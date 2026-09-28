import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // A fixed port of its own. On a shared default (5173/5174) the browser can
  // hand this site another project's service worker and cached page, which
  // renders as a blank screen.
  server: { port: 5190, strictPort: true },
})
