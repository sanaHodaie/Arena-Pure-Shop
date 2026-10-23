# بازطراحی هیرو و تصاویر شفاف محصولات

## بنر مستقل موبایل — نسخهٔ سوم

مسیر: `public/images/banners/hero-mobile-v3.webp`. این تصویر با built-in imagegen به‌صورت مستقل ساخته شده و در عرض ۶۴۰ پیکسل و کمتر جایگزین مجموعه بنرهای دسکتاپ می‌شود. نوشته‌ها و دکمه در HTML هستند.

```text
Create a brand new high-resolution luxury beauty website MOBILE hero artwork, portrait aspect ratio 4:5, 1024x1280. Premium Arena Pure lavender and deep muted plum visual identity. Seamless deep muted plum-purple #57376E in the upper half gently transitioning to soft smoky lavender below. The TOP 53% is elegantly empty, dark and quiet, for a live white Persian headline, short paragraph and shopping button. Product still life confined to BOTTOM 43%: two sophisticated transparent violet and blush-pink glass cosmetic/perfume bottles with gold pumps, small white frangipani blossoms and a few elegant green leaves, flowing ivory satin and a low curved lavender podium. Product group centered slightly left, with generous breathing room and complete bottles visible. Crisp photorealistic luxury studio photography, realistic glass, luminous but controlled highlights, soft shadows, beautifully balanced editorial design, refined minimal composition. No text, words, logo, watermark, price, UI, borders, buttons. This is an independent mobile composition, not a crop of a desktop banner.
```

ابزار استفاده‌شده: built-in imagegen؛ خروجی‌های منتخب پس از تبدیل به WebP در پروژه ذخیره می‌شوند.

## مسیر خروجی

- سه بنر بازطراحی‌شده: `public/images/banners/hero-desktop.webp`، `haircare-desktop.webp` و `fragrance-desktop.webp`.
- نسخه‌های کم‌حجم‌تر موبایل: همان نام‌ها با `-mobile.webp`؛ چیدمان متن و تصویر در CSS موبایل جدا تنظیم می‌شود.
- دوازده محصول با کانال آلفای واقعی: `public/images/products/*.webp`؛ نسخه‌های کارت کوچک با پسوند `-320.webp`.
- نام محصول و مسیر تصویر در `src/data/catalog.js` باقی می‌ماند.

## پرامپت مشترک حذف پس‌زمینه

```text
Remove the background from this exact product photograph. Output a genuine RGBA transparent background cutout, preserving the original product pixels, exact logo and label letters, packaging shape, actual color, all applicators and proportions. Do not redraw, stylize or change the product. Eliminate the white outer background and cast shadow, retain opaque white packaging and natural transparent glass edges. Keep the product upright and centered at the same scale within a square canvas. No new objects, no floor, no backdrop, no checkerboard pattern. For the NYX Butter Gloss only: keep the bottle and applicator; remove the blue border and separate color swatch/round shade label outside the packaging.
```

این پرامپت برای هر محصول به‌صورت جداگانه با عکس واقعی همان محصول اجرا شده است.

## پرامپت بنر اصلی

```text
Create a high-resolution photorealistic luxury cosmetics website hero background. Landscape aspect ratio 3:1, 1920x640 or higher. Elegant muted lavender palette #D8C8E9 #CFC0DF, ivory satin and purple #80539B. In LEFT 45% a tall translucent deep purple body mist bottle and blush pink rectangular body mist bottle with gold pump, surrounded by crisp white frangipani blossoms with pale yellow centers and fresh green leaves. Stunning realistic glass, fine detail, bright clean diffused studio light, sharp elegant product photography, sophisticated shadows, no fog no blur no washed out overlay. RIGHT 50% empty uncluttered pale lavender for live Persian copy. No text, no logos, no watermarks, no UI, no border.
```

## پرامپت بنر مراقبت مو

```text
Photorealistic high-end haircare campaign website banner, square 1024x1024 or higher. Warm pale grey lavender background #DFDADE. Two pristine white haircare containers: a tall shampoo bottle standing on a low muted purple #80539B geometric podium at bottom left, and a premium white hair mask jar on a taller purple podium at bottom right. Ivory sphere at lower left, one smaller ivory sphere near jar, delicate flowing ivory satin ribbon behind products. Crisp edges, fine realistic plastic and subtle glass details, clean brilliant studio lighting, soft contact shadows, editorial beauty photography, no haze, no blur. Product grouping confined to LOWER 58%. UPPER 40% particularly upper right must be empty, pale lavender for live text and button. No text, no logos, no watermarks, no interface, no frames.
```

## پرامپت بنر عطر

```text
Photorealistic high-end perfume campaign website banner, wide landscape 2:1, 1600x800 or higher. Warm pale lavender #E5DCE9 background with understated flowing ivory satin. In LOWER 50% four elegant realistic perfume bottles on staggered matte muted purple #80539B geometric podiums: small square ivory bottle with gold round cap left, tall lavender mist bottle center-left, clear rectangular fragrance bottle with black cap center-right, translucent violet bottle right. One ivory sphere lower left. Luxury glass refraction, precise clean edges, bright soft studio lighting and natural contact shadows. UPPER 42% and especially UPPER RIGHT 48% fully empty for live Persian headline and button. No fog, blur, faded overlay, text, letters, logos, watermarks, frames or UI.
```
