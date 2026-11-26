import { products } from './catalog.js';
import { categoryPages } from './categories.js';

function applyCatalog(data) {
  if (!data || !Array.isArray(data.categories) || !Array.isArray(data.products) ||
      data.categories.some(item => !item || typeof item.slug !== 'string') ||
      data.products.some(item => !item || !Number.isInteger(item.id) || typeof item.slug !== 'string')) {
    throw new Error('Invalid catalog response');
  }

  products.splice(0, products.length, ...data.products);
  for (const slug of Object.keys(categoryPages)) delete categoryPages[slug];
  for (const { slug, ...category } of data.categories) {
    Object.defineProperty(categoryPages, slug, { value: category, enumerable: true, configurable: true, writable: true });
  }
}

const storageKey = (origin) => `arena-public-catalog-v1:${origin}`;
const maxAge = 24 * 60 * 60 * 1000;

export function restoreStorefrontCatalog(origin) {
  try {
    const entry = JSON.parse(localStorage.getItem(storageKey(origin)));
    const age = Date.now() - entry?.savedAt;
    if (!Number.isFinite(age) || age < 0 || age > maxAge) return false;
    applyCatalog(entry.data);
    return true;
  } catch {
    return false;
  }
}

export async function loadStorefrontCatalog(endpoint, signal, origin) {
  const response = await fetch(endpoint, { signal, credentials: 'omit' });
  if (!response.ok) throw new Error(`Catalog HTTP ${response.status}`);
  const data = await response.json();
  if (signal.aborted) throw signal.reason;
  applyCatalog(data);
  try {
    localStorage.setItem(storageKey(origin), JSON.stringify({ data, savedAt: Date.now() }));
  } catch {
    // A working connection still provides the live catalog if storage is unavailable.
  }
}
