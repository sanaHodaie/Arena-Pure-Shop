import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Gem,
  BookOpen,
  MessageSquare,
  History,
  ShoppingBag,
  Users,
  ChartNoAxesCombined,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  ChevronLeft,
  ShieldCheck,
  LogOut,
  UserCheck
} from 'lucide-react';
import { playTactileClick, setAudioMuted, getAudioMuted } from '../utils/sound';
import AdminSearch from './AdminSearch';

export default function Layout({
  activePage,
  onNavigate,
  children,
  onToggleTheme,
  currentUser,
  onLogout,
  can = (_permission) => true,
  onSearch,
  products
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMutedState, setIsMutedState] = useState(getAudioMuted());

  const navItems = [
    { id: 'dashboard', label: 'داشبورد اصلی', icon: LayoutDashboard },
    { id: 'products', label: 'محصولات و موجودی', icon: Gem },
    ...(currentUser.articles ? [{ id: 'articles', label: 'خواندنی‌ها', icon: BookOpen }] : []),
    ...(currentUser.reviews ? [{ id: 'reviews', label: 'نظرات محصولات', icon: MessageSquare }] : []),
    ...(currentUser.loginLogs ? [{ id: 'login-logs', label: 'لاگ ورود مدیران', icon: History }] : []),
    { id: 'orders', label: 'سفارش‌ها و فاکتورها', icon: ShoppingBag },
    { id: 'customers', label: 'حساب‌های کاربران', icon: Users },
    ...(currentUser.salesReports ? [{ id: 'sales', label: 'گزارش فروش', icon: ChartNoAxesCombined }] : []),
    { id: 'account', label: 'حساب مدیریت', icon: UserCheck },
  ].filter((item) => !['dashboard', 'products'].includes(item.id) || can('products:read'));

  const handleNavClick = (pageId) => {
    playTactileClick();
    onNavigate(pageId);
    setIsMobileMenuOpen(false);
  };

  const handleSoundToggle = () => {
    const nextMuted = !isMutedState;
    setIsMutedState(nextMuted);
    setAudioMuted(nextMuted);
    if (!nextMuted) playTactileClick();
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-pearl-50 dark:bg-pearl-950 text-pearl-800 dark:text-pearl-100 transition-colors duration-300 overflow-hidden">
      <div className="flex-1 flex flex-row overflow-hidden relative h-full">

        <aside className="admin-nav-scroll admin-sidebar hidden lg:flex flex-col flex-shrink-0 border-l border-plum-100/70 dark:border-plum-950/40 bg-white/70 dark:bg-pearl-900/70 backdrop-blur-xl p-5 justify-between select-none h-full overflow-y-auto">
          {/* Brand Logo & Title */}
          <div className="space-y-6">
            <button type="button" aria-label="داشبورد آرنا پیور"
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-3 cursor-pointer group admin-sidebar-brand"
            >
              <span className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-tr from-plum-600 via-rosewood-600 to-rosewood-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-plum-500/25 group-hover:scale-105 transition-transform">
                A
              </span>
              <span className="admin-sidebar-label text-start">
                <span className="font-black text-base text-pearl-900 dark:text-white flex items-center gap-1.5">
                  آرنا پیور
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                </span>
                <span className="text-[11px] text-pearl-400 font-medium block">
                  پنل مدیریت فروشگاه
                </span>
              </span>
            </button>

            {/* Navigation Links */}
            <nav className="space-y-1.5" aria-label="منوی مدیریت">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <motion.button
                    key={item.id}
                    aria-label={item.label}
                    data-tooltip={item.label}
                    whileHover={{ x: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all relative ${
                      isActive
                        ? 'bg-gradient-to-l from-plum-600/15 via-rosewood-600/10 to-transparent text-plum-700 dark:text-plum-300 border-r-4 border-plum-600 shadow-xs'
                        : 'text-pearl-600 dark:text-pearl-400 hover:bg-plum-50/50 dark:hover:bg-pearl-800/50 hover:text-plum-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`shrink-0 p-1.5 rounded-xl transition-colors ${
                          isActive
                            ? 'bg-gradient-to-tr from-plum-600 to-rosewood-600 text-white shadow-md shadow-plum-500/20'
                            : 'text-pearl-500 dark:text-pearl-400 group-hover:text-plum-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="admin-sidebar-label">{item.label}</span>
                    </div>


                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* User & Store Card Footer */}
          <div className="admin-sidebar-label pt-4 border-t border-pearl-100 dark:border-pearl-800/80 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-pearl-50 dark:bg-pearl-800/50 border border-pearl-100 dark:border-pearl-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-plum-500 to-rosewood-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm shadow-plum-500/20">
                  {currentUser?.name?.charAt(0) || 'م'}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-pearl-800 dark:text-pearl-200 truncate block">
                    {currentUser?.name || 'مدیریت آرنا پیور'}
                  </span>
                  <span className="text-[10px] text-pearl-400 block truncate">
                    {currentUser?.username ? `@${currentUser.username}` : 'دسترسی مدیریت'}
                  </span>
                </div>
              </div>

              {/* Logout / Switch User Button */}
              <button
                aria-label="خروج از حساب"
                onClick={() => {
                  playTactileClick();
                  if (onLogout) onLogout();
                }}
                className="p-1.5 rounded-xl text-pearl-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                data-tooltip="خروج از حساب / باز کردن صفحه ورود"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden">
          {/* Top Bar Navigation */}
          <header className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 md:px-8 py-3 bg-white/70 dark:bg-pearl-900/70 backdrop-blur-xl border-b border-plum-100/60 dark:border-plum-950/40 min-w-0">
            {/* Left: Mobile Menu Toggle, Title & Search Bar */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-lg min-w-0">
              <button
                aria-label={isMobileMenuOpen ? 'بستن منوی مدیریت' : 'باز کردن منوی مدیریت'}
                aria-expanded={isMobileMenuOpen}
                onClick={() => {
                  playTactileClick();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="lg:hidden p-2 rounded-2xl bg-white dark:bg-pearl-800 border border-pearl-200 dark:border-pearl-700 text-pearl-700 dark:text-pearl-200 shadow-xs flex-shrink-0"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="hidden sm:block truncate min-w-0">
                <h2 className="text-sm font-black text-pearl-800 dark:text-white truncate">
                  {navItems.find((n) => n.id === activePage)?.label || 'پنل مدیریت آرنا پیور'}
                </h2>
              </div>

              {can('products:read') && <div className="hidden md:flex min-w-0 flex-1"><AdminSearch onSearch={onSearch} products={products}/></div>}
            </div>

            {/* Right: Sound, Dark Mode, Notifications, User/Login Quick Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Tactile Sound Feedback Switch */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSoundToggle}
                className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-pearl-800 border border-pearl-200 dark:border-pearl-700 text-pearl-600 dark:text-pearl-300 hover:text-plum-600 shadow-xs transition-colors"
                aria-label={isMutedState ? 'فعال‌سازی صدای دکمه‌ها' : 'بی‌صدا کردن'}
                data-tooltip={isMutedState ? 'فعال‌سازی صدای لمس دکمه‌ها' : 'بی‌صدا کردن'}
              >
                {isMutedState ? (
                  <VolumeX className="w-4 h-4 text-pearl-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-plum-600" />
                )}
              </motion.button>

              {/* Theme Toggle (Dark / Light) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playTactileClick();
                  onToggleTheme();
                }}
                className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-pearl-800 border border-pearl-200 dark:border-pearl-700 text-pearl-600 dark:text-pearl-300 hover:text-amber-500 shadow-xs transition-colors"
                aria-label="تغییر تم تاریک یا روشن"
              >
                <Sun className="w-4 h-4 text-amber-400 hidden dark:block"/><Moon className="w-4 h-4 text-plum-600 dark:hidden"/>
              </motion.button>


              {/* Quick Login / Logout Screen Trigger */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playTactileClick();
                  onLogout();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-plum-50 to-rosewood-50 dark:from-pearl-800 dark:to-plum-950/50 border border-plum-200 dark:border-plum-800 text-plum-700 dark:text-plum-300 text-xs font-bold shadow-xs hover:border-plum-400 transition-all cursor-pointer"
                data-tooltip="خروج از حساب کاربری"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-plum-600 dark:text-plum-400" />
                <span>خروج</span>
              </motion.button>
            </div>
          </header>
          {can('products:read') && <div className="md:hidden relative z-20 px-3 py-2 bg-white dark:bg-pearl-900"><AdminSearch onSearch={onSearch} products={products}/></div>}

          {/* Page Container */}
          <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Drawer Navigation Modal */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-pearl-950/60 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="admin-nav-scroll relative w-72 max-w-[80vw] h-full bg-white dark:bg-pearl-900 border-l border-plum-200/80 dark:border-plum-900/40 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl z-10"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-plum-600 to-rosewood-500 flex items-center justify-center text-white font-black text-lg">
                      A
                    </div>
                    <span className="font-black text-pearl-900 dark:text-white">آرنا پیور</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="بستن منوی مدیریت"
                    className="p-2 rounded-xl text-pearl-400 hover:text-pearl-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-colors ${
                          isActive
                            ? 'bg-plum-600 text-white shadow-md shadow-plum-500/20'
                            : 'text-pearl-600 dark:text-pearl-400 hover:bg-pearl-100 dark:hover:bg-pearl-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>

                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="text-[11px] text-pearl-400 text-center pt-4 border-t border-pearl-100 dark:border-pearl-800">
                آرنا پیور © ۱۴۰۵
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
