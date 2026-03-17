import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    // p5.js is large by design; loaded via dynamic import so it won't block initial render
    chunkSizeWarningLimit: 1200,
  },
})
