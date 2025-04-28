import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})