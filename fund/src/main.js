import './style.css'
import './theme.css'
import JsBarcode from 'jsbarcode'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()
const supabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey)
const supabase = supabaseConfigured ? createClient(supabaseUrl, supabasePublishableKey) : null
const fundAssetPrefix = window.location.pathname.startsWith('/fund') ? '/fund' : ''
const authRedirectUrl = () => new URL(fundAssetPrefix ? '/fund/' : '/', window.location.origin).toString()

const icons = {
  grid: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  box: '<svg viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9"/></svg>',
  receipt: '<svg viewBox="0 0 24 24"><path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 6-7"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>',
  scan: '<svg viewBox="0 0 24 24"><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2M4 12h16"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  trend: '<svg viewBox="0 0 24 24"><path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/></svg>',
  more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="m18 6-12 12M6 6l12 12"/></svg>',
  logout: '<svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  help: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.6 2.6 0 0 1 5 .9c0 1.8-2.5 2.2-2.5 3.9M12 17.2v.1"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
}
const icon = (name) => `<span class="icon">${icons[name]}</span>`
const moneyFormat = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
const money = (value) => moneyFormat.format(value)
const timeLabel = (date) => new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(date))
// Read the clock on every render: booth laptops stay open past midnight.
const dayLabel = (date) => new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date)
const emptyState = (dataMode = 'custom') => ({ products: [], movements: [], dataMode })

let state = emptyState('loading')
let isDemo = false
let serverProblem = 'Menghubungkan ke server inventori…'
let eventSource
let inventoryChannel
let authUser
let authView = 'login'
let authMessage = ''
let authMessageIsError = false
let useLocalMode = false
let activeFilter = 'Semua barang'
let activeNav = '#dashboard'
let query = ''
let txQuery = ''
let txType = 'all'
let reportRange = 7
let toastTimer
let activeCameraStopper
const pageTitles = { '#dashboard': 'Ringkasan', '#inventory': 'Inventori', '#transactions': 'Transaksi', '#reports': 'Analitik' }

async function apiRequest(path, { method = 'GET', body } = {}) {
  if (supabase && authUser && !useLocalMode) return supabaseApiRequest(path, { method, body })
  const response = await fetch(`/api${path}`, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) { const error = new Error(data.error || `Permintaan gagal (${response.status}).`); error.status = response.status; throw error }
  return data
}

function supabaseError(error) {
  if (error.code === '23505') return new Error('SKU / barcode itu sudah dipakai barang lain.')
  if (error.code === '42501') return new Error('Akses ditolak. Pastikan SQL Supabase sudah dijalankan dan kamu sudah masuk.')
  if (error.code === 'P0002') return new Error('Barang tidak ditemukan pada akun ini.')
  if (error.code === 'P0001' || error.code === '22023') return new Error(error.message)
  if (error.code === 'PGRST202') return new Error('Fungsi database belum ditemukan. Jalankan ulang file supabase/schema.sql di SQL Editor.')
  return new Error(error.message || 'Permintaan ke Supabase gagal.')
}

function throwSupabaseError(error) { if (error) throw supabaseError(error) }

function mapSupabaseInventory(products, movements) {
  return {
    dataMode: products.some((product) => product.is_sample) ? 'demo' : 'custom',
    products: products.map((product) => ({
      id: product.id, name: product.name, sku: product.sku, category: product.category,
      price: Number(product.price), stock: product.stock, minStock: product.min_stock,
      color: product.color || 'new', emoji: product.emoji || '📦', isSample: Boolean(product.is_sample),
    })),
    movements: movements.map((movement) => ({
      id: movement.id, productId: movement.product_id, productName: movement.product_name,
      productSKU: movement.product_sku, type: movement.type, qty: movement.qty,
      unitPrice: movement.type === 'sale' ? Number(movement.unit_price) : undefined,
      note: movement.note || '', date: movement.date,
    })),
  }
}

async function getSupabaseInventoryState() {
  const [productsResult, movementsResult] = await Promise.all([
    supabase.from('inventory_products').select('id,name,sku,category,price,stock,min_stock,color,emoji,is_sample').order('sort_order', { ascending: true }),
    supabase.from('inventory_movements').select('id,product_id,product_name,product_sku,type,qty,unit_price,note,date').order('date', { ascending: false }),
  ])
  throwSupabaseError(productsResult.error)
  throwSupabaseError(movementsResult.error)
  return mapSupabaseInventory(productsResult.data || [], movementsResult.data || [])
}

async function supabaseApiRequest(path, { method = 'GET', body } = {}) {
  const statePath = path === '/state' && method === 'GET'
  if (statePath) return { ...(await getSupabaseInventoryState()), _freshStore: false }
  if (path === '/products' && method === 'GET') return (await getSupabaseInventoryState()).products
  if (path === '/migrate' && method === 'POST') throw new Error('Impor data lokal ke Supabase belum tersedia. Data lama tetap aman di database lokal.')
  if (path === '/demo' && method === 'DELETE') {
    const { error } = await supabase.from('inventory_products').delete().eq('is_sample', true)
    throwSupabaseError(error)
    return getSupabaseInventoryState()
  }
  if (path === '/products' && method === 'POST') {
    const { data: productId, error } = await supabase.rpc('create_inventory_product', {
      p_name: body.name, p_sku: body.sku, p_category: body.category || 'Umum', p_price: body.price,
      p_stock: body.stock, p_min_stock: body.minStock,
    })
    throwSupabaseError(error)
    const state = await getSupabaseInventoryState()
    return { state, product: state.products.find((product) => product.id === productId) }
  }
  const productMatch = path.match(/^\/products\/([^/]+)$/)
  if (productMatch && method === 'PATCH') {
    const { data, error } = await supabase.from('inventory_products').update({
      name: body.name, sku: body.sku, category: body.category || 'Umum', price: body.price, min_stock: body.minStock,
    }).eq('id', decodeURIComponent(productMatch[1])).select('id').maybeSingle()
    throwSupabaseError(error)
    if (!data) throw new Error('Barang tidak ditemukan pada akun ini.')
    const state = await getSupabaseInventoryState()
    return { state, product: state.products.find((product) => product.id === data.id) }
  }
  if (productMatch && method === 'DELETE') {
    const { data, error } = await supabase.from('inventory_products').delete().eq('id', decodeURIComponent(productMatch[1])).select('id').maybeSingle()
    throwSupabaseError(error)
    if (!data) throw new Error('Barang tidak ditemukan pada akun ini.')
    return getSupabaseInventoryState()
  }
  if (path === '/movements' && method === 'POST') {
    const { data, error } = await supabase.rpc('record_inventory_movement', {
      p_product_id: body.productId, p_type: body.type, p_qty: body.qty, p_note: body.note || '',
    })
    throwSupabaseError(error)
    const state = await getSupabaseInventoryState()
    const product = state.products.find((item) => item.id === body.productId)
    const movement = state.movements.find((item) => item.id === data)
    return { state, movement: movement || { qty: body.qty, type: body.type, productId: body.productId, productName: product?.name, productSKU: product?.sku, unitPrice: body.type === 'sale' ? product?.price : undefined, date: new Date().toISOString() }, product: data }
  }
  throw new Error(`Operasi Supabase tidak dikenal: ${method} ${path}`)
}
function applyState(payload) {
  const { _freshStore, ...nextState } = payload
  state = nextState
  isDemo = state.dataMode === 'demo'
  serverProblem = ''
}
async function loadInventory() {
  try {
    let payload
    if (supabase && authUser && !useLocalMode) {
      payload = await getSupabaseInventoryState()
      applyState(payload)
      render()
      subscribeSupabaseInventory()
      return
    }
    payload = await apiRequest('/state')
    const legacy = localStorage.getItem('stokly-data')
    if (payload._freshStore && legacy) {
      try {
        payload = await apiRequest('/migrate', { method: 'POST', body: JSON.parse(legacy) })
        localStorage.removeItem('stokly-data')
      } catch (error) {
        if (error.status === 409) payload = await apiRequest('/state')
        else throw error
      }
    }
    applyState(payload)
    render()
    if (!eventSource) {
      eventSource = new EventSource('/api/events')
      eventSource.addEventListener('inventory', (event) => { try { applyState(JSON.parse(event.data)); render() } catch (error) { console.error('Data inventori live tidak terbaca.', error) } })
      eventSource.onerror = () => { serverProblem = 'Koneksi live terputus. Perubahan lokal akan dimuat ulang saat koneksi kembali.'; render() }
      eventSource.onopen = () => { if (serverProblem) { serverProblem = ''; render() } }
    }
  } catch (error) {
    serverProblem = `Tidak dapat terhubung ke server inventori. ${error.message}`
    render()
  }
}

