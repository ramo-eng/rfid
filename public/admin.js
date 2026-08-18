const form = document.getElementById("form");
const listEl = document.getElementById("list");
const statusEl = document.getElementById("status");
const staticHost = location.hostname.endsWith("github.io");

function nfcUrl(slug) {
  return `${location.origin}${appUrl("r/" + encodeURIComponent(slug) + "/")}`;
}

async function loadLocations() {
  const data = await fetchLocations();
  listEl.innerHTML = "";
  for (const location of data.locations || []) {
    const url = nfcUrl(location.slug);
    const item = document.createElement("article");
    item.className = "loc";
    item.innerHTML = `
      <h2>${location.name}</h2>
      <p>${location.address || ""}</p>
      <p>Place ID: <code>${location.googlePlaceId}</code></p>
      <p>Write this URL on the NFC tag:</p>
      <p><a href="${url}">${url}</a></p>
    `;
    listEl.appendChild(item);
  }
  if (staticHost) {
    form.hidden = true;
    statusEl.textContent = "This live site is static. Add shops by editing public/locations.json in the repo, then redeploy.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(form).entries());
  const response = await fetch(appUrl("api/locations"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    statusEl.textContent = data.error || "Could not save shop";
    statusEl.classList.add("error");
    return;
  }
  statusEl.textContent = `Saved ${data.location.name}. Program an NFC tag with ${nfcUrl(data.location.slug)}.`;
  statusEl.classList.remove("error");
  form.reset();
  await loadLocations();
});

loadLocations().catch(() => {
  statusEl.textContent = "Could not load shops.";
  statusEl.classList.add("error");
});
