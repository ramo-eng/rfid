const slug = shopSlugFromLocation();
const nameEl = document.getElementById("shop-name");
const addressEl = document.getElementById("shop-address");
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

async function load() {
  if (!slug) {
    nameEl.textContent = "Missing shop link";
    setStatus("This URL needs a shop slug, for example /r/demo-cafe", true);
    return;
  }

  const data = await fetchLocations();
  const location = (data.locations || []).find((item) => item.slug === slug);
  if (!location) {
    nameEl.textContent = "Shop not found";
    setStatus("Unknown shop", true);
    return;
  }

  nameEl.textContent = location.name;
  addressEl.textContent = location.address || "";
  googleUrl = googleReviewUrl(location.googlePlaceId);
  document.title = `Review ${location.name}`;
  renderStars();
}

load().catch(() => {
  nameEl.textContent = "Could not load shop";
  setStatus("Check the server and try again.", true);
});
