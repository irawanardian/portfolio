import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Agar hot-reload jalan lancar di Windows
    },
    host: true, // Penting! Agar bisa diakses dari luar container
    strictPort: true,
    port: 3000, // Kita set ke 3000 supaya cocok dengan docker-compose
  },
})
