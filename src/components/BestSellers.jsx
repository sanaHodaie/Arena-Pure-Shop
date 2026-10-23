import React from 'react';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { bestSellerProducts } from '../data/mockData.js';
import ProductCard from './ProductCard.jsx';
import { searchProducts } from '../data/productSearch.js';
export default function BestSellers({onAddToCart,onToggleWishlist,wishlist=[],onQuickView,selectedCategory,searchTerm='',onClearCategory}) {
 const filterCategory = selectedCategory && !['weekly-deals','brands'].includes(selectedCategory) ? selectedCategory : null;
 const products=searchProducts(bestSellerProducts,searchTerm).filter(p=>!filterCategory||p.category===filterCategory);
 return <section id="products" className="arena-container beauty-bestsellers"><div className="beauty-section-heading"><div><span className="beauty-eyebrow">انتخاب‌های محبوب شما</span><h2>پرفروش‌ترین‌های این ماه</h2></div><button className="beauty-view-all" onClick={onClearCategory}>مشاهده همه <ChevronLeft size={15}/></button></div>{filterCategory&&<div className="beauty-filter-status"><SlidersHorizontal size={15}/><span>{products.length.toLocaleString('fa-IR')} محصول در این دسته</span><button onClick={onClearCategory}>حذف فیلتر ×</button></div>}<div className="beauty-product-grid">{products.map(product=><ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlist={wishlist} onQuickView={onQuickView}/>)}</div>{!products.length&&<div className="beauty-empty"><p>محصولی با این مشخصات پیدا نشد.</p><button onClick={onClearCategory}>نمایش همه دسته‌ها</button></div>}</section>;
}