function subscribeSupabaseInventory() {
  if (!supabase || !authUser || useLocalMode || inventoryChannel) return
  inventoryChannel = supabase.channel(`inventory-${authUser.id}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory_products' }, refreshSupabaseInventory)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory_movements' }, refreshSupabaseInventory)
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        serverProblem = 'Koneksi live Supabase terputus. Periksa konfigurasi Realtime lalu coba lagi.'
        render()
      } else if (status === 'SUBSCRIBED' && serverProblem.includes('Koneksi live Supabase')) {
        serverProblem = ''
        render()
      }
    })
}

let inventoryRefreshPending = false
let inventoryRefreshQueued = false
async function refreshSupabaseInventory() {
  if (!authUser || useLocalMode) return
  // A change that lands while a refresh is in flight must trigger one more read, not be dropped.
  if (inventoryRefreshPending) { inventoryRefreshQueued = true; return }
  inventoryRefreshPending = true
  try {
    do {
      inventoryRefreshQueued = false
      applyState(await getSupabaseInventoryState())
    } while (inventoryRefreshQueued)
    render()
  } catch (error) {
    serverProblem = `Tidak dapat memuat stok dari Supabase. ${error.message}`
    render()
  } finally { inventoryRefreshPending = false }
}

async function stopInventoryRealtime() {
  const channel = inventoryChannel
  inventoryChannel = undefined
  if (channel && supabase) await supabase.removeChannel(channel)
  if (eventSource) eventSource.close()
  eventSource = undefined
}
function stockStatus(p) { return p.stock === 0 ? 'Habis' : p.stock <= p.minStock ? 'Menipis' : 'Aman' }
function filteredProducts() {
  return state.products.filter((p) => {
    const search = `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(query.toLowerCase())
    const status = stockStatus(p)
    const matchesFilter = activeFilter === 'Semua barang' || (activeFilter === 'Perlu restock' && status !== 'Aman') || (activeFilter === 'Stok menipis' && status === 'Menipis') || (activeFilter === 'Stok habis' && status === 'Habis') || (activeFilter === 'Stok aman' && status === 'Aman')
    return search && matchesFilter
  })
}
function startOfDay(value) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}
function saleAmount(movement) {
  if (movement.type !== 'sale') return 0
  const product = state.products.find((item) => item.id === movement.productId)
  return Number(movement.unitPrice ?? product?.price ?? 0) * movement.qty
}
function deltaLabel(current, previous) {
  if (previous === 0 && current === 0) return { text: 'stabil', cls: 'flat' }
  if (previous === 0) return { text: 'baru', cls: 'up' }
  const change = Math.round(((current - previous) / previous) * 100)
  if (change === 0) return { text: '0%', cls: 'flat' }
  return { text: `${change > 0 ? '+' : ''}${change}%`, cls: change > 0 ? 'up' : 'down' }
}
function computeAnalytics(days) {
  const start = startOfDay(new Date())
  start.setDate(start.getDate() - (days - 1))
  const prevStart = new Date(start)
  prevStart.setDate(prevStart.getDate() - days)
  const inWindow = (date, from, to) => {
    const value = new Date(date)
    return value >= from && (!to || value < to)
  }
  const current = state.movements.filter((m) => inWindow(m.date, start))
  const previous = state.movements.filter((m) => inWindow(m.date, prevStart, start))
  const sales = current.filter((m) => m.type === 'sale')
  const prevSales = previous.filter((m) => m.type === 'sale')
  const restocks = current.filter((m) => m.type === 'restock')
  const revenue = sales.reduce((sum, m) => sum + saleAmount(m), 0)
  const prevRevenue = prevSales.reduce((sum, m) => sum + saleAmount(m), 0)
  const unitsSold = sales.reduce((sum, m) => sum + m.qty, 0)
  const prevUnits = prevSales.reduce((sum, m) => sum + m.qty, 0)
  const unitsIn = restocks.reduce((sum, m) => sum + m.qty, 0)
  const tickets = sales.length
  const avgTicket = tickets ? revenue / tickets : 0
  const daily = Array.from({ length: days }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    const key = date.toDateString()
    const daySales = sales.filter((m) => new Date(m.date).toDateString() === key)
    const dayRestock = restocks.filter((m) => new Date(m.date).toDateString() === key)
    return {
      date,
      key,
      label: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: days > 7 ? 'numeric' : 'short' }).format(date),
      revenue: daySales.reduce((sum, m) => sum + saleAmount(m), 0),
      units: daySales.reduce((sum, m) => sum + m.qty, 0),
      restock: dayRestock.reduce((sum, m) => sum + m.qty, 0),
    }
  })
  const peak = daily.reduce((best, day) => (day.revenue > best.revenue ? day : best), daily[0] || { revenue: 0, label: '—' })
  const byProduct = new Map()
  for (const movement of sales) {
    const product = state.products.find((item) => item.id === movement.productId)
    const id = movement.productId || movement.productSKU || movement.productName
    const currentRow = byProduct.get(id) || { id, name: product?.name || movement.productName || 'Barang dihapus', sku: product?.sku || movement.productSKU || '—', units: 0, revenue: 0 }
    currentRow.units += movement.qty
    currentRow.revenue += saleAmount(movement)
    byProduct.set(id, currentRow)
  }
  const topProducts = [...byProduct.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6)
  const topShare = revenue ? Math.round((topProducts.slice(0, 3).reduce((sum, item) => sum + item.revenue, 0) / revenue) * 100) : 0
  const soldIds = new Set(sales.map((m) => m.productId))
  const deadStock = state.products.filter((p) => p.stock > 0 && !soldIds.has(p.id)).sort((a, b) => (b.stock * b.price) - (a.stock * a.price)).slice(0, 6)
  const safe = state.products.filter((p) => stockStatus(p) === 'Aman').length
  const low = state.products.filter((p) => stockStatus(p) === 'Menipis').length
  const out = state.products.filter((p) => stockStatus(p) === 'Habis').length
  const totalSkus = state.products.length || 1
  const insights = []
  if (revenue) insights.push({ k: '01', t: `Omzet periode ini ${money(revenue)} dari ${tickets} transaksi (${unitsSold} unit).` })
  if (peak?.revenue) insights.push({ k: '02', t: `Hari terkuat ${peak.label}: ${money(peak.revenue)}.` })
  if (topProducts[0]) insights.push({ k: '03', t: `${topProducts[0].name} memimpin omzet. Tiga SKU teratas menahan ${topShare}% penjualan.` })
  if (unitsIn || unitsSold) insights.push({ k: '04', t: `Masuk ${unitsIn} unit, keluar ${unitsSold} unit. Stok bersih ${unitsIn - unitsSold >= 0 ? '+' : ''}${unitsIn - unitsSold}.` })
  if (deadStock.length) insights.push({ k: '05', t: `${deadStock.length} barang berstok tidak bergerak di periode ini.` })
  const restockNeed = state.products.filter((p) => p.stock <= p.minStock)
  if (restockNeed.length) insights.push({ k: '06', t: `${restockNeed.length} SKU di atau di bawah batas minimum — prioritas restock.` })
  return {
    days, start, revenue, prevRevenue, unitsSold, prevUnits, unitsIn, tickets, avgTicket, daily, peak, topProducts, deadStock,
    health: { safe, low, out, safePct: Math.round((safe / totalSkus) * 100), lowPct: Math.round((low / totalSkus) * 100), outPct: Math.round((out / totalSkus) * 100) },
    insights: insights.slice(0, 5),
    netUnits: unitsIn - unitsSold,
  }
}
function filteredMovements() {
  const term = txQuery.trim().toLowerCase()
  return [...state.movements]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((m) => (txType === 'all' ? true : m.type === txType))
    .filter((m) => {
      if (!term) return true
      const product = state.products.find((item) => item.id === m.productId)
      return `${product?.name || m.productName || ''} ${product?.sku || m.productSKU || ''} ${m.note || ''}`.toLowerCase().includes(term)
    })
}

function renderAuth() {
  const isSignup = authView === 'signup'
  const isReset = authView === 'reset'
  const isPasswordUpdate = authView === 'update-password'
  closeModal()
  const title = isSignup ? 'Buat akun dana' : isReset ? 'Atur ulang password' : isPasswordUpdate ? 'Buat password baru' : 'Selamat datang kembali'
  const description = isSignup ? 'Siapkan akun untuk mengelola stok merchandise & kas dana usaha.' : isReset ? 'Kami kirim tautan untuk mengatur ulang password.' : isPasswordUpdate ? 'Gunakan password baru untuk akun pengelola dana.' : 'Masuk untuk mengelola stok festival dan aktivitas dana usaha.'
  const emailField = !isPasswordUpdate ? `<label class="auth-field"><span>Email</span><input name="email" type="email" autocomplete="email" placeholder="nama@email.com" required></label>` : ''
  const storeField = isSignup ? `<label class="auth-field"><span>Nama tim / toko</span><input name="storeName" autocomplete="organization" placeholder="Contoh: Dana Usaha KPK Gresik"></label>` : ''
  const passwordLabel = isPasswordUpdate ? 'Password baru' : 'Password'
  const passwordField = !isReset ? `<label class="auth-field"><span>${passwordLabel}</span><input name="password" type="password" autocomplete="${isSignup || isPasswordUpdate ? 'new-password' : 'current-password'}" placeholder="${isSignup || isPasswordUpdate ? 'Minimal 8 karakter' : 'Masukkan password'}" ${isSignup || isPasswordUpdate ? 'minlength="8"' : ''} required></label>` : ''
  const submitLabel = isSignup ? 'Buat akun' : isReset ? 'Kirim tautan reset' : isPasswordUpdate ? 'Simpan password baru' : 'Masuk'
  const switchAction = isReset ? '<button type="button" class="auth-link" data-auth-switch="login">Kembali ke login</button>' : isPasswordUpdate ? '' : isSignup ? '<p>Sudah punya akun? <button type="button" class="auth-link" data-auth-switch="login">Masuk</button></p>' : '<p>Belum punya akun? <button type="button" class="auth-link" data-auth-switch="signup">Buat akun</button></p>'
  const configNotice = !supabaseConfigured ? `<aside class="auth-config-note"><b>Supabase belum terhubung</b><p>Isi URL dan publishable key di <code>.env.local</code>, lalu jalankan schema Supabase yang sesuai.</p></aside>` : ''
  const localAction = import.meta.env.DEV && !supabaseConfigured ? '<button type="button" class="auth-local-button" data-local-mode>Buka inventori mode lokal</button>' : ''
  document.querySelector('#app').innerHTML = `<main class="auth-screen"><section class="auth-story"><a class="auth-brand" href="#"><span class="brand-logo-img"><img src="${fundAssetPrefix}/images/logo/hero.webp" alt="KPK" /></span><span class="brand-text"><span class="brand-title">KPK</span><span class="brand-subtitle">× Ini Lho ITS! · Dana</span></span></a><p class="auth-kicker">FESTIVAL PULANG KAMPUNG 2026</p><h1>Catat stok festival.<br><em>Pantau dananya.</em></h1><p class="auth-story-copy">Sistem inventori merchandise, penjualan booth festival, dan analitik kas dana usaha Kampus Pulang Kampung 2026.</p><ul class="auth-highlights"><li>${icon('scan')}Pindai barcode dari HP</li><li>${icon('receipt')}Sinkron antar perangkat</li><li>${icon('chart')}Laporan omzet harian</li></ul></section><section class="auth-card"><p class="auth-eyebrow">AKUN PENGELOLA DANA</p><h2>${title}</h2><p class="auth-description">${description}</p><form data-auth-form>${storeField}${emailField}${passwordField}${isReset ? '' : '<button type="button" class="auth-forgot" data-auth-forgot>Lupa password?</button>'}<button type="submit" class="primary-button auth-submit" data-label="${submitLabel}">${submitLabel}<span aria-hidden="true">→</span></button></form><p class="auth-feedback${authMessageIsError ? ' is-error' : ''}" data-auth-feedback role="status" ${authMessage ? '' : 'hidden'}>${escapeHtml(authMessage)}</p>${switchAction}${configNotice}${localAction}<p class="auth-privacy">Data inventori & kas aman dan dipisahkan per akun toko.</p></section></main>`

  document.querySelector('[data-auth-form]').addEventListener('submit', submitAuthForm)
  document.querySelectorAll('[data-auth-switch]').forEach((button) => button.addEventListener('click', () => {
    authView = button.dataset.authSwitch
    authMessage = ''
    authMessageIsError = false
    renderAuth()
  }))
  document.querySelector('[data-auth-forgot]')?.addEventListener('click', () => {
    authView = 'reset'
    authMessage = ''
    authMessageIsError = false
    renderAuth()
  })
  document.querySelector('[data-local-mode]')?.addEventListener('click', enterLocalMode)
}

function setAuthFeedback(message, isError = false) {
  authMessage = message
  authMessageIsError = isError
  const feedback = document.querySelector('[data-auth-feedback]')
  if (!feedback) return
  feedback.textContent = message
  feedback.hidden = !message
  feedback.classList.toggle('is-error', isError)
}

