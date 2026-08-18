const http = require("http");
const fs = require("fs");
const path = require("path");
const { listLocations, getLocation, upsertLocation, googleReviewUrl } = require("./lib/locations");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Cache-Control": "no-store",
    ...headers,
  });
  res.end(body);
}

function sendJson(res, status, data) {
  send(res, status, JSON.stringify(data), { "Content-Type": "application/json; charset=utf-8" });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function serveStatic(req, res, urlPath) {
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, safePath);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    send(res, 403, "Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, "Not found");
      return;
    }
    send(res, 200, data, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const { pathname } = url;

  try {
    if (req.method === "GET" && pathname === "/api/locations") {
      sendJson(res, 200, { locations: listLocations() });
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/api/locations/")) {
      const slug = decodeURIComponent(pathname.slice("/api/locations/".length));
      const location = getLocation(slug);
      if (!location) {
        sendJson(res, 404, { error: "Location not found" });
        return;
      }
      sendJson(res, 200, {
        location,
        googleReviewUrl: googleReviewUrl(location.googlePlaceId),
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/locations") {
      const body = JSON.parse((await readBody(req)) || "{}");
      const location = upsertLocation(body);
      sendJson(res, 200, { location });
      return;
    }

    if (req.method === "GET" && (pathname === "/" || pathname === "/admin")) {
      serveStatic(req, res, "admin.html");
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/r/")) {
      serveStatic(req, res, "review.html");
      return;
    }

    if (req.method === "GET") {
      serveStatic(req, res, pathname === "/" ? "admin.html" : pathname);
      return;
    }

    send(res, 405, "Method not allowed");
  } catch (error) {
    sendJson(res, 400, { error: error.message || "Request failed" });
  }
});

if (require.main === module) {
  const host = process.env.HOST || "0.0.0.0";
  server.listen(PORT, host, () => {
    console.log(`NFC review server listening on http://${host}:${PORT}`);
  });
}

module.exports = { server };
