import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  // Stable URL for Cursor Simple Browser / previews: avoid ::1 and random ports.
  server: {
    host: "127.0.0.1",
    port: 5175,
    strictPort: true,
    hmr: { host: "127.0.0.1", protocol: "ws" },
  },
  preview: {
    host: "127.0.0.1",
    port: 4175,
    strictPort: true,
  },
});