function authErrorMessage(error) {
  const message = String(error?.message || '')
  if (message.toLowerCase().includes('invalid login credentials')) return 'Email atau password belum cocok.'
  if (message.toLowerCase().includes('email not confirmed')) return 'Konfirmasi email terlebih dahulu, lalu coba masuk lagi.'
  if (message.toLowerCase().includes('user already registered')) return 'Email ini sudah memiliki akun. Silakan masuk.'
  if (message.toLowerCase().includes('password should be at least')) return 'Password terlalu pendek. Gunakan minimal 8 karakter.'
  return message || 'Terjadi kesalahan. Coba lagi.'
}

async function submitAuthForm(event) {
  event.preventDefault()
  const button = event.currentTarget.querySelector('[type="submit"]')
  const formData = new FormData(event.currentTarget)
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')
  button.disabled = true
  button.textContent = 'Memproses…'
  setAuthFeedback('')
  try {
    if (!supabase) throw new Error('Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY di .env.local.')
    if (authView === 'signup') {
      const storeName = String(formData.get('storeName') || '').trim()
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { emailRedirectTo: authRedirectUrl(), data: { store_name: storeName } },
      })
      if (error) throw error
      if (data.session && data.user) enterSupabaseApp(data.user)
      else {
        authView = 'login'
        renderAuth()
        setAuthFeedback('Akun berhasil dibuat. Cek email untuk konfirmasi, lalu masuk.')
      }
      return
    }
    if (authView === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: authRedirectUrl() })
      if (error) throw error
      setAuthFeedback('Jika email terdaftar, tautan reset akan dikirim. Periksa juga folder spam.')
      return
    }
    if (authView === 'update-password') {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      authView = 'login'
      renderAuth()
      setAuthFeedback('Password berhasil diperbarui. Silakan masuk dengan password baru.')
      await supabase.auth.signOut()
      return
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    enterSupabaseApp(data.user)
  } catch (error) {
    if (button.isConnected) {
      button.disabled = false
      button.innerHTML = `${escapeHtml(button.dataset.label || 'Lanjutkan')}<span aria-hidden="true">→</span>`
    }
    setAuthFeedback(authErrorMessage(error), true)
  }
}

function enterSupabaseApp(user) {
  // Sign-in reaches here twice (the form and the SIGNED_IN event); load once.
  if (authUser?.id === user.id && !useLocalMode) return
  authUser = user
  useLocalMode = false
  authMessage = ''
  authMessageIsError = false
  serverProblem = ''
  state = emptyState('loading')
  render()
  loadInventory()
}

function enterLocalMode() {
  useLocalMode = true
  authUser = undefined
  authMessage = ''
  state = emptyState('loading')
  render()
  loadInventory()
}

async function startApplication() {
  const hash = window.location.hash
  if (pageTitles[hash]) activeNav = hash
  window.addEventListener('hashchange', () => {
    const next = window.location.hash
    if (!pageTitles[next] || next === activeNav) return
    activeNav = next
    render()
  })
  document.addEventListener('keydown', handleGlobalKeydown)
  if (!supabase) { renderAuth(); return }
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      authUser = undefined
      useLocalMode = false
      state = emptyState()
      void stopInventoryRealtime()
      renderAuth()
    } else if (event === 'PASSWORD_RECOVERY') {
      // The recovery link also signs the user in; keep them on the new-password form until they save it.
      authUser = undefined
      void stopInventoryRealtime()
      authView = 'update-password'
      authMessage = 'Masukkan password baru untuk menyelesaikan pemulihan akun.'
      authMessageIsError = false
      renderAuth()
    } else if (event === 'SIGNED_IN' && session?.user && authView !== 'update-password') {
      // Defer: calling Supabase from inside this callback can deadlock the auth client.
      setTimeout(() => enterSupabaseApp(session.user), 0)
    }
  })
  const { data: { session }, error } = await supabase.auth.getSession()
  if (authView === 'update-password') return
  if (error) {
    authMessage = authErrorMessage(error)
    authMessageIsError = true
    renderAuth()
  } else if (session?.user) enterSupabaseApp(session.user)
  else renderAuth()
}

function inventoryRows(rows, emptyText) {
  return rows.map((p) => `<tr><td><div class="product-cell"><span class="product-thumb ${escapeHtml(p.color)}">${escapeHtml(p.emoji)}</span><span><b>${escapeHtml(p.name)}</b><small>${escapeHtml(p.category)}</small></span></div></td><td><span class="sku">${escapeHtml(p.sku)}</span></td><td class="price">${money(p.price)}</td><td><span class="stock-number ${stockStatus(p) !== 'Aman' ? 'stock-low' : ''}">${p.stock}</span><span class="stock-unit">unit</span></td><td><span class="status status-${stockStatus(p).toLowerCase()}"><i></i>${stockStatus(p)}</span></td><td><button type="button" class="row-menu" title="Aksi barang" aria-label="Aksi untuk ${escapeHtml(p.name)}" data-product-menu="${escapeHtml(p.id)}">${icon('more')}</button></td></tr>`).join('') || `<tr><td colspan="6" class="empty-state">${emptyText}</td></tr>`
}

function inventoryTable(rows, emptyText = 'Tidak ada barang yang cocok.') {
  return `<div class="table-scroll"><table><thead><tr><th>NAMA BARANG</th><th>SKU / BARCODE</th><th>HARGA</th><th>STOK</th><th>STATUS</th><th><span class="sr-only">Aksi</span></th></tr></thead><tbody data-inventory-rows>${inventoryRows(rows, emptyText)}</tbody></table></div>`
}

function loadingMarkup() {
  return `<section class="loading-state" role="status" aria-live="polite"><span class="loading-lantern" aria-hidden="true"></span><b>Memuat data dana usaha…</b><p>Mengambil stok dan transaksi terbaru.</p></section>`
}

function renderDashboard(metrics) {
  const { totalItems, needsRestock, totalValue, salesToday, ticketsToday, recent, week } = metrics
  const revDelta = deltaLabel(week.revenue, week.prevRevenue)
  const maxBar = Math.max(...week.daily.map((d) => d.revenue), 1)
  const watch = state.products.filter((p) => p.stock <= p.minStock).slice(0, 6)
  const snippet = state.products.slice(0, 8)
  const hour = new Date().getHours()
  const greeting = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam'
  const eyebrow = serverProblem ? 'SERVER TIDAK TERHUBUNG' : isDemo ? 'MODE DEMO · DATA CONTOH' : 'RINGKASAN DANA USAHA'
  const subheading = serverProblem || (isDemo ? 'Angka ini contoh. Kosongkan demo lalu isi stok merchandise yang sebenarnya.' : 'Stok, omzet hari ini, dan barang yang menipis — dibaca dari pergerakan barang.')
  const heroActions = serverProblem
    ? `<button type="button" class="primary-button" data-action="retry">Coba lagi ${icon('arrow')}</button>`
    : `<button type="button" class="secondary-button" data-action="quick-sale">${icon('scan')} Catat penjualan</button><button type="button" class="primary-button" data-action="add-product">${icon('plus')} Tambah barang</button>`
  const onboarding = !serverProblem && !state.products.length ? `
    <section class="onboarding panel">
      <div><p class="eyebrow">MULAI DI SINI</p><h2>Inventori masih kosong</h2><p class="subheading">Tiga langkah supaya booth siap jualan.</p></div>
      <ol class="onboarding-steps">
        <li><b>Daftarkan merchandise</b><span>Nama, harga jual, stok awal, dan batas minimum.</span></li>
        <li><b>Cetak label barcode</b><span>Pakai barcode bawaan atau buat kode otomatis.</span></li>
        <li><b>Pindai saat terjual</b><span>Stok berkurang dan omzet tercatat otomatis.</span></li>
      </ol>
      <button type="button" class="primary-button" data-action="add-product">${icon('plus')} Tambah barang pertama</button>
    </section>` : ''
  return `
    <section class="welcome-row hero-banner${serverProblem ? ' is-offline' : ''}"><div class="hero-copy"><p class="eyebrow">${eyebrow}</p><p class="hero-greeting">${greeting}!</p><h1>${escapeHtml(metrics.storeName)}</h1><p class="subheading">${escapeHtml(subheading)}</p>${isDemo && !serverProblem ? '<button type="button" class="demo-clear" data-action="clear-demo">Mulai dengan stok kosong →</button>' : ''}</div><div class="hero-actions">${heroActions}</div></section>
    ${onboarding}
    <section class="stats-grid">
      <article class="stat-card"><div class="stat-heading"><span>Unit di rak</span><span class="stat-icon blue">${icon('box')}</span></div><strong>${totalItems.toLocaleString('id-ID')} <small>unit</small></strong><div class="stat-foot"><span class="foot-note">${state.products.length} SKU</span></div></article>
      <article class="stat-card"><div class="stat-heading"><span>Perlu restock</span><span class="stat-icon peach">${icon('bell')}</span></div><strong>${needsRestock} <small>SKU</small></strong><div class="stat-foot"><span class="${needsRestock ? 'foot-warning' : 'foot-neutral'}">${needsRestock ? 'Di atau di bawah minimum' : 'Semua di atas minimum'}</span></div></article>
      <article class="stat-card"><div class="stat-heading"><span>Nilai inventori</span><span class="stat-icon lavender">${icon('chart')}</span></div><strong class="value-stat">${money(totalValue)}</strong><div class="stat-foot"><span class="foot-note">Harga jual × stok</span></div></article>
      <article class="stat-card"><div class="stat-heading"><span>Omzet hari ini</span><span class="stat-icon mint">${icon('trend')}</span></div><strong class="value-stat">${money(salesToday)}</strong><div class="stat-foot"><span class="foot-note">${ticketsToday} transaksi</span></div></article>
    </section>
    ${needsRestock ? `<section class="attention-banner"><span class="attention-icon">!</span><div class="attention-copy"><b>${needsRestock} SKU butuh restock</b><span>Buka daftar restock, atau catat barang masuk dari menu barang.</span></div><button type="button" data-filter-shortage>Buka restock ${icon('arrow')}</button></section>` : ''}
    <section class="workspace-grid">
      <div class="panel chart-frame">
        <div class="chart-legend"><h2>Omzet 7 hari</h2><span class="delta ${revDelta.cls}">${revDelta.text} vs 7 hari sebelumnya</span></div>
        ${barChart(week.daily, week.peak, maxBar, () => true)}
      </div>
      <div class="panel activity-panel">
        <div class="panel-heading"><div><h2>Perlu dicek</h2><p>SKU di atau di bawah minimum.</p></div></div>
        <div class="dead-list">${watch.map((p) => `<button type="button" data-watch-product="${escapeHtml(p.id)}"><span><b>${escapeHtml(p.name)}</b><br><small>Sisa ${p.stock} · min ${p.minStock}</small></span><span class="status status-${stockStatus(p).toLowerCase()}">${stockStatus(p)}</span></button>`).join('') || '<div class="empty-activity">Tidak ada yang menipis. 🎉</div>'}</div>
      </div>
    </section>
    <section class="workspace-grid">
      <div class="panel">
        <div class="panel-heading"><div><h2>Inventori singkat</h2><p>${state.products.length} barang terdaftar.</p></div><button type="button" class="text-button" data-go="#inventory">Kelola ${icon('arrow')}</button></div>
        ${inventoryTable(snippet, 'Belum ada barang. Tambahkan merchandise pertama.')}
        <div class="table-footer"><span>Menampilkan <b>${snippet.length}</b> dari <b>${state.products.length}</b> barang</span><button type="button" class="text-button" data-go="#inventory">Buka inventori ${icon('arrow')}</button></div>
      </div>
      <div class="panel activity-panel">
        <div class="panel-heading"><div><h2>Aktivitas</h2><p>Keluar-masuk terakhir.</p></div></div>
        <div class="activity-list">${recent.map((m) => { const p = state.products.find((x) => x.id === m.productId); return `<div class="activity-item"><span class="activity-symbol ${m.type}">${m.type === 'sale' ? '−' : '+'}</span><div class="activity-description"><b>${escapeHtml(p?.name || m.productName || 'Barang dihapus')}</b><small>${m.type === 'sale' ? 'Penjualan' : 'Restock'} · ${shortDateTime(m.date)}</small></div><span class="activity-qty ${m.type}">${m.type === 'sale' ? '−' : '+'}${m.qty}</span></div>` }).join('') || '<div class="empty-activity">Belum ada aktivitas stok.</div>'}</div>
        <button type="button" class="activity-link" data-go="#transactions">Semua transaksi ${icon('arrow')}</button>
      </div>
    </section>
  `
}

