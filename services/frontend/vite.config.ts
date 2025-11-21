import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './srcs'),
    },
  },
  server: {
    host: true,
    port: 5173,
	proxy: {
		'/api': {
		  target: 'https://localhost:8443',
		  changeOrigin: true,
		  secure: false, // Allow self-signed certs if using https locally
		}
	  }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom']
        }
      }
    }
  },
  esbuild: {
    target: 'ES2020',
	drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
});


