window.APP_BASE = (function () {
  const parts = location.pathname.split("/").filter(Boolean);
  if (location.hostname.endsWith("github.io") && parts[0]) {
    return `/${parts[0]}/`;
  }
  return "/";
})();

function appUrl(path) {
  return window.APP_BASE + String(path || "").replace(/^\//, "");
}

function googleReviewUrl(placeId) {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

function shopSlugFromLocation() {
  const queryShop = new URLSearchParams(location.search).get("shop");
  if (queryShop) return queryShop;
  let path = location.pathname;
  if (path.startsWith(window.APP_BASE)) {
    path = `/${path.slice(window.APP_BASE.length)}`;
  }
  const match = path.match(/\/r\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function fetchLocations() {
  if (!location.hostname.endsWith("github.io")) {
    try {
      const response = await fetch(appUrl("api/locations"), { headers: { Accept: "application/json" } });
      if (response.ok) {
        return response.json();
      }
    } catch {
      // Fall through to the static file used on GitHub Pages.
    }
  }
  const fallback = await fetch(appUrl("locations.json"));
  if (!fallback.ok) {
    throw new Error("Could not load shops");
  }
  return fallback.json();
}
