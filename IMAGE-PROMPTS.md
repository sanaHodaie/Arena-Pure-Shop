# پرامپت تصاویر آرنا پیور

> به‌روزرسانی: عکس هر ۱۲ محصول دریافت و به WebP تبدیل شده است. فایل‌های فعال اکنون پسوند `.webp` دارند؛ نسخهٔ `-320.webp` برای کارت‌های کوچک آماده است. بنرها و دسته‌بندی‌ها نیز به WebP تبدیل شده‌اند. نام‌های JPG این سند مربوط به راهنمای اولیهٔ ورود عکس جدید است.

## شیوهٔ استفاده و فایل‌ها

عکس مرجع طراحی را به ابزار تولید تصویر بدهید و از پرامپت‌های زیر استفاده کنید. تصویر مرجع چرخیده است؛ توضیح دهید که خروجی باید صاف و در جهت معمول وب‌سایت باشد.
برای یکدستی، همه تصاویر را با یک مدل و تنظیمات ثابت تولید کنید و اولین خروجی تأییدشده را به‌عنوان مرجع سبک به تولیدهای بعدی بدهید. تطابق صددرصدی با پرامپت به‌تنهایی تضمین نمی‌شود؛ خروجی‌ها را از نظر رنگ و ترکیب‌بندی مقایسه کنید.

فایل‌ها باید JPG واقعی باشند. اگر ابزار PNG خروجی می‌دهد با Export/Save as به JPG تبدیل کنید؛ تغییر پسوند کافی نیست. برای استفاده از شفافیت PNG باید مسیرهای کد هم تغییر کند؛ مسیرهای فعلی JPG هستند.

| نوع تصویر | مسیر در پروژه |
| --- | --- |
| دسته‌بندی‌ها | `public/images/categories/` |
| محصولات | `public/images/products/` |
| بنرها | `public/images/banners/` |

مسیر کامل پایه: `D:\webProject\public\images\`. نام فایل‌ها دقیقاً مطابق همین راهنما باشد؛ اتصال در کد آماده است. دسته‌بندی‌ها و بنرها تا زمان اضافه شدن فایل جدید از تصویر مرجع استفاده می‌کنند. نبودن نسخهٔ موبایل بنر باعث استفاده از نسخهٔ دسکتاپ می‌شود.

## دسته‌بندی‌ها — هفت تصویر مربع

اندازه: ۱۰۲۴×۱۰۲۴. عکس مربع تولید کنید؛ برش دایره‌ای در سایت انجام می‌شود. کل گروه محصول در محدودهٔ مرکزی دایره‌ای به قطر ۷۶٪ تصویر جا بگیرد. پس‌زمینه برای تطبیق مرجع به‌صورت یکی در میان بنفش و یاسی است.

پرامپت پایه (متن داخل کروشه را از جدول جایگزین کنید):

```text
Create a premium photorealistic cosmetics category still life for the Arena Pure beauty store. Square 1:1 canvas, 1024x1024. Match the supplied reference's lavender and muted purple visual identity, displayed upright. SUBJECT: [SUBJECT]. Seamless solid matte [BACKGROUND] background with a matching floor, no horizon line. Arrange 2 or 3 unbranded objects at gently varied angles, in a compact balanced group centered in the image. Keep the complete group inside the central circular safe area of 76% of the canvas diameter, with generous empty margins. Soft large studio light from upper left, gentle contact shadows to lower right, realistic glass and plastic, refined editorial beauty photography, consistent camera angle and lighting across the series. Show the objects clearly, without clutter. Full-bleed square background, no circular frame or border. No added text, no logos, no labels, no watermark, no people or hands, no extra decorations.
```

| دسته | SUBJECT | BACKGROUND | نام فایل |
| --- | --- | --- | --- |
| مراقبت مو | One elegant lavender shampoo bottle, one white hair-mask jar, one small hair serum bottle | muted purple #80539B | `haircare.jpg` |
| مراقبت پوست | One frosted glass serum dropper, one white moisturizer tube, one small cream jar | pale lavender #E5DBEA | `skincare.jpg` |
| ضد آفتاب | Two minimal white sunscreen tubes with small pale peach and mint accents, one standing and one slightly tilted | muted purple #80539B | `sunscreen.jpg` |
| بهداشت شخصی | One refined roll-on deodorant, one soft pink body-lotion bottle, one minimal white care tube | pale lavender #E5DBEA | `hygiene.jpg` |
| پاک‌کننده‌ها | One clear micellar-water bottle with a pale mint cap, one gentle cleansing tube, three white cotton pads | muted purple #80539B | `cleansing.jpg` |
| ادکلن | One round blush-pink glass perfume bottle with a gold cap, one rectangular violet glass fragrance bottle | pale lavender #E5DBEA | `fragrance.jpg` |
| آرایشی | One open nude-pink lipstick, one closed plum lip-gloss tube, one open round powder compact | muted purple #80539B | `cosmetics.jpg` |

برای پس‌زمینهٔ کاملاً یکسان در همهٔ دسته‌ها می‌توانید در هر هفت پرامپت `muted purple #80539B` بگذارید؛ تناوب بالا به عکس مرجع نزدیک‌تر است.

