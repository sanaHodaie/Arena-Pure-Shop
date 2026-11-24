import { products } from './catalog.js';
export const categoryNames = { cleansing: 'پاک‌کننده‌ها', cosmetics: 'آرایش صورت و لب', skincare: 'مراقبت پوست', sunscreen: 'ضدآفتاب', haircare: 'مراقبت مو', hygiene: 'بهداشت و پاک‌کننده', fragrance: 'عطر و ادکلن' };
const identities = {
  1: { type: 'مداد لب', model: 'Slim Lip Pencil', shade: 'Nude Truffle' },
  2: { type: 'رژ لب مایع', model: 'Super Stay Vinyl Ink', shade: '35 Cheeky', color: '#a66c71', undertone: 'رزِ خنثی متمایل به سرد', shadeNote: 'اگر نود صورتی و رز را به رنگ‌های هلویی ترجیح می‌دهی، Cheeky را امتحان کن.', family: 'vinyl-ink' },
  3: { type: 'برق لب', model: 'Butter Gloss', shade: 'Angel Food Cake' },
  4: { type: 'رژ لب مایع', model: 'Super Stay Vinyl Ink', shade: '15 Peachy', color: '#c58d7e', undertone: 'هلوییِ گرم', shadeNote: 'اگر نود گرم با هالهٔ هلویی می‌خواهی، Peachy را امتحان کن.', family: 'vinyl-ink' },
  5: { type: 'ریمل', model: 'Lash Sensational Sky High', shade: 'Very Black' },
  6: { type: 'سرم صورت', model: 'Niacinamide 10% + Zinc 1%' },
  7: { type: 'سرم صورت', model: 'Hyaluronic Acid 2% + B5 with Ceramides' },
  8: { type: 'کرم مرطوب‌کننده', model: 'Moisturizing Cream' },
  9: { type: 'ضدآفتاب', model: 'Anthelios UVMune 400 Invisible Fluid SPF50+', shade: 'بی‌رنگ', extra: [['فاکتور محافظت درج‌شده در نام محصول', 'SPF50+'], ['نسخه محصول', 'بدون عطر (Non Perfumed)']] },
  10: { type: 'شامپو', model: 'Elvive Hyaluron + Plump' },
  11: { type: 'میسلار واتر', model: 'SkinActive All-in-1', extra: [['نسخه محصول', 'درب صورتی']] },
  12: { type: 'عطر زنانه', model: 'La Vie Est Belle', extra: [['غلظت', 'ادو پرفیوم (Eau de Parfum)']] },
};
export function getProductDetails(product) {
  const identity = identities[product.id] || { type: product.type, model: product.model };
  return { ...identity,
    specs: [['برند', product.brand], ['نام انگلیسی', product.englishName], ['نوع محصول', identity.type], ['مدل', identity.model], ...(identity.shade ? [['رنگ / شماره', identity.shade]] : []), ['دسته‌بندی', categoryNames[product.category]], ...(identity.extra || [])].filter(([, value]) => value),
    variants: identity.family ? products.filter(item => identities[item.id]?.family === identity.family) : [],
    related: products.filter(item => item.id !== product.id && item.category === product.category && (!identity.family || identities[item.id]?.family !== identity.family)).slice(0, 4),
    gallery: [{ src: product.image, alt: product.title }],
  };
}
export function findProduct(pathname) {
  const match = /^\/products\/([^/]+)\/?$/.exec(pathname);
  return match ? products.find(product => product.slug === match[1]) || null : null;
}
export function productUrl(product) { return `/products/${product.slug}`; }
