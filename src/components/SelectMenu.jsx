import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import './SelectMenu.css';

export default function SelectMenu({ value, onChange, options, label, Icon }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const trigger = useRef(null);
  const items = useRef([]);
  const id = useId();
  const selected = options.findIndex(option => option.value === value);
  useEffect(() => {
    if (!open) return;
    items.current[active]?.focus();
  }, [open, active]);
  useEffect(() => {
    const outside = event => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  const choose = option => { onChange(option.value); setOpen(false); trigger.current?.focus(); };
  const onKeyDown = event => {
    if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false); trigger.current?.focus(); }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (!open) { setActive(selected); setOpen(true); return; }
    setActive(index => event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length);
  };
  return <div className="select-menu" ref={root} onKeyDown={onKeyDown} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button ref={trigger} className="select-trigger" type="button" aria-label={`${label}: ${options[selected].label}`} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => { setActive(selected); setOpen(value => !value); }}><Icon size={17} aria-hidden="true"/><span><small>{label}</small>{options[selected].label}</span><ChevronDown size={16} className={open ? 'is-open' : ''}/></button>
    {open && <div id={id} className="select-options" role="listbox" aria-label={label}>{options.map((option, index) => <button type="button" role="option" tabIndex={-1} aria-selected={value === option.value} ref={element => { items.current[index] = element; }} key={option.value} onClick={() => choose(option)}>{option.label}{value === option.value && <Check size={16}/>}</button>)}</div>}
  </div>;
}