## محصولات — فقط با عکس واقعی همان مدل

برای هر محصول، عکس واقعی و واضح همان محصول و همان رنگ را ضمیمه کنید و درخواست ویرایش بدهید. تولید از روی نام به‌تنهایی می‌تواند شکل بسته‌بندی یا نوشته‌ها را اشتباه بسازد. مدل‌های رنگی مانند Cheeky و Peachy باید مرجع جداگانه داشته باشند.

اندازه: ۱۲۰۰×۱۲۰۰، نسبت ۱:۱. پس‌زمینهٔ مشترک همه محصولات: `#FCFAFC`؛ نور از بالا و چپ، سایهٔ کوتاه در پایین و راست. بدون گل، سکو و لوازم تزئینی؛ این عناصر فقط برای بنرها هستند.

پرامپت پایه:

```text
Edit the uploaded authentic product photograph into a consistent premium e-commerce packshot. PRODUCT: [EXACT PRODUCT NAME]. Preserve the original product's identity exactly: brand logo, every label and printed word, packaging shape, cap, proportions, material, actual shade and color. Do not redraw, replace, invent or correct the label. Remove only the original background and unrelated props. Use one seamless uniform very pale lavender-white background, hex #FCFAFC, with no gradient, texture or horizon line. Square 1200x1200 canvas. Product upright, centered, front-facing or preserve the uploaded near-front view. Keep the complete product visible with at least 12% empty margin on every side; fit its longest dimension to approximately 72% of the canvas. Keep any original applicator only if it belongs to this exact product, arranged compactly next to it. Soft diffused studio lighting from upper left, short subtle contact shadow toward lower right, realistic edges and natural materials, crisp label details without oversharpening. Match the lighting, background, framing and visual scale of the supplied approved packshot style reference. No pedestal, flowers, hands, decorative props, price, discount badge, watermark, extra text or duplicated products. If exact label preservation is impossible, keep the source product pixels and replace only the background.
```

پرامپت اختصاصی و نام فایل هر ۱۲ محصول در ادامهٔ همین سند آمده است. همهٔ محصولات در بخش‌های مختلف سایت از همین فایل‌های مشترک استفاده می‌کنند.

## بنر اصلی دسکتاپ

فایل: `public/images/banners/hero-desktop.jpg` — اندازه: ۱۹۲۰×۶۴۰، نسبت ۳:۱.

```text
Create a photorealistic luxury beauty e-commerce hero background inspired by the supplied Arena Pure reference, upright landscape 1920x640, aspect ratio 3:1. Elegant muted lavender palette #D8C8E9, #CFC0DF, with warm ivory highlights and accents of #80539B. Place two premium body mist bottles in the LEFT 45%: a tall translucent deep-purple cylindrical spray bottle tilted gently, and a soft blush-pink rectangular mist bottle with a gold pump. Nestle them among realistic white frangipani flowers with pale yellow centers and a few natural green leaves, clustered at the lower-left. Soft lilac satin backdrop, subtle flowing ivory silk near the upper-right edge. Soft diffused studio illumination from upper left, natural product shadows, editorial cosmetics photography, elegant and restrained. Keep the RIGHT 48% visually quiet and clear of all objects, with an uninterrupted light lavender background and low contrast for dark Persian headline and a button that will be added by the website. All objects fully visible within safe margins. No words, letters, invented logos, watermark, price, buttons, dots, frames or user interface. Do not render the screenshot or rotate the composition.
```

