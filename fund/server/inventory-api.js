import { randomUUID } from 'node:crypto'
import {
  getInventoryDatabase,
  getInventoryState,
  isFreshInventoryStore,
  markInventoryStoreUsed,
  refreshInventoryDataMode,
  replaceInventoryData,
} from './inventory-db.js'

const subscribers = new Set()

class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status }
}

function assertText(value, label, max = 140) {
  const text = String(value ?? '').trim()
  if (!text || text.length > max) throw new ApiError(400, `${label} wajib diisi (maksimal ${max} karakter).`)
  return text
}

function assertNumber(value, label, { min = 0, integer = false } = {}) {
  const number = Number(value)
  if (!Number.isFinite(number) || number < min || (integer && !Number.isInteger(number))) throw new ApiError(400, `${label} tidak valid.`)
  return number
}

function sendJson(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(data))
}

async function sendState(response, status, data) {
  sendJson(response, status, { ...data, _freshStore: isFreshInventoryStore() })
}

function broadcast(state) {
  const payload = `event: inventory\ndata: ${JSON.stringify(state)}\n\n`
  for (const response of subscribers) {
    if (response.destroyed || response.writableEnded) subscribers.delete(response)
    else response.write(payload)
  }
}

async function updatedState() {
  const state = await getInventoryState()
  broadcast(state)
  return state
}

async function readBody(request) {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (body.length > 1_000_000) throw new ApiError(413, 'Isi permintaan terlalu besar.')
  }
  try { return body ? JSON.parse(body) : {} } catch { throw new ApiError(400, 'Format data tidak valid.') }
}

