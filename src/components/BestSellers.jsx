import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, ChevronLeft, Sparkles } from 'lucide-react';
import { bestSellerProducts, formatPrice } from '../data/mockData.js';

export default function BestSellers({ onAddToCart, onToggleWishlist, wishlist = [], onQuickView, selectedCategory }) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'همه محصولات' },
    { id: 'cosmetics', label: 'آرایشی' },
    { id: 'skincare', label: 'مراقبت پوست' },
    { id: 'haircare', label: 'مراقبت مو' },
  ];

  const filteredProducts = bestSellerProducts.filter(product => {
    if (selectedCategory && selectedCategory !== 'weekly-deals' && selectedCategory !== 'brands') {
      return product.category === selectedCategory;
    }
    if (activeTab === 'all') return true;
    return product.category === activeTab;
  });

  return (
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-purple-600 rounded-full"></span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              پرفروش‌ترین‌های این ماه
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 mr-4">
            محبوب‌ترین انتخاب‌های خریداران آرنا پیور با بالاترین رضایت مشتریان
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 bg-[#f4effa] p-1 rounded-2xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Column Product Grid (Screenshot 2) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => {
          const isWishlisted = wishlist.includes(product.id);
          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-100 hover:border-purple-200 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative"
            >
              {/* Top: Wishlist + Badge */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="p-1.5 rounded-full bg-slate-50 hover:bg-purple-50 text-slate-400 hover:text-red-500 transition cursor-pointer"
                  aria-label="افزودن به علاقه‌مندی‌ها"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} />
                </button>
                {product.badge && (
                  <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product Image */}
              <div 
                onClick={() => onQuickView(product)}
                className="relative w-full h-44 sm:h-48 flex items-center justify-center cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-b from-purple-50/30 to-slate-50/50 p-4"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Hover Quick View Overlay */}
                <div className="absolute inset-0 bg-purple-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-purple-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    مشاهده جزئیات
                  </span>
                </div>
              </div>

              {/* Brand & Title */}
              <div className="mt-3 text-right">
                <span className="text-[11px] text-purple-600 font-bold block mb-1">
                  {product.brand}
                </span>
                <h3 
                  onClick={() => onQuickView(product)}
                  className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 hover:text-purple-700 transition cursor-pointer min-h-[40px] leading-relaxed"
                  title={product.title}
                >
                  {product.title}
                </h3>
              </div>

              {/* Price & Add to Cart Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-right">
                  {product.oldPrice && (
                    <span className="text-[11px] text-slate-400 line-through block">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                  <span className="text-sm sm:text-base font-extrabold text-slate-900">
                    {formatPrice(product.price)} <span className="text-xs font-normal text-slate-500">تومان</span>
                  </span>
                </div>

                <button
                  onClick={() => onAddToCart(product)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-700 hover:text-white transition shadow-xs active:scale-95 cursor-pointer text-xs font-semibold"
                  title="افزودن به سبد خرید"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">خرید</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
