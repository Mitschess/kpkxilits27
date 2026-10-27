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
}
const icon = (name) => `<span class="icon">${icons[name]}</span>`
const money = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
const timeLabel = (date) => new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(date))
const today = new Date()
const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(today)

let state = { products: [], movements: [], dataMode: 'loading' }
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
async function refreshSupabaseInventory() {
  if (inventoryRefreshPending || !authUser || useLocalMode) return
  inventoryRefreshPending = true
  try {
    applyState(await getSupabaseInventoryState())
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
  const start = startOfDay(today)
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
  document.querySelector('#app').innerHTML = `<main class="auth-screen"><section class="auth-story"><a class="auth-brand" href="#"><span class="brand-logo-img"><img src="${fundAssetPrefix}/images/logo/hero.webp" alt="KPK" /></span><span class="brand-text"><span class="brand-title">KPK</span><span class="brand-subtitle">× Ini Lho ITS! · Dana</span></span></a><p class="auth-kicker">FESTIVAL PULANG KAMPUNG 2026</p><h1>Catat stok festival.<br><em>Pantau dananya.</em></h1><p class="auth-story-copy">Sistem inventori merchandise, penjualan booth festival, dan analitik kas dana usaha Kampus Pulang Kampung 2026.</p></section><section class="auth-card"><p class="auth-eyebrow">AKUN PENGELOLA DANA</p><h2>${title}</h2><p class="auth-description">${description}</p><form data-auth-form>${storeField}${emailField}${passwordField}${isReset ? '' : '<button type="button" class="auth-forgot" data-auth-forgot>Lupa password?</button>'}<button type="submit" class="primary-button auth-submit" data-label="${submitLabel}">${submitLabel}<span aria-hidden="true">→</span></button></form><p class="auth-feedback${authMessageIsError ? ' is-error' : ''}" data-auth-feedback role="status" ${authMessage ? '' : 'hidden'}>${escapeHtml(authMessage)}</p>${switchAction}${configNotice}${localAction}<p class="auth-privacy">Data inventori & kas aman dan dipisahkan per akun toko.</p></section></main>`

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
        setAuthFeedback('Akun berhasil dibuat. Cek email untuk konfirmasi, lalu masuk ke Stokly.')
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
      button.textContent = button.dataset.label || 'Lanjutkan'
    }
    setAuthFeedback(authErrorMessage(error), true)
  }
}

function enterSupabaseApp(user) {
  authUser = user
  useLocalMode = false
  authMessage = ''
  authMessageIsError = false
  serverProblem = ''
  render()
  loadInventory()
}

function enterLocalMode() {
  useLocalMode = true
  authUser = undefined
  authMessage = ''
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
  if (!supabase) { renderAuth(); return }
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      authUser = undefined
      useLocalMode = false
      state = { products: [], movements: [], dataMode: 'custom' }
      void stopInventoryRealtime()
      renderAuth()
    } else if (event === 'PASSWORD_RECOVERY') {
      authView = 'update-password'
      authMessage = 'Masukkan password baru untuk menyelesaikan pemulihan akun.'
      authMessageIsError = false
      renderAuth()
    }
  })
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    authMessage = authErrorMessage(error)
    authMessageIsError = true
    renderAuth()
  } else if (session?.user) enterSupabaseApp(session.user)
  else renderAuth()
}

function inventoryTable(rows, emptyText = 'Tidak ada barang yang cocok.') {
  return `<div class="table-scroll"><table><thead><tr><th>NAMA BARANG</th><th>SKU / BARCODE</th><th>HARGA</th><th>STOK</th><th>STATUS</th><th></th></tr></thead><tbody>${rows.map((p) => `<tr><td><div class="product-cell"><span class="product-thumb ${p.color}">${p.emoji}</span><span><b>${escapeHtml(p.name)}</b><small>${escapeHtml(p.category)}</small></span></div></td><td><span class="sku">${escapeHtml(p.sku)}</span></td><td class="price">${money(p.price)}</td><td><span class="stock-number ${stockStatus(p) !== 'Aman' ? 'stock-low' : ''}">${p.stock}</span><span class="stock-unit">unit</span></td><td><span class="status status-${stockStatus(p).toLowerCase()}"><i></i>${stockStatus(p)}</span></td><td><button class="row-menu" title="Aksi barang" data-product-menu="${p.id}">${icon('more')}</button></td></tr>`).join('') || `<tr><td colspan="6" class="empty-state">${emptyText}</td></tr>`}</tbody></table></div>`
}

