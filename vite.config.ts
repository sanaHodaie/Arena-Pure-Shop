import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const fromRoot = (file: string) => fileURLToPath(new URL(file, import.meta.url));

export default defineConfig(() => {
  const backend = process.env.API_PROXY_TARGET || 'http://127.0.0.1:8000';
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'arena-management-entry',
        configureServer(server) {
          server.middlewares.use((request, _response, next) => {
            if (/^\/admin\/?(?:\?|$)/.test(request.url || '')) request.url = '/management/index.html';
            next();
          });
        },
        configurePreviewServer(server) {
          server.middlewares.use((request, _response, next) => {
            if (/^\/admin\/?(?:\?|$)/.test(request.url || '')) request.url = '/management/index.html';
            next();
          });
        },
      },
    ],
    build: {
      rollupOptions: { input: { storefront: fromRoot('./index.html'), management: fromRoot('./management/index.html') } },
    },
    resolve: { alias: { '@': fromRoot('./') } },
    server: {
      proxy: {
        '/api/management/': backend,
        '/media/products/': backend,
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
