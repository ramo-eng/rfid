const test = require("node:test");
const assert = require("node:assert/strict");
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
