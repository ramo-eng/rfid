function googleReviewUrl(placeId) {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

function parsePlaceFromHref(href) {
  const url = new URL(href, "http://local.invalid/");
  const query = url.searchParams;
  const placeId = (query.get("placeid") || query.get("placeId") || query.get("place") || "").trim();
  const name = (query.get("name") || "").trim();
  const address = (query.get("address") || "").trim();
  return { placeId, name, address };
}

function buildNfcPath({ placeId, name, address }) {
  if (!placeId) {
    throw new Error("A Google Place ID is required on the RFID tag.");
  }
  const query = new URLSearchParams();
  query.set("placeid", placeId);
  if (name) query.set("name", name);
  if (address) query.set("address", address);
  return `r/?${query.toString()}`;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { googleReviewUrl, parsePlaceFromHref, buildNfcPath };
}
