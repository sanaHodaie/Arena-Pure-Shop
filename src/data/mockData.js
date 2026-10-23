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
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'skincare',
    name: 'مراقبت پوست',
    icon: '💧',
    count: '۱۸۵ محصول',
    color: 'from-indigo-100 to-purple-200',
    borderColor: 'border-purple-300',
    image: 'https://images.unsplash.com/photo-1608248597359-59749fb8c5bf?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'sunscreen',
    name: 'ضد آفتاب',
    icon: '☀️',
    count: '۶۸ محصول',
    color: 'from-amber-100 to-purple-200',
    borderColor: 'border-amber-300',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'health',
    name: 'بهداشتی',
    icon: '🫧',
    count: '۹۴ محصول',
    color: 'from-purple-100 to-pink-100',
    borderColor: 'border-purple-300',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'hygiene',
    name: 'بهداشت شخصی',
    icon: '🌿',
    count: '۱۱۵ محصول',
    color: 'from-teal-100 to-purple-200',
    borderColor: 'border-teal-300',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fragrance',
    name: 'ادکلن',
    icon: '🌸',
    count: '۷۹ محصول',
    color: 'from-pink-100 to-purple-200',
    borderColor: 'border-pink-300',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cosmetics',
    name: 'آرایشی',
    icon: '💄',
    count: '۲۳۰ محصول',
    color: 'from-fuchsia-100 to-purple-200',
    borderColor: 'border-fuchsia-300',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80'
  },
];

export const specialOfferProducts = [
  {
    id: 1,
    brand: 'آرکانسیل',
    title: 'آرکانسیل مداد لب شماره ۴۰۰',
    price: 196000,
    oldPrice: 245000,
    discountPercent: 20,
    rating: 4.8,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'مداد لب با بافت بسیار نرم و روان، حاوی ویتامین E و ماندگاری طولانی بدون پخش شدن روی لب.'
  },
  {
    id: 2,
    brand: 'آرکانسیل',
    title: 'آرکانسیل خط لب تتو Arcancil شماره ۴۰۰',
    price: 189000,
    oldPrice: 230000,
    discountPercent: 18,
    rating: 4.9,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'خط لب فوق‌العاده ضد آب با ماندگاری ۲۴ ساعته ضد تعریق و مناسب آرایش‌های حرفه‌ای.'
  },
  {
    id: 3,
    brand: 'آرکانسیل',
    title: 'آرکانسیل رژ لب مایع شماره ۰۰۹',
    price: 179000,
    oldPrice: 220000,
    discountPercent: 19,
    rating: 4.7,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'رژ لب مایع با رنگدانه‌های غنی، پوشش مات و مخملی و عدم ایجاد حس خشکی روی لب.'
  },
  {
    id: 4,
    brand: 'آرکانسیل',
    title: 'آرکانسیل رژ لب مایع مات هیستریا کد ۳۶۵',
    price: 350000,
    oldPrice: 420000,
    discountPercent: 17,
    rating: 5.0,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'رژ لب هیستریا با جلوه کاملا مات و پوشش یکنواخت، حاوی روغن جوجوبا.'
  },
  {
    id: 5,
    brand: 'آرکانسیل',
    title: 'آرکانسیل رژ لب مایع مات هیستریا کد ۵۱۰',
    price: 350000,
    oldPrice: 420000,
    discountPercent: 17,
    rating: 4.9,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'رنگ صورتی نود بسیار شیک مناسب استفاده روزانه و مجالس با ماندگاری ۱۲ ساعته.'
  },
  {
    id: 6,
    brand: 'آرکانسیل',
    title: 'آرکانسیل رژ لب مایع هیستریا شماره ۰۵۰',
    price: 179000,
    oldPrice: 215000,
    discountPercent: 17,
    rating: 4.8,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'جلوه‌ای براق و مخملی همزمان، مرطوب‌کننده و حجم‌دهنده لب.'
  },
  {
    id: 7,
    brand: 'آرکانسیل',
    title: 'آرکانسیل ریمل حجم دهنده مشکی زبرا',
    price: 189000,
    oldPrice: 240000,
    discountPercent: 21,
    rating: 4.9,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'حجم‌دهندگی فوق‌العاده با برس حرفه‌ای تفکیک‌کننده، بدون ریزش و سیاهی زیر چشم.'
  },
  {
    id: 8,
    brand: 'آرکانسیل',
    title: 'آرکانسیل ریمل سیل کاباره مژه بلند ۸۰ سالگی',
    price: 189000,
    oldPrice: 235000,
    discountPercent: 20,
    rating: 4.9,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'نسخه ویژه ۸۰ سالگی آرکانسیل با اثر لیفت و بلندکنندگی مژه‌ها بدون ایجاد چسبندگی.'
  }
];

