import React from 'react';
import { brands } from '../data/mockData.js';

export default function BrandLogos() {
  return (
    <section id="brands" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2.5 h-6 bg-purple-600 rounded-full"></span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          برندهای برتر
        </h2>
      </div>

      {/* Brand Logos Bar (Screenshots 3 & 4) */}
      <div className="bg-white rounded-3xl border border-purple-100/80 p-6 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-6 items-center justify-items-center">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex flex-col items-center justify-center p-3 w-full rounded-2xl hover:bg-purple-50/60 transition group cursor-pointer"
            >
              {/* Brand Typography Logo Matching Screenshots */}
              <div className="h-10 flex items-center justify-center">
                {brand.id === 'cerita' && (
                  <span className="text-xl font-bold tracking-widest text-slate-500 group-hover:text-purple-700 transition font-sans">
                    CERITA
                  </span>
                )}
                {brand.id === 'fulica' && (
                  <span className="text-lg font-black tracking-wider text-slate-500 group-hover:text-purple-700 transition uppercase">
                    FULICA
                  </span>
                )}
                {brand.id === 'farmasi' && (
                  <div className="flex items-center gap-1 text-slate-500 group-hover:text-red-600 transition">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-base font-bold tracking-wider">FARMASI</span>
                  </div>
                )}
                {brand.id === 'dmi' && (
                  <div className="w-12 h-8 border-2 border-slate-400 group-hover:border-purple-700 rounded-lg flex items-center justify-center font-black text-slate-600 group-hover:text-purple-700 transition">
                    DMI
                  </div>
                )}
                {brand.id === 'active' && (
                  <span className="text-xl font-extrabold italic text-slate-600 group-hover:text-blue-600 transition">
                    Active
                  </span>
                )}
                {brand.id === 'lafarrerr' && (
                  <span className="text-base font-medium tracking-tight text-slate-600 group-hover:text-purple-800 transition font-serif">
                    Lá farrerr
                  </span>
                )}
                {brand.id === 'voche' && (
                  <span className="text-lg font-bold text-slate-500 group-hover:text-emerald-700 transition">
                    Voché
                  </span>
                )}
              </div>

              {/* Persian Brand Subtitle */}
              <span className="text-[11px] text-slate-400 group-hover:text-purple-600 transition mt-1 font-medium">
                {brand.persianName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
