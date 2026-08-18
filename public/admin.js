const form = document.getElementById("form");
const output = document.getElementById("output");
const outputUrl = document.getElementById("output-url");
const copyBtn = document.getElementById("copy");
const preview = document.getElementById("preview");
const statusEl = document.getElementById("status");

function nfcUrlFromForm(payload) {
  return `${location.origin}${appUrl(buildNfcPath(payload))}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    const url = nfcUrlFromForm(payload);
    output.hidden = false;
    outputUrl.href = url;
    outputUrl.textContent = url;
    preview.href = url;
    statusEl.textContent = "Write this URL onto the RFID/NFC tag. The Place ID travels with the tag.";
    statusEl.classList.remove("error");
  } catch (error) {
    statusEl.textContent = error.message;
    statusEl.classList.add("error");
  }
});

copyBtn.addEventListener("click", async () => {
  const url = outputUrl.textContent;
  try {
    await navigator.clipboard.writeText(url);
    statusEl.textContent = "Copied. Paste it into NFC Tools as a URL/URI record, then write the tag.";
    statusEl.classList.remove("error");
  } catch {
    statusEl.textContent = "Copy failed. Select the URL and copy it manually.";
    statusEl.classList.add("error");
  }
});
