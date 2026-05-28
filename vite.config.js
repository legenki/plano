import { defineConfig } from 'vite';

export default defineConfig({
  base: '/plano/',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
});
