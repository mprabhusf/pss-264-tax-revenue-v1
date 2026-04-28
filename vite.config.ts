import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Set when running `npm run build:github-pages` — publishes static files to /docs for GitHub Pages. */
const githubPages = process.env.GITHUB_PAGES === "true";

/** GitHub project Pages are served at /repository-name/; relative `./` breaks when the URL has no trailing slash. */
function defaultGithubPagesBase(): string {
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (repo) return `/${repo}/`;
  return "/pss-264-tax-revenue-v1/";
}

/**
 * Asset prefix for GitHub Pages. Override for a fork or custom path:
 * `VITE_PAGES_BASE=/my-repo/ npm run build:github-pages`
 */
const pagesBase =
  process.env.VITE_PAGES_BASE?.replace(/\/?$/, "/") ??
  (githubPages ? defaultGithubPagesBase() : "/");

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
