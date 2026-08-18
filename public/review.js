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

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function renderStars() {
  starButtons.forEach((button) => {
    const value = Number(button.dataset.stars);
    const on = value <= selectedStars;
    button.classList.toggle("active", on);
    button.setAttribute("aria-pressed", String(on && value === selectedStars));
  });
  labelEl.textContent = selectedStars ? labels[selectedStars] : "Select a rating";
  continueBtn.disabled = !selectedStars || !googleUrl;
}

starButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedStars = Number(button.dataset.stars);
    renderStars();
  });
});

continueBtn.addEventListener("click", async () => {
  const draft = textEl.value.trim();
  if (draft) {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus("Copied your review. Paste it into Google, match your star rating, then tap Post.");
    } catch {
      setStatus("Could not copy automatically. Copy your text, then paste it into Google.");
    }
  } else {
    setStatus("Opening Google. Write your review there, choose your stars, then tap Post.");
  }
  window.location.href = googleUrl;
});

function load() {
  const place = parsePlaceFromHref(location.href);
  if (!place.placeId) {
    nameEl.textContent = "No place on this tag";
    setStatus("The RFID/NFC tag must include a Google Place ID in the URL, for example /r/?placeid=ChIJ...&name=Cafe", true);
    return;
  }

  nameEl.textContent = place.name || "This shop";
  addressEl.textContent = place.address || "";
  placeIdEl.textContent = `Place from RFID: ${place.placeId}`;
  googleUrl = googleReviewUrl(place.placeId);
  document.title = `Review ${place.name || "this shop"}`;
  renderStars();
}

load();