function renderDashboard(metrics) {
  const { totalItems, needsRestock, totalValue, salesToday, ticketsToday, recent, week } = metrics
  const revDelta = deltaLabel(week.revenue, week.prevRevenue)
  const maxBar = Math.max(...week.daily.map((d) => d.revenue), 1)
  const watch = state.products.filter((p) => p.stock <= p.minStock).slice(0, 6)
  return `
    <section class="welcome-row hero-banner"><div><p class="eyebrow">${serverProblem ? 'SERVER TIDAK TERHUBUNG' : isDemo ? 'MODE DEMO · DATA CONTOH' : 'RINGKASAN TOKO'}</p><h1>${escapeHtml(metrics.storeName)}</h1><p class="subheading">${escapeHtml(serverProblem || (isDemo ? 'Angka ini contoh. Kosongkan demo lalu isi stok toko yang sebenarnya.' : 'Stok, omzet hari ini, dan SKU yang menipis — dibaca dari pergerakan barang.'))}</p>${isDemo && !serverProblem ? '<button class="demo-clear" data-action="clear-demo">Mulai dengan stok kosong →</button>' : ''}</div>${serverProblem ? '<button class="primary-button" data-action="retry">Coba lagi</button>' : '<button class="primary-button" data-action="add-product">' + icon('plus') + ' Tambah barang</button>'}</section>
    <section class="stats-grid">
      <article class="stat-card"><div class="stat-heading"><span>Unit di rak</span><span class="stat-icon">${icon('box')}</span></div><strong>${totalItems.toLocaleString('id-ID')} <small>unit</small></strong><div class="stat-foot"><span class="foot-note">${state.products.length} SKU</span></div></article>
      <article class="stat-card"><div class="stat-heading"><span>Perlu restock</span><span class="stat-icon">${icon('bell')}</span></div><strong>${needsRestock} <small>SKU</small></strong><div class="stat-foot"><span class="${needsRestock ? 'foot-warning' : 'foot-neutral'}">${needsRestock ? 'Di atau di bawah minimum' : 'Semua di atas minimum'}</span></div></article>
      <article class="stat-card"><div class="stat-heading"><span>Nilai inventori</span><span class="stat-icon">${icon('chart')}</span></div><strong class="value-stat">${money(totalValue)}</strong><div class="stat-foot"><span class="foot-note">Harga jual × stok</span></div></article>
      <article class="stat-card"><div class="stat-heading"><span>Omzet hari ini</span><span class="stat-icon">${icon('trend')}</span></div><strong class="value-stat">${money(salesToday)}</strong><div class="stat-foot"><span class="foot-note">${ticketsToday} transaksi</span></div></article>
    </section>
    ${needsRestock ? `<section class="attention-banner"><span class="attention-icon">!</span><div class="attention-copy"><b>${needsRestock} SKU butuh restock</b><span>Buka daftar restock, atau catat barang masuk dari menu barang.</span></div><button data-filter-shortage>Buka restock ${icon('arrow')}</button></section>` : ''}
    <section class="workspace-grid">
      <div class="panel chart-frame">
        <div class="chart-legend"><h2>Omzet 7 hari</h2><span class="delta ${revDelta.cls}">${revDelta.text} vs 7 hari sebelumnya</span></div>
        <div class="bar-chart">${week.daily.map((day) => `<div class="bar-col ${day.key === week.peak?.key && day.revenue ? 'is-peak' : ''}" title="${escapeHtml(day.label)} · ${money(day.revenue)}"><i style="height:${Math.max(3, Math.round((day.revenue / maxBar) * 100))}%"></i><small>${escapeHtml(day.label)}</small></div>`).join('')}</div>
      </div>
      <div class="panel activity-panel">
        <div class="panel-heading"><div><h2>Perlu dicek</h2><p>SKU di atau di bawah minimum.</p></div></div>
        <div class="dead-list">${watch.map((p) => `<button type="button" data-watch-product="${p.id}"><span><b>${escapeHtml(p.name)}</b><br><small>Sisa ${p.stock} · min ${p.minStock}</small></span><span class="status status-${stockStatus(p).toLowerCase()}">${stockStatus(p)}</span></button>`).join('') || '<div class="empty-activity">Tidak ada yang menipis.</div>'}</div>
      </div>
    </section>
    <section class="workspace-grid" style="margin-top:12px">
      <div class="panel">
        <div class="panel-heading"><div><h2>Inventori singkat</h2><p>${state.products.length} barang terdaftar.</p></div><button class="secondary-button" data-action="quick-sale">${icon('scan')} Catat penjualan</button></div>
        ${inventoryTable(filteredProducts().slice(0, 8), 'Belum ada barang.')}
        <div class="table-footer"><span>Cuplikan 8 baris</span><button class="text-button" data-go="#inventory">Buka inventori ${icon('arrow')}</button></div>
      </div>
      <div class="panel activity-panel">
        <div class="panel-heading"><div><h2>Aktivitas</h2><p>Keluar-masuk terakhir.</p></div></div>
        <div class="activity-list">${recent.map((m) => { const p = state.products.find((x) => x.id === m.productId); return `<div class="activity-item"><span class="activity-symbol ${m.type}">${m.type === 'sale' ? '−' : '+'}</span><div class="activity-description"><b>${escapeHtml(p?.name || m.productName || 'Barang dihapus')}</b><small>${m.type === 'sale' ? 'Penjualan' : 'Restock'} · ${timeLabel(m.date)}</small></div><span class="activity-qty ${m.type}">${m.type === 'sale' ? '−' : '+'}${m.qty}</span></div>` }).join('') || '<div class="empty-activity">Belum ada aktivitas stok.</div>'}</div>
        <button class="activity-link" data-go="#transactions">Semua transaksi ${icon('arrow')}</button>
      </div>
    </section>
  `
}

