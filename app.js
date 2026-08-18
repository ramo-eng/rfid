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