function shortDateTime(date) {
  const value = new Date(date)
  // Older entries need a date, otherwise "10.15" reads as today.
  if (value.toDateString() === new Date().toDateString()) return timeLabel(value)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(value)
}

function barChart(daily, peak, maxBar, showLabel) {
  return `<div class="bar-chart" role="img" aria-label="Grafik omzet harian">${daily.map((day, index) => `<div class="bar-col ${day.key === peak?.key && day.revenue ? 'is-peak' : ''}" title="${escapeHtml(day.label)} · ${money(day.revenue)} · ${day.units} unit"><i style="height:${Math.max(3, Math.round((day.revenue / maxBar) * 100))}%"></i><small>${showLabel(index) ? escapeHtml(day.label) : ''}</small></div>`).join('')}</div>`
}

function renderInventoryView() {
  const rows = filteredProducts()
  return `
    <section class="page-toolbar"><div><p class="eyebrow">STOK</p><h1>Inventori</h1><p class="subheading">Cari SKU, filter status, catat penjualan atau restock dari baris barang.</p></div><div class="top-actions"><button type="button" class="secondary-button" data-action="quick-sale">${icon('scan')} Catat penjualan</button><button type="button" class="primary-button" data-action="add-product">${icon('plus')} Tambah barang</button></div></section>
    <section class="panel">
      <div class="table-tools"><label class="search-box">${icon('search')}<input id="search" type="search" placeholder="Cari nama, SKU, atau barcode" aria-label="Cari barang" autocomplete="off" value="${escapeHtml(query)}"><span class="shortcut" title="Tekan / untuk mencari">/</span></label><div class="filter-wrap"><select id="filter" aria-label="Filter stok">${['Semua barang', 'Perlu restock', 'Stok menipis', 'Stok habis', 'Stok aman'].map((filter) => `<option ${activeFilter === filter ? 'selected' : ''}>${filter}</option>`).join('')}</select><span class="filter-caret" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m7 10 5 5 5-5" /></svg></span></div></div>
      ${inventoryTable(rows, inventoryEmptyText())}
      <div class="table-footer"><span data-inventory-count>${inventoryCountLabel(rows)}</span><button type="button" class="text-button" data-action="export-products">Unduh CSV ${icon('arrow')}</button></div>
    </section>
  `
}

function inventoryEmptyText() {
  if (!state.products.length) return 'Belum ada barang. Pilih <b>Tambah barang</b> untuk mulai.'
  return `Tidak ada barang yang cocok. <button type="button" class="text-button" data-action="reset-filter">Hapus pencarian & filter</button>`
}

function inventoryCountLabel(rows) {
  return `Menampilkan <b>${rows.length}</b> dari <b>${state.products.length}</b> barang`
}

// Typing only swaps the result rows; rebuilding the whole page would replace the
// focused input and break mobile keyboards mid-word.
function refreshInventoryResults() {
  const body = document.querySelector('[data-inventory-rows]')
  const count = document.querySelector('[data-inventory-count]')
  if (!body || !count) { render(); return }
  const rows = filteredProducts()
  body.innerHTML = inventoryRows(rows, inventoryEmptyText())
  count.innerHTML = inventoryCountLabel(rows)
  bindProductMenus(body)
  body.querySelector('[data-action="reset-filter"]')?.addEventListener('click', resetInventoryFilter)
}

function resetInventoryFilter() {
  query = ''
  activeFilter = 'Semua barang'
  render()
}

function renderTransactionsView() {
  const rows = filteredMovements()
  return `
    <section class="page-toolbar"><div><p class="eyebrow">MUTASI</p><h1>Transaksi</h1><p class="subheading">${state.movements.length} catatan keluar-masuk. Filter penjualan atau restock.</p></div><button type="button" class="primary-button" data-action="quick-sale">${icon('scan')} Catat penjualan</button></section>
    <section class="panel">
      <div class="table-tools">
        <label class="search-box">${icon('search')}<input id="tx-search" type="search" placeholder="Cari barang, SKU, atau catatan" aria-label="Cari transaksi" autocomplete="off" value="${escapeHtml(txQuery)}"></label>
        <div class="segmented" role="group" aria-label="Jenis transaksi">
          ${[['all', 'Semua'], ['sale', 'Penjualan'], ['restock', 'Restock']].map(([type, label]) => `<button type="button" class="${txType === type ? 'active' : ''}" aria-pressed="${txType === type}" data-tx-type="${type}">${label}</button>`).join('')}
        </div>
      </div>
      <div class="table-scroll"><table><thead><tr><th>WAKTU</th><th>BARANG</th><th>JENIS</th><th>QTY</th><th>NILAI</th><th>CATATAN</th></tr></thead><tbody data-tx-rows>${transactionRows(rows)}</tbody></table></div>
      <div class="table-footer"><span data-tx-count>${transactionCountLabel(rows)}</span></div>
    </section>
  `
}

function transactionRows(rows) {
  return rows.map((m) => {
    const p = state.products.find((item) => item.id === m.productId)
    const when = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(m.date))
    const amount = m.type === 'sale' ? saleAmount(m) : 0
    return `<tr><td class="sku">${escapeHtml(when)}</td><td><div class="product-cell"><span><b>${escapeHtml(p?.name || m.productName || 'Barang dihapus')}</b><small>${escapeHtml(p?.sku || m.productSKU || '—')}</small></span></div></td><td><span class="status ${m.type === 'sale' ? 'status-sale' : 'status-aman'}">${m.type === 'sale' ? 'Penjualan' : 'Restock'}</span></td><td class="stock-number ${m.type === 'sale' ? 'stock-low' : 'stock-in'}">${m.type === 'sale' ? '−' : '+'}${m.qty}</td><td class="price">${m.type === 'sale' ? money(amount) : '—'}</td><td class="note-cell">${escapeHtml(m.note || '—')}</td></tr>`
  }).join('') || `<tr><td colspan="6" class="empty-state">${state.movements.length ? 'Belum ada transaksi pada filter ini.' : 'Belum ada transaksi. Catat penjualan atau restock pertama.'}</td></tr>`
}

function transactionCountLabel(rows) {
  const revenue = rows.reduce((sum, m) => sum + saleAmount(m), 0)
  return `<b>${rows.length}</b> baris ditampilkan${revenue ? ` · omzet <b>${money(revenue)}</b>` : ''}`
}

function refreshTransactionResults() {
  const body = document.querySelector('[data-tx-rows]')
  const count = document.querySelector('[data-tx-count]')
  if (!body || !count) { render(); return }
  const rows = filteredMovements()
  body.innerHTML = transactionRows(rows)
  count.innerHTML = transactionCountLabel(rows)
}

function renderReportsView() {
  const report = computeAnalytics(reportRange)
  const revDelta = deltaLabel(report.revenue, report.prevRevenue)
  const unitDelta = deltaLabel(report.unitsSold, report.prevUnits)
  const maxBar = Math.max(...report.daily.map((d) => d.revenue), 1)
  const maxProduct = Math.max(...report.topProducts.map((p) => p.revenue), 1)
  const safeEnd = `${report.health.safePct}%`
  const lowEnd = `${report.health.safePct + report.health.lowPct}%`
  return `
    <section class="page-toolbar"><div><p class="eyebrow">ANALITIK</p><h1>Laporan dana usaha</h1><p class="subheading">${reportRange === 1 ? 'Hari ini, dibanding kemarin' : `Periode ${reportRange} hari, dibanding ${reportRange} hari sebelumnya`}. Omzet dari harga tercatat saat penjualan.</p></div><div class="segmented" role="group" aria-label="Periode laporan">${[1, 7, 30].map((days) => `<button type="button" class="${reportRange === days ? 'active' : ''}" aria-pressed="${reportRange === days}" data-report-range="${days}">${days === 1 ? 'Hari ini' : days + ' hari'}</button>`).join('')}</div></section>
    <section class="stats-grid">
      <article class="stat-card"><div class="stat-heading"><span>Omzet</span><span class="delta ${revDelta.cls}">${revDelta.text}</span></div><strong class="value-stat">${money(report.revenue)}</strong><div class="stat-foot"><span class="foot-note">${report.tickets} transaksi</span></div></article>
      <article class="stat-card"><div class="stat-heading"><span>Unit terjual</span><span class="delta ${unitDelta.cls}">${unitDelta.text}</span></div><strong>${report.unitsSold.toLocaleString('id-ID')}</strong><div class="stat-foot"><span class="foot-note">Rata transaksi ${money(report.avgTicket)}</span></div></article>
      <article class="stat-card"><div class="stat-heading"><span>Barang masuk</span></div><strong>${report.unitsIn.toLocaleString('id-ID')}</strong><div class="stat-foot"><span class="foot-note">Net ${report.netUnits >= 0 ? '+' : ''}${report.netUnits} unit</span></div></article>
      <article class="stat-card"><div class="stat-heading"><span>Hari terkuat</span></div><strong class="value-stat">${report.peak?.revenue ? money(report.peak.revenue) : '—'}</strong><div class="stat-foot"><span class="foot-note">${escapeHtml(report.peak?.label || 'Belum ada data')}</span></div></article>
    </section>
    ${report.insights.length ? `<ul class="insight-list">${report.insights.map((item) => `<li><b>${item.k}</b><span>${escapeHtml(item.t)}</span></li>`).join('')}</ul>` : ''}
    <section class="analytics-grid">
      <div class="panel chart-frame">
        <div class="chart-legend"><h2>Tren omzet</h2><span><i class="legend-swatch peak"></i>Hari terkuat</span></div>
        ${barChart(report.daily, report.peak, maxBar, (index) => report.days <= 7 || index === 0 || index === report.daily.length - 1 || index % 5 === 0)}
      </div>
      <div class="panel chart-frame">
        <div class="chart-legend"><h2>Kesehatan stok</h2><span>${state.products.length} SKU</span></div>
        <div class="mix-row">
          <div class="donut${state.products.length ? '' : ' is-empty'}" style="--safe:${safeEnd};--low:${lowEnd}" role="img" aria-label="Aman ${report.health.safePct}%, menipis ${report.health.lowPct}%, habis ${report.health.outPct}%"></div>
          <div class="mix-legend">
            <span><i class="c-safe"></i>Aman ${report.health.safe} · ${report.health.safePct}%</span>
            <span><i class="c-low"></i>Menipis ${report.health.low} · ${report.health.lowPct}%</span>
            <span><i class="c-out"></i>Habis ${report.health.out} · ${report.health.outPct}%</span>
          </div>
        </div>
      </div>
    </section>
    <section class="analytics-grid">
      <div class="panel chart-frame">
        <div class="chart-legend"><h2>SKU penahan omzet</h2><span>Periode ini</span></div>
        <div class="hbar-list">${report.topProducts.map((p) => `<div class="hbar-row"><b>${escapeHtml(p.name)}</b><span class="hbar-meta">${money(p.revenue)}</span><div class="hbar-track"><span style="width:${Math.max(4, Math.round((p.revenue / maxProduct) * 100))}%"></span></div></div>`).join('') || '<div class="empty-state">Belum ada penjualan untuk diurutkan.</div>'}</div>
      </div>
      <div class="panel chart-frame">
        <div class="chart-legend"><h2>Stok diam</h2><span>Ada stok, tidak terjual</span></div>
        <div class="dead-list">${report.deadStock.map((p) => `<div class="dead-row"><span><b>${escapeHtml(p.name)}</b><br><small>${p.stock} unit · ${money(p.stock * p.price)}</small></span><span class="sku">${escapeHtml(p.sku)}</span></div>`).join('') || '<div class="empty-state">Semua SKU berstok bergerak, atau stok masih kosong.</div>'}</div>
      </div>
    </section>
    <div class="report-footer"><button type="button" class="secondary-button" data-action="export-report">Unduh CSV periode ini ${icon('arrow')}</button></div>
  `
}

