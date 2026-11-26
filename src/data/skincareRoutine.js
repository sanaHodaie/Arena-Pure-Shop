import { products } from './catalog.js';

export const skinTypes = [
  ['dry', 'خشک'], ['oily', 'چرب'], ['combination', 'مختلط'],
  ['normal', 'معمولی'], ['sensitive', 'حساس'], ['unknown', 'مطمئن نیستم'],
];

export const skinConcerns = [
  ['dryness', 'خشکی و کشیدگی'], ['shine', 'برق و چربی اضافی'],
  ['pores', 'منافذ نمایان'], ['dullness', 'کدری و ناهماهنگی رنگ'], ['sensitivity', 'حساسیت و قرمزی'],
];

const catalogProduct = (id) => products.find(product => product.id === id);
const steps = [
  { key: 'cleanser', label: 'شوینده', use: 'روی پوست مرطوب ماساژ بده و آبکشی کن؛ هنگام شست‌وشو پوست را نمال.', options: [
    [22, ['dry', 'sensitive', 'unknown'], ['dryness', 'sensitivity'], 'شویندهٔ کرمی با کف کم، برای وقتی که شست‌وشوی کف‌دار به پوستت حس کشیدگی می‌دهد.'],
    [49, ['normal', 'combination', 'dry', 'unknown'], ['dryness'], 'از کرم به کف تبدیل می‌شود و برای شست‌وشوی روزمرهٔ پوست نرمال، مختلط یا متمایل به خشکی قابل بررسی است.'],
    [51, ['sensitive', 'dry', 'unknown'], ['sensitivity'], 'پاک‌کنندهٔ شیری برای وقتی که بافت کم‌کف را روی پوست خشک یا حساس ترجیح می‌دهی.'],
    [23, ['oily', 'combination', 'normal'], ['shine', 'pores'], 'ژل کف‌دار مناسب بررسی برای پوست چرب؛ اگر گونه‌ها بعد از شست‌وشو کشیده می‌شوند، دفعات مصرف را کمتر کن.'],
    [52, ['oily', 'combination'], ['shine', 'pores'], 'شویندهٔ ژلی و کف‌دار برای پوست چرب یا ناحیهٔ T براق؛ حس پوست بعد از آبکشی را معیار قرار بده.'],
  ] },
  { key: 'serum', label: 'سرم', use: 'بعد از شست‌وشو و پیش از مرطوب‌کننده بزن. اگر تازه شروع کرده‌ای، ابتدا روی بخش کوچکی از پوست امتحان کن.', options: [
    [7, ['dry', 'normal', 'combination', 'oily', 'sensitive', 'unknown'], ['dryness'], 'سرم هیالورونیک اسید یک لایهٔ آبرسان سبک است. روی پوست کمی مرطوب بزن و برای پوست خشک روی آن مرطوب‌کننده استفاده کن.'],
    [6, ['oily', 'combination'], ['shine', 'pores'], 'نیاسینامید ۱۰٪ برای وقتی که دغدغه‌ات برق اضافی و ظاهر منافذ است. از مقدار کم شروع کن.'],
  ] },
  { key: 'moisturizer', label: 'مرطوب‌کننده', use: 'بعد از سرم، یا مستقیم بعد از شست‌وشو، روی پوست بزن.', options: [
    [8, ['dry', 'sensitive', 'normal', 'unknown'], ['dryness', 'sensitivity'], 'کرم غلیظ‌تر برای نواحی خشک و پوست کشیده؛ برای زیر آرایش از مقدار کم شروع کن.'],
    [26, ['dry', 'normal', 'combination', 'oily', 'sensitive', 'unknown'], [], 'مرطوب‌کنندهٔ روزانه برای بعد از سرم و قبل از ضدآفتاب؛ روی ناحیهٔ T از مقدار کم شروع کن.'],
  ] },
  { key: 'sunscreen', label: 'ضدآفتاب صبح', use: 'آخرین مرحلهٔ روتین صبح است. مقدار و زمان تمدید را طبق دستور روی بسته رعایت کن.', options: [
    [31, ['dry', 'normal', 'combination'], ['dryness'], 'بافت کرمی‌تر برای روتین روزانهٔ پوست معمولی یا خشک؛ اگر پوستت در گرما براق می‌شود، جلوه را پس از جذب بسنج.'],
    [39, ['normal', 'dry', 'combination', 'unknown'], ['dryness'], 'بافت سرمی برای زمانی که ضدآفتاب غلیظ نمی‌خواهی. مقاومت در برابر آب را برای ورزش روی بسته بررسی کن.'],
    [9, ['sensitive', 'normal', 'combination', 'oily', 'unknown', 'dry'], ['sensitivity'], 'فلوئید بی‌رنگ و بدون عطر برای استفادهٔ روزانه. اگر پوستت واکنش‌پذیر است، ابتدا روی بخش کوچکی امتحان کن.'],
    [33, ['oily', 'combination'], ['shine', 'pores'], 'نسخهٔ Oil Control برای وقتی که جلوهٔ کمتر براق اولویت دارد.'],
    [38, ['oily', 'combination', 'normal'], ['shine'], 'نسخهٔ Dry-Touch برای وقتی که حس خشک‌تر ضدآفتاب را ترجیح می‌دهی.'],
  ] },
];

