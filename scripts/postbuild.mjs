import fs from "node:fs";
import path from "node:path";

const dist = path.resolve(process.cwd(), "docs");

try {
  // SPA fallback for GitHub Pages
  const indexPath = path.join(dist, "index.html");
  const notFoundPath = path.join(dist, "404.html");
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
  }

  // Avoid Jekyll processing
  fs.writeFileSync(path.join(dist, ".nojekyll"), "");

  // Ensure CNAME is present if provided in public/
  const cnameSrc = path.resolve(process.cwd(), "public", "CNAME");
  if (fs.existsSync(cnameSrc)) {
    fs.copyFileSync(cnameSrc, path.join(dist, "CNAME"));
  }
} catch (err) {
  console.error("postbuild failed:", err);
  process.exit(1);
}


