import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Star, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { formatPrice } from '../data/mockData.js';

export default function ProductQuickView({ product, isOpen, onClose, onAddToCart, onToggleWishlist, isWishlisted }) {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedShade, setSelectedShade] = useState('شیک نود');

  const shades = ['شیک نود', 'صورتی کلاسیک', 'کالباسی مات', 'زرشکی مخملی'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-all">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 flex flex-col md:flex-row relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-purple-50/60 to-slate-50 p-6 flex flex-col items-center justify-center relative">
          {product.discountPercent && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {product.discountPercent}٪ تخفیف
            </span>
          )}

          <img
            src={product.image}
            alt={product.title}
            className="max-h-64 object-contain drop-shadow-md"
          />

          <div className="mt-4 flex items-center gap-2 text-xs text-purple-700 bg-white/80 px-3 py-1 rounded-full border border-purple-100 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ضمانت اصالت و سلامت فیزیکی</span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between text-right">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                {product.brand}
              </span>

              <button
                onClick={() => onToggleWishlist(product.id)}
                className="p-1.5 rounded-full hover:bg-purple-50 text-slate-400 hover:text-red-500 transition"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} />
              </button>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
              {product.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2 text-amber-500 text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.9'}</span>
              <span className="text-slate-400 font-normal mr-1">(نظر خریداران رضایتمند)</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">
                {formatPrice(product.price)} <span className="text-xs font-normal text-slate-500">تومان</span>
              </span>
              {product.oldPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              {product.description || 'فرمولاسیون درجه یک، ساخته شده با مرغوب‌ترین ترکیبات بدون حساسیت زایی، مناسب انواع پوست و ایجاد جلوه‌ای طبیعی و ماندگار.'}
            </p>

            {/* Shades selector */}
            <div className="mt-4">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                انتخاب شماره رنگ: <span className="text-purple-700">{selectedShade}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {shades.map((shade) => (
                  <button
                    key={shade}
                    onClick={() => setSelectedShade(shade)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                      selectedShade === shade
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-slate-200 text-slate-600 hover:border-purple-300'
                    }`}
                  >
                    {shade}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
            {/* Quantity */}
            <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-7 h-7 bg-white rounded-lg text-slate-700 font-bold hover:bg-purple-50 shadow-2xs"
              >
                +
              </button>
              <span className="w-8 text-center text-xs font-bold text-slate-800 font-mono">
                {quantity.toLocaleString('fa-IR')}
              </span>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-7 h-7 bg-white rounded-lg text-slate-700 font-bold hover:bg-purple-50 shadow-2xs"
              >
                -
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                onAddToCart({ ...product, quantity, selectedShade });
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 active:scale-95 transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>افزودن به سبد خرید</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
