import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
    reporters: ['./src/test/ExercisesReporter.ts'],
    exclude: [
      ...configDefaults.exclude,
      'src/pages/**/Component.test.ts',
      'src/pages/**/Component.test.tsx',
      'src/pages/**/utils.test.ts',
      'src/pages/**/utils.test.tsx',
    ],
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
