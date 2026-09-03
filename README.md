# coupon4u v0.8.7 — Premium Ticket Voucher UI

A mobile-first coupon marketplace redesign based on the supplied visual reference.

## Highlights
- Premium digital-ticket voucher cards with merchant artwork zones
- Cream voucher paper, perforated edges, barcode and redeem strip
- Dark CRED-inspired shell with richer editorial typography
- Home, Saved, My Offers, More, Detail and Claimed flows
- Existing Kollam restaurant/hotel/shop/activity catalog retained
- No external merchant image URLs
- LocalStorage for saved and claimed offers
- Version shown as v0.8.7

Open `index.html` in a browser. For fetch() to load `offers.json`, use a small local web server rather than `file://`.


## Adding merchant images

Each merchant has its own folder under `assets/merchants/`.

Inside every merchant folder you will find `IMAGE_NAME.txt`.
It tells you the exact filename expected.

For the current setup, rename the image to `cover.jpg` and place it beside
`IMAGE_NAME.txt`. The app already links to that path in `offers.json`.

Example:
`assets/merchants/supreme_uppercrust/cover.jpg`

You can replace `cover.jpg` with a PNG only if you also update that merchant's
`image` path in `offers.json`.


## Ratings
Merchant ratings are displayed as a compact star badge on the voucher artwork.
The catalog stores the rating and review count with `ratingSource: Google`.
