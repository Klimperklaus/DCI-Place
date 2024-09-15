import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [react()],
});




// Für die Komprimierung der Dateien:
// import compression from "vite-plugin-compression";
// plugins: [
// react(),
//  compression({
//    algorithm: "gzip", // 'brotliCompress' für Brotli-Komprimierung
//    ext: ".gz", // '.br' für Brotli-Komprimierung
//  }),
// ],
//  npm install vite-plugin-compression --save-dev