export function buildSkincareRoutine(skin, concerns, budget = Infinity) {
  const cautious = skin === 'sensitive' || skin === 'unknown' || concerns.includes('sensitivity');
  const preferredSkin = cautious ? 'sensitive' : skin;
  const candidates = steps.map(({ key, label, use, options }) => options.flatMap(([id, skins, matches, reason]) => {
    const product = catalogProduct(id);
    if (!product?.inStock || !skins.includes(preferredSkin)) return [];
    if (key === 'serum' && (!concerns.some(concern => matches.includes(concern)) || (cautious && id === 6))) return [];
    const score = (skins[0] === preferredSkin ? 2 : 1) + matches.filter(concern => concerns.includes(concern)).length * 3;
    return [{ key, label, use, product, reason, score }];
  }));
  const [cleansers, serums, moisturizers, sunscreens] = candidates;
  let minimum = Infinity;
  let best = null;

  for (const cleanser of cleansers) {
    for (const moisturizer of moisturizers) {
      for (const sunscreen of sunscreens) {
        minimum = Math.min(minimum, cleanser.product.price + moisturizer.product.price + sunscreen.product.price);
        for (const serum of [null, ...serums]) {
          const items = serum ? [cleanser, serum, moisturizer, sunscreen] : [cleanser, moisturizer, sunscreen];
          const total = items.reduce((sum, item) => sum + item.product.price, 0);
          if (total > budget) continue;
          const score = items.reduce((sum, item) => sum + item.score, 0);
          if (!best || score > best.score || (score === best.score && total < best.total)) best = { items, total, score };
        }
      }
    }
  }

  const morning = [];
  const evening = [];

  for (const selected of best?.items ?? []) {
    // Serum options address different concerns and follow different schedules.
    const alternatives = selected.key === 'serum' ? [] : candidates.flat().filter(candidate =>
      candidate.key === selected.key && candidate.product.price < selected.product.price);
    const alternative = alternatives.sort((a, b) => b.score - a.score || a.product.price - b.product.price)[0];
    for (const { period, ...item } of scheduleProduct({ ...selected, alternative })) {
      (period === 'morning' ? morning : evening).push(item);
    }
  }

  const routine = best && {
    morning,
    evening,
    total: best.total,
    preferredSkin,
    includesSerum: best.items.some(item => item.key === 'serum'),
  };
  return { routine, minimum, serumAvailable: serums.length > 0 };
}

