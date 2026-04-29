import { copyFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const docs = join(root, "..", "docs");
const indexHtml = join(docs, "index.html");

writeFileSync(join(docs, ".nojekyll"), "");
copyFileSync(indexHtml, join(docs, "404.html"));
console.log("postbuild-github-pages: wrote docs/.nojekyll and docs/404.html");
