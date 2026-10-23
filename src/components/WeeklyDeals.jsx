import React from 'react';
import { Heart, ShoppingBag, Eye, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { specialOfferProducts, formatPrice } from '../data/mockData.js';

export default function WeeklyDeals({ onAddToCart, onToggleWishlist, wishlist = [], onQuickView }) {
  const scrollDeals = (dir) => {
    const el = document.getElementById('weekly-deals-slider');
    if (el) {
      el.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-[2.5rem] bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-950 p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-2xl backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                پیشنهاد هفته
              </h3>
              <p className="text-xs text-purple-200 mt-0.5">
                منتخب کارشناسان زیبایی آرنا پیور با قیمت‌های باورنکردنی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollDeals('right')}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              aria-label="قبلی"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollDeals('left')}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              aria-label="بعدی"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Row (Screenshot 3) */}
        <div 
          id="weekly-deals-slider"
          className="relative z-10 flex items-stretch gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth"
        >
          {specialOfferProducts.slice().reverse().map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                className="w-[210px] sm:w-[230px] shrink-0 bg-white rounded-3xl p-4 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 text-slate-800 group"
              >
                {/* Wishlist toggle */}
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className="p-1.5 rounded-full bg-slate-50 hover:bg-purple-50 text-slate-400 hover:text-red-500 transition"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} />
                  </button>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                    {product.brand}
                  </span>
                </div>

                {/* Product Image */}
                <div 
                  onClick={() => onQuickView(product)}
                  className="relative w-full h-36 flex items-center justify-center cursor-pointer overflow-hidden rounded-2xl bg-slate-50 p-2"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-purple-900 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      مشاهده
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h4 
                  onClick={() => onQuickView(product)}
                  className="mt-3 text-xs font-bold text-slate-800 line-clamp-2 hover:text-purple-700 transition cursor-pointer min-h-[36px]"
                >
                  {product.title}
                </h4>

                {/* Price & Action */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {formatPrice(product.price)} <span className="text-[10px] font-normal text-slate-500">تومان</span>
                  </span>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="p-2 rounded-xl bg-purple-700 text-white hover:bg-purple-800 transition active:scale-95"
                    title="افزودن به سبد خرید"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
