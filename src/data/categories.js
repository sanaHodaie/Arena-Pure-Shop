export const categoryPages = {
 fragrance: { title: 'عطر و ادکلن', eyebrow: 'رایحه‌ای برای امضای تو', description: 'عطر محبوبت را از میان رایحه‌های زنانه و مردانه پیدا کن.' },
 cosmetics: { title: 'لوازم آرایشی', eyebrow: 'رنگ و زیبایی به سبک تو', description: 'از آرایش چشم و لب تا پوشش صورت؛ انتخاب‌های روتین آرایشی‌ات را کشف کن.' },
 cleansing: { title: 'پاک‌کننده‌ها', eyebrow: 'شروع یک روتین تازه', description: 'ژل، فوم و بالم پاک‌کننده را برای روتین روزانه پوستت کشف کن.' },
 hygiene: { title: 'بهداشت شخصی', eyebrow: 'تازگی هر روز', description: 'محصولات بهداشت و حمام برای مراقبت روزانه.' },
  sunscreen: { title: 'ضدآفتاب', eyebrow: 'مراقبت روزانه', description: 'ضدآفتاب مناسب پوستت را انتخاب کن.' },
  haircare: { title: 'مراقبت مو', eyebrow: 'روتین زیبایی مو', description: 'از شامپو و نرم‌کننده تا ماسک و روغن مو؛ محصول دلخواهت را پیدا کن و مشخصات هر مدل را در صفحه خودش ببین.' },
  skincare: { title: 'مراقبت پوست', eyebrow: 'لحظه‌ای برای مراقبت از خودت', description: 'از پاک‌کننده و آبرسان تا سرم و مرطوب‌کننده؛ قدم‌های روتین پوستت را با شناخت هر محصول انتخاب کن.' },
};
export function categoryUrl(id) { return Object.hasOwn(categoryPages, id) ? categoryPages[id].storefrontPath || `/categories/${id}` : '/#products'; }
export function findCategory(pathname) {
  const match = /^\/categories\/([^/]+)\/?$/.exec(pathname);
  return match && Object.hasOwn(categoryPages, match[1]) ? match[1] : null;
}
