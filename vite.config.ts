import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      emptyOutDir: true
    },
    server: {
      proxy: {
        '/wp-json': {
          target: env.VITE_WORDPRESS_URL || 'https://jumplings.in',
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