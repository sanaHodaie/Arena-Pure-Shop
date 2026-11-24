import FragranceFinderPage from './pages/FragranceFinderPage.jsx';
import { CompareTray } from './components/CompareControls.jsx';
import WishlistComparison from './pages/WishlistComparison.jsx';
import { routineProducts, saveCustomerRoutine } from './data/skincareRoutine.js';
import SkincareRoutinePage from './pages/SkincareRoutinePage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import CustomerAccount from './pages/CustomerAccount.jsx';
import { products } from './data/catalog.js';
import { createCustomerOrder, readCustomerFavorites, saveCustomerFavorites } from './data/customerAccount.js';
import ArticlePage from './pages/ArticlePage.jsx';
import { blogArticles } from './data/mockData.js';
import React, { useState, useEffect, useRef } from 'react';
import { categoryPages, categoryUrl, findCategory } from './data/categories.js';
import CategoryPage from './pages/CategoryPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import { findProduct, productUrl, getProductDetails } from './data/productDetails.js';
import Header from './components/Header.jsx';
import HeroBanners from './components/HeroBanners.jsx';
import SpecialOffers from './components/SpecialOffers.jsx';
import Categories from './components/Categories.jsx';
import BestSellers from './components/BestSellers.jsx';
import MiddleBanners from './components/MiddleBanners.jsx';
import ValueProps from './components/ValueProps.jsx';
import BrandLogos from './components/BrandLogos.jsx';
import BlogSection from './components/BlogSection.jsx';
import Footer from './components/Footer.jsx';

import CartDrawer from './components/CartDrawer.jsx';
import ProductQuickView from './components/ProductQuickView.jsx';
import AuthModal from './components/AuthModal.jsx';
import { readDemoSession, writeDemoSession } from './data/demoAccount.js';
import Toast from './components/Toast.jsx';

