import React, { useState } from 'react';
import { motion } from 'motion/react';
import { toPersianDigits } from '../utils/formatters';

export function AnimatedDonutChart({ data = [] }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const activeIndex = data[activeIdx] ? activeIdx : null;
  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;

  const size = 180;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full min-w-0 overflow-hidden">
      {/* Donut SVG with Drawing Segment Animations */}
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center flex-shrink-0">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-slate-100 dark:text-slate-800"
            strokeWidth={strokeWidth}
          />

          {data.map((item, idx) => {
            const percent = (item.value / total) * 100;
            const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += percent;

            const isHovered = activeIdx === idx;

            return (
              <motion.circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.4, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
          <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-full">
            {activeIndex !== null ? data[activeIndex].name.split('(')[0] : 'کل دسته‌ها'}
          </span>
          <span className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white mt-0.5">
            {activeIndex !== null ? `${toPersianDigits(data[activeIndex].value)}` : `${toPersianDigits(total)}`}
          </span>
        </div>
      </div>

      {/* Legend with Interactive Hover */}
      <div className="flex flex-col gap-2 w-full min-w-0 flex-1">
        {data.map((item, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setActiveIdx(idx)}
            onMouseLeave={() => setActiveIdx(null)}
            className={`flex items-center justify-between p-1.5 px-2 rounded-xl transition-all cursor-pointer min-w-0 ${
              activeIdx === idx ? 'bg-purple-50 dark:bg-purple-950/40 translate-x-0.5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-300 truncate min-w-0">{item.name}</span>
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white tabular-nums flex-shrink-0 mr-1">
              {toPersianDigits(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Animated Bar Chart
