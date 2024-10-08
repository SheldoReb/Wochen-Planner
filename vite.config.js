import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Ensure this removes the '/api' prefix
      }
    }
  },
  define: {
    'process.env.VITE_USE_MOCK_DATA': JSON.stringify(process.env.VITE_USE_MOCK_DATA) // Ensure consistent use of VITE_USE_MOCK_DATA
  }
})