import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
  },
  // Für die Komprimierung der Dateien:
  plugins: [
    react(),
    compression({
      algorithm: "gzip", // 'brotliCompress' für Brotli-Komprimierung
      ext: ".gz", // '.br' für Brotli-Komprimierung
    }),
  ],
});

//  npm install vite-plugin-compression --save-dev
