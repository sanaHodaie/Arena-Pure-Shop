import { useEffect, useRef, useState } from 'react';

export default function useAutoScroll() {
  const rail = useRef(null);
  const section = useRef(null);
  const direction = useRef(-1);
  const resumeAfter = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const motionChanged = () => setReducedMotion(query.matches);
    const visibilityChanged = () => setHidden(document.hidden);
    query.addEventListener('change', motionChanged);
    document.addEventListener('visibilitychange', visibilityChanged);
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { threshold: 0.15 });
    observer.observe(section.current);
    return () => {
      query.removeEventListener('change', motionChanged);
      document.removeEventListener('visibilitychange', visibilityChanged);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (hovered || focused || hidden || !visible || reducedMotion) return;
    const timer = setInterval(() => {
      const element = rail.current;
      if (!element || performance.now() < resumeAfter.current) return;
      const max = element.scrollWidth - element.clientWidth;
      if (max < 2) return;
      const offset = Math.abs(element.scrollLeft);
      if (offset >= max - 2) direction.current = 1;
      else if (offset <= 2) direction.current = -1;
      const card = element.querySelector('.beauty-card');
      const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap || 0) : 260;
      element.scrollBy({ left: direction.current * step, behavior: 'smooth' });
    }, 1500);
    return () => clearInterval(timer);
  }, [hovered, focused, hidden, visible, reducedMotion]);

  const defer = () => { resumeAfter.current = performance.now() + 6000; };
  const scroll = amount => {
    defer();
    rail.current?.scrollBy({ left: amount, behavior: reducedMotion ? 'instant' : 'smooth' });
  };
  return {
    rail, section, scroll,
    interactionProps: {
      onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true),
      onBlurCapture: event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); },
      onTouchStart: defer, onTouchMove: defer, onTouchEnd: defer, onWheel: defer,
    },
  };
}