export const bestSellerProducts = [
  {
    id: 101,
    brand: 'آرکانسیل',
    title: 'آرکانسیل مداد لب شماره ۴۰۰',
    price: 196000,
    oldPrice: 230000,
    rating: 4.8,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    badge: 'پرفروش'
  },
  {
    id: 102,
    brand: 'آرکانسیل',
    title: 'آرکانسیل رژ لب مایع مات مدل هیستریا کد ۲۰۰',
    price: 350000,
    oldPrice: 390000,
    rating: 4.9,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    badge: 'تخفیف ویژه'
  },
  {
    id: 103,
    brand: 'آرکانسیل',
    title: 'آرکانسیل خط لب تتو Arcancil شماره ۴۰۰',
    price: 189000,
    oldPrice: 220000,
    rating: 4.7,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?auto=format&fit=crop&w=400&q=80',
    inStock: true
  },
  {
    id: 104,
    brand: 'آرکانسیل',
    title: 'آرکانسیل رژ لب مایع مات هیستریا کد ۳۷۹',
    price: 350000,
    oldPrice: 410000,
    rating: 5.0,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    badge: 'جدید'
  },
  {
    id: 105,
    brand: 'آرکانسیل',
    title: 'آرکانسیل رژ لب مایع شماره ۰۰۹',
    price: 179000,
    oldPrice: 210000,
    rating: 4.8,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=400&q=80',
    inStock: true
  },
  {
    id: 106,
    brand: 'آرکانسیل',
    title: 'آرکانسیل رژ لب مایع مات هیستریا کد ۵۱۰',
    price: 350000,
    oldPrice: 395000,
    rating: 4.9,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=400&q=80',
    inStock: true
  },
  {
    id: 107,
    brand: 'آرکانسیل',
    title: 'آرکانسیل رژ لب مایع مات هیستریا کد ۳۶۵',
    price: 350000,
    oldPrice: 400000,
    rating: 4.9,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    inStock: true
  },
  {
    id: 108,
    brand: 'آرکانسیل',
    title: 'آرکانسیل رژ لب مایع هیستریا شماره ۰۵۰',
    price: 179000,
    oldPrice: 215000,
    rating: 4.7,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?auto=format&fit=crop&w=400&q=80',
    inStock: true
  },
  {
    id: 109,
    brand: 'لافارر',
    title: 'کرم مرطوب کننده و آبرسان قوی لافارر شماره ۲',
    price: 285000,
    oldPrice: 330000,
    rating: 4.9,
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    inStock: true
  },
  {
    id: 110,
    brand: 'فولیکا',
    title: 'شامپو ضد ریزش و تقویت کننده مو فولیکا',
    price: 165000,
    oldPrice: 195000,
    rating: 4.6,
    category: 'haircare',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80',
    inStock: true
  },
  {
    id: 111,
    brand: 'سریتا',
    title: 'سرم تقویت مژه معجزه‌آسا سریتا',
    price: 490000,
    oldPrice: 560000,
    rating: 5.0,
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1608248597359-59749fb8c5bf?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    badge: 'پیشنهاد ویژه'
  },
  {
    id: 112,
    brand: 'آرکانسیل',
    title: 'پنکک فشرده مات و مخملی ضد آب آرکانسیل',
    price: 395000,
    oldPrice: 470000,
    rating: 4.8,
    category: 'cosmetics',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    inStock: true
  }
];

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
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'نحوه استفاده از سرم هیالورونیک اسید با بهترین اثرگذاری',
    excerpt: 'پوست بزرگ‌ترین اندام بدن انسان، نقش مهمی در محافظت از بدن و حفظ ظاهر جوان و سالم دارد. در سال‌های اخیر، محصولات مراقبت از پوست مبتنی بر هیالورونیک اسید تحولی شگرف ایجاد کرده‌اند...',
    author: 'Seo_admin',
    date: '۲۵ شهریور ۱۴۰۳',
    readTime: '۷ دقیقه',
    image: 'https://images.unsplash.com/photo-1608248597359-59749fb8c5bf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: '۱۰ تا از بهترین برندهای خط چشم ماژیکی ضد آب ایرانی و خارجی',
    excerpt: 'خط چشم یکی از مهم‌ترین ابزارهای آرایشی است که می‌تواند زیبایی و جذابیت چشمان را به طرز عجیبی افزایش دهد. در میان انواع مختلف خط چشم، مدل‌های ماژیکی ضد آب به دلیل دقت بالا محبوبیت فوق‌العاده‌ای دارند...',
    author: 'Seo_admin',
    date: '۱۵ شهریور ۱۴۰۳',
    readTime: '۶ دقیقه',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'بهترین مارک پنکک‌های ایرانی و خارجی با پوشش مات و مخملی',
    excerpt: 'یکی از سوالاتی که مصرف‌کنندگان لوازم آرایشی معمولا از خود می‌پرسند این است که بهترین مارک پنکک‌های ایرانی و خارجی کدامند؟ پاسخ این سوال بستگی به نوع پوست و فرمولاسیون مورد نیاز دارد...',
    author: 'Zahra Rajabalizadeh',
    date: '۲ شهریور ۱۴۰۳',
    readTime: '۸ دقیقه',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
  }
];

export const formatPrice = (price) => {
  if (typeof price !== 'number') return price;
  return price.toLocaleString('fa-IR');
};
