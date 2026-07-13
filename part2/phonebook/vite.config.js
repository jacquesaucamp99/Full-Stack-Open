import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://phonebook-backend-brisk-inlet-8863.fly.dev',
        changeOrigin: true,
      },
    }
  },
})