function scheduleProduct(item) {
  const niacinamide = item.key === 'serum' && item.product.id === 6;
  const schedule = niacinamide ? [] : [{ ...item, period: 'morning', frequency: '۷ بار در هفته' }];
  if (niacinamide || item.key === 'cleanser' || item.key === 'moisturizer') {
    schedule.push({
      ...item,
      period: 'evening',
      frequency: niacinamide ? 'برای شروع، ۲ تا ۳ شب در هفته' : '۷ بار در هفته',
      use: item.key === 'cleanser'
        ? 'ضدآفتاب و آلودگی روز را با شوینده و آب ولرم پاک کن. برای آرایش ضدآب، دستور پاک‌کردن روی بسته را بررسی کن.'
        : item.use,
    });
  }
  return schedule;
}

export function getRoutinePlacement(product, routine) {
  const definition = steps.find(step => step.options.some(([id]) => id === product.id));
  if (!definition) return null;
  const [, skins, , reason] = definition.options.find(([id]) => id === product.id);
  const { key, label, use } = definition;
  const schedule = scheduleProduct({ key, label, use, product, reason });
  const positions = steps.map(step => step.key);
  const oldSteps = routine ? [...routine.morning, ...routine.evening].filter(step => step.key === key) : [];
  const existing = [...new Map(oldSteps.map(step => [step.product.id, step.product])).values()];
  const alreadyIncluded = existing.some(item => item.id === product.id);
  const compatible = !routine?.preferredSkin || skins.includes(routine.preferredSkin);
  if (!routine || alreadyIncluded || !compatible || !product.inStock) {
    return { schedule, existing, alreadyIncluded, compatible, next: null };
  }

  const next = { ...routine };
  for (const period of ['morning', 'evening']) {
    const updated = routine[period].filter(item => item.key !== key);
    const entry = schedule.find(item => item.period === period);
    if (entry) {
      const { period: _, ...step } = entry;
      updated.push(step);
    }
    next[period] = updated.sort((a, b) => positions.indexOf(a.key) - positions.indexOf(b.key));
  }
  next.total = routineProducts(next).reduce((sum, item) => sum + item.price, 0);
  return { schedule, existing, alreadyIncluded, compatible, next };
}

export function routineProducts(routine) {
  return [...new Map([...routine.morning, ...routine.evening].map(step => [
    step.product.id, catalogProduct(step.product.id) || { ...step.product, inStock: false },
  ])).values()];
}

export function replaceRoutineProduct(routine, key) {
  const selected = [...routine.morning, ...routine.evening].find(step => step.key === key);
  if (!selected?.alternative) return routine;
  const replace = step => step.key === key ? {
    ...step,
    product: selected.alternative.product,
    reason: selected.alternative.reason,
    alternative: undefined,
  } : step;
  const next = { ...routine, morning: routine.morning.map(replace), evening: routine.evening.map(replace) };
  return { ...next, total: routineProducts(next).reduce((total, product) => total + product.price, 0) };
}

export function saveCustomerRoutine(phone, routine) {
  const snapshot = steps => steps.map(({ key, label, use, product, reason, frequency }) => ({
    key, label, use, reason, frequency, product: { id: product.id, title: product.title, slug: product.slug, price: product.price },
  }));
  localStorage.setItem('arena-demo-routine:' + phone, JSON.stringify({
    preferredSkin: routine.preferredSkin,
    morning: snapshot(routine.morning),
    evening: snapshot(routine.evening),
  }));
}

export function readCustomerRoutine(phone) {
  const saved = JSON.parse(localStorage.getItem('arena-demo-routine:' + phone));
  if (!saved) return null;
  const restore = steps => steps.map(step => ({
    ...step, product: catalogProduct(step.product.id) ?? { ...step.product, inStock: false, unlisted: true },
  }));
  const routine = { preferredSkin: saved.preferredSkin, morning: restore(saved.morning), evening: restore(saved.evening) };
  return { ...routine, total: routineProducts(routine).reduce((total, product) => total + product.price, 0) };
}
