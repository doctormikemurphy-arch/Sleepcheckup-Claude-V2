import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Dev only: serve /watch from public/watch/index.html so the same URL works
// locally as in production. Vercel handles this via vercel.json.
const serveStaticPages = (): Plugin => ({
  name: 'serve-static-pages',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/watch' || req.url === '/watch/') req.url = '/watch/index.html'
      next()
    })
  },
})

export default defineConfig({
  plugins: [react(), serveStaticPages()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
