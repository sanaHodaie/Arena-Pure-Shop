import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../data/mockData.js';

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onCheckout }) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 500000;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-700 text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">سبد خرید شما</h3>
              <span className="text-xs text-slate-500">
                {cart.length > 0 ? `${cart.length} قلم کالا` : 'سبد شما خالی است'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-purple-50/70 border-b border-purple-100 text-xs">
          {remainingForFreeShipping > 0 ? (
            <div>
              <p className="text-purple-800 font-semibold mb-1.5">
                فقط <span className="font-bold font-mono text-purple-950">{formatPrice(remainingForFreeShipping)}</span> تومان دیگر تا <span className="text-emerald-700 font-bold">ارسال کاملاً رایگان!</span>
              </p>
              <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-700 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressToFreeShipping}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <p className="text-emerald-700 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              تبریک! سفارش شما مشمول ارسال رایگان شد.
            </p>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-4 text-purple-300">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h4 className="text-base font-bold text-slate-700 mb-1">سبد خرید شما خالی است</h4>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                می‌توانید با مراجعه به دسته‌بندی‌ها و پیشنهادهای شگفت‌انگیز، محصولات مورد نظر خود را اضافه کنید.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition"
              >
                مشاهده محصولات
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-purple-200 bg-white transition shadow-2xs"
              >
                {/* Item Thumbnail */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-contain rounded-xl bg-slate-50 p-1 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-purple-600 font-bold block">{item.brand}</span>
                  <h4 className="text-xs font-bold text-slate-800 truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">
                      {formatPrice(item.price * item.quantity)} <span className="text-[10px] text-slate-500 font-normal">تومان</span>
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-white hover:bg-purple-50 text-slate-700 flex items-center justify-center shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-800 w-5 text-center font-mono">
                        {item.quantity.toLocaleString('fa-IR')}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 rounded-md bg-white hover:bg-purple-50 text-slate-700 flex items-center justify-center shadow-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                  title="حذف از سبد"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>مبلغ کالاها:</span>
              <span className="font-bold text-slate-800">{formatPrice(subtotal)} تومان</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>هزینه ارسال:</span>
              <span className="font-bold text-emerald-600">
                {subtotal >= freeShippingThreshold ? 'رایگان' : '۳۵,۰۰۰ تومان'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-extrabold text-slate-900">
              <span>مبلغ کل قابل پرداخت:</span>
              <span className="text-base text-purple-700">
                {formatPrice(subtotal + (subtotal >= freeShippingThreshold ? 0 : 35000))} تومان
              </span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full mt-3 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition active:scale-95 cursor-pointer"
            >
              <span>تکمیل خرید و ثبت نهایی</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
