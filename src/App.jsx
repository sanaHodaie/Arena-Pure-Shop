import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import HeroBanners from './components/HeroBanners.jsx';
import SpecialOffers from './components/SpecialOffers.jsx';
import Categories from './components/Categories.jsx';
import BestSellers from './components/BestSellers.jsx';
import MiddleBanners from './components/MiddleBanners.jsx';
import ValueProps from './components/ValueProps.jsx';
import WeeklyDeals from './components/WeeklyDeals.jsx';
import BrandLogos from './components/BrandLogos.jsx';
import BlogSection from './components/BlogSection.jsx';
import Footer from './components/Footer.jsx';

import CartDrawer from './components/CartDrawer.jsx';
import ProductQuickView from './components/ProductQuickView.jsx';
import AuthModal from './components/AuthModal.jsx';
import ArticleModal from './components/ArticleModal.jsx';
import Toast from './components/Toast.jsx';

export default function App() {
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

  // Wishlist state
  const [wishlist, setWishlist] = useState([2, 4]);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);

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

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('از علاقه‌مندی‌ها حذف شد', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('به لیست علاقه‌مندی‌های شما افزوده شد', 'wishlist');
        return [...prev, productId];
      }
    });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    showToast('در حال انتقال به درگاه پرداخت امن بانکی...', 'info');
  };

  const handleLoginSuccess = (phoneNumber) => {
    setUser({ phone: phoneNumber });
    showToast(`با شماره ${phoneNumber} وارد شدید`, 'cart');
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProducts = (category = null) => {
    setSelectedCategory(typeof category === 'string' ? category : null);
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        wishlistCount={wishlist.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onSelectProduct={setQuickViewProduct}
      />

      {/* Main Content Sections strictly adhering to screenshots */}
      <main className="flex-1 space-y-2 sm:space-y-4">
        {/* Screenshot 1: Hero Banners */}
        <HeroBanners onShopClick={scrollToProducts} />

        {/* Screenshot 1 & 2: Special Offers (پیشنهاد شگفت‌انگیز) */}
        <SpecialOffers
          searchTerm={searchTerm}
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
          searchTerm={searchTerm}
          onClearCategory={() => setSelectedCategory(null)}
        />

        {/* Screenshot 3: Middle Promotional Banners */}
        <MiddleBanners onShopClick={scrollToProducts} />

        {/* Screenshot 3: Value Propositions / Trust Guarantees */}
        <ValueProps />

        {/* Screenshot 3: Weekly Deals (پیشنهاد هفته) */}
        <WeeklyDeals
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
          onQuickView={(p) => setQuickViewProduct(p)}
        />

        {/* Screenshot 3 & 4: Top Brands (برندهای برتر) */}
        <BrandLogos />

        {/* Screenshot 4: Articles & Magazine (خواندنی‌ها) */}
        <BlogSection onArticleClick={(article) => setActiveArticle(article)} />
      </main>

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
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <ArticleModal
        article={activeArticle}
        isOpen={!!activeArticle}
        onClose={() => setActiveArticle(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
