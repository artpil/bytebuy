import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      // Настройка алиаса '@' для папки src
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    // 👇 ДОБАВЛЯЕМ ПРОКСИ
    proxy: {
      '/api/admitad-feed': {
        target: 'https://export.admitad.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/admitad-feed/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        // 👇 Добавляем для отладки
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 Прокси запрос:', req.url)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Прокси ответ:', proxyRes.statusCode)
          })
          proxy.on('error', (err, req, res) => {
            console.error('❌ Ошибка прокси:', err.message)
          })
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'CNAME') return 'CNAME'
          return 'assets/[name]-[hash].[ext]'
        }
      }
    }
  }
})
