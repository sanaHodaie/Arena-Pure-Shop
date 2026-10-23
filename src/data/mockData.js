import { products } from './catalog.js';
/**
 * Mock data for Arena Pure Cosmetics & Skincare Shop
 * Designed to accurately reflect the visual identity and product catalog from the screenshots
 */

export const siteConfig = {
  name: 'آرنا پیور',
  englishName: 'Arena Pure',
  phone: '۰۱۳-۳۲۷۶۶۲۰۲',
  mobile: '۰۹۳۰۱۳۱۵۰۵۰',
  email: 'info@arenapure.com',
  address: 'رشت - روبروی بیمارستان آریا - کوچه ولیعصر ۶ - دومین بن‌بست سمت راست - ساختمان گیل‌آرا',
  about: 'فروشگاه آنلاین آرنا پیور، با هدف ارائه بهترین محصولات مراقبت شخصی و زیبایی به عنوان مرجع تخصصی در زمینه مراقبت مو، مراقبت پوست، ضد آفتاب، محصولات بهداشتی و ادکلن‌های آرایشی فعالیت می‌کند. ما با انتخاب محصولات باکیفیت و متنوع از برندهای معتبر، سعی داریم نیازهای مشتریان خود را به بهترین شکل برطرف کنیم. در آرنا پیور، سلامت و زیبایی شما اولویت ماست و با ارائه خدمات سریع و مطمئن، تجربه خرید لذت‌بخش را برای شما فراهم می‌کنیم.'
};

export const navCategories = [
  { id: 'weekly-deals', title: 'پیشنهاد هفته', icon: 'Sparkles', href: '#weekly-deals', isSpecial: true },
  { id: 'brands', title: 'برندها', icon: 'Tag', href: '#brands' },
  { id: 'skincare', title: 'مراقبت پوست', icon: 'Droplets', href: '#products' },
  { id: 'haircare', title: 'مراقبت و زیبایی مو', icon: 'Scissors', href: '#products' },
  { id: 'cosmetics', title: 'آرایشی', icon: 'Palette', href: '#products' },
  { id: 'fragrance', title: 'اسپری و ادکلن', icon: 'Flame', href: '#products' },
  { id: 'hygiene', title: 'بهداشت شخصی و حمام', icon: 'ShieldCheck', href: '#products' },
];

export const mainCategories = [
  {
    id: 'haircare',
    name: 'مراقبت مو',
    icon: '✨',
    count: '۱۲۴ محصول',
    color: 'from-purple-100 to-purple-200',
    borderColor: 'border-purple-300',
    image: '/images/categories/haircare.webp'
  },
  {
    id: 'skincare',
    name: 'مراقبت پوست',
    icon: '💧',
    count: '۱۸۵ محصول',
    color: 'from-indigo-100 to-purple-200',
    borderColor: 'border-purple-300',
    image: '/images/categories/skincare.webp'
  },
  {
    id: 'sunscreen',
    name: 'ضد آفتاب',
    icon: '☀️',
    count: '۶۸ محصول',
    color: 'from-amber-100 to-purple-200',
    borderColor: 'border-amber-300',
    image: '/images/categories/sunscreen.webp'
  },
  {
    id: 'health',
    name: 'بهداشتی',
    icon: '🫧',
    count: '۹۴ محصول',
    color: 'from-purple-100 to-pink-100',
    borderColor: 'border-purple-300',
    image: '/images/categories/hygiene.webp'
  },
  {
    id: 'hygiene',
    name: 'بهداشت شخصی',
    icon: '🌿',
    count: '۱۱۵ محصول',
    color: 'from-teal-100 to-purple-200',
    borderColor: 'border-teal-300',
    image: '/images/categories/cleansing.webp'
  },
  {
    id: 'fragrance',
    name: 'ادکلن',
    icon: '🌸',
    count: '۷۹ محصول',
    color: 'from-pink-100 to-purple-200',
    borderColor: 'border-pink-300',
    image: '/images/categories/fragrance.webp'
  },
  {
    id: 'cosmetics',
    name: 'آرایشی',
    icon: '💄',
    count: '۲۳۰ محصول',
    color: 'from-fuchsia-100 to-purple-200',
    borderColor: 'border-fuchsia-300',
    image: '/images/categories/cosmetics.webp'
  },
];

export const specialOfferProducts = products.slice(0, 8);

export const bestSellerProducts = products;

