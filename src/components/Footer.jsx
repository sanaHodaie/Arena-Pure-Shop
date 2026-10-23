import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ChevronUp, 
  Instagram, 
  Send, 
  MessageCircle, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { siteConfig } from '../data/mockData.js';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      {/* Grand Rounded Purple Container (Screenshot 4) */}
      <div className="rounded-[2.5rem] bg-gradient-to-br from-[#531b93] via-[#6121ab] to-[#431475] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Row: Logo & Back to Top */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-purple-400/20">
          {/* Logo */}
          <div className="flex items-center gap-2 select-none">
            <span className="text-3xl font-extrabold tracking-tight text-white">
              Arena
            </span>
            <span className="text-base font-serif italic text-purple-200 -translate-y-2">
              Pure
            </span>
          </div>

          {/* Back to Top Button matching screenshot 4 */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 bg-white/10 hover:bg-white text-purple-100 hover:text-purple-900 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer backdrop-blur-xs"
          >
            <span>بازگشت به بالا</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        {/* Middle Content Columns (Screenshot 4) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 py-10">
          
          {/* About Text - 5 Columns */}
          <div className="md:col-span-5 text-right">
            <h4 className="text-base font-extrabold text-white mb-3">
              درباره فروشگاه تخصصی آرنا پیور
            </h4>
            <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed text-justify">
              {siteConfig.about}
            </p>

            {/* Social Media Links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-pink-600 text-white flex items-center justify-center transition shadow-xs"
                aria-label="اینستاگرام آرنا پیور"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-sky-500 text-white flex items-center justify-center transition shadow-xs"
                aria-label="تلگرام آرنا پیور"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-emerald-500 text-white flex items-center justify-center transition shadow-xs"
                aria-label="واتساپ آرنا پیور"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Access Column 1 - 2 Columns */}
          <div className="md:col-span-2 text-right">
            <h4 className="text-sm font-extrabold text-white mb-4">
              دسترسی سریع
            </h4>
            <ul className="space-y-2.5 text-xs text-purple-200">
              <li>
                <a href="#" className="hover:text-white transition">صفحه اصلی</a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition">فروشگاه</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">درباره ما</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">ارتباط با ما</a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white transition">وبلاگ</a>
              </li>
            </ul>
          </div>

          {/* Quick Access Column 2 - 2 Columns */}
          <div className="md:col-span-2 text-right">
            <h4 className="text-sm font-extrabold text-white mb-4">
              راهنمای مشتریان
            </h4>
            <ul className="space-y-2.5 text-xs text-purple-200">
              <li>
                <a href="#" className="hover:text-white transition">رویه ارسال سفارش</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">شیوه‌های پرداخت</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">قوانین بازگرداندن کالا</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">پرسش‌های متداول</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">حریم خصوصی</a>
              </li>
            </ul>
          </div>

          {/* Contact & Address Column - 3 Columns */}
          <div id="contact" className="md:col-span-3 text-right">
            <h4 className="text-sm font-extrabold text-white mb-4">
              راه‌های ارتباطی
            </h4>
            <div className="space-y-3 text-xs text-purple-100">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-purple-300 block text-[11px]">تلفن ثابت:</span>
                  <a href={`tel:${siteConfig.phone}`} className="hover:text-white font-mono dir-ltr block text-right font-semibold">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-purple-300 block text-[11px]">ایمیل پشتیبانی:</span>
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-white font-mono dir-ltr block text-right">
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-purple-300 block text-[11px]">آدرس فروشگاه:</span>
                  <span className="leading-relaxed text-purple-100">
                    {siteConfig.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Badges matching screenshot 4 (E-namad & Samandehi) */}
            <div className="mt-6 flex items-center gap-3">
              <div className="bg-white rounded-2xl p-2 w-16 h-18 flex flex-col items-center justify-center text-slate-800 shadow-sm border border-purple-200">
                <ShieldCheck className="w-7 h-7 text-blue-600" />
                <span className="text-[8px] font-bold mt-1 text-slate-700">اینماد ۵ ستاره</span>
                <span className="text-[6px] text-amber-500">★★★★★</span>
              </div>
              <div className="bg-white rounded-2xl p-2 w-16 h-18 flex flex-col items-center justify-center text-slate-800 shadow-sm border border-purple-200">
                <Award className="w-7 h-7 text-amber-500" />
                <span className="text-[8px] font-bold mt-1 text-slate-700">ساماندهی</span>
                <span className="text-[7px] text-emerald-600 font-bold">تایید شده</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Copyright matching screenshot 4 */}
        <div className="relative z-10 pt-6 mt-2 border-t border-purple-400/20 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-200 gap-3">
          <p>© ۲۰۲۵ | کلیه حقوق برای فروشگاه آرنا پیور (arenapure.com) محفوظ است.</p>
          <p className="text-[11px] text-purple-300">طراحی اختصاصی با هویت بصری آرنا پیور</p>
        </div>

      </div>
    </footer>
  );
}
