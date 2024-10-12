import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Ensure this removes the '/api' prefix
      }
    }
  },
  define: {
    'process.env.VITE_USE_MOCK_DATA': JSON.stringify(process.env.VITE_USE_MOCK_DATA) // Ensure consistent use of VITE_USE_MOCK_DATA
  }
})