## بنر اصلی موبایل

فایل: `public/images/banners/hero-mobile.jpg` — اندازه: ۹۶۰×۶۰۰، نسبت ۸:۵.

```text
Recompose the supplied approved desktop beauty hero artwork as a separate mobile composition, landscape 960x600, aspect ratio 8:5. Preserve the same purple and blush-pink body mist bottles, white frangipani flowers, satin materials, soft lighting and lavender palette. Make the product-and-flower cluster smaller and place it in the BOTTOM-LEFT, contained within the bottom 43% and left 55% of the canvas. Keep the TOP-RIGHT 75% width and top 55% height simple, light lavender and empty for live Persian text and a button. Avoid large dark objects behind that safe area. Soft photorealistic editorial beauty photography. No text, logos, watermark, buttons, frames or UI. Do not simply crop the desktop artwork; recompose it for the specified mobile safe areas.
```

## بنر مراقبت مو دسکتاپ

فایل: `public/images/banners/haircare-desktop.jpg` — اندازه: ۱۰۲۴×۱۰۲۴.

```text
Photorealistic premium haircare campaign background, square 1024x1024. Match the approved lavender Arena Pure hero style. Warm pale grey-lilac #DFDADE studio backdrop. A tall white shampoo bottle on a low muted-purple #80539B rectangular podium at bottom-left, and a white hair-mask jar on a taller purple podium at bottom-right. Two small matte ivory spheres and a delicate flowing ivory silk ribbon behind the lower product group. Place all objects in the LOWER 60% and preserve a quiet empty UPPER-RIGHT 75% width by 38% height area for live Persian headline and button. Accurate soft contact shadows, refined 3D depth, photorealistic plastic, soft upper-left studio lighting, elegant restrained composition. Generic unbranded packaging, no lettering or logos, no watermark, no buttons or interface.
```

## بنر مراقبت مو موبایل

فایل: `public/images/banners/haircare-mobile.jpg` — اندازه: ۱۰۰۰×۶۰۰، نسبت ۵:۳.

```text
Recompose the approved square haircare banner into a mobile landscape 1000x600 composition, aspect ratio 5:3. Keep the same ivory shampoo bottle and mask jar, matte purple podiums, ivory spheres, pale grey-lilac #DFDADE background, soft silk and upper-left studio lighting. Cluster the products in the LEFT 38% and lower-left corner. Keep the RIGHT 62% and especially its upper 70% completely uncluttered with low-contrast pale lavender background for live Persian text and a button. Products fully visible and smaller than in the square version. No text, logo, watermark, border, buttons or UI.
```

## بنر عطر دسکتاپ

فایل: `public/images/banners/fragrance-desktop.jpg` — اندازه: ۱۶۰۰×۸۰۰، نسبت ۲:۱.

```text
Photorealistic premium perfume campaign background, landscape 1600x800, aspect ratio 2:1, matching the approved Arena Pure lavender visual series. Arrange four elegant unbranded fragrance bottles on staggered matte purple #80539B geometric podiums running along the BOTTOM 45%: a small square ivory bottle with a gold cap on the left, a tall lavender mist bottle, a clear rectangular perfume with a black cap, and a larger transparent violet bottle at the far right. Warm pale lavender #E5DCE9 backdrop, one ivory sphere near bottom-left, a restrained flowing ivory silk ribbon behind the products. Keep the UPPER-RIGHT 48% width and upper 43% height clear and low contrast for live Persian title and button. Soft upper-left studio lighting, realistic glass refraction and gentle shadows, luxurious but minimal. No labels, text, logos, watermark, price, buttons or interface.
```

## بنر عطر موبایل

فایل: `public/images/banners/fragrance-mobile.jpg` — اندازه: ۱۰۰۰×۶۰۰، نسبت ۵:۳.

