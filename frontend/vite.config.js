import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The shared demo/ folder sits next to the app, so allow the dev server to read it.
  server: {fs: {allow: ['..']}, port: 50000}
})