function renderInventoryView() {
  const rows = filteredProducts()
  return `
    <section class="page-toolbar"><div><p class="eyebrow">STOK</p><h1>Inventori</h1><p class="subheading">Cari SKU, filter status, catat penjualan atau restock dari baris barang.</p></div><div class="top-actions">${'<button class="secondary-button" data-action="quick-sale">' + icon('scan') + ' Catat penjualan</button>'}<button class="primary-button" data-action="add-product">${icon('plus')} Tambah barang</button></div></section>
    <section class="panel">
      <div class="table-tools"><label class="search-box">${icon('search')}<input id="search" type="search" placeholder="Cari nama, SKU, atau barcode" value="${escapeHtml(query)}"><span class="shortcut" title="Tekan / untuk mencari">/</span></label><div class="filter-wrap"><select id="filter" aria-label="Filter stok">${['Semua barang', 'Perlu restock', 'Stok menipis', 'Stok habis', 'Stok aman'].map((filter) => `<option ${activeFilter === filter ? 'selected' : ''}>${filter}</option>`).join('')}</select><span class="filter-caret" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m7 10 5 5 5-5" /></svg></span></div></div>
      ${inventoryTable(rows)}
      <div class="table-footer"><span>Menampilkan <b>${rows.length}</b> dari <b>${state.products.length}</b> barang</span><button class="text-button" data-action="export-products">Unduh CSV ${icon('arrow')}</button></div>
    </section>
  `
}