function insertMovement(db, movement) {
  db.prepare(`INSERT INTO movements (id, product_id, product_name, product_sku, type, qty, unit_price, note, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    movement.id, movement.productId, movement.productName, movement.productSKU, movement.type,
    movement.qty, movement.type === 'sale' ? movement.unitPrice : null, movement.note, movement.date,
  )
}

function transaction(db, action) {
  return db.transaction(action).immediate()
}

export function inventoryApi() {
  return async function handleApi(request, response, next) {
    try {
      const pathname = new URL(request.url, 'http://localhost').pathname
      if (pathname === '/health' && request.method === 'GET') return sendJson(response, 200, { ok: true })
      if (pathname === '/events' && request.method === 'GET') {
        const state = await getInventoryState()
        response.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' })
        response.write(`event: inventory\ndata: ${JSON.stringify(state)}\n\n`)
        subscribers.add(response)
        const keepAlive = setInterval(() => { if (!response.destroyed) response.write(': ping\n\n') }, 25000)
        response.on('close', () => { clearInterval(keepAlive); subscribers.delete(response) })
        return
      }
      if (pathname === '/state' && request.method === 'GET') return sendState(response, 200, await getInventoryState())
      if (pathname === '/migrate' && request.method === 'POST') {
        const db = await getInventoryDatabase()
        const old = await readBody(request)
        if (!isFreshInventoryStore()) throw new ApiError(409, 'Database sudah mulai digunakan; migrasi dibatalkan agar data tidak tertimpa.')
        if (!Array.isArray(old.products) || !Array.isArray(old.movements)) throw new ApiError(400, 'Data lama tidak valid.')
        const products = old.products.map((product) => ({
          id: String(product.id || randomUUID()), name: assertText(product.name, 'Nama barang'), sku: assertText(product.sku, 'SKU / barcode', 100),
          category: String(product.category || 'Umum').slice(0, 100), price: assertNumber(product.price, 'Harga'),
          stock: assertNumber(product.stock, 'Stok', { integer: true }), minStock: assertNumber(product.minStock, 'Batas minimum', { integer: true }),
          color: String(product.color || 'new'), emoji: String(product.emoji || '📦'), isSample: old.dataMode !== 'custom',
        }))
        const movements = old.movements.map((movement) => ({ ...movement, id: String(movement.id || randomUUID()) }))
        replaceInventoryData(db, { products, movements, dataMode: old.dataMode === 'custom' ? 'custom' : 'demo' })
        markInventoryStoreUsed()
        return sendState(response, 200, await updatedState())
      }
      if (pathname === '/demo' && request.method === 'DELETE') {
        const db = await getInventoryDatabase()
        transaction(db, () => {
          db.exec('DELETE FROM products; DELETE FROM movements;')
          db.prepare("INSERT INTO settings (key, value) VALUES ('data_mode', 'custom') ON CONFLICT(key) DO UPDATE SET value = 'custom'").run()
        })
        markInventoryStoreUsed()
        return sendState(response, 200, await updatedState())
      }
      if (pathname === '/products' && request.method === 'POST') {
        const db = await getInventoryDatabase()
        const body = await readBody(request)
        const product = {
          id: randomUUID(), name: assertText(body.name, 'Nama barang'), sku: assertText(body.sku || `BRG-${Date.now().toString(36).toUpperCase()}`, 'SKU / barcode', 100),
          category: String(body.category || 'Umum').trim().slice(0, 100) || 'Umum', price: assertNumber(body.price, 'Harga'),
          stock: assertNumber(body.stock, 'Stok awal', { integer: true }), minStock: assertNumber(body.minStock, 'Batas minimum', { integer: true }),
          color: 'new', emoji: '📦', isSample: false,
        }
        transaction(db, () => {
          if (db.prepare('SELECT 1 FROM products WHERE sku = ?').get(product.sku)) throw new ApiError(409, 'SKU / barcode itu sudah dipakai barang lain.')
          db.prepare('UPDATE products SET sort_order = sort_order + 1').run()
          db.prepare(`INSERT INTO products (id, name, sku, category, price, stock, min_stock, color, emoji, is_sample, sort_order)
            VALUES (@id, @name, @sku, @category, @price, @stock, @minStock, @color, @emoji, 0, 0)`).run(product)
          if (product.stock > 0) insertMovement(db, {
            id: randomUUID(), productId: product.id, productName: product.name, productSKU: product.sku,
            type: 'restock', qty: product.stock, note: 'Stok awal', date: new Date().toISOString(),
          })
          refreshInventoryDataMode(db)
        })
        markInventoryStoreUsed()
        return sendJson(response, 201, { state: await updatedState(), product })
      }
      const productMatch = pathname.match(/^\/products\/([^/]+)$/)
      if (productMatch && request.method === 'PATCH') {
        const db = await getInventoryDatabase()
        const id = decodeURIComponent(productMatch[1]); const body = await readBody(request)
        const changes = {
          name: assertText(body.name, 'Nama barang'), sku: assertText(body.sku, 'SKU / barcode', 100),
          category: String(body.category || 'Umum').trim().slice(0, 100) || 'Umum', price: assertNumber(body.price, 'Harga'),
          minStock: assertNumber(body.minStock, 'Batas minimum', { integer: true }),
        }
        transaction(db, () => {
          if (!db.prepare('SELECT 1 FROM products WHERE id = ?').get(id)) throw new ApiError(404, 'Barang tidak ditemukan.')
          if (db.prepare('SELECT 1 FROM products WHERE sku = ? AND id <> ?').get(changes.sku, id)) throw new ApiError(409, 'SKU / barcode itu sudah dipakai barang lain.')
          db.prepare(`UPDATE products SET name = @name, sku = @sku, category = @category, price = @price, min_stock = @minStock WHERE id = @id`).run({ ...changes, id })
          refreshInventoryDataMode(db)
        })
        markInventoryStoreUsed()
        const state = await updatedState()
        return sendJson(response, 200, { state, product: state.products.find((item) => item.id === id) })
      }
      if (productMatch && request.method === 'DELETE') {
        const db = await getInventoryDatabase()
        const id = decodeURIComponent(productMatch[1])
        transaction(db, () => {
          const product = db.prepare('SELECT name, sku, price FROM products WHERE id = ?').get(id)
          if (!product) throw new ApiError(404, 'Barang tidak ditemukan.')
          db.prepare(`UPDATE movements SET product_name = ?, product_sku = ?, unit_price = CASE WHEN type = 'sale' AND unit_price IS NULL THEN ? ELSE unit_price END
            WHERE product_id = ? AND (product_name = '' OR product_sku = '')`).run(product.name, product.sku, product.price, id)
          db.prepare('DELETE FROM products WHERE id = ?').run(id)
          refreshInventoryDataMode(db)
        })
        markInventoryStoreUsed()
        return sendState(response, 200, await updatedState())
      }
      if (pathname === '/movements' && request.method === 'POST') {
        const db = await getInventoryDatabase()
        const body = await readBody(request)
        if (!['sale', 'restock'].includes(body.type)) throw new ApiError(400, 'Jenis pergerakan stok tidak valid.')
        const qty = assertNumber(body.qty, 'Jumlah', { min: 1, integer: true })
        const productId = String(body.productId)
        let movement
        transaction(db, () => {
          const product = db.prepare('SELECT id, name, sku, price, stock FROM products WHERE id = ?').get(productId)
          if (!product) throw new ApiError(404, 'Barang tidak ditemukan.')
          if (body.type === 'sale' && qty > product.stock) throw new ApiError(409, `Stok ${product.name} tinggal ${product.stock} unit.`)
          const update = body.type === 'sale'
            ? db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?').run(qty, productId, qty)
            : db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(qty, productId)
          if (update.changes !== 1) throw new ApiError(409, `Stok ${product.name} sudah berubah. Muat ulang sebelum mencatat penjualan.`)
          movement = {
            id: randomUUID(), productId, productName: product.name, productSKU: product.sku, type: body.type, qty,
            note: String(body.note || (body.type === 'sale' ? 'Penjualan kasir' : 'Restock')).trim().slice(0, 200), date: new Date().toISOString(),
          }
          if (body.type === 'sale') movement.unitPrice = product.price
          insertMovement(db, movement)
          refreshInventoryDataMode(db)
        })
        markInventoryStoreUsed()
        return sendJson(response, 201, { state: await updatedState(), movement })
      }
      if (pathname === '/products' && request.method === 'GET') return sendJson(response, 200, (await getInventoryState()).products)
      return next()
    } catch (error) {
      if (response.headersSent) { response.end(); return }
      const status = error instanceof ApiError ? error.status : error.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 500
      if (!(error instanceof ApiError) && status === 500) console.error('[stokly api]', error)
      sendJson(response, status, { error: error.message || 'Terjadi kesalahan server.' })
    }
  }
}
