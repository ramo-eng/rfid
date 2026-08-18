# NFC Google review pages

Tap an NFC/RFID tag with a phone, pick a star rating, write a review in your own words, then continue to Google’s official review screen.

Live demo (after GitHub Pages is enabled):

- Home: https://ramo-eng.github.io/rfid/
- NFC URL: https://ramo-eng.github.io/rfid/r/demo-cafe/

This app **cannot** fill Google’s review form or tap Post for the customer.

## How it works

1. Add shop records in `public/locations.json` (name, slug, Google Place ID).
2. Write the shop URL onto an NFC tag.
3. A customer taps the tag, chooses stars, and writes their own review.
4. Continue opens Google’s write-a-review page for that Place ID.

## Run locally

```bash
npm start
```

Open `http://localhost:3000`. Demo page: `http://localhost:3000/r/demo-cafe`.

## Go live on GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes the static site to the `gh-pages` branch.

If the site is not visible yet, open the repo **Settings → Pages**, set **Source** to **Deploy from a branch**, branch `gh-pages`, folder `/`. The public URL is `https://ramo-eng.github.io/rfid/`.

Replace the demo Place ID before using this with a real shop.

## Tests

```bash
npm test
```
