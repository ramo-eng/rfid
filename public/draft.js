function draftStorageKey(placeId) {
  return `nfc-review-draft:${placeId}`;
}

function serializeDraft({ stars, text }) {
  return JSON.stringify({
    stars: Number(stars) || 0,
    text: String(text || ""),
    savedAt: Date.now(),
  });
}

function parseDraft(raw) {
  if (!raw) {
    return { stars: 0, text: "" };
  }
  try {
    const data = JSON.parse(raw);
    return {
      stars: Number(data.stars) || 0,
      text: String(data.text || ""),
    };
  } catch {
    return { stars: 0, text: "" };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { draftStorageKey, serializeDraft, parseDraft };
}
