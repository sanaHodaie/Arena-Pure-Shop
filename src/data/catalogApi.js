import { products } from './catalog.js';
import { categoryPages } from './categories.js';

export async function loadStorefrontCatalog(endpoint, signal) {
  const response = await fetch(endpoint, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error(`Catalog HTTP ${response.status}`);

  const data = await response.json();
  if (!Array.isArray(data.categories) || !Array.isArray(data.products) ||
      data.categories.some(item => typeof item.slug !== 'string') ||
      data.products.some(item => !Number.isInteger(item.id) || typeof item.slug !== 'string')) {
    throw new Error('Invalid catalog response');
  }

  products.splice(0, products.length, ...data.products);
  for (const slug of Object.keys(categoryPages)) delete categoryPages[slug];
  for (const { slug, ...category } of data.categories) {
    Object.defineProperty(categoryPages, slug, { value: category, enumerable: true, configurable: true, writable: true });
  }
}
