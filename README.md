# NFC Google review pages

Tap an NFC/RFID tag with a phone, pick a star rating, write a review in your own words, then continue to Google’s official review screen.

This app **cannot** fill Google’s review form or tap Post for the customer. Google does not provide an API for that, and posting canned or auto-filled reviews as if they were written by the visitor is not allowed.

## How it works

1. Add a shop on the admin page and paste its Google Place ID.
2. Write the shop URL (`/r/your-shop`) onto an NFC tag with a writer app such as NFC Tools.
3. A customer taps the tag. The phone opens your server.
4. They choose 1–5 stars and write their review.
5. Continue copies their text (when the browser allows it) and opens Google’s write-a-review page for that Place ID.
6. They paste, match the star rating, and post on Google themselves.

Every rating still goes to the same Google review page. This does not hide lower ratings.

## Run locally

```bash
npm start
```

Open `http://localhost:3000` to add shops. Demo page: `http://localhost:3000/r/demo-cafe`.

Replace the demo Place ID with the real Place ID for each shop.

## Tests

```bash
npm test
```
