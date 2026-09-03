# coupon4u v0.6.3

Core catalog now matches the intended initial demo:
- 10 restaurants
- 10 hotels
- 5 clothing shops
- 8 activity listings

All 25 core restaurant/hotel/shop listings have a business-specific real-image URL. The app uses the specific URL instead of a generic category image.

The restaurant list includes Javees Cinema Restaurant, Chef Stop, Wok & Grill, Black Gold and Sree Ayyappa in addition to the five earlier restaurants. The hotel list includes Waterfront by Palmyra, Hotel Allseason, Chandra Inn, Ashtamudi Villas and SR Residency in addition to the five earlier hotels.

Image URLs were verified against current web/business/official listing results. They remain external URLs in this prototype because the execution environment cannot reliably download third-party image binaries. The UI now displays a neutral "Image unavailable" state if an external host blocks the image instead of showing the wrong generic photo.

Version: v0.6.3
