# coupon4u v1.0.0

Premium Kerala coupon marketplace demo.

## Redemption pass
- Customer logs in with a unique 10-digit mobile number.
- A single pass code is generated for that mobile number and remains valid for 24 hours.
- A live countdown appears at the top-left of the home screen.
- Offer cards contain no coupon IDs and no barcodes.
- Redeeming any offer uses the active 24-hour pass.
- The redemption screen shows the pass code, live expiry countdown, and a QR code containing that pass code.

## Images
Merchant photos are loaded from `assets/merchants/<slug>/cover.jpg`. If a photo is missing, the matching SVG fallback is used automatically.

> This version stores the pass locally in the browser for the frontend demo. A production deployment should generate and validate the 24-hour pass server-side (for example with Supabase) so the same mobile number is recognized across devices.
