import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Heart,
  Bell,
  PlusCircle,
  Menu,
  X,
  User,
  Shield,
  Layers,
  ArrowRightLeft,
  Calendar,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentRole,
    favorites,
    notifications,
    loginAs,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* 1. BRAND LOGO */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-eco-700 via-eco-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-eco-600/20 group-hover:shadow-eco-500/40 group-hover:scale-105 transition-all duration-300">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:rotate-12 transition-transform duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                <path d="M11 19h8.2a1.8 1.8 0 0 0 1.58-1 1.79 1.79 0 0 0-.08-1.85L17.4 11.5" />
                <path d="m21.5 8-3.4 5.5H12" />
                <path d="M2.5 16 6 10.5H12" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-charcoal-900 font-sans">
                  Re<span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-600 to-teal-600">Loop</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-eco-100 to-teal-50 text-eco-800 border border-eco-200/80 px-1.5 sm:px-2 py-0.5 rounded-full shadow-subtle">
                  Eco
                </span>
              </div>
              <p className="text-[11px] text-sand-500 font-medium tracking-wide hidden sm:block">
                Trao đổi & Đồ cũ bền vững
              </p>
            </div>
          </Link>

          {/* 2. PRIMARY NAV LINKS (Desktop) */}
          <nav className="hidden lg:flex items-center gap-2 text-sm font-semibold text-charcoal-700">
            <Link
              to="/explore"
              className={`px-3 py-1.5 rounded-full transition-all ${
                location.pathname === '/explore'
                  ? 'text-eco-800 bg-eco-50 font-bold shadow-subtle'
                  : 'hover:text-eco-700 hover:bg-eco-50/70'
              }`}
            >
              Khám phá đồ cũ
            </Link>
            <Link
              to="/explore?type=EXCHANGE"
              className="px-3 py-1.5 rounded-full hover:text-eco-800 hover:bg-eco-50/70 transition-all flex items-center gap-1.5 group/item"
            >
              <div className="w-5 h-5 rounded-full bg-eco-100 text-eco-700 flex items-center justify-center group-hover/item:rotate-180 transition-transform duration-500">
                <ArrowRightLeft className="w-3 h-3" />
              </div>
              <span>Góc Đổi đồ</span>
            </Link>
            <Link
              to="/categories"
              className={`px-3 py-1.5 rounded-full transition-all ${
                location.pathname === '/categories'
                  ? 'text-eco-800 bg-eco-50 font-bold shadow-subtle'
                  : 'hover:text-eco-700 hover:bg-eco-50/70'
              }`}
            >
              Danh mục
            </Link>
            <Link
              to="/safety"
              className={`px-3 py-1.5 rounded-full transition-all ${
                location.pathname === '/safety'
                  ? 'text-eco-800 bg-eco-50 font-bold shadow-subtle'
                  : 'hover:text-eco-700 hover:bg-eco-50/70'
              }`}
            >
              Cẩm nang an toàn
            </Link>
          </nav>

          {/* 3. SEARCH BAR (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xs xl:max-w-sm relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm đồ điện tử, sách, xe đạp..."
              className="w-full bg-white hover:bg-sand-50 focus:bg-white text-sm text-charcoal-900 rounded-full pl-10 pr-4 py-2.5 border border-slate-200/90 shadow-sm focus:border-eco-500 focus:outline-none focus:ring-4 focus:ring-eco-500/15 transition-all placeholder:text-sand-400"
            />
            <Search className="w-4 h-4 text-sand-400 absolute left-3.5 top-3 pointer-events-none" />
          </form>

          {/* 4. ACTIONS & USER PROFILE */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Wishlist */}
            <Link
              to="/user/wishlist"
              className="hidden sm:inline-flex relative p-2 sm:p-2.5 text-charcoal-700 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors border border-transparent hover:border-rose-100"
              title="Danh sách quan tâm"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-clay-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm shadow-clay-500/50">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsUserMenuOpen(false);
                }}
                className="relative p-2 sm:p-2.5 text-charcoal-700 hover:text-eco-800 hover:bg-sand-100 rounded-full transition-colors"
                title="Thông báo"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-clay-500 rounded-full animate-ping" />
                )}
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-clay-500 rounded-full" />
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-1.5rem)] sm:w-96 bg-white rounded-2xl shadow-elevated border border-sand-200 py-3 z-50 animate-slide-up">
                  <div className="px-4 py-2 border-b border-sand-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-charcoal-900">Thông báo</span>
                      {unreadNotifs.length > 0 && (
                        <span className="text-[11px] bg-clay-100 text-clay-700 font-semibold px-2 py-0.5 rounded-full">
                          {unreadNotifs.length} mới
                        </span>
                      )}
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-eco-700 hover:text-eco-900 font-medium"
                      >
                        Đọc tất cả
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-sand-50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-sand-500">
                        Chưa có thông báo mới nào
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <Link
                          key={n.id}
                          to={n.link}
                          onClick={() => {
                            markNotificationRead(n.id);
                            setIsNotifOpen(false);
                          }}
                          className={`block px-4 py-3 hover:bg-sand-50 transition-colors ${
                            !n.isRead ? 'bg-eco-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full mt-1.5 bg-eco-600 flex-shrink-0" />
                            <div>
                              <div className="text-xs font-semibold text-charcoal-900">
                                {n.title}
                              </div>
                              <p className="text-xs text-sand-700 mt-0.5 line-clamp-2 leading-relaxed">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-sand-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>

                  <div className="px-4 pt-2 border-t border-sand-100 text-center">
                    <Link
                      to="/user/notifications"
                      onClick={() => setIsNotifOpen(false)}
                      className="text-xs text-eco-700 hover:text-eco-900 font-semibold"
                    >
                      Xem toàn bộ thông báo →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsNotifOpen(false);
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-3 rounded-full hover:bg-white bg-slate-50/80 border border-slate-200/80 shadow-subtle hover:shadow-soft transition-all"
                >
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-xs font-bold text-charcoal-900 max-w-[100px] truncate">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-eco-600 font-bold flex items-center justify-end gap-0.5">
                      ★ {currentUser.trustScore}đ Uy tín
                    </span>
                  </div>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.fullName}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-eco-500"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-sand-500 hidden sm:block" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 max-w-[calc(100vw-1.5rem)] bg-white/95 backdrop-blur-xl rounded-2xl shadow-elevated border border-slate-200/80 py-2 z-50 animate-slide-up">
                    <div className="px-4 py-3 border-b border-sand-100 bg-sand-50/60 rounded-t-2xl">
                      <div className="font-bold text-sm text-charcoal-900">
                        {currentUser.fullName}
                      </div>
                      <div className="text-xs text-sand-600 truncate">{currentUser.email}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[11px] bg-eco-100 text-eco-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-eco-600" />
                          Điểm uy tín: {currentUser.trustScore}/100
                        </span>
                        {currentUser.role === 'ADMIN' && (
                          <span className="text-[10px] bg-charcoal-900 text-white font-bold px-1.5 py-0.5 rounded">
                            ADMIN
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1 text-sm text-charcoal-700">
                      {currentUser.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-eco-50 text-eco-900 font-semibold"
                        >
                          <Shield className="w-4 h-4 text-eco-700" />
                          <span>Bảng điều khiển Admin</span>
                        </Link>
                      )}

                      <Link
                        to="/user/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-sand-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-sand-500" />
                        <span>Tổng quan Dashboard</span>
                      </Link>

                      <Link
                        to="/user/products"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-sand-50 transition-colors"
                      >
                        <Layers className="w-4 h-4 text-sand-500" />
                        <span>Kho đồ cá nhân</span>
                      </Link>

                      <Link
                        to="/user/exchanges"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-sand-50 transition-colors"
                      >
                        <ArrowRightLeft className="w-4 h-4 text-sand-500" />
                        <span>Đề nghị đổi đồ</span>
                      </Link>

                      <Link
                        to="/user/transactions"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-sand-50 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-sand-500" />
                        <span>Lịch hẹn & Giao dịch</span>
                      </Link>

                      <Link
                        to="/user/messages"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-sand-50 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-sand-500" />
                        <span>Hộp thư đề nghị</span>
                      </Link>

                      <Link
                        to="/user/reviews"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-sand-50 transition-colors"
                      >
                        <Star className="w-4 h-4 text-sand-500" />
                        <span>Đánh giá & Uy tín</span>
                      </Link>

                      <Link
                        to="/user/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-sand-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-sand-500" />
                        <span>Cài đặt tài khoản</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-sand-100">
                      <button
                        onClick={() => {
                          loginAs(null);
                          setIsUserMenuOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-bold text-charcoal-800 hover:text-eco-700 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full hover:bg-eco-50/80 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex text-xs sm:text-sm font-bold text-eco-700 bg-eco-50 hover:bg-eco-100/80 border border-eco-200/80 px-4 py-2 rounded-full transition-all shadow-subtle"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Primary CTA: Post listing */}
            <Link
              to="/user/create-listing"
              className="hidden sm:inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-eco-600 via-emerald-600 to-teal-600 hover:from-eco-500 hover:to-teal-500 active:scale-95 text-white font-bold text-xs sm:text-sm px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md shadow-eco-600/25 hover:shadow-lg hover:shadow-eco-500/35 hover:-translate-y-0.5 transition-all flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4 flex-shrink-0" />
              <span>Đăng tin</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-charcoal-700 hover:text-eco-800 rounded-xl hover:bg-sand-100 transition-colors flex-shrink-0"
              aria-label="Mở menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 pt-3 pb-6 space-y-4 animate-slide-up shadow-card">
          {/* Mobile Primary CTA */}
          <Link
            to="/user/create-listing"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-eco-600 via-emerald-600 to-teal-600 text-white font-bold text-sm rounded-xl shadow-glow-emerald"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Đăng tin thanh lý / Trao đổi</span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm đồ điện tử, sách, xe đạp..."
              className="w-full bg-slate-50 text-sm text-charcoal-900 rounded-xl pl-10 pr-4 py-2.5 border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500"
            />
            <Search className="w-4 h-4 text-sand-400 absolute left-3.5 top-3 pointer-events-none" />
          </form>

          <nav className="flex flex-col space-y-1.5 text-sm font-semibold text-charcoal-800">
            <Link
              to="/user/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                location.pathname === '/user/wishlist'
                  ? 'bg-eco-50 text-eco-800 font-bold'
                  : 'hover:bg-slate-50 hover:text-eco-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Danh sách quan tâm</span>
              </div>
              {favorites.length > 0 && (
                <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              to="/explore"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl transition-all ${
                location.pathname === '/explore'
                  ? 'bg-eco-50 text-eco-800 font-bold'
                  : 'hover:bg-slate-50 hover:text-eco-700'
              }`}
            >
              Khám phá đồ cũ
            </Link>
            <Link
              to="/explore?type=EXCHANGE"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-eco-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-eco-600" />
                <span>Góc Đổi đồ</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Hot
              </span>
            </Link>
            <Link
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl transition-all ${
                location.pathname === '/categories'
                  ? 'bg-eco-50 text-eco-800 font-bold'
                  : 'hover:bg-slate-50 hover:text-eco-700'
              }`}
            >
              Danh mục ngành hàng
            </Link>
            <Link
              to="/safety"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl transition-all ${
                location.pathname === '/safety'
                  ? 'bg-eco-50 text-eco-800 font-bold'
                  : 'hover:bg-slate-50 hover:text-eco-700'
              }`}
            >
              Cẩm nang an toàn gặp mặt
            </Link>
            {currentUser?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-eco-700 to-eco-600 text-white font-bold shadow-glow-emerald flex items-center justify-between"
              >
                <span>Trang Quản trị Admin</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Admin</span>
              </Link>
            )}
          </nav>

          {!currentUser && (
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2.5 text-center text-xs font-bold text-charcoal-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-gradient-to-r from-eco-600 to-teal-600 rounded-xl shadow-glow-emerald transition-all"
              >
                Đăng ký tài khoản
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