function render() {
  if (!useLocalMode && !authUser) {
    renderAuth()
    return
  }
  const remoteBackend = Boolean(supabase && authUser && !useLocalMode)
  const storeName = isDemo ? 'Dana Usaha KPK' : remoteBackend ? (authUser.user_metadata?.store_name || 'Dana Usaha KPK') : 'Dana Usaha KPK'
  const accountLabel = remoteBackend ? authUser.email : 'Mode lokal'
  const accountInitial = remoteBackend ? String(authUser.email || 'DU').slice(0, 2).toUpperCase() : 'LK'
  const now = new Date()
  const totalItems = state.products.reduce((sum, p) => sum + p.stock, 0)
  const needsRestock = state.products.filter((p) => p.stock <= p.minStock).length
  const totalValue = state.products.reduce((sum, p) => sum + p.stock * p.price, 0)
  const todaySales = state.movements.filter((m) => m.type === 'sale' && new Date(m.date).toDateString() === now.toDateString())
  const salesToday = todaySales.reduce((sum, m) => sum + saleAmount(m), 0)
  const recent = [...state.movements].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
  const title = pageTitles[activeNav] || 'Ringkasan'
  const loading = state.dataMode === 'loading' && !serverProblem
  const page = loading ? loadingMarkup()
    : activeNav === '#inventory' ? renderInventoryView()
    : activeNav === '#transactions' ? renderTransactionsView()
    : activeNav === '#reports' ? renderReportsView()
    : renderDashboard({ storeName, totalItems, needsRestock, totalValue, salesToday, ticketsToday: todaySales.length, recent, week: computeAnalytics(7) })
  // Live updates re-render while someone may be typing; put the caret back where it was.
  const focused = document.activeElement?.id && document.querySelector('#app')?.contains(document.activeElement) ? document.activeElement : undefined
  const focusState = focused && { id: focused.id, start: focused.selectionStart, end: focused.selectionEnd }
  document.querySelector('#app').innerHTML = `
    <aside class="sidebar">
      <a class="brand" href="#dashboard">
        <span class="brand-logo-img"><img src="${fundAssetPrefix}/images/logo/hero.webp" alt="KPK" /></span>
        <span class="brand-text">
          <span class="brand-title">KPK</span>
          <span class="brand-subtitle">× Ini Lho ITS! · Dana</span>
        </span>
      </a>
      <div class="nav-label">Buku kerja</div>
      <nav class="nav-list">
        <a class="nav-item ${activeNav === '#dashboard' ? 'active' : ''}" href="#dashboard">${icon('grid')}<span>Ringkasan</span></a>
        <a class="nav-item ${activeNav === '#inventory' ? 'active' : ''}" href="#inventory">${icon('box')}<span>Inventori</span><span class="nav-count">${state.products.length}</span></a>
        <a class="nav-item ${activeNav === '#transactions' ? 'active' : ''}" href="#transactions">${icon('receipt')}<span>Transaksi</span></a>
        <a class="nav-item ${activeNav === '#reports' ? 'active' : ''}" href="#reports">${icon('chart')}<span>Analitik</span></a>
      </nav>
      <div class="sidebar-bottom">
        <div class="help-card"><b>Festival Pulang Kampung</b><p>Daftar merchandise, pindai barcode, catat kas masuk & keluar, pantau omzet.</p><a href="#help" data-action="help">Buka panduan ${icon('arrow')}</a></div>
        <div class="profile"><span class="profile-avatar">${escapeHtml(accountInitial)}</span><span class="profile-copy"><b>${escapeHtml(accountLabel || 'Pengelola dana')}</b><small>${remoteBackend ? 'Akun terhubung' : 'Server lokal'}</small></span><button type="button" class="profile-logout" data-action="${remoteBackend ? 'sign-out' : 'leave-local'}">${remoteBackend ? 'Keluar' : 'Kembali'}</button></div>
      </div>
    </aside>
    <main class="main-area">
      <header class="topbar"><div class="breadcrumbs">${escapeHtml(storeName)} <span>/</span> <b>${title}</b></div><div class="top-actions"><div class="date-pill">${icon('calendar')}<span>${dayLabel(now)}</span></div><button type="button" class="icon-button topbar-help" data-action="help" aria-label="Buka panduan">${icon('help')}</button><button type="button" class="icon-button notification" aria-label="${needsRestock ? `${needsRestock} barang perlu restock` : 'Notifikasi stok'}">${icon('bell')}${needsRestock ? `<i>${needsRestock > 9 ? '9+' : needsRestock}</i>` : ''}</button><button type="button" class="mobile-logout" data-action="${remoteBackend ? 'sign-out' : 'leave-local'}">${remoteBackend ? 'Keluar' : 'Kembali'}</button><span class="top-avatar" title="${escapeHtml(accountLabel)}">${escapeHtml(accountInitial)}</span></div></header>
      <div class="content">
        ${page}
        <footer class="footer"><span>© ${now.getFullYear()} KPK × Ini Lho ITS! — Dana Usaha</span><span class="${serverProblem ? 'is-offline' : ''}"><i class="live-dot"></i> ${serverProblem ? 'Tidak tersinkron' : remoteBackend ? 'Sinkron antar perangkat' : 'Sinkron antar tab'}</span></footer>
      </div>
    </main>
    `
  bindEvents()
  if (focusState) {
    const input = document.getElementById(focusState.id)
    input?.focus({ preventScroll: true })
    try { input?.setSelectionRange(focusState.start, focusState.end) } catch { /* not a text input */ }
  }
}
function escapeHtml(text) { return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) }

function renderBarcode(svg, value) {
  JsBarcode(svg, value, { format: 'CODE128', lineColor: '#352a22', width: 1.7, height: 52, displayValue: true, font: 'Arial', fontSize: 13, textMargin: 3, margin: 5 })
}

function printBarcodeLabel(name, sku) {
  let svg
  try {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    renderBarcode(svg, sku)
  } catch {
    showToast('Kode ini tidak bisa dibuat menjadi barcode. Gunakan huruf dan angka biasa.')
    return
  }
  const printWindow = window.open('', '_blank', 'width=520,height=420')
  if (!printWindow) { showToast('Izinkan pop-up untuk mencetak label barcode.'); return }
  printWindow.document.open()
  printWindow.document.write(`<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Label ${escapeHtml(sku)}</title><style>@page{size:80mm 48mm;margin:3mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;color:#222}.label{width:74mm;min-height:40mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2mm;text-align:center;overflow:hidden}.name{max-width:100%;font-size:10pt;font-weight:700;overflow-wrap:anywhere}.label svg{display:block;max-width:100%;height:auto}.sku{font-size:8pt;letter-spacing:.7px}@media screen{body{padding:16px}.label{border:1px dashed #aaa;margin:auto}}</style></head><body><main class="label"><div class="name">${escapeHtml(name)}</div>${new XMLSerializer().serializeToString(svg)}<div class="sku">${escapeHtml(sku)}</div></main><script>window.onload=()=>{window.focus();window.print()}</script></body></html>`)
  printWindow.document.close()
}

function newInternalSku() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = new Uint8Array(7)
  if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes)
  else bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256) })
  return `STK-${Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')}`
}

function wireBarcodeTools(root) {
  const input = root.querySelector('input[name="sku"]')
  const preview = root.querySelector('[data-barcode-preview]')
  const svg = root.querySelector('[data-barcode-svg]')
  const status = root.querySelector('[data-barcode-status]')
  const generate = root.querySelector('[data-generate-barcode]')
  const print = root.querySelector('[data-print-barcode]')
  if (!input || !preview || !svg || !status || !generate || !print) return
  const updatePreview = () => {
    const value = input.value.trim()
    if (!value) {
      preview.hidden = true
      print.disabled = true
      status.textContent = 'Untuk barang tanpa barcode, buat kode lalu cetak label.'
      return
    }
    try {
      renderBarcode(svg, value)
      preview.hidden = false
      print.disabled = false
      status.textContent = 'Label siap dicetak. Tempelkan pada barang agar bisa dipindai.'
    } catch {
      preview.hidden = true
      print.disabled = true
      status.textContent = 'Kode ini belum bisa dibuat sebagai barcode. Gunakan huruf dan angka biasa.'
    }
  }
  input.addEventListener('input', updatePreview)
  generate.addEventListener('click', () => {
    let sku
    do { sku = newInternalSku() } while (state.products.some((product) => product.sku.toLowerCase() === sku.toLowerCase()))
    input.value = sku
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.focus()
  })
  print.addEventListener('click', () => {
    const productName = root.querySelector('input[name="name"]')?.value.trim() || 'Barang toko'
    printBarcodeLabel(productName, input.value.trim())
  })
  updatePreview()
}

