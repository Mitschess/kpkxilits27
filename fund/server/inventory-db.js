import Database from 'better-sqlite3'
import { mkdir, readFile, rename } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dataDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data')
const databaseFile = path.join(dataDir, 'inventory.sqlite')
const legacyFile = path.join(dataDir, 'inventory.json')
let database
let initPromise
let freshStore = false

const demoState = () => {
  const products = [
    { id: 'p1', name: 'Kopi Arabika Gayo', sku: 'KPG-001', category: 'Minuman', price: 85000, stock: 18, minStock: 10, color: 'coffee', emoji: '☕', isSample: true },
    { id: 'p2', name: 'Teh Melati Premium', sku: 'THM-002', category: 'Minuman', price: 42000, stock: 6, minStock: 12, color: 'tea', emoji: '🍵', isSample: true },
    { id: 'p3', name: 'Granola Madu', sku: 'GRN-003', category: 'Makanan', price: 56000, stock: 24, minStock: 8, color: 'granola', emoji: '🥣', isSample: true },
    { id: 'p4', name: 'Mug Keramik Sage', sku: 'MUG-004', category: 'Peralatan', price: 68000, stock: 3, minStock: 5, color: 'mug', emoji: '🏺', isSample: true },
    { id: 'p5', name: 'Sirup Gula Aren', sku: 'SIR-005', category: 'Bahan baku', price: 35000, stock: 15, minStock: 7, color: 'syrup', emoji: '🍯', isSample: true },
    { id: 'p6', name: 'Cookies Cokelat', sku: 'CKS-006', category: 'Makanan', price: 28000, stock: 0, minStock: 6, color: 'cookies', emoji: '🍪', isSample: true },
  ]
  const ago = (ms) => new Date(Date.now() - ms).toISOString()
  const day = (n, hours = 11) => new Date(Date.now() - n * 86400000 - hours * 3600000).toISOString()
  return {
    dataMode: 'demo', products,
    movements: [
      { id: 'm1', productId: 'p1', productName: products[0].name, productSKU: products[0].sku, type: 'sale', qty: 2, unitPrice: products[0].price, note: 'Penjualan kasir', date: ago(18 * 60000) },
      { id: 'm2', productId: 'p2', productName: products[1].name, productSKU: products[1].sku, type: 'sale', qty: 1, unitPrice: products[1].price, note: 'Penjualan kasir', date: ago(52 * 60000) },
      { id: 'm3', productId: 'p5', productName: products[4].name, productSKU: products[4].sku, type: 'restock', qty: 10, note: 'Restock supplier', date: ago(115 * 60000) },
      { id: 'm4', productId: 'p3', productName: products[2].name, productSKU: products[2].sku, type: 'sale', qty: 3, unitPrice: products[2].price, note: 'Penjualan kasir', date: ago(3 * 3600000) },
      { id: 'm5', productId: 'p1', productName: products[0].name, productSKU: products[0].sku, type: 'sale', qty: 4, unitPrice: products[0].price, note: 'Penjualan kasir', date: day(1, 8) },
      { id: 'm6', productId: 'p4', productName: products[3].name, productSKU: products[3].sku, type: 'sale', qty: 1, unitPrice: products[3].price, note: 'Penjualan kasir', date: day(1, 5) },
      { id: 'm7', productId: 'p3', productName: products[2].name, productSKU: products[2].sku, type: 'sale', qty: 2, unitPrice: products[2].price, note: 'Penjualan kasir', date: day(2, 7) },
      { id: 'm8', productId: 'p2', productName: products[1].name, productSKU: products[1].sku, type: 'sale', qty: 3, unitPrice: products[1].price, note: 'Penjualan kasir', date: day(2, 4) },
      { id: 'm9', productId: 'p1', productName: products[0].name, productSKU: products[0].sku, type: 'restock', qty: 8, note: 'Restock supplier', date: day(3, 9) },
      { id: 'm10', productId: 'p1', productName: products[0].name, productSKU: products[0].sku, type: 'sale', qty: 5, unitPrice: products[0].price, note: 'Penjualan kasir', date: day(3, 3) },
      { id: 'm11', productId: 'p5', productName: products[4].name, productSKU: products[4].sku, type: 'sale', qty: 2, unitPrice: products[4].price, note: 'Penjualan kasir', date: day(4, 6) },
      { id: 'm12', productId: 'p3', productName: products[2].name, productSKU: products[2].sku, type: 'sale', qty: 1, unitPrice: products[2].price, note: 'Penjualan kasir', date: day(5, 8) },
      { id: 'm13', productId: 'p2', productName: products[1].name, productSKU: products[1].sku, type: 'sale', qty: 2, unitPrice: products[1].price, note: 'Penjualan kasir', date: day(6, 4) },
      { id: 'm14', productId: 'p6', productName: products[5].name, productSKU: products[5].sku, type: 'sale', qty: 4, unitPrice: products[5].price, note: 'Penjualan kasir', date: day(6, 2) },
    ],
  }
}

function createSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sku TEXT NOT NULL COLLATE NOCASE UNIQUE,
      category TEXT NOT NULL,
      price REAL NOT NULL CHECK (price >= 0),
      stock INTEGER NOT NULL CHECK (stock >= 0),
      min_stock INTEGER NOT NULL CHECK (min_stock >= 0),
      color TEXT NOT NULL,
      emoji TEXT NOT NULL,
      is_sample INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS movements (
      sequence INTEGER PRIMARY KEY AUTOINCREMENT,
      id TEXT NOT NULL UNIQUE,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      product_sku TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('sale', 'restock')),
      qty INTEGER NOT NULL CHECK (qty > 0),
      unit_price REAL,
      note TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS movements_date_idx ON movements(date DESC, sequence DESC);
  `)
}

function setSetting(db, key, value) {
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, String(value))
}

function insertProduct(db, product, sortOrder) {
  db.prepare(`INSERT INTO products (id, name, sku, category, price, stock, min_stock, color, emoji, is_sample, sort_order)
    VALUES (@id, @name, @sku, @category, @price, @stock, @minStock, @color, @emoji, @isSample, @sortOrder)`).run({
    id: String(product.id), name: String(product.name), sku: String(product.sku), category: String(product.category || 'Umum'),
    price: Number(product.price), stock: Number(product.stock), minStock: Number(product.minStock), color: String(product.color || 'new'),
    emoji: String(product.emoji || '📦'), isSample: product.isSample ? 1 : 0, sortOrder,
  })
}

function insertMovement(db, movement, productsById = new Map()) {
  const product = productsById.get(String(movement.productId))
  db.prepare(`INSERT INTO movements (id, product_id, product_name, product_sku, type, qty, unit_price, note, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    String(movement.id), String(movement.productId), String(movement.productName || product?.name || 'Barang dihapus'),
    String(movement.productSKU || product?.sku || ''), movement.type, Number(movement.qty),
    movement.type === 'sale' ? Number(movement.unitPrice ?? product?.price ?? 0) : null,
    String(movement.note || ''), String(movement.date || new Date().toISOString()),
  )
}

function importState(db, state) {
  const replace = db.transaction(() => {
    db.exec('DELETE FROM movements; DELETE FROM products;')
    state.products.forEach((product, index) => insertProduct(db, product, index))
    const productsById = new Map(state.products.map((product) => [String(product.id), product]))
    state.movements.forEach((movement) => insertMovement(db, movement, productsById))
    const hasSamples = state.products.some((product) => product.isSample)
    setSetting(db, 'data_mode', state.dataMode || (hasSamples ? 'demo' : 'custom'))
    setSetting(db, 'initialized', '1')
  })
  replace.immediate()
}

async function archiveLegacyFile() {
  const archivedLegacyFile = path.join(dataDir, `inventory.legacy-${Date.now()}.json`)
  try { await rename(legacyFile, archivedLegacyFile) } catch (error) {
    if (error.code !== 'ENOENT') console.warn('[stokly database] File JSON lama tidak dapat dipindahkan ke arsip.', error)
  }
}

async function initialize() {
  await mkdir(dataDir, { recursive: true })
  database = new Database(databaseFile, { timeout: 5000 })
  database.pragma('journal_mode = WAL')
  database.pragma('busy_timeout = 5000')
  database.pragma('foreign_keys = ON')
  createSchema(database)

  if (database.prepare("SELECT value FROM settings WHERE key = 'initialized'").get()) {
    const mode = database.prepare("SELECT value FROM settings WHERE key = 'data_mode'").get()?.value
    const movementCount = database.prepare('SELECT COUNT(*) AS n FROM movements').get()?.n || 0
    const sampleCount = database.prepare('SELECT COUNT(*) AS n FROM products WHERE is_sample = 1').get()?.n || 0
    if (mode === 'demo' && sampleCount && movementCount <= 4) importState(database, demoState())
    await archiveLegacyFile()
    return
  }

  let initialState
  let importedLegacy = false
  try {
    const legacy = JSON.parse(await readFile(legacyFile, 'utf8'))
    if (!Array.isArray(legacy.products) || !Array.isArray(legacy.movements)) throw new Error('Format file inventori lama tidak valid; database tidak dibuat agar data lama tetap aman.')
    initialState = {
      dataMode: legacy.dataMode || 'custom',
      products: legacy.products.map((product) => ({ ...product, isSample: legacy.dataMode !== 'custom' })),
      movements: legacy.movements,
    }
    importedLegacy = true
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    initialState = demoState()
    freshStore = true
  }
  importState(database, initialState)
  if (importedLegacy) await archiveLegacyFile()
}

export async function getInventoryDatabase() {
  if (!initPromise) initPromise = initialize()
  await initPromise
  return database
}

export function replaceInventoryData(db, state) { importState(db, state) }

export function refreshInventoryDataMode(db) {
  const hasSamples = db.prepare('SELECT 1 FROM products WHERE is_sample = 1 LIMIT 1').get()
  const mode = hasSamples ? 'demo' : 'custom'
  setSetting(db, 'data_mode', mode)
  return mode
}

export async function getInventoryState() {
  const db = await getInventoryDatabase()
  const mode = db.prepare("SELECT value FROM settings WHERE key = 'data_mode'").get()?.value || 'custom'
  const products = db.prepare(`SELECT id, name, sku, category, price, stock, min_stock AS minStock,
    color, emoji, is_sample AS isSample FROM products ORDER BY sort_order ASC`).all().map((product) => ({ ...product, isSample: Boolean(product.isSample) }))
  const movements = db.prepare(`SELECT id, product_id AS productId, product_name AS productName, product_sku AS productSKU,
    type, qty, unit_price AS unitPrice, note, date FROM movements ORDER BY date DESC, sequence DESC`).all()
    .map((movement) => movement.type === 'sale' ? movement : { ...movement, unitPrice: undefined })
  return { dataMode: mode, products, movements }
}

export function isFreshInventoryStore() { return freshStore }
export function markInventoryStoreUsed() { freshStore = false }
