import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const controls = 'button, a[href], input:not([type=hidden]), select, textarea, summary, [role=option], [data-tooltip]';

function controlAt(node) {
  const control = node instanceof Element && node.closest(controls);
  return control && !control.matches(':disabled') ? control : null;
}

function tooltipText(control) {
  const label = control.getAttribute('data-tooltip') || control.getAttribute('aria-label');
  if (label) return label.trim();
  const labelledBy = control.getAttribute('aria-labelledby');
  if (labelledBy) return labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' ').trim();
  if (control.labels?.length) {
    const copy = control.labels[0].cloneNode(true);
    copy.querySelectorAll('input,select,textarea,button,small,img,svg').forEach((element) => element.remove());
    return copy.textContent.replace(/\s+/g, ' ').trim();
  }
  return (control.placeholder || control.textContent).replace(/\s+/g, ' ').trim();
}

export default function AdminTooltips() {
  const [tip, setTip] = useState(null);
  const floating = useRef(null);
  const id = useId();

  useEffect(() => {
    let timer;
    let active;

    function clear() {
      window.clearTimeout(timer);
      active = null;
      setTip(null);
    }

    function show(control) {
      if (!control || control === active) return;
      clear();
      const text = tooltipText(control);
      if (!text) return;
      active = control;
      timer = window.setTimeout(() => {
        if (active === control && control.isConnected) setTip({ control, text });
      }, 350);
    }

    function onPointerOver(event) {
      if (event.pointerType !== 'touch') show(controlAt(event.target));
    }

    function onPointerOut(event) {
      if (active && active.contains(event.target) && !active.contains(event.relatedTarget)) clear();
    }

    function onFocus(event) {
      if (event.target.matches(':focus-visible')) show(controlAt(event.target));
    }

    function onKey(event) {
      if (event.key === 'Escape') clear();
    }

    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', clear);
    document.addEventListener('pointerdown', clear);
    document.addEventListener('keydown', onKey);
    document.addEventListener('scroll', clear, true);
    window.addEventListener('resize', clear);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', clear);
      document.removeEventListener('pointerdown', clear);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('scroll', clear, true);
      window.removeEventListener('resize', clear);
    };
  }, []);

  useLayoutEffect(() => {
    if (!tip || !floating.current) return;
    const anchor = tip.control.getBoundingClientRect();
    const node = floating.current;
    const { width, height } = node.getBoundingClientRect();
    const center = anchor.left + anchor.width / 2;
    node.style.left = Math.max(8, Math.min(center - width / 2, window.innerWidth - width - 8)) + 'px';
    node.style.top = (anchor.top > height + 16
      ? anchor.top - height - 8
      : Math.min(anchor.bottom + 8, window.innerHeight - height - 8)) + 'px';

    const previous = tip.control.getAttribute('aria-describedby');
    tip.control.setAttribute('aria-describedby', [previous, id].filter(Boolean).join(' '));
    return () => {
      if (previous) tip.control.setAttribute('aria-describedby', previous);
      else tip.control.removeAttribute('aria-describedby');
    };
  }, [tip, id]);

  if (!tip?.control.isConnected) return null;
  const layer = tip.control.closest('dialog[open]') || document.body;
  return createPortal(<span id={id} ref={floating} className="admin-tooltip" role="tooltip" dir="rtl">{tip.text}</span>, layer);
}
