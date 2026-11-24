import { products } from './catalog.js';

export const scentFamilies = [
  ['fresh', 'تازه و مرکباتی'], ['floral', 'گلی'], ['woody', 'چوبی'], ['warm', 'گرم و شیرین'],
];
export const fragranceOccasions = [['day', 'روزمره'], ['evening', 'مهمانی و شب']];

const profiles = {
  12: { families: ['warm', 'floral'], occasions: ['evening'], reason: 'جلوهٔ شیرین و گرم با حال‌وهوای وانیلی؛ برای وقتی که رایحهٔ گورماند را می‌پسندی.' },
  59: { families: ['fresh', 'woody'], occasions: ['day', 'evening'], reason: 'شروع تازه و ادویه‌ای با عمق چوبی؛ برای ترکیب حس مرکباتی و چوبی.' },
  60: { families: ['fresh', 'woody', 'floral'], occasions: ['day', 'evening'], reason: 'مرکبات در شروع و پچولی در پایان؛ انتخابی برای کسی که عطر گلی با زمینهٔ چوبی می‌خواهد.' },
  61: { families: ['floral', 'warm'], occasions: ['evening'], reason: 'ترکیب اسطوخودوس و حس گل سفید روی زمینهٔ گرم؛ برای سلیقهٔ گلی با کمی شیرینی.' },
  62: { families: ['warm', 'floral'], occasions: ['evening'], reason: 'حال‌وهوای انگور فرنگی سیاه و وانیل؛ برای کسی که رایحهٔ میوه‌ای با زمینهٔ گرم دوست دارد.' },
  63: { families: ['fresh', 'floral'], occasions: ['day'], reason: 'رایحهٔ گلی با شروع میوه‌ای و حس سبک‌تر؛ گزینه‌ای برای استفادهٔ روزمره.' },
  64: { families: ['woody', 'fresh'], occasions: ['day', 'evening'], reason: 'شروع مرکباتی با زمینهٔ چوبی؛ برای استفادهٔ روزمره یا موقعیت رسمی.' },
  65: { families: ['fresh'], occasions: ['day'], reason: 'حال‌وهوای دریایی و مرکباتی؛ مناسب سلیقه‌ای که رایحهٔ تازه برای روز می‌خواهد.' },
  66: { families: ['floral', 'warm'], occasions: ['evening'], reason: 'رایحهٔ گرم با عمق خاکی و گلی؛ برای کسی که عطر پُرحضور برای شب می‌پسندد.' },
  67: { families: ['warm', 'floral'], occasions: ['evening'], reason: 'حس گل سفید و زمینهٔ گرم کاکائویی؛ برای سلیقهٔ شیرین در مهمانی و شب.' },
};

export function findFragrances(family, occasion, budget) {
  return products.flatMap(product => {
    const profile = profiles[product.id];
    if (product.category !== 'fragrance' || !product.inStock || product.price > budget || !profile) return [];
    if ((family && !profile.families.includes(family)) || (occasion && !profile.occasions.includes(occasion))) return [];
    return [{ product, ...profile }];
  }).sort((a, b) => {
    const rank = item => family && item.families[0] === family ? 1 : 0;
    return rank(b) - rank(a) || a.product.price - b.product.price;
  }).slice(0, 3);
}