function showProductBarcode(product) {
  openInfoModal('Label barcode', `<p class="modal-hint">Cetak label ini, lalu tempelkan pada ${escapeHtml(product.name)}. Kode yang sama akan dibaca kamera HP.</p><div class="saved-barcode-label"><b>${escapeHtml(product.name)}</b><svg data-saved-barcode role="img" aria-label="Barcode ${escapeHtml(product.sku)}"></svg><small>${escapeHtml(product.sku)}</small></div><p class="barcode-print-note" data-saved-barcode-status></p><button type="button" class="primary-button" data-print-saved-barcode>Cetak label</button>`)
  const root = document.querySelector('#modal-root')
  const status = root.querySelector('[data-saved-barcode-status]')
  const print = root.querySelector('[data-print-saved-barcode]')
  try {
    renderBarcode(root.querySelector('[data-saved-barcode]'), product.sku)
    status.textContent = 'Label siap dicetak.'
    print.addEventListener('click', () => printBarcodeLabel(product.name, product.sku))
  } catch {
    status.textContent = 'Kode ini tidak bisa dibuat menjadi barcode. Gunakan SKU berisi huruf dan angka biasa.'
    print.disabled = true
  }
}

function showToast(message, tone = 'info') {
  const toast = document.querySelector('#toast')
  toast.textContent = message
  toast.classList.toggle('is-error', tone === 'error')
  toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), tone === 'error' ? 4500 : 2600)
}

const showError = (error) => showToast(error.message, 'error')
const modalRoot = () => document.querySelector('#modal-root')
let modalReturnFocus

function closeModal() {
  activeCameraStopper?.()
  const root = modalRoot()
  if (!root?.firstElementChild) return
  root.innerHTML = ''
  document.body.classList.remove('modal-open')
  if (modalReturnFocus?.isConnected) modalReturnFocus.focus({ preventScroll: true })
  modalReturnFocus = undefined
}

function mountModal(markup) {
  activeCameraStopper?.()
  const root = modalRoot()
  // Chained modals (menu → sale) should hand focus back to what opened the first one.
  if (!root.firstElementChild) modalReturnFocus = document.activeElement
  root.innerHTML = markup
  document.body.classList.add('modal-open')
  const backdrop = root.querySelector('.modal-backdrop')
  root.querySelectorAll('.close-modal').forEach((el) => el.addEventListener('click', closeModal))
  // Only a press that starts and ends on the backdrop closes it, so selecting text in a field doesn't.
  let pressedBackdrop = false
  backdrop.addEventListener('pointerdown', (event) => { pressedBackdrop = event.target === backdrop })
  backdrop.addEventListener('click', (event) => { if (pressedBackdrop && event.target === backdrop) closeModal() })
  return backdrop
}

const modalHead = (title) => `<div class="modal-head"><div><p class="eyebrow">DANA USAHA · KPK × ILITS</p><h2 id="modal-title">${title}</h2></div><button type="button" class="icon-button close-modal" aria-label="Tutup">${icon('close')}</button></div>`

function openInfoModal(title, content, { actions = '<button type="button" class="secondary-button close-modal">Tutup</button>' } = {}) {
  const backdrop = mountModal(`<div class="modal-backdrop"><section class="modal info-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">${modalHead(title)}<div class="info-content">${content}</div>${actions ? `<div class="modal-actions">${actions}</div>` : ''}</section></div>`)
  backdrop.querySelector('.modal-head .close-modal')?.focus({ preventScroll: true })
  return backdrop
}

function openConfirmModal(title, message, confirmLabel, onConfirm) {
  const backdrop = openInfoModal(title, `${message}<p class="form-error" data-form-error role="alert" hidden></p>`, {
    actions: `<button type="button" class="secondary-button close-modal">Batal</button><button type="button" class="danger-button" data-confirm>${icon('trash')} ${confirmLabel}</button>`,
  })
  const confirm = backdrop.querySelector('[data-confirm]')
  confirm.addEventListener('click', async () => {
    setButtonBusy(confirm, true, 'Memproses…')
    try {
      await onConfirm()
      if (backdrop.isConnected) closeModal()
    } catch (error) {
      setButtonBusy(confirm, false)
      showFormError(backdrop, error.message)
    }
  })
}

function setButtonBusy(button, busy, label) {
  if (busy) {
    button.dataset.idleHtml = button.innerHTML
    button.innerHTML = `<span class="spinner" aria-hidden="true"></span>${label}`
  } else if (button.dataset.idleHtml) button.innerHTML = button.dataset.idleHtml
  button.disabled = busy
  button.setAttribute('aria-busy', String(busy))
}

function showFormError(root, message) {
  const error = root.querySelector('[data-form-error]')
  if (!error) { showToast(message, 'error'); return }
  error.textContent = message
  error.hidden = !message
}

// onSubmit may return a promise; the form stays open until it settles, so a failed
// save keeps what was typed and shows the reason next to the buttons.
function openModal(title, content, onSubmit, submitLabel = 'Simpan') {
  const backdrop = mountModal(`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">${modalHead(title)}<form id="modal-form" novalidate>${content}<p class="form-error" data-form-error role="alert" hidden></p><div class="modal-actions"><button type="button" class="secondary-button close-modal">Batal</button><button type="submit" class="primary-button">${submitLabel} ${icon('arrow')}</button></div></form></section></div>`)
  const form = backdrop.querySelector('form')
  const submit = form.querySelector('[type="submit"]')
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (submit.disabled) return
    if (!form.checkValidity()) {
      const invalid = form.querySelector(':invalid')
      showFormError(backdrop, validationText(invalid))
      invalid?.focus()
      return
    }
    showFormError(backdrop, '')
    activeCameraStopper?.()
    setButtonBusy(submit, true, 'Menyimpan…')
    try {
      await onSubmit(new FormData(form))
      // onSubmit may have opened the next modal; only close the one we own.
      if (backdrop.isConnected) closeModal()
    } catch (error) {
      if (!backdrop.isConnected) { showError(error); return }
      setButtonBusy(submit, false)
      showFormError(backdrop, error.message)
    }
  })
  if (!window.matchMedia('(max-width: 768px)').matches) form.querySelector('input')?.focus()
  return backdrop
}

// Browser messages follow the device language; spell the common cases out in Indonesian.
function validationText(input) {
  if (!input) return 'Lengkapi isian yang wajib.'
  const label = input.getAttribute('aria-label') || input.closest('label')?.querySelector('span')?.firstChild?.textContent?.trim() || 'Isian'
  const { validity } = input
  if (validity.valueMissing) return `${label} wajib diisi.`
  if (validity.rangeUnderflow) return `${label} minimal ${input.min}.`
  if (validity.rangeOverflow) return `${label} maksimal ${input.max}.`
  if (validity.stepMismatch || validity.badInput) return `${label} harus berupa angka bulat.`
  return `${label}: ${input.validationMessage}`
}

function handleGlobalKeydown(event) {
  const modal = modalRoot()?.querySelector('.modal')
  if (modal) {
    if (event.key === 'Escape') { event.preventDefault(); closeModal(); return }
    if (event.key === 'Tab') {
      const focusable = [...modal.querySelectorAll('button:not([disabled]), input:not([type="hidden"]):not([hidden]), select, a[href]')].filter((el) => el.offsetParent !== null)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) { event.preventDefault(); first.focus() }
    }
    return
  }
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
    const input = document.querySelector('#search') || document.querySelector('#tx-search')
    if (!input) return
    event.preventDefault()
    input.focus()
  }
}

const field = (label, name, opts = {}) => `<label class="form-field ${opts.wide ? 'wide' : ''}"><span>${label}${opts.required === false ? ' <em>opsional</em>' : ''}</span><input name="${name}" type="${opts.type || 'text'}" ${opts.type === 'number' ? 'inputmode="numeric" step="1"' : ''} ${opts.required === false ? '' : 'required'} ${opts.placeholder ? `placeholder="${opts.placeholder}"` : ''} ${opts.value !== undefined ? `value="${opts.value}"` : ''} ${opts.min !== undefined ? `min="${opts.min}"` : ''} ${opts.max !== undefined ? `max="${opts.max}"` : ''} ${opts.autocomplete ? `autocomplete="${opts.autocomplete}"` : ''}></label>`

function cameraPanelMarkup() {
  return `<div class="camera-panel" data-camera-panel hidden><div class="camera-viewfinder"><video data-camera-video autoplay muted playsinline aria-label="Pratinjau kamera untuk memindai barcode"></video><span class="scan-reticle" aria-hidden="true"></span></div><div class="camera-panel-footer"><span data-camera-status role="status">Arahkan barcode ke dalam bingkai.</span><div class="camera-panel-actions"><button type="button" class="text-button" data-camera-photo>Foto barcode</button><input type="file" accept="image/*" capture="environment" data-camera-file hidden><button type="button" class="text-button" data-camera-stop>Tutup kamera</button></div></div></div><p class="camera-message" data-camera-message role="status"></p>`
}

function cameraSkuField(value, placeholder = 'Pindai dengan kamera HP atau ketik kode') {
  return `<label class="form-field"><span>SKU / barcode</span><div class="field-with-action"><input name="sku" required placeholder="${placeholder}" ${value !== undefined ? `value="${value}"` : ''}><button type="button" class="camera-field-button" data-camera-trigger aria-label="Buka kamera HP untuk memindai barcode">${icon('scan')}<span>Kamera HP</span></button></div></label>`
}

function barcodeToolsMarkup() {
  return `<div class="barcode-tools"><button type="button" class="text-button" data-generate-barcode>Buat kode otomatis</button><button type="button" class="text-button" data-print-barcode disabled>Cetak label</button><span data-barcode-status role="status">Untuk barang tanpa barcode, buat kode lalu cetak label.</span></div><div class="barcode-preview" data-barcode-preview hidden><svg data-barcode-svg role="img" aria-label="Pratinjau barcode"></svg></div>`
}

function cameraErrorMessage(error) {
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) return 'Akses kamera butuh halaman HTTPS. Buka aplikasi lewat alamat HTTPS di HP.'
  if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') return 'Izin kamera belum diberikan. Izinkan kamera untuk situs ini lalu coba lagi.'
  if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') return 'Kamera tidak ditemukan di perangkat ini.'
  if (error?.name === 'NotReadableError' || error?.name === 'TrackStartError') return 'Kamera sedang dipakai aplikasi lain. Tutup aplikasi itu lalu coba lagi.'
  return `Kamera tidak dapat dibuka${error?.message ? `: ${error.message}` : '.'}`
}

