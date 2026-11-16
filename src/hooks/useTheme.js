import { useEffect, useState } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const systemChanged = () => {
      try { if (localStorage.getItem('arena-theme')) return; } catch {}
      setTheme(query.matches ? 'dark' : 'light');
    };
    const storageChanged = event => {
      if (event.key === 'arena-theme') setTheme(event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : query.matches ? 'dark' : 'light');
    };
    query.addEventListener('change', systemChanged);
    window.addEventListener('storage', storageChanged);
    return () => { query.removeEventListener('change', systemChanged); window.removeEventListener('storage', storageChanged); };
  }, []);
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('arena-theme', next); } catch {}
    setTheme(next);
  };
  return { theme, toggleTheme };
}
