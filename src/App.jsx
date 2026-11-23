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
  const [location, setLocation] = useState(() => window.location.pathname + window.location.hash);
  const product = findProduct(window.location.pathname);
  const article = blogArticles.find(item => window.location.pathname === '/articles/' + item.id);
  const isWishlist = window.location.pathname === '/wishlist';
  const isAccount = window.location.pathname === '/account';
  const isHome = window.location.pathname === '/';
  const activeCategory = findCategory(window.location.pathname);
  const navigate = href => {
    const url = new URL(href, window.location.origin);
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
    document.title = isWishlist ? 'علاقه‌مندی‌ها | آرنا پیور' : isAccount ? 'پنل مشتری | آرنا پیور' : article ? article.title : product ? `${product.title} | آرنا پیور` : activeCategory ? `${categoryPages[activeCategory].title} | آرنا پیور` : isHome ? 'آرنا پیور | زیبایی و مراقبت' : 'محصول پیدا نشد | آرنا پیور';
    const previous = previousProduct.current;
    previousProduct.current = product;
    const family = product && getProductDetails(product).family;
    if (!window.location.hash && previous && product && previous.id !== product.id && family && family === getProductDetails(previous).family) return;
    const frame = requestAnimationFrame(() => {
      const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView();
      else { window.scrollTo({ top: 0, behavior: 'instant' }); (document.getElementById('wishlist-title') || document.getElementById('customer-account-title') || document.getElementById('article-title') || document.getElementById('product-title') || document.getElementById('category-title'))?.focus({ preventScroll: true }); }
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
  const [orderVersion, setOrderVersion] = useState(0);
  const checkoutPending = useRef(false);

  const showToast = (message, type = 'cart') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
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
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={activeCategory || selectedCategory}
        onSelectCategory={handleSelectCategory}
        onSelectProduct={item => navigate(productUrl(item))}
      />

      {/* Main Content Sections strictly adhering to screenshots */}
      {isWishlist ? (
        <WishlistPage products={favoriteProducts} wishlist={wishlist}
          onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />
      ) : isAccount ? (
        <CustomerAccount
          key={accountPhone}
          phone={accountPhone}
          orderVersion={orderVersion}
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
      </main> : activeCategory ? <CategoryPage key={activeCategory} category={activeCategory} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist}/> : product ? <ProductPage product={product} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} onQuickView={setQuickViewProduct}/> : <main className="arena-container pd-not-found"><h1>محصول پیدا نشد</h1><p>ممکن است نشانی محصول تغییر کرده باشد.</p><a href="/">بازگشت به فروشگاه</a></main>}

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
        <AuthModal onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLoginSuccess} />
      )}



      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
