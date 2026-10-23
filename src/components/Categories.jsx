import React from 'react';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { mainCategories } from '../data/mockData.js';

export default function Categories({ selectedCategory, onSelectCategory }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-6 bg-purple-600 rounded-full"></span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            دسته‌بندی‌ها
          </h2>
        </div>
        <a 
          href="#products" 
          className="text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition group"
        >
          <span>مشاهده همه</span>
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Categories Circles Carousel / Grid (Screenshot 2) */}
      <div className="flex items-center justify-start sm:justify-between gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar">
        {mainCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center shrink-0 group focus:outline-none cursor-pointer"
            >
              {/* Circular Graphic Container */}
              <div 
                className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1.5 transition-all duration-300 ${
                  isSelected 
                    ? 'ring-4 ring-purple-600 ring-offset-2 scale-105' 
                    : 'group-hover:scale-105 group-hover:shadow-lg'
                }`}
              >
                {/* Purple gradient circle background */}
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-200 via-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden border border-purple-200 shadow-sm relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Subtle purple overlay for color consistency */}
                  <div className="absolute inset-0 bg-purple-900/15 group-hover:bg-purple-900/0 transition-colors"></div>
                </div>

                {/* Micro badge indicator */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-purple-100 whitespace-nowrap">
                  {cat.icon}
                </div>
              </div>

              {/* Title & Count */}
              <span className={`mt-3 text-xs sm:text-sm font-bold transition-colors ${
                isSelected ? 'text-purple-700' : 'text-slate-700 group-hover:text-purple-700'
              }`}>
                {cat.name}
              </span>
              <span className="text-[11px] text-slate-400">
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