function wireCameraScanner(root, input, onScan) {
  const trigger = root.querySelector('[data-camera-trigger]')
  const panel = root.querySelector('[data-camera-panel]')
  const video = root.querySelector('[data-camera-video]')
  const status = root.querySelector('[data-camera-status]')
  const message = root.querySelector('[data-camera-message]')
  const stopButton = root.querySelector('[data-camera-stop]')
  const photoButton = root.querySelector('[data-camera-photo]')
  const fileInput = root.querySelector('[data-camera-file]')
  if (!trigger || !panel || !video || !status || !message || !stopButton || !photoButton || !fileInput) return

  let currentSession
  let photoRun = 0
  let photoUrl
  function stop(hidePanel = true) {
    photoRun += 1
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    photoUrl = undefined
    if (currentSession) {
      currentSession.cancelled = true
      currentSession.controls?.stop()
      video.srcObject?.getTracks().forEach((track) => track.stop())
      video.srcObject = null
      currentSession = undefined
    }
    fileInput.value = ''
    trigger.disabled = false
    if (hidePanel) panel.hidden = true
    if (activeCameraStopper === stop) activeCameraStopper = undefined
  }
  activeCameraStopper = stop
  trigger.addEventListener('click', async () => {
    activeCameraStopper?.()
    activeCameraStopper = stop
    currentSession = { cancelled: false, controls: undefined }
    const session = currentSession
    panel.hidden = false
    requestAnimationFrame(() => panel.scrollIntoView({ behavior: 'smooth', block: 'center' }))
    message.textContent = ''
    status.textContent = 'Meminta izin kamera…'
    trigger.disabled = true
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      status.textContent = cameraErrorMessage()
      trigger.disabled = false
      return
    }
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser')
      const reader = new BrowserMultiFormatReader()
      const controls = await reader.decodeFromConstraints({
        audio: false,
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
      }, video, (result) => {
        if (!result || session.cancelled) return
        const code = result.getText().trim()
        stop()
        input.value = code
        input.dispatchEvent(new Event('input', { bubbles: true }))
        onScan(code)
      })
      session.controls = controls
      if (session.cancelled) controls.stop()
      else status.textContent = 'Kamera aktif. Arahkan ke barcode barang.'
    } catch (error) {
      if (session.cancelled) return
      stop(false)
      status.textContent = cameraErrorMessage(error)
    }
  })
  stopButton.addEventListener('click', () => stop())
  photoButton.addEventListener('click', () => {
    stop()
    activeCameraStopper = stop
    panel.hidden = false
    requestAnimationFrame(() => panel.scrollIntoView({ behavior: 'smooth', block: 'center' }))
    status.textContent = 'Pilih kamera untuk memfoto barcode.'
    fileInput.click()
  })
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0]
    if (!file) return
    activeCameraStopper = stop
    const run = ++photoRun
    photoUrl = URL.createObjectURL(file)
    const image = new Image()
    status.textContent = 'Membaca foto barcode…'
    image.onload = async () => {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser')
        const result = await new BrowserMultiFormatReader().decodeFromImageElement(image)
        if (run !== photoRun) return
        const code = result.getText().trim()
        stop()
        input.value = code
        onScan(code)
      } catch {
        if (run === photoRun) status.textContent = 'Barcode belum terbaca. Coba foto lebih dekat dan pastikan kodenya fokus.'
      } finally {
        if (run === photoRun && photoUrl) URL.revokeObjectURL(photoUrl)
        if (run === photoRun) { photoUrl = undefined; fileInput.value = '' }
      }
    }
    image.onerror = () => {
      if (run === photoRun) status.textContent = 'Foto tidak dapat dibuka. Coba ambil foto lagi.'
      if (run === photoRun && photoUrl) URL.revokeObjectURL(photoUrl)
      if (run === photoRun) { photoUrl = undefined; fileInput.value = '' }
    }
    image.src = photoUrl
  })
}

const scanMessage = (root, text, isError = false) => {
  const message = root.querySelector('[data-camera-message]')
  message.textContent = text
  message.classList.toggle('is-error', isError)
}

function productFormFields(product) {
  return `<div class="form-grid">${field('Nama barang', 'name', { placeholder: 'Contoh: Kaos KPK 2026', value: product ? escapeHtml(product.name) : undefined, autocomplete: 'off' })}${cameraSkuField(product ? escapeHtml(product.sku) : undefined)}${barcodeToolsMarkup()}${field('Kategori', 'category', { required: false, placeholder: 'Contoh: Merchandise', value: product ? escapeHtml(product.category) : undefined })}${field('Harga jual (Rp)', 'price', { type: 'number', min: 0, placeholder: 'Contoh: 75000', value: product?.price })}${product ? '' : field('Stok awal', 'stock', { type: 'number', min: 0, placeholder: '0' })}${field('Batas minimum stok', 'minStock', { type: 'number', min: 0, placeholder: 'Contoh: 5', value: product?.minStock })}</div>${cameraPanelMarkup()}`
}

function wireProductForm(root) {
  wireCameraScanner(root, root.querySelector('input[name="sku"]'), (code) => scanMessage(root, `Barcode ${code} terbaca dan dimasukkan ke kolom SKU.`))
  wireBarcodeTools(root)
}

function addProduct() {
  const root = openModal('Tambah barang baru', `<p class="modal-hint">Gunakan barcode yang sudah ada atau buat kode internal otomatis. Cetak labelnya lalu tempelkan pada barang.</p>${productFormFields()}`, async (data) => {
    const product = { name: data.get('name').trim(), sku: data.get('sku').trim(), category: data.get('category').trim() || 'Umum', price: Number(data.get('price')), stock: Number(data.get('stock')), minStock: Number(data.get('minStock')) }
    const { state: nextState } = await apiRequest('/products', { method: 'POST', body: product })
    applyState(nextState); render(); showToast(`${product.name} ditambahkan ke inventori`)
  }, 'Simpan barang')
  wireProductForm(root)
}

function editProduct(product) {
  const root = openModal('Edit detail barang', `<p class="modal-hint">Perubahan harga, SKU, dan batas minimum tidak mengubah jumlah stok. Kamu bisa membuat ulang atau mencetak label barcode dari sini.</p>${productFormFields(product)}`, async (data) => {
    const changes = { name: data.get('name').trim(), sku: data.get('sku').trim() || product.sku, category: data.get('category').trim() || 'Umum', price: Number(data.get('price')), minStock: Number(data.get('minStock')) }
    const { state: nextState } = await apiRequest(`/products/${encodeURIComponent(product.id)}`, { method: 'PATCH', body: changes })
    applyState(nextState); render(); showToast(`${changes.name} diperbarui`)
  })
  wireProductForm(root)
}

function stockAction(product, type) {
  const selling = type === 'sale'
  if (selling && product.stock === 0) { showToast(`Stok ${product.name} habis. Catat restock dulu sebelum menjual.`, 'error'); return }
  const root = openModal(selling ? 'Catat penjualan' : 'Tambah stok', `<div class="selected-product"><span class="product-thumb ${escapeHtml(product.color)}">${escapeHtml(product.emoji)}</span><span><b>${escapeHtml(product.name)}</b><small>Stok tersedia: <strong>${product.stock} unit</strong> · ${escapeHtml(product.sku)}</small></span>${selling ? `<span class="selected-price">${money(product.price)}</span>` : ''}</div><div class="qty-field"><span>${selling ? 'Jumlah terjual' : 'Jumlah barang masuk'}</span><div class="qty-stepper"><button type="button" data-qty-step="-1" aria-label="Kurangi jumlah">−</button><input name="qty" type="number" inputmode="numeric" step="1" min="1" ${selling ? `max="${product.stock}"` : ''} value="1" required aria-label="${selling ? 'Jumlah terjual' : 'Jumlah barang masuk'}"><button type="button" data-qty-step="1" aria-label="Tambah jumlah">+</button></div>${selling ? `<p class="qty-total">Total <b data-qty-total>${money(product.price)}</b></p>` : ''}</div>${field('Catatan', 'note', { required: false, placeholder: selling ? 'Contoh: Booth hari ke-2' : 'Contoh: Restock dari vendor' })}`, async (data) => {
    const qty = Number(data.get('qty'))
    const { state: nextState, movement } = await apiRequest('/movements', { method: 'POST', body: { productId: product.id, type, qty, note: data.get('note').trim() || (selling ? 'Penjualan kasir' : 'Restock') } })
    applyState(nextState); render()
    const updated = state.products.find((item) => item.id === product.id)
    showToast(selling ? `Penjualan tercatat · stok tersisa ${updated?.stock ?? 0} unit` : `Stok bertambah ${movement.qty} unit`)
  }, selling ? 'Simpan penjualan' : 'Tambah stok')
  const qty = root.querySelector('input[name="qty"]')
  const total = root.querySelector('[data-qty-total]')
  const syncTotal = () => { if (total) total.textContent = money(product.price * Math.max(0, Number(qty.value) || 0)) }
  qty.addEventListener('input', syncTotal)
  root.querySelectorAll('[data-qty-step]').forEach((button) => button.addEventListener('click', () => {
    const max = selling ? product.stock : Infinity
    qty.value = String(Math.min(max, Math.max(1, (Number(qty.value) || 0) + Number(button.dataset.qtyStep))))
    syncTotal()
  }))
}

// Exact SKU, then exact name, then a single partial match — never guess between several.
function findProduct(rawTerm) {
  const term = rawTerm.trim().toLowerCase()
  if (!term) return { error: 'Pindai atau ketik SKU / nama barang terlebih dahulu.' }
  const exact = state.products.find((p) => p.sku.toLowerCase() === term) || state.products.find((p) => p.name.toLowerCase() === term)
  if (exact) return { product: exact }
  const matches = state.products.filter((p) => `${p.name} ${p.sku}`.toLowerCase().includes(term))
  if (matches.length === 1) return { product: matches[0] }
  if (matches.length > 1) return { error: `Ada ${matches.length} barang cocok (${matches.slice(0, 3).map((p) => p.name).join(', ')}${matches.length > 3 ? ', …' : ''}). Ketik lebih spesifik atau pindai barcodenya.` }
  return { error: `"${rawTerm.trim()}" belum terdaftar. Pastikan barcode sudah disimpan di SKU barang.` }
}

