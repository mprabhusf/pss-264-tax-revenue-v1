import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Set when running `npm run build:github-pages` — publishes static files to /docs for GitHub Pages. */
const githubPages = process.env.GITHUB_PAGES === "true";
/**
 * Pages asset prefix. Default `./` so JS/CSS resolve under whatever path GitHub
 * Enterprise serves (e.g. /pages/org/repo/). Override if you use a fixed path:
 * `VITE_PAGES_BASE=/pss-264-tax-revenue-v1/ npm run build:github-pages`
 */
const pagesBase =
  process.env.VITE_PAGES_BASE?.replace(/\/?$/, "/") ??
  (githubPages ? "./" : "/");

export default defineConfig({
  base: githubPages ? pagesBase : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  ...(githubPages
    ? { build: { outDir: "docs", emptyOutDir: true } }
    : {}),
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
