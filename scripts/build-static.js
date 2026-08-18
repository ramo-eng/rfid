const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(ROOT, "dist");

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function resetDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function build() {
  resetDir(OUT);
  for (const file of ["review.html", "admin.html", "styles.css", "app.js", "place.js", "draft.js", "review.js", "admin.js"]) {
    copyFile(path.join(PUBLIC, file), path.join(OUT, file));
  }
  copyFile(path.join(PUBLIC, "admin.html"), path.join(OUT, "index.html"));
  copyFile(path.join(PUBLIC, "review.html"), path.join(OUT, "r", "index.html"));
  fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
  fs.writeFileSync(path.join(OUT, "404.html"), fs.readFileSync(path.join(PUBLIC, "review.html")));
}

build();
console.log(`Built static site to ${OUT}`);
