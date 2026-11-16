import React from 'react';
import { Heart, Plus } from 'lucide-react';
import { formatPrice } from '../data/mockData.js';
import { productUrl } from '../data/productDetails.js';
import ProductImage from './ProductImage.jsx';
export default function ProductCard({ product, onAddToCart, onToggleWishlist, wishlist = [] }) {
  const wished = wishlist.includes(product.id);
  return <article className="beauty-card">
    <div className="beauty-card-visual">
      {product.discountPercent > 0 && <span className="beauty-discount">{product.discountPercent.toLocaleString('fa-IR')}٪ تخفیف</span>}
      <button className={`beauty-wishlist ${wished ? 'is-saved' : ''}`} onClick={() => onToggleWishlist(product.id)} aria-label={`علاقه‌مندی: ${product.title}`} aria-pressed={wished}><Heart size={19} strokeWidth={1.4} fill={wished ? 'currentColor' : 'none'}/></button>
      <a className="beauty-image-button" href={productUrl(product)} aria-label={`مشاهده ${product.title}`}><ProductImage src={product.image} alt={product.title} loading="lazy"/></a>
    </div>
    <div className="beauty-card-details"><span className="beauty-brand">{product.brand}</span><h3><a href={productUrl(product)}>{product.title}</a></h3><p className="beauty-english" dir="ltr">{product.englishName}</p><div className="beauty-card-footer"><div className="beauty-price">{product.oldPrice > product.price && <del>{formatPrice(product.oldPrice)}</del>}<strong>{formatPrice(product.price)} <small>تومان</small></strong></div><button className="beauty-add" onClick={() => onAddToCart(product)} aria-label={`افزودن ${product.title} به سبد خرید`}><Plus size={19}/><span>افزودن</span></button></div></div>
  </article>;
}