export default function App() {
  const previousProduct = useRef(null);
  const previousPath = useRef(null);
  const pendingRoutine = useRef(null);
  const [location, setLocation] = useState(() => window.location.pathname + window.location.hash);
  const [routineDraft, setRoutineDraft] = useState({ skin: '', concerns: [], budget: 3_500_000, result: null });
  const product = findProduct(window.location.pathname);
  const article = blogArticles.find(item => window.location.pathname === '/articles/' + item.id);
  const isFragranceFinder = window.location.pathname === '/fragrance-finder';
  const isRoutine = window.location.pathname === '/skincare-routine';
  const isWishlist = window.location.pathname === '/wishlist';
  const isAccount = window.location.pathname === '/account';
  const isHome = window.location.pathname === '/';
  const activeCategory = findCategory(window.location.pathname);
  const navigate = href => {
    const url = new URL(href, window.location.origin);
    if (url.href === window.location.href && url.hash === '#categories') {
      document.getElementById('categories')?.scrollIntoView();
      return;
    }
    window.history.pushState(null, '', url.pathname + url.search + url.hash);
    setLocation(url.pathname + url.hash);
  };
  useEffect(() => {
    const update = () => setLocation(window.location.pathname + window.location.hash);
    window.addEventListener('popstate', update);
    window.addEventListener('hashchange', update);
    return () => { window.removeEventListener('popstate', update); window.removeEventListener('hashchange', update); };
  }, []);
  useEffect(() => {
    document.title = isFragranceFinder ? 'عطریاب | آرنا پیور' : isRoutine ? 'روتین‌ساز پوست | آرنا پیور' : isWishlist ? 'علاقه‌مندی‌ها | آرنا پیور' : isAccount ? 'پنل مشتری | آرنا پیور' : article ? article.title : product ? `${product.title} | آرنا پیور` : activeCategory ? `${categoryPages[activeCategory].title} | آرنا پیور` : isHome ? 'آرنا پیور | زیبایی و مراقبت' : 'محصول پیدا نشد | آرنا پیور';
    const wasAccount = previousPath.current === '/account';
    previousPath.current = window.location.pathname;
    const previous = previousProduct.current;
    previousProduct.current = product;
    const family = product && getProductDetails(product).family;
    if (!window.location.hash && previous && product && previous.id !== product.id && family && family === getProductDetails(previous).family) return;
    if (isAccount && wasAccount) return;
    const frame = requestAnimationFrame(() => {
      const routineResult = isRoutine && previous ? document.getElementById('routine-result') : null;
      if (routineResult) {
        routineResult.focus({ preventScroll: true });
        routineResult.scrollIntoView({ block: 'start' });
        return;
      }
      const target = !isAccount && window.location.hash && document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView();
      else { window.scrollTo({ top: 0, behavior: 'instant' }); (document.getElementById('fragrance-finder-title') || document.getElementById('routine-title') || document.getElementById('wishlist-title') || document.getElementById('customer-account-title') || document.getElementById('article-title') || document.getElementById('product-title') || document.getElementById('category-title'))?.focus({ preventScroll: true }); }
    });
    return () => cancelAnimationFrame(frame);
  }, [location]);
  const handleLink = event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (url.origin !== window.location.origin) return;
    event.preventDefault();
    navigate(url.href);
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const sections = document.querySelectorAll('.beauty-categories, .beauty-bestsellers, .arena-offers-section');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.06 });
    sections.forEach(section => { section.classList.add('reveal-pending'); observer.observe(section); });
    return () => { observer.disconnect(); sections.forEach(section => section.classList.remove('reveal-pending', 'is-revealed')); };
  }, []);
  // Cart state
  const [cart, setCart] = useState([]);

  const [accountPhone, setAccountPhone] = useState(readDemoSession);
  const [wishlist, setWishlist] = useState(() => readCustomerFavorites(accountPhone));

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [toast, setToast] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [orderVersion, setOrderVersion] = useState(0);
  const checkoutPending = useRef(false);

  const showToast = (message, type = 'cart') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const comparison = {
    products: compareProducts,
    open: () => { if (compareProducts.length >= 2) setShowComparison(true); },
    clear: () => setCompareProducts([]),
    toggle: item => {
      if (compareProducts.some(product => product.id === item.id)) {
        setCompareProducts(compareProducts.filter(product => product.id !== item.id));
      } else if (compareProducts.length && compareProducts[0].category !== item.category) {
        showToast('فقط محصولات هم‌دسته قابل مقایسه‌اند. برای تغییر دسته، انتخاب‌ها را پاک کن.', 'info');
      } else if (compareProducts.length >= 3) {
        showToast('حداکثر سه محصول قابل مقایسه است.', 'info');
      } else {
        setCompareProducts([...compareProducts, item]);
      }
    },
  };

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    showToast(`«${product.title}» به سبد خرید افزوده شد`, 'cart');
  };

  const handleAddRoutineToCart = routine => {
    const items = routineProducts(routine);
    if (!items.length || items.some(product => !product.inStock)) {
      showToast('بعضی محصولات روتین موجود نیستند. سبد خرید تغییری نکرد.', 'info');
      return;
    }
    setCart(current => {
      const next = new Map(current.map(item => [item.id, item]));
      for (const product of items) {
        next.set(product.id, { ...product, quantity: (next.get(product.id)?.quantity || 0) + 1 });
      }
      return [...next.values()];
    });
    setIsCartOpen(true);
    showToast('محصولات روتین به سبد خرید اضافه شدند.');
  };

  const persistRoutine = (phone, routine) => {
    try {
      saveCustomerRoutine(phone, routine);
      navigate('/account#account-routine');
      showToast('روتین در بخش «روتین من» ذخیره شد.', 'info');
    } catch {
      showToast('ذخیرهٔ روتین در این مرورگر ممکن نیست.', 'info');
    }
  };

  const handleSaveRoutine = routine => {
    if (accountPhone) persistRoutine(accountPhone, routine);
    else {
      pendingRoutine.current = routine;
      setIsAuthOpen(true);
    }
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('کالا از سبد خرید حذف شد', 'info');
  };

  const handleToggleWishlist = productId => {
    const exists = wishlist.includes(productId);
    const next = exists ? wishlist.filter(id => id !== productId) : [...wishlist, productId];
    try {
      saveCustomerFavorites(accountPhone, next);
      setWishlist(next);
      showToast(exists ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها افزوده شد', exists ? 'info' : 'wishlist');
    } catch {
      showToast('ذخیرهٔ علاقه‌مندی‌ها ممکن نیست.', 'info');
    }
  };

  const handleCheckout = async () => {
    if (!cart.length || checkoutPending.current) return;
    setIsCartOpen(false);
    if (!accountPhone) {
      setIsAuthOpen(true);
      return;
    }

    checkoutPending.current = true;
    try {
      await createCustomerOrder(accountPhone, cart);
      setCart(current => current.flatMap(item => {
        const quantity = item.quantity - (cart.find(saved => saved.id === item.id)?.quantity || 0);
        return quantity > 0 ? [{ ...item, quantity }] : [];
      }));
      setOrderVersion(version => version + 1);
      navigate('/account#account-orders');
    } catch {
      showToast('ثبت سفارش آزمایشی ممکن نیست. سبد خرید شما حفظ شد.', 'info');
    } finally {
      checkoutPending.current = false;
    }
  };

  const handleLoginSuccess = phoneNumber => {
    const favorites = [...new Set([...readCustomerFavorites(phoneNumber), ...wishlist])];
    try {
      saveCustomerFavorites(phoneNumber, favorites);
      saveCustomerFavorites(null, []);
    }
    catch { showToast('ذخیرهٔ علاقه‌مندی‌ها ممکن نیست.', 'info'); }
    setWishlist(favorites);
    writeDemoSession(phoneNumber);
    setAccountPhone(phoneNumber);
    setIsAuthOpen(false);
    const routine = pendingRoutine.current;
    pendingRoutine.current = null;
    if (routine) {
      persistRoutine(phoneNumber, routine);
      return;
    }
    if (!isAccount) navigate('/account');
  };

  const handleLogout = () => {
    writeDemoSession(null);
    setAccountPhone(null);
    setWishlist(readCustomerFavorites(null));
    navigate('/');
  };

  const handleSelectCategory = (catId, hash = '#products') => {
    if (categoryPages[catId]) { setSelectedCategory(null); navigate(categoryUrl(catId)); return; }
    setSelectedCategory(catId);
    if (!isHome) navigate(`/${hash}`);
    const element = document.getElementById(hash.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const favoriteProducts = products.filter(product => wishlist.includes(product.id));
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div onClick={handleLink} className="min-h-screen bg-brand-background text-slate-800 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        isSignedIn={!!accountPhone}
        onOpenAuth={() => accountPhone ? navigate('/account') : setIsAuthOpen(true)}
        wishlistCount={favoriteProducts.length}
        isWishlist={isWishlist}
        isRoutine={isRoutine}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={activeCategory || selectedCategory}
        onSelectCategory={handleSelectCategory}
        onSelectProduct={item => navigate(productUrl(item))}
      />

      {/* Main Content Sections strictly adhering to screenshots */}
      {isFragranceFinder ? (
        <FragranceFinderPage wishlist={wishlist} comparison={comparison}
          onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />
      ) : isRoutine ? <SkincareRoutinePage draft={routineDraft} onDraftChange={setRoutineDraft} onSaveRoutine={handleSaveRoutine} onAddRoutineToCart={handleAddRoutineToCart} /> : isWishlist ? (
        <WishlistPage products={favoriteProducts} wishlist={wishlist} comparison={comparison}
          onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />
      ) : isAccount ? (
        <CustomerAccount
          key={accountPhone}
          phone={accountPhone}
          orderVersion={orderVersion}
          activePanel={location.split('#')[1]}
          onSelectPanel={panel => navigate('/account#' + panel)}
          onAddRoutineToCart={handleAddRoutineToCart}
          favoriteCount={favoriteProducts.length}
          onLogin={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
        />
      ) : article ? <ArticlePage article={article}/> : isHome ? <main className="flex-1 space-y-2 sm:space-y-4">
        {/* Screenshot 1: Hero Banners */}
        <HeroBanners />

        {/* Screenshot 1 & 2: Special Offers (پیشنهاد شگفت‌انگیز) */}
        <SpecialOffers
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
          onQuickView={(p) => setQuickViewProduct(p)}
        />

        {/* Screenshot 2: Circular Categories (دسته‌بندی‌ها) */}
        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Screenshot 2: Best Sellers (پرفروش‌ترین‌های این ماه) */}
        <BestSellers
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
          onQuickView={(p) => setQuickViewProduct(p)}
          selectedCategory={selectedCategory}
          onClearCategory={() => setSelectedCategory(null)}
        />

        {/* Screenshot 3: Middle Promotional Banners */}
        <MiddleBanners />

        {/* Screenshot 3: Value Propositions / Trust Guarantees */}
        <ValueProps />

        {/* Screenshot 3: Weekly Deals (پیشنهاد هفته) */}


        {/* Screenshot 3 & 4: Top Brands (برندهای برتر) */}
        <BrandLogos />

        {/* Screenshot 4: Articles & Magazine (خواندنی‌ها) */}
        <BlogSection />
      </main> : activeCategory ? <CategoryPage key={activeCategory} category={activeCategory} comparison={comparison} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist}/> : product ? <ProductPage product={product} accountPhone={accountPhone} onSaveRoutine={handleSaveRoutine} comparison={comparison} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} onQuickView={setQuickViewProduct}/> : <main className="arena-container pd-not-found"><h1>محصول پیدا نشد</h1><p>ممکن است نشانی محصول تغییر کرده باشد.</p><a href="/">بازگشت به فروشگاه</a></main>}

      {/* Screenshot 4: Grand Purple Footer */}
      <Footer />

      {/* Interactive Modals & Slide-overs */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <ProductQuickView
        onViewProduct={item => { setQuickViewProduct(null); navigate(productUrl(item)); }}
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
      />

      {isAuthOpen && (
        <AuthModal onClose={() => { pendingRoutine.current = null; setIsAuthOpen(false); }} onLoginSuccess={handleLoginSuccess} />
      )}



      {(activeCategory || product || isFragranceFinder) && <CompareTray comparison={comparison} onProductPage={!!product} />}
      {showComparison && compareProducts.length >= 2 && (
        <WishlistComparison products={compareProducts} onClose={() => setShowComparison(false)} />
      )}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
