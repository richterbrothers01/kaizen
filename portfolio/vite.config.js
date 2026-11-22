import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // No CSS minifier: Lightning CSS (Vite 8 default) drops the unprefixed
  // `backdrop-filter` and keeps only `-webkit-`, which breaks the glass
  // effect in Firefox (and reports as computed `none`). The stylesheet is
  // ~14 kB, so unminified output costs nothing.
  build: { cssMinify: false },
})
