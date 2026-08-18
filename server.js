const http = require("http");
const fs = require("fs");
const path = require("path");

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

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const { pathname } = url;

  if (req.method !== "GET") {
    send(res, 405, "Method not allowed");
    return;
  }

  if (pathname === "/" || pathname === "/admin") {
    serveStatic(req, res, "admin.html");
    return;
  }

  if (pathname === "/r" || pathname.startsWith("/r/")) {
    serveStatic(req, res, "review.html");
    return;
  }

  serveStatic(req, res, pathname);
});

if (require.main === module) {
  const host = process.env.HOST || "0.0.0.0";
  server.listen(PORT, host, () => {
    console.log(`NFC review server listening on http://${host}:${PORT}`);
  });
}

module.exports = { server };
