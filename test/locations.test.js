const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { googleReviewUrl, parsePlaceFromHref, buildNfcPath } = require("../public/place.js");
const { draftStorageKey, serializeDraft, parseDraft } = require("../public/draft.js");

test("googleReviewUrl uses the official write-review place id link", () => {
  assert.equal(
    googleReviewUrl("ChIJ123"),
    "https://search.google.com/local/writereview?placeid=ChIJ123"
  );
});

test("RFID URL carries the Google Place ID in the query string", () => {
  const pathWithQuery = buildNfcPath({
    placeId: "ChIJ123",
    name: "Sunset Bistro",
    address: "12 Oak",
  });
  assert.match(pathWithQuery, /^r\/\?/);
  const parsed = parsePlaceFromHref(`https://example.com/${pathWithQuery}`);
  assert.equal(parsed.placeId, "ChIJ123");
  assert.equal(parsed.name, "Sunset Bistro");
  assert.equal(parsed.address, "12 Oak");
});

test("a tap URL without a place id is rejected", () => {
  const parsed = parsePlaceFromHref("https://example.com/r/");
  assert.equal(parsed.placeId, "");
});

test("static build writes the RFID review route", () => {
  const result = spawnSync("node", ["scripts/build-static.js"], {
    cwd: path.join(__dirname, ".."),
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const dist = path.join(__dirname, "..", "dist");
  assert.equal(fs.existsSync(path.join(dist, ".nojekyll")), true);
  assert.equal(fs.existsSync(path.join(dist, "r", "index.html")), true);
  assert.equal(fs.existsSync(path.join(dist, "place.js")), true);
  assert.equal(fs.existsSync(path.join(dist, "draft.js")), true);
});

test("review drafts round-trip through local storage JSON", () => {
  assert.equal(draftStorageKey("ChIJ123"), "nfc-review-draft:ChIJ123");
  const saved = serializeDraft({ stars: 4, text: "Great coffee" });
  const loaded = parseDraft(saved);
  assert.equal(loaded.stars, 4);
  assert.equal(loaded.text, "Great coffee");
});