export const valueProps = [
  {
    id: 1,
    title: 'ارسال سریع و آسان',
    desc: 'ارسال در زمان انتخابی مشتری به سریعترین شکل ممکن می‌باشد.',
    icon: 'PackageCheck'
  },
  {
    id: 2,
    title: 'خدمات پس از خرید',
    desc: 'هدف ما تلاش بی وقفه برای ارائه بهترین خدمات به مشتریان عزیز می‌باشد.',
    icon: 'Clock'
  },
  {
    id: 3,
    title: 'ضمانت اصالت',
    desc: 'تمامی کالاها اورجینال و با ضمانت اصل بودن از نمایندگی معتبر تهیه و ارائه می‌شوند.',
    icon: 'ShieldCheck'
  },
  {
    id: 4,
    title: 'ضمانت بازگشت کالا',
    desc: 'تا ۷ روز برای احترام به انتخاب مشتریان، کالای خریداری شده برگردانده می‌شود.',
    icon: 'RotateCcw'
  }
];

export const brands = [
  { id: 'cerita', name: 'CERITA', persianName: 'سریتا', logo: 'CERITA' },
  { id: 'fulica', name: 'FULICA', persianName: 'فولیکا', logo: 'FULICA' },
  { id: 'farmasi', name: 'FARMASI', persianName: 'فارماسی', logo: 'FARMASI' },
  { id: 'dmi', name: 'DMI', persianName: 'دی ام آی', logo: 'DMI' },
  { id: 'active', name: 'Active', persianName: 'اکتیو', logo: 'Active' },
  { id: 'lafarrerr', name: 'Lá farrerr', persianName: 'لافارر', logo: 'Lá farrerr' },
  { id: 'voche', name: 'Voché', persianName: 'وچه', logo: 'Voché' },
];

export const blogArticles = [
  {
    id: 1,
    title: 'بهترین پنکک برای پوست خشک با پوشش عالی',
    excerpt: 'پنکک یکی از محبوب‌ترین محصولات آرایشی است که به دلیل قابلیت پوشش‌دهی بالا و ایجاد ظاهری یکدست و طبیعی، جایگاه ویژه‌ای در کیف آرایش بانوان دارد...',
    author: 'Seo_admin',
    date: '۲ مهر ۱۴۰۳',
    readTime: '۵ دقیقه',
    image: '/images/articles/article-1.webp'
  },
  {
    id: 2,
    title: 'نحوه استفاده از سرم هیالورونیک اسید با بهترین اثرگذاری',
    excerpt: 'پوست بزرگ‌ترین اندام بدن انسان، نقش مهمی در محافظت از بدن و حفظ ظاهر جوان و سالم دارد. در سال‌های اخیر، محصولات مراقبت از پوست مبتنی بر هیالورونیک اسید تحولی شگرف ایجاد کرده‌اند...',
    author: 'Seo_admin',
    date: '۲۵ شهریور ۱۴۰۳',
    readTime: '۷ دقیقه',
    image: '/images/articles/article-2.webp'
  },
  {
    id: 3,
    title: '۱۰ تا از بهترین برندهای خط چشم ماژیکی ضد آب ایرانی و خارجی',
    excerpt: 'خط چشم یکی از مهم‌ترین ابزارهای آرایشی است که می‌تواند زیبایی و جذابیت چشمان را به طرز عجیبی افزایش دهد. در میان انواع مختلف خط چشم، مدل‌های ماژیکی ضد آب به دلیل دقت بالا محبوبیت فوق‌العاده‌ای دارند...',
    author: 'Seo_admin',
    date: '۱۵ شهریور ۱۴۰۳',
    readTime: '۶ دقیقه',
    image: '/images/articles/article-3.webp'
  },
  {
    id: 4,
    title: 'بهترین مارک پنکک‌های ایرانی و خارجی با پوشش مات و مخملی',
    excerpt: 'یکی از سوالاتی که مصرف‌کنندگان لوازم آرایشی معمولا از خود می‌پرسند این است که بهترین مارک پنکک‌های ایرانی و خارجی کدامند؟ پاسخ این سوال بستگی به نوع پوست و فرمولاسیون مورد نیاز دارد...',
    author: 'Zahra Rajabalizadeh',
    date: '۲ شهریور ۱۴۰۳',
    readTime: '۸ دقیقه',
    image: '/images/articles/article-4.webp'
  }
];

export const formatPrice = (price) => {
  if (typeof price !== 'number') return price;
  return price.toLocaleString('fa-IR');
};
