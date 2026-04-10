import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/learning-react/',
  plugins: [react()],
  build: {
    // This is a demo/exercises app. Enabling original sources available in Chrome Dev Tools.
    sourcemap: true,
    minify: false,
    cssMinify: false,
  },
});
