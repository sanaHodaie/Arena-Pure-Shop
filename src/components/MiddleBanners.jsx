import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function MiddleBanners({ onShopClick }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Banner 1: Cosmetics & Makeup (Screenshot 3) */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ebdffc] via-[#f7f2fe] to-[#dfcefa] p-7 sm:p-9 shadow-sm border border-purple-100 flex flex-col justify-between min-h-[240px] sm:min-h-[260px] group hover:shadow-md transition-all">
          
          {/* Subtle Ambient Background */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-200/40 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-[60%]">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-white/70 px-2.5 py-1 rounded-full mb-3 shadow-2xs">
              <Sparkles className="w-3 h-3" />
              کالکشن آرایش مات
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
              زیبایی بی‌ پایان
              <br />
              <span className="text-purple-700">که لایقش هستی!</span>
            </h3>
            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
              پوشش ابریشمی و یکدست با سازگاری کامل برای پوست‌های حساس
            </p>

            <div className="mt-5">
              <button
                onClick={onShopClick}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition active:scale-95 cursor-pointer"
              >
                <span>خرید</span>
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>
          </div>

          {/* 3D Scene Mock: Compact Powder & Liquid Foundation on 3D Pedestal */}
          <div className="absolute bottom-2 left-2 sm:left-4 w-44 sm:w-52 h-44 sm:h-52 flex items-center justify-center pointer-events-none">
            {/* 3D Purple Block */}
            <div className="absolute bottom-4 left-4 w-32 h-20 bg-gradient-to-tr from-purple-800 to-purple-600 rounded-2xl shadow-lg transform -skew-y-6"></div>
            
            {/* White Sphere */}
            <div className="absolute top-4 right-6 w-9 h-9 rounded-full bg-gradient-to-br from-white via-purple-50 to-purple-200 shadow-md"></div>
            
            {/* Compact Powder Cushion */}
            <div className="absolute top-2 left-8 w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 p-2 shadow-xl border-2 border-white flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-amber-200 to-amber-400 shadow-inner flex items-center justify-center">
                <span className="text-[7px] font-bold text-amber-900 tracking-wider">MATTE POWDER</span>
              </div>
            </div>

            {/* Foundation Bottle */}
            <div className="absolute bottom-6 left-2 w-12 h-24 bg-gradient-to-t from-slate-900 to-slate-800 rounded-xl shadow-2xl border border-slate-700 flex flex-col items-center justify-between p-1.5 transform rotate-6">
              <div className="w-8 h-4 bg-gradient-to-r from-amber-300 to-amber-500 rounded-t-sm"></div>
              <span className="text-[6px] text-amber-200 font-bold uppercase tracking-widest">L'OREAL</span>
              <div className="w-full h-8 bg-amber-100/20 rounded-sm"></div>
            </div>

            {/* Feather */}
            <div className="absolute top-0 right-12 w-14 h-8 text-purple-300/70 transform -rotate-12">
              <svg viewBox="0 0 100 40" fill="currentColor">
                <path d="M0,20 Q50,0 100,20 Q50,40 0,20 Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Banner 2: Skin Freshness & Hygiene (Screenshot 3) */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ebdffc] via-[#f7f2fe] to-[#dfcefa] p-7 sm:p-9 shadow-sm border border-purple-100 flex flex-col justify-between min-h-[240px] sm:min-h-[260px] group hover:shadow-md transition-all">
          
          {/* Subtle Ambient Background */}
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-pink-200/40 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-[60%]">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-white/70 px-2.5 py-1 rounded-full mb-3 shadow-2xs">
              <Sparkles className="w-3 h-3" />
              مراقبت روزانه پوست
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
              طراوت و تازگی
              <br />
              <span className="text-purple-700">بهداشت و طراوت در کنار هم</span>
            </h3>
            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
              تسکین‌بخش، آبرسان عمقی و ضد پیری زودرس برای انواع پوست
            </p>

            <div className="mt-5">
              <button
                onClick={onShopClick}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition active:scale-95 cursor-pointer"
              >
                <span>خرید</span>
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>
          </div>

          {/* 3D Scene Mock: Creams, Roll-on, Lotions on 3D Pedestal */}
          <div className="absolute bottom-2 left-2 sm:left-4 w-44 sm:w-52 h-44 sm:h-52 flex items-center justify-center pointer-events-none">
            {/* 3D Purple Blocks */}
            <div className="absolute bottom-4 left-6 w-28 h-20 bg-gradient-to-tr from-purple-800 to-purple-600 rounded-2xl shadow-lg transform -skew-y-3"></div>
            
            {/* White Sphere */}
            <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-gradient-to-br from-white via-purple-50 to-purple-200 shadow-md"></div>
            
            {/* Clean White Lotion Tube */}
            <div className="absolute top-4 left-10 w-12 h-26 bg-gradient-to-t from-slate-100 via-white to-slate-50 rounded-xl shadow-xl border border-white flex flex-col items-center justify-between p-1.5 transform rotate-12">
              <div className="w-8 h-3 bg-purple-500 rounded-t-sm"></div>
              <span className="text-[6px] font-bold text-purple-900 uppercase">CERAVE</span>
              <div className="w-full h-8 bg-purple-100/40 rounded-sm"></div>
            </div>

            {/* Roll-on Deodorant */}
            <div className="absolute bottom-6 left-24 w-10 h-16 bg-white rounded-full shadow-lg border border-purple-200 flex flex-col items-center justify-center p-1">
              <div className="w-7 h-7 rounded-full bg-purple-200/80 mb-1"></div>
              <span className="text-[5px] font-bold text-slate-700">ACTIVE</span>
            </div>

            {/* Floating Soft Sphere */}
            <div className="absolute top-2 right-4 w-6 h-6 rounded-full bg-gradient-to-br from-white to-pink-200 shadow-sm"></div>
          </div>

        </div>

      </div>
    </section>
  );
}
