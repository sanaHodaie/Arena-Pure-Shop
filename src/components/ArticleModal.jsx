import React from 'react';
import { X, Calendar, User, Clock, Share2 } from 'lucide-react';

export default function ArticleModal({ article, isOpen, onClose }) {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 max-h-[90vh] flex flex-col text-right relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-60 w-full overflow-hidden bg-purple-100 shrink-0">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 right-4 left-4 text-white">
            <div className="flex items-center gap-3 text-xs text-purple-200 mb-1.5">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {article.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black leading-snug">
              {article.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-sm leading-relaxed">
          <p className="font-semibold text-purple-900 bg-purple-50 p-4 rounded-2xl border border-purple-100">
            {article.excerpt}
          </p>

          <h3 className="text-base font-bold text-slate-900 mt-4">نکات کلیدی برای انتخاب و استفاده بهینه</h3>
          <p>
            انتخاب محصول آرایشی یا مراقبتی مناسب نیازمند شناخت دقیق نوع پوست و مواد اولیه به کار رفته در فرمولاسیون است. محصولات اصل و مورد تایید سازمان غذا و دارو همواره از پایه‌های مغذی و پیگمنت‌های بهداشتی استفاده می‌کنند تا از هرگونه التهاب یا بسته شدن منافذ پوست جلوگیری شود.
          </p>
          <p>
            توصیه کارشناسان آرنا پیور این است که قبل از استفاده روزانه از هرگونه پنکک یا سرم پوستی، روتین پاکسازی و آبرسانی پایه را با محصولات متناسب با تایپ پوستی خود تکمیل نمایید.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">منبع: تحریریه آرنا پیور</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition"
          >
            بستن مقاله
          </button>
        </div>
      </div>
    </div>
  );
}
