import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "gzip", // 'brotliCompress' für Brotli-Komprimierung
      ext: ".gz", // '.br' für Brotli-Komprimierung
    }),
  ],
});

// Für die Komprimierung der Dateien:
//  npm install vite-plugin-compression --save-dev