function renderTransactionsView() {
  const rows = filteredMovements()
  return `
    <section class="page-toolbar"><div><p class="eyebrow">MUTASI</p><h1>Transaksi</h1><p class="subheading">${state.movements.length} catatan keluar-masuk. Filter penjualan atau restock.</p></div><button class="primary-button" data-action="quick-sale">${icon('scan')} Catat penjualan</button></section>
    <section class="panel">
      <div class="table-tools">
        <label class="search-box">${icon('search')}<input id="tx-search" type="search" placeholder="Cari barang, SKU, atau catatan" value="${escapeHtml(txQuery)}"></label>
        <div class="segmented" role="tablist">
          <button type="button" class="${txType === 'all' ? 'active' : ''}" data-tx-type="all">Semua</button>
          <button type="button" class="${txType === 'sale' ? 'active' : ''}" data-tx-type="sale">Penjualan</button>
          <button type="button" class="${txType === 'restock' ? 'active' : ''}" data-tx-type="restock">Restock</button>
        </div>
      </div>
      <div class="table-scroll"><table><thead><tr><th>WAKTU</th><th>BARANG</th><th>JENIS</th><th>QTY</th><th>NILAI</th><th>CATATAN</th></tr></thead><tbody>${rows.map((m) => {
        const p = state.products.find((item) => item.id === m.productId)
        const when = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(m.date))
        const amount = m.type === 'sale' ? saleAmount(m) : 0
        return `<tr><td class="sku">${escapeHtml(when)}</td><td><div class="product-cell"><span><b>${escapeHtml(p?.name || m.productName || 'Barang dihapus')}</b><small>${escapeHtml(p?.sku || m.productSKU || '—')}</small></span></div></td><td><span class="status ${m.type === 'sale' ? 'status-habis' : 'status-aman'}">${m.type === 'sale' ? 'Penjualan' : 'Restock'}</span></td><td class="stock-number ${m.type === 'sale' ? 'stock-low' : ''}">${m.type === 'sale' ? '−' : '+'}${m.qty}</td><td class="price">${m.type === 'sale' ? money(amount) : '—'}</td><td class="sku">${escapeHtml(m.note || '—')}</td></tr>`
      }).join('') || '<tr><td colspan="6" class="empty-state">Belum ada transaksi pada filter ini.</td></tr>'}</tbody></table></div>
      <div class="table-footer"><span><b>${rows.length}</b> baris ditampilkan</span></div>
    </section>
  `
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
    <section class="page-toolbar"><div><p class="eyebrow">ANALITIK</p><h1>Laporan toko</h1><p class="subheading">Periode ${reportRange} hari, dibanding ${reportRange} hari sebelumnya. Omzet dari harga tercatat saat penjualan.</p></div><div class="segmented">${[1, 7, 30].map((days) => `<button type="button" class="${reportRange === days ? 'active' : ''}" data-report-range="${days}">${days === 1 ? 'Hari ini' : days + ' hari'}</button>`).join('')}</div></section>
    <section class="stats-grid">
      <article class="stat-card"><div class="stat-heading"><span>Omzet</span><span class="delta ${revDelta.cls}">${revDelta.text}</span></div><strong class="value-stat">${money(report.revenue)}</strong><div class="stat-foot"><span class="foot-note">${report.tickets} transaksi</span></div></article>
      <article class="stat-card"><div class="stat-heading"><span>Unit terjual</span><span class="delta ${unitDelta.cls}">${unitDelta.text}</span></div><strong>${report.unitsSold.toLocaleString('id-ID')}</strong><div class="stat-foot"><span class="foot-note">Rata transaksi ${money(report.avgTicket)}</span></div></article>
      <article class="stat-card"><div class="stat-heading"><span>Barang masuk</span></div><strong>${report.unitsIn.toLocaleString('id-ID')}</strong><div class="stat-foot"><span class="foot-note">Net ${report.netUnits >= 0 ? '+' : ''}${report.netUnits} unit</span></div></article>
      <article class="stat-card"><div class="stat-heading"><span>Hari terkuat</span></div><strong class="value-stat">${report.peak?.revenue ? money(report.peak.revenue) : '—'}</strong><div class="stat-foot"><span class="foot-note">${escapeHtml(report.peak?.label || 'Belum ada data')}</span></div></article>
    </section>
    ${report.insights.length ? `<ul class="insight-list">${report.insights.map((item) => `<li><b>${item.k}</b><span>${escapeHtml(item.t)}</span></li>`).join('')}</ul>` : ''}
    <section class="analytics-grid">
      <div class="panel chart-frame">
        <div class="chart-legend"><h2>Tren omzet</h2><span>Puncak ditandai merah bata</span></div>
        <div class="bar-chart">${report.daily.map((day, index) => {
          const labeled = report.days <= 7 || index === 0 || index === report.daily.length - 1 || index % 5 === 0
          return `<div class="bar-col ${day.key === report.peak?.key && day.revenue ? 'is-peak' : ''}" title="${escapeHtml(day.label)} · ${money(day.revenue)}"><i style="height:${Math.max(2, Math.round((day.revenue / maxBar) * 100))}%"></i><small>${labeled ? escapeHtml(day.label) : ''}</small></div>`
        }).join('')}</div>
      </div>
      <div class="panel chart-frame">
        <div class="chart-legend"><h2>Kesehatan stok</h2><span>${state.products.length} SKU</span></div>
        <div class="mix-row">
          <div class="donut" style="--safe:${safeEnd};--low:${lowEnd}"></div>
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
    <div class="table-footer" style="margin-top:8px;border:0;padding:0"><button class="text-button" data-action="export-report">Unduh CSV periode ini ${icon('arrow')}</button></div>
  `
}

function render() {
  if (!useLocalMode && !authUser && supabaseConfigured) {
    renderAuth()
    return
  }
  if (!useLocalMode && !authUser && !supabaseConfigured) {
    renderAuth()
    return
  }
  const remoteBackend = Boolean(supabase && authUser && !useLocalMode)
  const storeName = isDemo ? 'Dana Usaha KPK' : remoteBackend ? (authUser.user_metadata?.store_name || 'Dana Usaha KPK') : 'Dana Usaha KPK'
  const accountLabel = remoteBackend ? authUser.email : 'Mode lokal'
  const accountInitial = String(accountLabel || storeName || 'DU').slice(0, 2).toUpperCase()
  const totalItems = state.products.reduce((sum, p) => sum + p.stock, 0)
  const needsRestock = state.products.filter((p) => p.stock <= p.minStock).length
  const totalValue = state.products.reduce((sum, p) => sum + p.stock * p.price, 0)
  const todaySales = state.movements.filter((m) => m.type === 'sale' && new Date(m.date).toDateString() === today.toDateString())
  const salesToday = todaySales.reduce((sum, m) => sum + saleAmount(m), 0)
  const recent = [...state.movements].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
  const title = pageTitles[activeNav] || 'Ringkasan'
  const week = computeAnalytics(7)
  const page = activeNav === '#inventory' ? renderInventoryView()
    : activeNav === '#transactions' ? renderTransactionsView()
    : activeNav === '#reports' ? renderReportsView()
    : renderDashboard({ storeName, totalItems, needsRestock, totalValue, salesToday, ticketsToday: todaySales.length, recent, week })
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
      <header class="topbar"><div class="breadcrumbs">${escapeHtml(storeName)} <span>/</span> <b>${title}</b></div><div class="top-actions"><div class="date-pill">${icon('chart')}<span>${dayName}</span></div><button class="icon-button notification" aria-label="Notifikasi stok">${icon('bell')}${needsRestock ? '<i></i>' : ''}</button><button type="button" class="mobile-logout" data-action="${remoteBackend ? 'sign-out' : 'leave-local'}">${remoteBackend ? 'Keluar' : 'Kembali'}</button><span class="top-avatar">${escapeHtml(accountInitial)}</span></div></header>
      <div class="content">
        ${page}
        <footer class="footer"><span>© ${today.getFullYear()} KPK × Ini Lho ITS! — Dana Usaha</span><span><i class="live-dot"></i> ${remoteBackend ? 'Sinkron antar perangkat' : 'Sinkron antar tab'}</span></footer>
      </div>
    </main>
    `
  bindEvents()
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

function showToast(message) {
  const toast = document.querySelector('#toast')
  toast.textContent = message
  toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function openInfoModal(title, content) {
  activeCameraStopper?.()
  const root = document.querySelector('#modal-root')
  root.innerHTML = `<div class="modal-backdrop"><section class="modal info-modal" role="dialog" aria-modal="true"><div class="modal-head"><div><p class="eyebrow">DANA USAHA · KPK × ILITS</p><h2>${title}</h2></div><button class="icon-button close-modal" aria-label="Tutup">${icon('close')}</button></div><div class="info-content">${content}</div><div class="modal-actions"><button type="button" class="secondary-button close-modal">Tutup</button></div></section></div>`
  root.querySelectorAll('.close-modal').forEach((el) => el.addEventListener('click', () => { activeCameraStopper?.(); root.innerHTML = '' }))
  root.querySelector('.modal-backdrop').addEventListener('click', (event) => { if (event.target.classList.contains('modal-backdrop')) { activeCameraStopper?.(); root.innerHTML = '' } })
}

function openModal(title, content, onSubmit, submitLabel = 'Simpan') {
  activeCameraStopper?.()
  const root = document.querySelector('#modal-root')
  root.innerHTML = `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><p class="eyebrow">DANA USAHA · KPK × ILITS</p><h2>${title}</h2></div><button class="icon-button close-modal">${icon('close')}</button></div><form id="modal-form">${content}<div class="modal-actions"><button type="button" class="secondary-button close-modal">Batal</button><button type="submit" class="primary-button">${submitLabel} ${icon('arrow')}</button></div></form></section></div>`
  root.querySelectorAll('.close-modal').forEach((el) => el.addEventListener('click', () => { activeCameraStopper?.(); root.innerHTML = '' }))
  root.querySelector('.modal-backdrop').addEventListener('click', (event) => { if (event.target.classList.contains('modal-backdrop')) { activeCameraStopper?.(); root.innerHTML = '' } })
  root.querySelector('form').addEventListener('submit', (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); activeCameraStopper?.(); root.innerHTML = ''; onSubmit(data) })
  if (!window.matchMedia('(max-width: 768px)').matches) root.querySelector('input')?.focus()
}

const field = (label, name, opts = {}) => `<label class="form-field ${opts.wide ? 'wide' : ''}"><span>${label}</span><input name="${name}" type="${opts.type || 'text'}" ${opts.required === false ? '' : 'required'} ${opts.placeholder ? `placeholder="${opts.placeholder}"` : ''} ${opts.value !== undefined ? `value="${opts.value}"` : ''} ${opts.min !== undefined ? `min="${opts.min}"` : ''} ${opts.max !== undefined ? `max="${opts.max}"` : ''}></label>`

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

function addProduct() {
  openModal('Tambah barang baru', `<p class="modal-hint">Gunakan barcode yang sudah ada atau buat kode internal otomatis. Cetak labelnya lalu tempelkan pada barang.</p><div class="form-grid">${field('Nama barang', 'name', { placeholder: 'Contoh: Kopi Arabika' })}${cameraSkuField()}${barcodeToolsMarkup()}${field('Kategori', 'category', { placeholder: 'Contoh: Minuman' })}${field('Harga jual (Rp)', 'price', { type: 'number', min: 0 })}${field('Stok awal', 'stock', { type: 'number', min: 0 })}${field('Batas minimum stok', 'minStock', { type: 'number', min: 0 })}</div>${cameraPanelMarkup()}`, (data) => {
    const product = { name: data.get('name').trim(), sku: data.get('sku').trim(), category: data.get('category').trim() || 'Umum', price: Number(data.get('price')), stock: Number(data.get('stock')), minStock: Number(data.get('minStock')) }
    apiRequest('/products', { method: 'POST', body: product }).then(({ state: nextState }) => { applyState(nextState); render(); showToast(`${product.name} ditambahkan ke inventori`) }).catch((error) => showToast(error.message))
  })
  const root = document.querySelector('#modal-root')
  wireCameraScanner(root, root.querySelector('input[name="sku"]'), (code) => { root.querySelector('[data-camera-message]').textContent = `Barcode ${code} terbaca. Kode dimasukkan ke kolom SKU.` })
  wireBarcodeTools(root)
}
function editProduct(product) {
  openModal('Edit detail barang', `<p class="modal-hint">Perubahan harga, SKU, dan batas minimum tidak mengubah jumlah stok. Kamu bisa membuat ulang atau mencetak label barcode dari sini.</p><div class="form-grid">${field('Nama barang', 'name', { value: escapeHtml(product.name) })}${cameraSkuField(escapeHtml(product.sku))}${barcodeToolsMarkup()}${field('Kategori', 'category', { value: escapeHtml(product.category) })}${field('Harga jual (Rp)', 'price', { type: 'number', min: 0, value: product.price })}${field('Batas minimum stok', 'minStock', { type: 'number', min: 0, value: product.minStock })}</div>${cameraPanelMarkup()}`, (data) => {
    const changes = { name: data.get('name').trim(), sku: data.get('sku').trim() || product.sku, category: data.get('category').trim() || 'Umum', price: Number(data.get('price')), minStock: Number(data.get('minStock')) }
    apiRequest(`/products/${encodeURIComponent(product.id)}`, { method: 'PATCH', body: changes }).then(({ state: nextState }) => { applyState(nextState); render(); showToast(`${changes.name} diperbarui`) }).catch((error) => showToast(error.message))
  })
  const root = document.querySelector('#modal-root')
  wireCameraScanner(root, root.querySelector('input[name="sku"]'), (code) => { root.querySelector('[data-camera-message]').textContent = `Barcode ${code} terbaca. Kode dimasukkan ke kolom SKU.` })
  wireBarcodeTools(root)
}
function stockAction(product, type) {
  const selling = type === 'sale'
  if (selling && product.stock === 0) { showToast('Stok barang ini habis. Catat restock dulu sebelum menjual.'); return }
  openModal(selling ? 'Catat penjualan' : 'Tambah stok', `<div class="selected-product"><span class="product-thumb ${product.color}">${product.emoji}</span><span><b>${escapeHtml(product.name)}</b><small>Stok tersedia: <strong>${product.stock} unit</strong> · ${escapeHtml(product.sku)}</small></span></div>${field(selling ? 'Jumlah terjual' : 'Jumlah barang masuk', 'qty', { type: 'number', min: 1, max: selling ? product.stock : undefined, value: 1 })}${selling ? field('Catatan (opsional)', 'note', { required: false, placeholder: 'Contoh: Transaksi kasir' }) : field('Catatan (opsional)', 'note', { required: false, placeholder: 'Contoh: Restock dari supplier' })}`, (data) => {
    const qty = Number(data.get('qty'))
    apiRequest('/movements', { method: 'POST', body: { productId: product.id, type, qty, note: data.get('note').trim() || (selling ? 'Penjualan kasir' : 'Restock') } }).then(({ state: nextState, movement }) => {
      applyState(nextState); render()
      const updated = state.products.find((item) => item.id === product.id)
      showToast(selling ? `Penjualan tercatat · stok tersisa ${updated?.stock ?? 0} unit` : `Stok bertambah ${movement.qty} unit`)
    }).catch((error) => showToast(error.message))
  }, selling ? 'Simpan penjualan' : 'Tambah stok')
}
function quickSale() {
  openModal('Catat penjualan', `<div class="scanner-guide"><span class="scanner-guide-icon">${icon('scan')}</span><div><b>Pindai barcode dengan kamera HP</b><p>Arahkan kamera belakang HP ke barcode. Pastikan kode barcode sudah tersimpan di SKU barang.</p></div></div><p class="modal-hint">Setelah barcode terbaca, pilih jumlah terjual lalu simpan agar stok berkurang. Bisa juga ketik SKU atau nama barang.</p><div class="form-grid">${field('SKU / barcode / nama barang', 'searchTerm', { placeholder: 'Contoh: KPG-001', wide: true })}</div><div class="camera-actions"><button type="button" class="secondary-button" data-camera-trigger>${icon('scan')} Buka kamera HP</button></div>${cameraPanelMarkup()}`, (data) => {
    const term = data.get('searchTerm').trim().toLowerCase()
    if (!term) { showToast('Scan atau masukkan SKU / nama barang terlebih dahulu.'); return }
    const product = state.products.find((p) => p.sku.toLowerCase() === term) || state.products.find((p) => p.name.toLowerCase().includes(term))
    if (!product) { showToast('Barang tidak ditemukan. Pastikan barcode atau nama benar.'); return }
    stockAction(product, 'sale')
  }, 'Lanjutkan')
  const root = document.querySelector('#modal-root')
  const input = root.querySelector('input[name="searchTerm"]')
  wireCameraScanner(root, input, (code) => {
    const product = state.products.find((item) => item.sku.toLowerCase() === code.toLowerCase())
    if (!product) {
      root.querySelector('[data-camera-message]').textContent = `Barcode ${code} belum terdaftar. Tambahkan barang dengan kode tersebut terlebih dahulu.`
      return
    }
    root.innerHTML = ''
    stockAction(product, 'sale')
  })
}

function showReports() {
  goTo('#reports')
}

function goTo(hash) {
  activeNav = hash
  if (hash === '#inventory' || hash === '#dashboard') {
    /* keep inventory filters */
  }
  window.history.replaceState(null, '', hash)
  render()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function exportReport() {
  const report = computeAnalytics(reportRange)
  const columns = ['Tanggal', 'Omzet', 'Unit terjual', 'Unit masuk']
  const rows = report.daily.map((day) => [day.label, day.revenue, day.units, day.restock])
  const csv = '\uFEFF' + [columns, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(';')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a'); link.href = url; link.download = `analitik-stokly-${reportRange}hari.csv`; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  showToast(`Omzet ${reportRange} hari diekspor ke CSV`)
}

function showAllActivity() {
  const allMoves = [...state.movements].sort((a, b) => new Date(b.date) - new Date(a.date))
  const rows = allMoves.map((m) => {
    const p = state.products.find((item) => item.id === m.productId)
    const date = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(m.date))
    return `<div class="history-row"><span class="activity-symbol ${m.type}">${m.type === 'sale' ? '↗' : '↙'}</span><div><b>${escapeHtml(p?.name || m.productName || 'Barang dihapus')}</b><small>${m.type === 'sale' ? 'Penjualan' : 'Barang masuk'} · ${escapeHtml(m.note || '')} · ${date}</small></div><strong class="activity-qty ${m.type}">${m.type === 'sale' ? '−' : '+'}${m.qty}</strong></div>`
  }).join('')
  openInfoModal('Riwayat pergerakan stok', `<p class="modal-hint">${allMoves.length} catatan tersimpan di server ini.</p><div class="history-list">${rows || '<div class="empty-state">Belum ada transaksi atau restock.</div>'}</div>`)
}

function showStockAlerts() {
  const lowStock = state.products.filter((p) => p.stock <= p.minStock)
  const rows = lowStock.map((p) => `<button class="alert-row" data-alert-product="${p.id}"><span class="product-thumb ${p.color}">${p.emoji}</span><span><b>${escapeHtml(p.name)}</b><small>Sisa ${p.stock} unit · batas minimum ${p.minStock}</small></span><span class="status status-${stockStatus(p).toLowerCase()}">${stockStatus(p)}</span></button>`).join('')
  openInfoModal('Perlu diperiksa', `<p class="modal-hint">${lowStock.length ? 'Pilih barang untuk melihatnya di daftar inventori.' : 'Belum ada barang yang perlu direstock.'}</p><div class="alert-list">${rows || '<div class="empty-state">Stok semua barang masih di atas batas minimum.</div>'}</div>`)
  document.querySelectorAll('[data-alert-product]').forEach((button) => button.addEventListener('click', () => {
    const product = state.products.find((p) => p.id === button.dataset.alertProduct)
    document.querySelector('#modal-root').innerHTML = ''
    activeFilter = 'Perlu restock'
    query = product?.name || ''
    goTo('#inventory')
  }))
}

function exportProducts() {
  const columns = ['Nama barang', 'SKU / barcode', 'Kategori', 'Harga jual', 'Stok', 'Batas minimum', 'Status']
  const rows = state.products.map((p) => [p.name, p.sku, p.category, p.price, p.stock, p.minStock, stockStatus(p)])
  const csv = '\uFEFF' + [columns, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(';')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a'); link.href = url; link.download = 'inventori-stokly.csv'; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  showToast(`${state.products.length} barang diekspor ke CSV`)
}

function clearDemo() {
  openInfoModal('Mulai dengan data toko', '<p class="modal-hint">Ini akan menghapus barang contoh dan catatan aktivitas di browser ini. Setelah itu, masukkan inventori toko yang sebenarnya.</p>')
  const root = document.querySelector('#modal-root')
  root.querySelector('.modal-actions').innerHTML = '<button type="button" class="secondary-button close-modal">Batal</button><button type="button" class="primary-button" data-confirm-clear>Kosongkan data contoh</button>'
  root.querySelector('.modal-actions .close-modal').addEventListener('click', () => root.innerHTML = '')
  root.querySelector('[data-confirm-clear]').addEventListener('click', async () => {
    try {
      const nextState = await apiRequest('/demo', { method: 'DELETE' })
      applyState(nextState); activeFilter = 'Semua barang'; query = ''; activeNav = '#dashboard'; root.innerHTML = ''; render(); showToast('Data demo dihapus. Tambahkan barang tokomu untuk mulai.')
    } catch (error) { showToast(error.message) }
  })
}

function deleteProduct(product) {
  openInfoModal('Hapus barang?', `<p class="modal-hint"><b>${escapeHtml(product.name)}</b> akan dihapus dari inventori. Riwayat transaksi lama tetap disimpan.</p>`)
  const root = document.querySelector('#modal-root')
  root.querySelector('.modal-actions').innerHTML = '<button type="button" class="secondary-button close-modal">Batal</button><button type="button" class="primary-button" data-confirm-delete>Hapus barang</button>'
  root.querySelector('.modal-actions .close-modal').addEventListener('click', () => root.innerHTML = '')
  root.querySelector('[data-confirm-delete]').addEventListener('click', async () => {
    try {
      const nextState = await apiRequest(`/products/${encodeURIComponent(product.id)}`, { method: 'DELETE' })
      applyState(nextState); root.innerHTML = ''; render(); showToast(`${product.name} dihapus; riwayat transaksi dipertahankan.`)
    } catch (error) { showToast(error.message) }
  })
}

function bindEvents() {
  document.querySelectorAll('[data-action="sign-out"]').forEach((button) => button.addEventListener('click', async (event) => {
    const button = event.currentTarget
    button.disabled = true
    const { error } = await supabase.auth.signOut()
    if (error) { button.disabled = false; showToast(authErrorMessage(error)) }
  }))
  document.querySelectorAll('[data-action="leave-local"]').forEach((button) => button.addEventListener('click', () => {
    useLocalMode = false
    state = { products: [], movements: [], dataMode: 'custom' }
    void stopInventoryRealtime()
    renderAuth()
  }))
  document.querySelector('[data-action="add-product"]')?.addEventListener('click', addProduct)
  document.querySelector('[data-action="retry"]')?.addEventListener('click', loadInventory)
  document.querySelectorAll('[data-action="quick-sale"]').forEach((button) => button.addEventListener('click', quickSale))
  document.querySelector('[data-filter-shortage]')?.addEventListener('click', () => { activeFilter = 'Perlu restock'; query = ''; goTo('#inventory') })
  document.querySelector('[data-action="help"]').addEventListener('click', (event) => {
    event.preventDefault()
  openInfoModal('Panduan stok', '<div class="help-guide"><h3>1. Daftarkan barang</h3><p>Isi nama, stok awal, batas minimum, dan barcode pada kolom SKU / barcode. Kamu juga bisa memindai barcode memakai kamera HP.</p><h3>2. Catat penjualan</h3><p>Pilih Catat penjualan → Buka kamera HP. Arahkan kamera belakang ke barcode, pilih jumlah terjual, lalu simpan.</p><h3>3. Pantau restock</h3><p>Barang yang tersisa sama dengan atau di bawah batas minimum muncul di notifikasi. Gunakan menu barang untuk mencatat barang masuk.</p><h3>4. Gunakan beberapa tab/perangkat</h3><p>Semua perangkat harus membuka alamat server yang sama. Pemindaian langsung memerlukan HTTPS; di HTTP gunakan Foto barcode bila tersedia.</p></div>')
  })
  document.querySelector('[data-action="clear-demo"]')?.addEventListener('click', clearDemo)
  document.querySelector('.notification')?.addEventListener('click', showStockAlerts)
  document.querySelector('.small-more')?.addEventListener('click', () => goTo('#transactions'))
  document.querySelector('[data-action="all-activity"]')?.addEventListener('click', () => goTo('#transactions'))
  document.querySelector('[data-action="export-products"]')?.addEventListener('click', exportProducts)
  document.querySelector('[data-action="export-report"]')?.addEventListener('click', exportReport)
  document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => goTo(button.dataset.go)))
  document.querySelectorAll('[data-report-range]').forEach((button) => button.addEventListener('click', () => { reportRange = Number(button.dataset.reportRange); render() }))
  document.querySelectorAll('[data-tx-type]').forEach((button) => button.addEventListener('click', () => { txType = button.dataset.txType; render() }))
  document.querySelectorAll('[data-watch-product]').forEach((button) => button.addEventListener('click', () => {
    const product = state.products.find((p) => p.id === button.dataset.watchProduct)
    activeFilter = 'Perlu restock'
    query = product?.name || ''
    goTo('#inventory')
  }))
  const search = document.querySelector('#search')
  search?.addEventListener('input', (event) => { query = event.target.value; const pos = event.target.selectionStart; render(); const input = document.querySelector('#search'); input?.focus(); input?.setSelectionRange(pos, pos) })
  search?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || !query.trim()) return
    const term = query.trim().toLowerCase()
    const product = state.products.find((p) => p.sku.toLowerCase() === term) || state.products.find((p) => p.name.toLowerCase().includes(term))
    if (product) stockAction(product, 'sale')
    else showToast('Barang tidak ditemukan. Coba nama atau SKU yang terdaftar.')
  })
  document.querySelector('#tx-search')?.addEventListener('input', (event) => {
    txQuery = event.target.value
    const pos = event.target.selectionStart
    render()
    const input = document.querySelector('#tx-search')
    input?.focus()
    input?.setSelectionRange(pos, pos)
  })
  document.querySelector('#filter')?.addEventListener('change', (event) => { activeFilter = event.target.value; render() })
  document.querySelectorAll('[data-product-menu]').forEach((button) => button.addEventListener('click', () => {
    const product = state.products.find((p) => p.id === button.dataset.productMenu)
    if (!product) return
    openModal(escapeHtml(product.name), `<div class="action-list"><button type="button" data-do="sale">${icon('receipt')}<span><b>Catat penjualan</b><small>Kurangi stok setelah barang terjual</small></span>${icon('arrow')}</button><button type="button" data-do="restock">${icon('plus')}<span><b>Tambah stok</b><small>Catat barang masuk atau restock</small></span>${icon('arrow')}</button><button type="button" data-do="barcode">${icon('scan')}<span><b>Lihat / cetak barcode</b><small>Buat label untuk dipindai dari HP</small></span>${icon('arrow')}</button><button type="button" data-do="edit">${icon('box')}<span><b>Edit detail barang</b><small>Ubah nama, barcode, harga, atau batas minimum</small></span>${icon('arrow')}</button><button type="button" data-do="delete">${icon('close')}<span><b>Hapus barang</b><small>Riwayat transaksi lama tetap tersimpan</small></span>${icon('arrow')}</button></div>`, () => {})
    document.querySelectorAll('[data-do]').forEach((action) => action.addEventListener('click', () => { const type = action.dataset.do; document.querySelector('#modal-root').innerHTML = ''; if (type === 'edit') editProduct(product); else if (type === 'delete') deleteProduct(product); else if (type === 'barcode') showProductBarcode(product); else stockAction(product, type) }))
    document.querySelector('.modal-actions').innerHTML = ''
  }))
  document.querySelectorAll('.nav-item').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault()
    goTo(link.getAttribute('href'))
  }))
  document.querySelector('.brand')?.addEventListener('click', (event) => {
    event.preventDefault()
    goTo('#dashboard')
  })
  document.onkeydown = (event) => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
      event.preventDefault()
      const input = document.querySelector('#search') || document.querySelector('#tx-search')
      input?.focus()
    }
  }
}

startApplication()
