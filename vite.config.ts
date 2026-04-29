import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
  },
  base: '/learning-react/',
  plugins: [react()],
  build: {
    // This is a demo/exercises app. Enabling original sources available in Chrome Dev Tools.
    sourcemap: true,
    minify: false,
    cssMinify: false,
  },
});