```text
Recompose the approved wide perfume banner for mobile, landscape 1000x600, aspect ratio 5:3. Preserve its lavender palette #E5DCE9, realistic glass bottles, muted purple podiums, ivory silk and soft upper-left lighting. Reduce the scene to two complementary perfume bottles grouped at the BOTTOM-LEFT on low purple podiums, occupying the left 38% and lower 50% only. Keep the RIGHT 62% and its upper 70% quiet, pale and free of objects for live Persian text and a button. Keep all bottles fully visible. No labels, lettering, logos, watermark, border, buttons or UI.
```

## هدر

برای خود هدر تصویر نسازید: لوگوتایپ، جستجو، منو و دکمه‌ها باید اجزای واقعی سایت بمانند تا روی موبایل قابل استفاده و متن‌ها واضح باشند. لوگوی فعلی به‌صورت متن است. اگر لوگوی رسمی دارید، نسخهٔ SVG آن را جداگانه بدهید؛ تولید تصویری معمولاً نوشتهٔ دقیق Arena Pure را تضمین نمی‌کند.

## نکات ریسپانسیو

- نسخهٔ موبایل بنرها در عرض ۵۲۰ پیکسل و کمتر انتخاب می‌شود؛ در نبود آن، نسخهٔ دسکتاپ استفاده می‌شود.
- دسته‌بندی‌ها مربع هستند و در سایت با برش دایره‌ای نمایش داده می‌شوند؛ عناصر نباید نزدیک گوشه‌های فایل باشند.
- عکس محصولات با object-fit: contain نمایش داده می‌شود و بریده نمی‌شود.
- متن فارسی و دکمه را داخل عکس تولید نکنید؛ محل آن‌ها را طبق safe area هر پرامپت خالی بگذارید.
- فایل نهایی را برای وب فشرده کنید؛ برای دسته‌ها حدود ۱۵۰KB، محصولات حدود ۲۵۰KB، بنر دسکتاپ حدود ۵۰۰KB هدف مناسبی برای این پروژه است.

## پرامپت اختصاصی هر محصول


### مداد لب نیکس Slim Lip Pencil رنگ Nude Truffle

File: `nyx-slim-lip-pencil-nude-truffle.jpg`

```text
Edit the attached authentic photo of NYX Slim Lip Pencil Nude Truffle. Preserve the exact original packaging, logo, label text, proportions, materials and actual shade; do not recreate or invent any product details. Replace only the background with seamless solid pale lavender-white #FCFAFC, no gradient or texture. Square 1200x1200. Center the complete upright product, its longest dimension approximately 72% of the canvas, with at least 12% clear margin on every side. Soft diffused studio light from upper left, subtle short contact shadow to lower right. Match the approved packshot style reference. Keep the original applicator only when included in this exact product reference. No flowers, pedestal, unrelated props, hands, extra text, price, watermark, duplicate items or UI. If preserving the label is difficult, keep the original product pixels and edit only the background.
```


### رژ لب مایع میبلین Super Stay Vinyl Ink رنگ 35 Cheeky

File: `maybelline-vinyl-ink-35-cheeky.jpg`

```text
Edit the attached authentic photo of Maybelline Super Stay Vinyl Ink 35 Cheeky. Preserve the exact original packaging, logo, label text, proportions, materials and actual shade; do not recreate or invent any product details. Replace only the background with seamless solid pale lavender-white #FCFAFC, no gradient or texture. Square 1200x1200. Center the complete upright product, its longest dimension approximately 72% of the canvas, with at least 12% clear margin on every side. Soft diffused studio light from upper left, subtle short contact shadow to lower right. Match the approved packshot style reference. Keep the original applicator only when included in this exact product reference. No flowers, pedestal, unrelated props, hands, extra text, price, watermark, duplicate items or UI. If preserving the label is difficult, keep the original product pixels and edit only the background.
```


### برق لب نیکس Butter Gloss رنگ Angel Food Cake

File: `nyx-butter-gloss-angel-food-cake.jpg`

