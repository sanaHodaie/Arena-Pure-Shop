export function normalizeSearch(value = '') {
  return value.toLowerCase().normalize('NFKC')
    .replace(/[يى]/g, 'ی').replace(/ك/g, 'ک')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/[\u200c\u200d\s]+/g, ' ').trim();
}

export function searchProducts(products, query) {
  const normalized = normalizeSearch(query);
  if (!normalized) return products;
  const words = normalized.split(' ');
  return products.filter(product => {
    const text = normalizeSearch(`${product.title} ${product.englishName || ''} ${product.brand}`);
    return words.every(word => text.includes(word));
  });
}
