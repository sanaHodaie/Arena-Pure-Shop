import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronLeft, ExternalLink, Heart, Minus, Plus, ShoppingBag, ZoomIn, X } from 'lucide-react';
import ProductImage from '../components/ProductImage.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { formatPrice } from '../data/mockData.js';
import { categoryNames, getProductDetails, productUrl } from '../data/productDetails.js';
import './ProductPage.css';

export default function ProductPage({ product, onAddToCart, onToggleWishlist, wishlist, onQuickView }) {
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const zoom = useRef(null);
  const details = getProductDetails(product);
  const selectedImage = details.gallery[imageIndex];
  const wished = wishlist.includes(product.id);
  useEffect(() => { setQuantity(1); setImageIndex(0); zoom.current?.close(); }, [product.id]);
  const add = () => onAddToCart({ ...product, quantity });

  return <main className="pd-page arena-container" dir="rtl">
    <nav className="pd-breadcrumb" aria-label="مسیر صفحه"><a href="/">خانه</a><ChevronLeft size={14}/><a href="/#products">{categoryNames[product.category]}</a><ChevronLeft size={14}/><span>{product.brand}</span></nav>
    <div className="pd-layout">
      <section className="pd-gallery" aria-label="تصاویر محصول">
        <div className="pd-gallery-top"><span className="pd-tag">{product.brand}</span><button className="pd-icon" onClick={() => onToggleWishlist(product.id)} aria-label="افزودن به علاقه‌مندی‌ها" aria-pressed={wished}><Heart size={21} fill={wished ? 'currentColor' : 'none'}/></button></div>
        <button className="pd-main-image" disabled={!selectedImage.src} onClick={() => zoom.current?.showModal()} aria-label="بزرگ‌نمایی تصویر محصول"><ProductImage src={selectedImage.src} alt={selectedImage.alt} sizes="(max-width: 760px) 90vw, 520px" loading="eager"/>{selectedImage.src && <span><ZoomIn size={17}/> مشاهده تصویر بزرگ‌تر</span>}</button>
        {details.gallery.length > 1 && <div className="pd-thumbnails">{details.gallery.map((image, index) => <button key={image.src} aria-label={`تصویر ${(index + 1).toLocaleString('fa-IR')}`} aria-pressed={index === imageIndex} onClick={() => setImageIndex(index)}><ProductImage src={image.src} alt={image.alt}/></button>)}</div>}
        {selectedImage.src && <p className="pd-image-note">تصویر همین مدل محصول • رنگ تصویر ممکن است با نمایشگر متفاوت باشد.</p>}
      </section>
      <section className="pd-summary" aria-labelledby="product-title">
        <div className="pd-eyebrow">ARENA PURE <span> / {categoryNames[product.category]}</span></div>
        <h1 id="product-title" tabIndex={-1}>{product.title}</h1>
        <p className="pd-english" dir="ltr">{product.englishName}</p>
        <div className="pd-availability">{product.inStock ? <><Check size={16}/> موجود در کاتالوگ</> : 'ناموجود'}</div>
        <div className="pd-highlights"><div><span>برند</span><strong>{product.brand}</strong></div><div><span>نوع محصول</span><strong>{details.type}</strong></div>{details.shade && <div><span>رنگ انتخاب‌شده</span><strong dir="auto">{details.shade}</strong></div>}</div>
        {details.variants.length > 0 && <fieldset className="pd-variants"><legend>انتخاب رنگ <span>— {details.shade}</span></legend><div>{details.variants.map(variant => { const item = getProductDetails(variant); return <a key={variant.id} href={productUrl(variant)} className={variant.id === product.id ? 'is-selected' : ''} aria-current={variant.id === product.id ? 'page' : undefined}><i style={{ background: item.color }} aria-hidden="true"/><span dir="ltr">{item.shade}</span>{variant.id === product.id && <Check size={14}/>}</a>; })}</div><small>نمونه رنگ‌ها تقریبی است؛ عکس رنگ انتخاب‌شده را بررسی کنید.</small></fieldset>}
        <div className="pd-purchase"><div className="pd-price"><div>{product.oldPrice > product.price && <del>{formatPrice(product.oldPrice)}</del>}{product.discountPercent > 0 && <span>{product.discountPercent.toLocaleString('fa-IR')}٪ تخفیف</span>}</div><strong>{formatPrice(product.price)} <small>تومان</small></strong></div><p className="pd-demo">قیمت‌ها نمایشی هستند؛ فروش و پرداخت آنلاین هنوز فعال نیست.</p>
          <div className="pd-buy-row"><div className="pd-quantity" aria-label="تعداد محصول"><button disabled={!product.inStock || quantity >= 99} onClick={() => setQuantity(q => Math.min(99, q + 1))} aria-label="افزایش تعداد"><Plus size={17}/></button><output aria-live="polite">{quantity.toLocaleString('fa-IR')}</output><button disabled={quantity === 1} onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="کاهش تعداد"><Minus size={17}/></button></div><button className="pd-buy" disabled={!product.inStock} onClick={add}><ShoppingBag size={19}/>{product.inStock ? 'افزودن به سبد خرید' : 'ناموجود'}</button></div>
          <p className="pd-shipping">هزینه ارسال در سبد خرید محاسبه می‌شود.</p>
        </div>
        <a className="pd-spec-link" href="#product-specifications">مشاهده مشخصات کامل <ArrowLeft size={16}/></a>
      </section>
    </div>
    <nav className="pd-section-nav" aria-label="بخش‌های اطلاعات محصول"><a href="#product-introduction">معرفی محصول</a><a href="#product-specifications">مشخصات</a><a href="#product-questions">پرسش‌های متداول</a></nav>
    <div className="pd-information">
      <section id="product-introduction" className="pd-panel"><span className="pd-eyebrow">ABOUT THIS PRODUCT</span><h2>آشنایی با {details.model}</h2><p>{product.title} از برند {product.brand} در دسته {categoryNames[product.category]} قرار دارد.{details.shade ? ` این صفحه مربوط به رنگ ${details.shade} است؛ پیش از افزودن به سبد، نام و شماره رنگ را بررسی کنید.` : ' برای تطبیق نسخه محصول، نام کامل انگلیسی و مشخصات بسته‌بندی را بررسی کنید.'}</p><a className="pd-source" href={product.sourceUrl} target="_blank" rel="noopener noreferrer">منبع اطلاعات این محصول <ExternalLink size={15}/></a></section>
      <section id="product-specifications" className="pd-panel"><h2>مشخصات محصول</h2><dl className="pd-specs">{details.specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd dir="auto">{value}</dd></div>)}</dl><p className="pd-data-note">حجم، کشور سازنده و فهرست ترکیبات این موجودی هنوز ثبت نشده‌اند. این موارد باید با بسته‌بندی کالای عرضه‌شده تطبیق داده شوند.</p></section>
      <section className="pd-panel"><h2>روش مصرف و ترکیبات</h2><p>دستور مصرف، ترکیبات و هشدارهای درج‌شده روی بسته‌بندی همان محصول را مبنا قرار دهید. اطلاعات تأییدشده این بخش پس از بررسی بسته‌بندی اضافه می‌شود.</p></section>
      <section id="product-questions" className="pd-panel"><h2>پرسش‌های متداول</h2><details><summary>آیا محصول دریافتی همین رنگ است؟</summary><p>{details.shade ? `رنگ انتخاب‌شده در این صفحه ${details.shade} است و با همین نام به سبد اضافه می‌شود. نمایش رنگ روی نمایشگرها متفاوت است.` : 'این صفحه مربوط به مدل درج‌شده در عنوان است. مشخصات کامل نسخه را پیش از خرید بررسی کنید.'}</p></details><details><summary>از کجا ترکیبات دقیق را بررسی کنم؟</summary><p>برچسب ترکیبات روی بسته‌بندی نسخه عرضه‌شده مرجع اصلی است؛ فرمول‌ها ممکن است در بازارها یا زمان‌های مختلف تغییر کنند. لینک منبع محصول نیز در بخش معرفی قرار دارد.</p></details></section>
      <section className="pd-panel"><h2>دیدگاه خریداران</h2><p>هنوز دیدگاهی برای این محصول ثبت نشده است.</p></section>
    </div>
    {!!details.related.length && <section className="pd-related"><div><h2>انتخاب‌های دیگر برای شما</h2><a href="/#products">همه محصولات <ArrowLeft size={16}/></a></div><div className="pd-related-grid">{details.related.map(item => <ProductCard key={item.id} product={item} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlist={wishlist} onQuickView={onQuickView}/>)}</div></section>}
    <div className="pd-mobile-buy"><div><small>{details.shade || product.brand}</small><strong>{formatPrice(product.price)} <small>تومان</small></strong></div><button className="pd-buy" disabled={!product.inStock} onClick={add}><ShoppingBag size={18}/>{product.inStock ? `افزودن${quantity > 1 ? ` (${quantity.toLocaleString('fa-IR')})` : ''} به سبد` : 'ناموجود'}</button></div>
    <dialog ref={zoom} className="pd-zoom" onClick={event => { if (event.target === zoom.current) zoom.current.close(); }}><button className="pd-icon" autoFocus onClick={() => zoom.current.close()} aria-label="بستن تصویر"><X/></button><ProductImage src={selectedImage.src} alt={selectedImage.alt} sizes="90vw"/></dialog>
  </main>;
}
