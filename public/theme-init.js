// Apply the saved/system theme before the page paints.
(() => {
  let saved;
  try { saved = localStorage.getItem('arena-theme'); } catch {}
  const theme = saved === 'light' || saved === 'dark' ? saved : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
