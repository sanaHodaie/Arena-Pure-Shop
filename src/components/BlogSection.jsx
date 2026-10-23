import React from 'react';
import { User, ChevronLeft, Calendar, ArrowLeft } from 'lucide-react';
import { blogArticles } from '../data/mockData.js';

export default function BlogSection({ onArticleClick }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-6 bg-purple-600 rounded-full"></span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            خواندنی‌ها
          </h2>
        </div>
        <a 
          href="#blog" 
          className="text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition group"
        >
          <span>مشاهده همه</span>
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </a>
      </div>

      {/* 4 Article Cards Grid (Screenshot 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => onArticleClick && onArticleClick(article)}
            className="bg-white rounded-3xl border border-purple-100/70 p-4 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Thumbnail Image */}
              <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-purple-50 mb-3.5">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute bottom-2.5 right-2.5 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {article.date}
                </span>
              </div>

              {/* Author badge matching screenshot 4 */}
              <div className="flex items-center gap-1.5 text-xs text-purple-600 font-medium mb-2">
                <User className="w-3.5 h-3.5 text-purple-500" />
                <span className="font-mono text-[11px]">{article.author}</span>
              </div>

              {/* Article Title */}
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition line-clamp-2 leading-snug">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            {/* Read More Link */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:text-purple-800">
              <span>ادامه مطلب</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