function quickSale() {
  const options = state.products.map((p) => `<option value="${escapeHtml(p.sku)}">${escapeHtml(p.name)} · stok ${p.stock}</option>`).join('')
  const root = openModal('Catat penjualan', `<div class="scanner-guide"><span class="scanner-guide-icon">${icon('scan')}</span><div><b>Pindai barcode dengan kamera HP</b><p>Arahkan kamera belakang ke barcode. Barang yang cocok langsung membuka form jumlah terjual.</p></div></div><div class="form-grid"><label class="form-field wide"><span>SKU / barcode / nama barang</span><div class="field-with-action"><input name="searchTerm" list="product-options" placeholder="Contoh: KPG-001" autocomplete="off" required><button type="button" class="camera-field-button" data-camera-trigger aria-label="Buka kamera HP untuk memindai barcode">${icon('scan')}<span>Kamera HP</span></button></div><datalist id="product-options">${options}</datalist></label></div>${cameraPanelMarkup()}`, (data) => {
    const { product, error } = findProduct(data.get('searchTerm'))
    if (error) throw new Error(error)
    if (!product.stock) throw new Error(`Stok ${product.name} habis. Catat restock dulu sebelum menjual.`)
    stockAction(product, 'sale')
  }, 'Lanjutkan')
  wireCameraScanner(root, root.querySelector('input[name="searchTerm"]'), (code) => {
    const { product, error } = findProduct(code)
    if (error) { scanMessage(root, error, true); return }
    if (!product.stock) { scanMessage(root, `Stok ${product.name} habis. Catat restock dulu sebelum menjual.`, true); return }
    stockAction(product, 'sale')
  })
}

function goTo(hash) {
  closeModal()
  activeNav = hash
  // pushState (not replace) so the phone's back button returns to the previous page.
  if (window.location.hash !== hash) window.history.pushState(null, '', hash)
  render()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function downloadCsv(filename, columns, rows) {
  const csv = '﻿' + [columns, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function exportReport() {
  const report = computeAnalytics(reportRange)
  const rows = report.daily.map((day) => [new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(day.date), day.revenue, day.units, day.restock])
  downloadCsv(`analitik-dana-kpk-${reportRange}hari.csv`, ['Tanggal', 'Omzet', 'Unit terjual', 'Unit masuk'], rows)
  showToast(`Omzet ${reportRange === 1 ? 'hari ini' : `${reportRange} hari`} diekspor ke CSV`)
}

function exportProducts() {
  if (!state.products.length) { showToast('Belum ada barang untuk diekspor.', 'error'); return }
  const rows = state.products.map((p) => [p.name, p.sku, p.category, p.price, p.stock, p.minStock, stockStatus(p)])
  downloadCsv('inventori-dana-kpk.csv', ['Nama barang', 'SKU / barcode', 'Kategori', 'Harga jual', 'Stok', 'Batas minimum', 'Status'], rows)
  showToast(`${state.products.length} barang diekspor ke CSV`)
}

function showStockAlerts() {
  const lowStock = state.products.filter((p) => p.stock <= p.minStock)
  const rows = lowStock.map((p) => `<button type="button" class="alert-row" data-alert-product="${escapeHtml(p.id)}"><span class="product-thumb ${escapeHtml(p.color)}">${escapeHtml(p.emoji)}</span><span><b>${escapeHtml(p.name)}</b><small>Sisa ${p.stock} unit · batas minimum ${p.minStock}</small></span><span class="status status-${stockStatus(p).toLowerCase()}">${stockStatus(p)}</span></button>`).join('')
  const root = openInfoModal('Perlu diperiksa', `<p class="modal-hint">${lowStock.length ? 'Pilih barang untuk mencatat restock.' : 'Belum ada barang yang perlu direstock.'}</p><div class="alert-list">${rows || '<div class="empty-state">Stok semua barang masih di atas batas minimum. 🎉</div>'}</div>`, {
    actions: lowStock.length ? '<button type="button" class="secondary-button close-modal">Tutup</button><button type="button" class="primary-button" data-alert-all>Lihat di inventori</button>' : undefined,
  })
  root.querySelectorAll('[data-alert-product]').forEach((button) => button.addEventListener('click', () => {
    const product = state.products.find((p) => p.id === button.dataset.alertProduct)
    if (product) stockAction(product, 'restock')
  }))
  root.querySelector('[data-alert-all]')?.addEventListener('click', () => { activeFilter = 'Perlu restock'; query = ''; goTo('#inventory') })
}

function showHelp() {
  openInfoModal('Panduan dana usaha', `<ol class="help-guide">
    <li><b>Daftarkan merchandise</b><p>Isi nama, harga jual, stok awal, dan batas minimum. Pindai barcode bawaan dengan kamera HP, atau pilih <em>Buat kode otomatis</em> lalu cetak labelnya.</p></li>
    <li><b>Catat penjualan</b><p>Pilih <em>Catat penjualan</em> → <em>Kamera HP</em>. Arahkan kamera belakang ke barcode, atur jumlah terjual, lalu simpan. Scanner USB juga bisa: ketik/pindai di kolom cari Inventori lalu tekan Enter.</p></li>
    <li><b>Pantau restock</b><p>Barang yang stoknya sama dengan atau di bawah batas minimum muncul di ikon lonceng. Pilih barangnya untuk langsung mencatat barang masuk.</p></li>
    <li><b>Pakai di beberapa perangkat</b><p>Masuk dengan akun yang sama di setiap HP/laptop booth; perubahan stok tersinkron otomatis. Kamera langsung butuh HTTPS — di HTTP gunakan <em>Foto barcode</em>.</p></li>
  </ol><p class="help-shortcuts"><kbd>/</kbd> cari barang · <kbd>Esc</kbd> tutup jendela</p>`)
}

function clearDemo() {
  openConfirmModal('Mulai dengan data asli?', '<p class="modal-hint">Semua barang contoh beserta catatan aktivitasnya akan dihapus. Setelah itu, masukkan merchandise dan stok yang sebenarnya.</p>', 'Kosongkan data contoh', async () => {
    const nextState = await apiRequest('/demo', { method: 'DELETE' })
    applyState(nextState); activeFilter = 'Semua barang'; query = ''; activeNav = '#dashboard'
    closeModal(); render(); showToast('Data contoh dihapus. Tambahkan barang untuk mulai.')
  })
}

function deleteProduct(product) {
  openConfirmModal('Hapus barang?', `<p class="modal-hint"><b>${escapeHtml(product.name)}</b> (${escapeHtml(product.sku)}) akan dihapus dari inventori. Riwayat transaksinya tetap disimpan untuk laporan.</p>`, 'Hapus barang', async () => {
    const nextState = await apiRequest(`/products/${encodeURIComponent(product.id)}`, { method: 'DELETE' })
    applyState(nextState); closeModal(); render(); showToast(`${product.name} dihapus; riwayat transaksi dipertahankan.`)
  })
}

function openProductMenu(product) {
  const root = openInfoModal(escapeHtml(product.name), `<div class="selected-product"><span class="product-thumb ${escapeHtml(product.color)}">${escapeHtml(product.emoji)}</span><span><b>${escapeHtml(product.sku)} · ${money(product.price)}</b><small>Stok <strong>${product.stock} unit</strong> · minimum ${product.minStock}</small></span><span class="status status-${stockStatus(product).toLowerCase()}">${stockStatus(product)}</span></div><div class="action-list"><button type="button" data-do="sale" ${product.stock ? '' : 'disabled'}>${icon('receipt')}<span><b>Catat penjualan</b><small>${product.stock ? 'Kurangi stok setelah barang terjual' : 'Stok habis — restock dulu'}</small></span>${icon('arrow')}</button><button type="button" data-do="restock">${icon('plus')}<span><b>Tambah stok</b><small>Catat barang masuk atau restock</small></span>${icon('arrow')}</button><button type="button" data-do="barcode">${icon('scan')}<span><b>Lihat / cetak barcode</b><small>Buat label untuk dipindai dari HP</small></span>${icon('arrow')}</button><button type="button" data-do="edit">${icon('box')}<span><b>Edit detail barang</b><small>Ubah nama, barcode, harga, atau batas minimum</small></span>${icon('arrow')}</button><button type="button" class="is-danger" data-do="delete">${icon('trash')}<span><b>Hapus barang</b><small>Riwayat transaksi lama tetap tersimpan</small></span>${icon('arrow')}</button></div>`, { actions: '' })
  root.querySelectorAll('[data-do]').forEach((action) => action.addEventListener('click', () => {
    const type = action.dataset.do
    if (type === 'edit') editProduct(product)
    else if (type === 'delete') deleteProduct(product)
    else if (type === 'barcode') showProductBarcode(product)
    else stockAction(product, type)
  }))
}

function bindProductMenus(scope = document) {
  scope.querySelectorAll('[data-product-menu]').forEach((button) => button.addEventListener('click', () => {
    const product = state.products.find((p) => p.id === button.dataset.productMenu)
    if (product) openProductMenu(product)
  }))
}

function leaveLocalMode() {
  useLocalMode = false
  state = emptyState()
  void stopInventoryRealtime()
  renderAuth()
}

function bindEvents() {
  const on = (selector, handler) => document.querySelectorAll(selector).forEach((element) => element.addEventListener('click', handler))
  on('[data-action="sign-out"]', async (event) => {
    const button = event.currentTarget
    button.disabled = true
    const { error } = await supabase.auth.signOut()
    if (error) { button.disabled = false; showToast(authErrorMessage(error), 'error') }
  })
  on('[data-action="leave-local"]', leaveLocalMode)
  on('[data-action="add-product"]', addProduct)
  on('[data-action="retry"]', (event) => { setButtonBusy(event.currentTarget, true, 'Menghubungkan…'); loadInventory() })
  on('[data-action="quick-sale"]', quickSale)
  on('[data-action="help"]', (event) => { event.preventDefault(); showHelp() })
  on('[data-action="clear-demo"]', clearDemo)
  on('[data-action="export-products"]', exportProducts)
  on('[data-action="export-report"]', exportReport)
  on('[data-action="reset-filter"]', resetInventoryFilter)
  on('.notification', showStockAlerts)
  on('[data-filter-shortage]', () => { activeFilter = 'Perlu restock'; query = ''; goTo('#inventory') })
  on('[data-go]', (event) => goTo(event.currentTarget.dataset.go))
  on('[data-report-range]', (event) => { reportRange = Number(event.currentTarget.dataset.reportRange); render() })
  on('[data-tx-type]', (event) => { txType = event.currentTarget.dataset.txType; render() })
  on('[data-watch-product]', (event) => {
    const product = state.products.find((p) => p.id === event.currentTarget.dataset.watchProduct)
    if (product) stockAction(product, 'restock')
  })
  on('.nav-item, .brand', (event) => {
    event.preventDefault()
    goTo(event.currentTarget.getAttribute('href'))
  })
  bindProductMenus()

  const search = document.querySelector('#search')
  search?.addEventListener('input', (event) => { query = event.target.value; refreshInventoryResults() })
  // USB barcode scanners type the code and press Enter: open the sale form for that item.
  search?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || !query.trim()) return
    event.preventDefault()
    const rows = filteredProducts()
    const { product, error } = findProduct(query)
    const target = product || (rows.length === 1 ? rows[0] : undefined)
    if (target) stockAction(target, 'sale')
    else showToast(error, 'error')
  })
  document.querySelector('#tx-search')?.addEventListener('input', (event) => { txQuery = event.target.value; refreshTransactionResults() })
  document.querySelector('#filter')?.addEventListener('change', (event) => { activeFilter = event.target.value; refreshInventoryResults() })
}

startApplication()
