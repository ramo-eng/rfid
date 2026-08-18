# NFC Google review pages

The shop comes from the RFID/NFC tag. Each tag is programmed with a URL that already contains that shop’s Google Place ID. A phone tap opens your site with that place selected.

Example tag URL:

`https://your-host/r/?placeid=ChIJ...&name=Sunset%20Bistro`

This app **cannot** fill Google’s review form or tap Post for the customer.

## How it works

1. Open the home page and paste the shop name plus Google Place ID.
2. Copy the generated URL and write it onto the NFC tag (NFC Tools → URL/URI record).
3. A customer taps the tag. Their phone opens `/r/?placeid=...` for **that** shop.
4. They choose stars and write their own review. The page saves that draft on the phone and copies it, then opens Google so they can paste into the review box.

A different restaurant or shop needs a different tag, because the place lives on the tag.

## Run locally

```bash
npm start
```

Open `http://localhost:3000` to build a tag URL.

## Tests

```bash
npm test
```
