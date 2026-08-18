const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { slugify, googleReviewUrl } = require("../lib/locations");

test("slugify turns shop names into url-safe slugs", () => {
  assert.equal(slugify("Sunset Bistro"), "sunset-bistro");
  assert.equal(slugify("  Cafe #12  "), "cafe-12");
});

test("googleReviewUrl uses the official write-review place id link", () => {
  assert.equal(
    googleReviewUrl("ChIJ123"),
    "https://search.google.com/local/writereview?placeid=ChIJ123"
  );
});

test("static build writes GitHub Pages files including shop routes", () => {
  const result = spawnSync("node", ["scripts/build-static.js"], {
    cwd: path.join(__dirname, ".."),
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const dist = path.join(__dirname, "..", "dist");
  assert.equal(fs.existsSync(path.join(dist, ".nojekyll")), true);
  assert.equal(fs.existsSync(path.join(dist, "locations.json")), true);
  assert.equal(fs.existsSync(path.join(dist, "r", "demo-cafe", "index.html")), true);
});
