
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This ensures assets (js/css) are loaded relatively, which fixes issues 
  // when deploying to GitHub Pages or subfolders.
  base: './', 
  define: {
    'process.env': process.env
  }
})
