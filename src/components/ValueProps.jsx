import React from 'react';
import { RotateCcw, ShieldCheck, Headphones, Truck } from 'lucide-react';
import { valueProps } from '../data/mockData.js';

export default function ValueProps() {
  const getIcon = (id) => {
    switch (id) {
      case 1:
        return <Truck className="w-8 h-8 text-purple-700" />;
      case 2:
        return <Headphones className="w-8 h-8 text-purple-700" />;
      case 3:
        return <ShieldCheck className="w-8 h-8 text-purple-700" />;
      case 4:
        return <RotateCcw className="w-8 h-8 text-purple-700" />;
      default:
        return <ShieldCheck className="w-8 h-8 text-purple-700" />;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {valueProps.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1"
          >
            {/* Outline Circular Icon Badge (as in screenshot 3) */}
            <div className="w-16 h-16 rounded-2xl bg-purple-50 group-hover:bg-purple-100 border border-purple-200/60 flex items-center justify-center transition-colors mb-4">
              {getIcon(item.id)}
            </div>

            {/* Title */}
            <h4 className="text-base font-extrabold text-slate-800 mb-2 group-hover:text-purple-700 transition-colors">
              {item.title}
            </h4>

            {/* Description matching screenshot 3 exactly */}
            <p className="text-xs text-slate-500 leading-relaxed max-w-[240px]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