```text
Edit the attached authentic photo of NYX Butter Gloss Angel Food Cake. Preserve the exact original packaging, logo, label text, proportions, materials and actual shade; do not recreate or invent any product details. Replace only the background with seamless solid pale lavender-white #FCFAFC, no gradient or texture. Square 1200x1200. Center the complete upright product, its longest dimension approximately 72% of the canvas, with at least 12% clear margin on every side. Soft diffused studio light from upper left, subtle short contact shadow to lower right. Match the approved packshot style reference. Keep the original applicator only when included in this exact product reference. No flowers, pedestal, unrelated props, hands, extra text, price, watermark, duplicate items or UI. If preserving the label is difficult, keep the original product pixels and edit only the background.
```


### رژ لب مایع میبلین Super Stay Vinyl Ink رنگ 15 Peachy

File: `maybelline-vinyl-ink-15-peachy.jpg`

```text
Edit the attached authentic photo of Maybelline Super Stay Vinyl Ink 15 Peachy. Preserve the exact original packaging, logo, label text, proportions, materials and actual shade; do not recreate or invent any product details. Replace only the background with seamless solid pale lavender-white #FCFAFC, no gradient or texture. Square 1200x1200. Center the complete upright product, its longest dimension approximately 72% of the canvas, with at least 12% clear margin on every side. Soft diffused studio light from upper left, subtle short contact shadow to lower right. Match the approved packshot style reference. Keep the original applicator only when included in this exact product reference. No flowers, pedestal, unrelated props, hands, extra text, price, watermark, duplicate items or UI. If preserving the label is difficult, keep the original product pixels and edit only the background.
```


### ریمل میبلین Lash Sensational Sky High رنگ Very Black

File: `maybelline-sky-high-very-black.jpg`

```text
Edit the attached authentic photo of Maybelline Lash Sensational Sky High Mascara Very Black. Preserve the exact original packaging, logo, label text, proportions, materials and actual shade; do not recreate or invent any product details. Replace only the background with seamless solid pale lavender-white #FCFAFC, no gradient or texture. Square 1200x1200. Center the complete upright product, its longest dimension approximately 72% of the canvas, with at least 12% clear margin on every side. Soft diffused studio light from upper left, subtle short contact shadow to lower right. Match the approved packshot style reference. Keep the original applicator only when included in this exact product reference. No flowers, pedestal, unrelated props, hands, extra text, price, watermark, duplicate items or UI. If preserving the label is difficult, keep the original product pixels and edit only the background.
```


### سرم اوردینری Niacinamide 10% + Zinc 1%

File: `ordinary-niacinamide-10-zinc-1.jpg`

```text
Edit the attached authentic photo of The Ordinary Niacinamide 10% + Zinc 1%. Preserve the exact original packaging, logo, label text, proportions, materials and actual shade; do not recreate or invent any product details. Replace only the background with seamless solid pale lavender-white #FCFAFC, no gradient or texture. Square 1200x1200. Center the complete upright product, its longest dimension approximately 72% of the canvas, with at least 12% clear margin on every side. Soft diffused studio light from upper left, subtle short contact shadow to lower right. Match the approved packshot style reference. Keep the original applicator only when included in this exact product reference. No flowers, pedestal, unrelated props, hands, extra text, price, watermark, duplicate items or UI. If preserving the label is difficult, keep the original product pixels and edit only the background.
```


### سرم اوردینری Hyaluronic Acid 2% + B5 با سرامید

File: `ordinary-hyaluronic-acid-2-b5.jpg`

```text
Edit the attached authentic photo of The Ordinary Hyaluronic Acid 2% + B5 with Ceramides. Preserve the exact original packaging, logo, label text, proportions, materials and actual shade; do not recreate or invent any product details. Replace only the background with seamless solid pale lavender-white #FCFAFC, no gradient or texture. Square 1200x1200. Center the complete upright product, its longest dimension approximately 72% of the canvas, with at least 12% clear margin on every side. Soft diffused studio light from upper left, subtle short contact shadow to lower right. Match the approved packshot style reference. Keep the original applicator only when included in this exact product reference. No flowers, pedestal, unrelated props, hands, extra text, price, watermark, duplicate items or UI. If preserving the label is difficult, keep the original product pixels and edit only the background.
```


### کرم مرطوب‌کننده سراوی Moisturizing Cream

File: `cerave-moisturizing-cream.jpg`

