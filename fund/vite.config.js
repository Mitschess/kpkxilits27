import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { inventoryApi } from './server/inventory-api.js'

export default defineConfig({
  // Share the main website's Supabase config without duplicating secrets in fund/.env.local.
  envDir: fileURLToPath(new URL('..', import.meta.url)),
  plugins: [{
    name: 'stokly-inventory-api',
    configureServer(server) {
      server.middlewares.use('/api', inventoryApi())
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', inventoryApi())
    },
  }],
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
})
