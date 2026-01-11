import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      visualizer({
        open: false,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true
      })
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true
    },
    server: {
      proxy: {
        '/wp-json': {
          target: env.VITE_WORDPRESS_URL || 'https://admin.jumplings.in',
          changeOrigin: true,
          secure: false,
          headers: {
            'Authorization': 'Basic Y2tfNzE3ZGIzZjJkYjY5OWViM2M4Yjc3NDI1ZTI4Y2NiNzE2ZDM2NjFmMzpjc19iNTM2NTc4MzgxMTEyYmY3YmUwNTgxZWVhYWQwM2QzZjZkOTYzNTIz'
          }
        }
      }
    }
  }
})