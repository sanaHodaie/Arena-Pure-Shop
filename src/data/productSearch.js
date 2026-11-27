import { categoryNames, productIdentity } from './productDetails.js';

export function normalizeSearch(value = '') {
  return value.toLowerCase().normalize('NFKC').replace(/\p{Script=Latin}\p{Mark}*/gu, letter => letter.normalize('NFD'))
    .replace(/[يى]/g, 'ی').replace(/ك/g, 'ک')
    .replace(/[\u064B-\u065F\u0670\u0640\u0300-\u036f]/g, '')
    .replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/['’]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

const aliases = [
  ['میبلین', 'می بی لین', 'مایبلین', 'maybelline'],
  ['اسکای های', 'اسکای های‌', 'سکای های', 'sky high', 'skyhigh'],
  ['نیکس', 'ان وای ایکس', 'nyx'],
  ['اوردینری', 'اردینری', 'اوردیناری', 'ordinary'],
  ['سراوی', 'سراوه', 'cerave'],
  ['لاروش پوزای', 'لا روش پوزای', 'la roche posay'],
  ['لورال', 'لورآل', 'loreal'],
  ['گارنیه', 'گارنیر', 'garnier'],
  ['لانکوم', 'lancome'],
  ['اسنس', 'essence'],
  ['کلینیک', 'clinique'],
  ['وینیل اینک', 'وینیل تینت', 'vinyl ink'],
  ['فیت می', 'fit me'],
  ['باتر گلاس', 'butter gloss'],
  ['ریمل', 'mascara'],
  ['رژ لب', 'lipstick'],
  ['ضدآفتاب', 'ضد آفتاب', 'sunscreen'],
].map(group => [...new Set(group.map(normalizeSearch))]);

function fields(product) {
  const info = productIdentity(product);
  return normalizeSearch([
    product.title, product.englishName, product.brand, product.slug, categoryNames[product.category],
    info.type, info.model, info.shade, info.undertone,
  ].join(' '));
}

function hasPhrase(text, phrase) {
  return (' ' + text + ' ').includes(' ' + phrase + ' ');
}

export function searchProducts(products, query) {
  const normalized = normalizeSearch(query);
  if (!normalized) return products;
  const words = normalized.split(' ');
  const matchingAliases = aliases.filter(group => group.some(alias => hasPhrase(normalized, alias)));
  return products.flatMap(product => {
    const text = fields(product);
    const supplemental = matchingAliases.filter(group => group.some(alias => hasPhrase(text, alias))).flat().join(' ');
    const combined = text + ' ' + supplemental;
    if (!words.every(word => /\d/.test(word) ? hasPhrase(combined, word) : combined.includes(word))) return [];
    const names = [product.title, product.englishName, product.brand].map(value => normalizeSearch(value || ''));
    const rank = names.includes(normalized) ? 3 : hasPhrase(text, normalized) ? 2 : hasPhrase(combined, normalized) ? 1 : 0;
    return [{ product, rank }];
  }).sort((a, b) => b.rank - a.rank).map(row => row.product);
}

const colorGroups = [
  { id: 'pink', label: 'صورتی و رز', names: /(?:^| )(?:pink|rose|rosy|صورتی|رز)(?: |$)/ },
  { id: 'peach', label: 'هلویی و مرجانی', names: /(?:^| )(?:peach|peachy|coral|هلویی|مرجانی)(?: |$)/ },
  { id: 'nude', label: 'نود و بژ', names: /(?:^| )(?:nude|beige|نود|بژ)(?: |$)/ },
  { id: 'black', label: 'مشکی', names: /(?:^| )(?:black|مشکی|سیاه)(?: |$)/ },
  { id: 'brown', label: 'قهوه‌ای', names: /(?:^| )(?:brown|قهوه ای)(?: |$)/ },
  { id: 'red', label: 'قرمز', names: /(?:^| )(?:red|قرمز)(?: |$)/ },
  { id: 'clear', label: 'بی‌رنگ', names: /(?:^| )(?:clear|invisible|بی رنگ|بیرنگ)(?: |$)/ },
];

function productColors(product) {
  const info = productIdentity(product);
  const shade = normalizeSearch([info.shade, info.undertone].filter(Boolean).join(' '));
  return colorGroups.filter(group => group.names.test(shade));
}

export function searchColorOptions(products) {
  const available = new Set(products.flatMap(product => productColors(product).map(group => group.id)));
  return colorGroups.filter(group => available.has(group.id));
}

export function filterSearchProducts(products, { inStock, maxPrice, color }) {
  return products.filter(product =>
    (!inStock || product.inStock === true) &&
    (maxPrice === null || product.price <= maxPrice) &&
    (!color || productColors(product).some(group => group.id === color))
  );
}
