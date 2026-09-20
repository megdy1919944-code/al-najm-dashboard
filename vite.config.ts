import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'admin-standalone-rewriter',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const parsedUrl = new URL(req.url || '/', 'http://localhost');
            if (parsedUrl.pathname === '/admin') {
              res.writeHead(302, { Location: '/admin/' + (parsedUrl.search || '') });
              res.end();
              return;
            }
            if (parsedUrl.pathname === '/admin/') {
              req.url = '/admin/index.html' + (parsedUrl.search || '');
            }
            if (parsedUrl.pathname === '/merchant') {
              res.writeHead(302, { Location: '/merchant/' + (parsedUrl.search || '') });
              res.end();
              return;
            }
            if (parsedUrl.pathname === '/merchant/') {
              req.url = '/merchant/index.html' + (parsedUrl.search || '');
            }
            if (parsedUrl.pathname === '/lucky-farm' || parsedUrl.pathname === '/lucky-farm/') {
              res.writeHead(302, { Location: '/?game=lucky-farm' + (parsedUrl.search ? '&' + parsedUrl.search.slice(1) : '') });
              res.end();
              return;
            }
            next();
          });
        }
      },
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
