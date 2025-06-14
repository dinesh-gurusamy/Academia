import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // <-- allows access from local network
    port: 5173,       // (optional) make sure this port is open
  },
})
