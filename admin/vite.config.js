import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// The production build is served by the API under /admin/ (one link for everything).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/admin/' : '/',
  plugins: [react()],
  // The shared demo/ folder sits next to the app, so allow the dev server to read it.
  server: {fs: {allow: ['..']}, port: 10000}
}))
