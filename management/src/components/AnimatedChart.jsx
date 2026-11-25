import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { number } from './ManagementUI';

export function AnimatedDonutChart({ data = [] }) {
  const [active, setActive] = useState(null);
  const reduced = useReducedMotion();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const focused = data.find((item) => item.name === active);
  const radius = 76;
  const circle = 2 * Math.PI * radius;
  let offset = 0;

  return <div className="grid items-center gap-6 sm:grid-cols-[minmax(142px,1fr)_minmax(0,1fr)]">
    <div className="relative mx-auto aspect-square w-full max-w-52">
      <motion.svg viewBox="0 0 200 200" role="img" aria-label="نسبت محصولات فعال به تفکیک دسته"
        initial={reduced ? false : { opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0 : .4 }}>
        <circle cx="100" cy="100" r={radius} fill="none" stroke="currentColor" className="text-pearl-100 dark:text-pearl-800" strokeWidth="20" />
        {data.map((item) => {
          const length = circle * item.value / total;
          const start = offset;
          offset += length;
          const gap = data.length > 1 ? Math.min(5, length * .2) : 0;
          return <circle key={item.name} cx="100" cy="100" r={radius} fill="none" stroke={item.color}
            strokeWidth={active === item.name ? 26 : 20} strokeDasharray={`${Math.max(0, length - gap)} ${circle}`}
            strokeDashoffset={-start} transform="rotate(-90 100 100)"
            opacity={active && active !== item.name ? .35 : 1}
            className="origin-center transition-opacity motion-reduce:transition-none"
            onPointerEnter={() => setActive(item.name)} onPointerLeave={() => setActive(null)}>
            <title>{item.name} · {number(item.value)}</title>
          </circle>;
        })}
      </motion.svg>
      <div className="pointer-events-none absolute inset-0 grid place-content-center gap-1 text-center">
        <span className="text-xs text-pearl-600 dark:text-pearl-300">{focused?.name || 'کل محصولات فعال'}</span>
        <strong className="text-2xl">{number(focused?.value ?? total)}</strong>
      </div>
    </div>
    <div className="grid gap-1.5">
      {data.map((item) => <button type="button" key={item.name} aria-pressed={active === item.name}
        onPointerEnter={() => setActive(item.name)} onPointerLeave={() => setActive(null)}
        onFocus={() => setActive(item.name)} onBlur={() => setActive(null)}
        onClick={() => setActive(active === item.name ? null : item.name)}
        className="flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs hover:bg-pearl-100 dark:hover:bg-pearl-800">
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: item.color }} />{item.name}</span>
        <span className="shrink-0 font-bold">{number(Math.round(item.value / total * 100))}٪</span>
      </button>)}
    </div>
  </div>;
}
