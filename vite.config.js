import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Use BASE_URL env var for GitHub Pages deployment, default to '/' for local dev
  base: process.env.BASE_URL || '/',
})
