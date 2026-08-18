const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "public", "locations.json");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function loadStore() {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed || !Array.isArray(parsed.locations)) {
    return { locations: [] };
  }
  return parsed;
}

function saveStore(store) {
  fs.writeFileSync(DATA_PATH, `${JSON.stringify(store, null, 2)}\n`);
}

function listLocations() {
  return loadStore().locations;
}

function getLocation(slug) {
  return listLocations().find((loc) => loc.slug === slug) || null;
}

function upsertLocation({ name, address, googlePlaceId, slug }) {
  const store = loadStore();
  const nextSlug = slugify(slug || name);
  if (!nextSlug) {
    throw new Error("A name or slug is required.");
  }
  if (!googlePlaceId || !String(googlePlaceId).trim()) {
    throw new Error("Google Place ID is required.");
  }

  const record = {
    slug: nextSlug,
    name: String(name || nextSlug).trim(),
    address: String(address || "").trim(),
    googlePlaceId: String(googlePlaceId).trim(),
  };

  const index = store.locations.findIndex((loc) => loc.slug === nextSlug);
  if (index >= 0) {
    store.locations[index] = record;
  } else {
    store.locations.push(record);
  }
  saveStore(store);
  return record;
}

function googleReviewUrl(placeId) {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

module.exports = {
  DATA_PATH,
  slugify,
  loadStore,
  listLocations,
  getLocation,
  upsertLocation,
  googleReviewUrl,
};
