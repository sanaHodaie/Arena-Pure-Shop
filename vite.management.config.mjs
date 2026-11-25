import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'management',
  base: '/static/management/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../backend/generated/management',
    emptyOutDir: true,
  },
});
