import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [preact()],
  base: '/CRSCalculator/', // GitHub Pages repository name
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  },
  server: {
    port: 3001 // Use port 3001 since 3000 is occupied
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  }
});