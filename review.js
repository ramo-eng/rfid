const nameEl = document.getElementById("shop-name");
const addressEl = document.getElementById("shop-address");
const placeIdEl = document.getElementById("place-id");
const labelEl = document.getElementById("star-label");
const textEl = document.getElementById("review-text");
const continueBtn = document.getElementById("continue");
const statusEl = document.getElementById("status");
const starButtons = [...document.querySelectorAll(".star")];

const labels = {
  1: "1 star — what went wrong?",
  2: "2 stars — what could be better?",
  3: "3 stars — what was okay, and what was not?",
  4: "4 stars — what did you like?",
  5: "5 stars — what made it great?",
};

let selectedStars = 0;
let googleUrl = "";
let placeId = "";

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function persistDraft() {
  if (!placeId) return;
  const payload = serializeDraft({ stars: selectedStars, text: textEl.value });
  try {
    localStorage.setItem(draftStorageKey(placeId), payload);
    sessionStorage.setItem(draftStorageKey(placeId), payload);
  } catch {
    // Private mode can block storage; clipboard copy still works.
  }
}

function restoreDraft() {
  let raw = "";
  try {
    raw = sessionStorage.getItem(draftStorageKey(placeId)) || localStorage.getItem(draftStorageKey(placeId)) || "";
  } catch {
    raw = "";
  }
  const draft = parseDraft(raw);
  if (draft.text) textEl.value = draft.text;
  if (draft.stars) selectedStars = draft.stars;
}

function renderStars() {
  starButtons.forEach((button) => {
    const value = Number(button.dataset.stars);
    const on = value <= selectedStars;
    button.classList.toggle("active", on);
    button.setAttribute("aria-pressed", String(on && value === selectedStars));
  });
  labelEl.textContent = selectedStars ? labels[selectedStars] : "Select a rating";
  continueBtn.disabled = !selectedStars || !googleUrl || !textEl.value.trim();
}

async function copyReviewText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, text.length);
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    document.body.removeChild(area);
    return copied;
  }
}

starButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedStars = Number(button.dataset.stars);
    persistDraft();
    renderStars();
  });
});

textEl.addEventListener("input", () => {
  persistDraft();
  renderStars();
});

continueBtn.addEventListener("click", async () => {
  const draft = textEl.value.trim();
  persistDraft();
  if (!draft) {
    setStatus("Write your review first so it can be copied onto the clipboard.", true);
    return;
  }

  continueBtn.disabled = true;
  const copied = await copyReviewText(draft);
  if (copied) {
    setStatus("Your review is copied. Opening Google — tap the review box, paste, match your stars, then Post.");
  } else {
    textEl.focus();
    textEl.select();
    setStatus("Copy failed. Select the text, copy it, then paste it into Google.", true);
    continueBtn.disabled = false;
    return;
  }

  window.setTimeout(() => {
    window.location.href = googleUrl;
  }, 400);
});

function load() {
  const place = parsePlaceFromHref(location.href);
  if (!place.placeId) {
    nameEl.textContent = "No place on this tag";
    setStatus("The RFID/NFC tag must include a Google Place ID in the URL, for example /r/?placeid=ChIJ...&name=Cafe", true);
    return;
  }

  placeId = place.placeId;
  nameEl.textContent = place.name || "This shop";
  addressEl.textContent = place.address || "";
  placeIdEl.textContent = `Place from RFID: ${place.placeId}`;
  googleUrl = googleReviewUrl(place.placeId);
  document.title = `Review ${place.name || "this shop"}`;
  restoreDraft();
  renderStars();
}

load();