```text
Edit the attached authentic photo of CeraVe Moisturizing Cream. Preserve the exact original packaging, logo, label text, proportions, materials and actual shade; do not recreate or invent any product details. Replace only the background with seamless solid pale lavender-white #FCFAFC, no gradient or texture. Square 1200x1200. Center the complete upright product, its longest dimension approximately 72% of the canvas, with at least 12% clear margin on every side. Soft diffused studio light from upper left, subtle short contact shadow to lower right. Match the approved packshot style reference. Keep the original applicator only when included in this exact product reference. No flowers, pedestal, unrelated props, hands, extra text, price, watermark, duplicate items or UI. If preserving the label is difficult, keep the original product pixels and edit only the background.
```


### ضدآفتاب لاروش پوزای Anthelios UVMune 400 Invisible Fluid SPF50+ بی‌رنگ و بدون عطر

File: `laroche-posay-uvmune-400-spf50.jpg`

```text
Edit the attached authentic photo of La Roche Posay Anthelios UVMune 400 Invisible Fluid SPF50 Non Perfumed. Preserve the exact original packaging, logo, label text, proportions, materials and actual shade; do not recreate or invent any product details. Replace only the background with seamless solid pale lavender-white #FCFAFC, no gradient or texture. Square 1200x1200. Center the complete upright product, its longest dimension approximately 72% of the canvas, with at least 12% clear margin on every side. Soft diffused studio light from upper left, subtle short contact shadow to lower right. Match the approved packshot style reference. Keep the original applicator only when included in this exact product reference. No flowers, pedestal, unrelated props, hands, extra text, price, watermark, duplicate items or UI. If preserving the label is difficult, keep the original product pixels and edit only the background.
```


### شامپو لورآل Elvive Hyaluron + Plump

File: `loreal-elvive-hyaluron-plump-shampoo.jpg`

```text
Edit the attached authentic photo of LOreal Elvive Hyaluron Plump Hydrating Shampoo. Preserve the exact original packaging, logo, label text, proportions, materials and actual shade; do not recreate or invent any product details. Replace only the background with seamless solid pale lavender-white #FCFAFC, no gradient or texture. Square 1200x1200. Center the complete upright product, its longest dimension approximately 72% of the canvas, with at least 12% clear margin on every side. Soft diffused studio light from upper left, subtle short contact shadow to lower right. Match the approved packshot style reference. Keep the original applicator only when included in this exact product reference. No flowers, pedestal, unrelated props, hands, extra text, price, watermark, duplicate items or UI. If preserving the label is difficult, keep the original product pixels and edit only the background.
```


### میسلار واتر گارنیه SkinActive All-in-1 درب صورتی

File: `garnier-micellar-water-pink.jpg`

```text
Edit the attached authentic photo of Garnier SkinActive Micellar Cleansing Water All in 1 Pink. Preserve the exact original packaging, logo, label text, proportions, materials and actual shade; do not recreate or invent any product details. Replace only the background with seamless solid pale lavender-white #FCFAFC, no gradient or texture. Square 1200x1200. Center the complete upright product, its longest dimension approximately 72% of the canvas, with at least 12% clear margin on every side. Soft diffused studio light from upper left, subtle short contact shadow to lower right. Match the approved packshot style reference. Keep the original applicator only when included in this exact product reference. No flowers, pedestal, unrelated props, hands, extra text, price, watermark, duplicate items or UI. If preserving the label is difficult, keep the original product pixels and edit only the background.
```


### ادو پرفیوم زنانه لانکوم La Vie Est Belle

File: `lancome-la-vie-est-belle-edp.jpg`

```text
Edit the attached authentic photo of Lancome La Vie Est Belle Eau de Parfum. Preserve the exact original packaging, logo, label text, proportions, materials and actual shade; do not recreate or invent any product details. Replace only the background with seamless solid pale lavender-white #FCFAFC, no gradient or texture. Square 1200x1200. Center the complete upright product, its longest dimension approximately 72% of the canvas, with at least 12% clear margin on every side. Soft diffused studio light from upper left, subtle short contact shadow to lower right. Match the approved packshot style reference. Keep the original applicator only when included in this exact product reference. No flowers, pedestal, unrelated props, hands, extra text, price, watermark, duplicate items or UI. If preserving the label is difficult, keep the original product pixels and edit only the background.
```
