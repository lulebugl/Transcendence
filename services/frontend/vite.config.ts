import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist'
  },
  plugins: [
    tailwindcss()
  ]
});

