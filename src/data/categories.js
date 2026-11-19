export const categoryPages = {
 hygiene: { title: 'بهداشت شخصی', eyebrow: 'تازگی هر روز', description: 'محصولات بهداشت و حمام برای مراقبت روزانه.' },
  sunscreen: { title: 'ضدآفتاب', eyebrow: 'مراقبت روزانه', description: 'ضدآفتاب مناسب پوستت را انتخاب کن.' },
  haircare: { title: 'مراقبت مو', eyebrow: 'روتین زیبایی مو', description: 'از شامپو و نرم‌کننده تا ماسک و روغن مو؛ محصول دلخواهت را پیدا کن و مشخصات هر مدل را در صفحه خودش ببین.' },
  skincare: { title: 'مراقبت پوست', eyebrow: 'لحظه‌ای برای مراقبت از خودت', description: 'از پاک‌کننده و آبرسان تا سرم و مرطوب‌کننده؛ قدم‌های روتین پوستت را با شناخت هر محصول انتخاب کن.' },
};
export function categoryUrl(id) { return categoryPages[id] ? `/categories/${id}` : '/#products'; }
export function findCategory(pathname) {
  const match = /^\/categories\/([^/]+)\/?$/.exec(pathname);
  return match && categoryPages[match[1]] ? match[1] : null;
}
