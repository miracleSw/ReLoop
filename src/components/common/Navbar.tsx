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
    <header className="sticky top-0 z-30 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-sand-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* 1. BRAND LOGO */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-eco-800 text-white flex items-center justify-center shadow-soft group-hover:bg-eco-700 transition-colors">
              <svg
                className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300"
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
                <span className="font-extrabold text-2xl tracking-tight text-eco-900 font-sans">
                  Re<span className="text-eco-600">Loop</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-eco-100 text-eco-800 px-1.5 py-0.5 rounded-full">
                  Eco
                </span>
              </div>
              <p className="text-[11px] text-sand-600 font-medium tracking-wide">
                Trao đổi & Đồ cũ bền vững
              </p>
            </div>
          </Link>

          {/* 2. PRIMARY NAV LINKS (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-charcoal-700">
            <Link
              to="/explore"
              className={`hover:text-eco-800 transition-colors ${
                location.pathname === '/explore' ? 'text-eco-800 font-semibold' : ''
              }`}
            >
              Khám phá đồ cũ
            </Link>
            <Link
              to="/explore?type=EXCHANGE"
              className="hover:text-eco-800 transition-colors flex items-center gap-1"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-eco-600" />
              Góc Đổi đồ
            </Link>
            <Link
              to="/categories"
              className={`hover:text-eco-800 transition-colors ${
                location.pathname === '/categories' ? 'text-eco-800 font-semibold' : ''
              }`}
            >
              Danh mục
            </Link>
            <Link
              to="/safety"
              className="hover:text-eco-800 transition-colors text-sand-700 hover:text-eco-800"
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
              className="w-full bg-sand-100 hover:bg-sand-200/70 focus:bg-white text-sm text-charcoal-900 rounded-full pl-10 pr-4 py-2.5 border border-transparent focus:border-eco-500 focus:outline-none focus:ring-2 focus:ring-eco-500/20 transition-all placeholder:text-sand-500"
            />
            <Search className="w-4 h-4 text-sand-500 absolute left-3.5 top-3 pointer-events-none" />
          </form>

          {/* 4. ACTIONS & USER PROFILE */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Wishlist */}
            <Link
              to="/user/wishlist"
              className="relative p-2.5 text-charcoal-700 hover:text-eco-800 hover:bg-sand-100 rounded-full transition-colors"
              title="Danh sách quan tâm"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-clay-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
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
                className="relative p-2.5 text-charcoal-700 hover:text-eco-800 hover:bg-sand-100 rounded-full transition-colors"
                title="Thông báo"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-clay-500 rounded-full animate-ping" />
                )}
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-clay-500 rounded-full" />
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-elevated border border-sand-200 py-3 z-50 animate-slide-up">
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
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full hover:bg-sand-100 border border-sand-200 transition-colors"
                >
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-xs font-bold text-charcoal-900 max-w-[100px] truncate">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-eco-700 font-semibold">
                      ★ {currentUser.trustScore}đ Uy tín
                    </span>
                  </div>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-eco-600"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-sand-600 hidden sm:block" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-elevated border border-sand-200 py-2 z-50 animate-slide-up">
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
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-charcoal-800 hover:text-eco-800 px-3 py-2 rounded-xl hover:bg-sand-100 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex text-xs sm:text-sm font-semibold text-eco-800 border border-eco-600/30 hover:bg-eco-50 px-3.5 py-2 rounded-xl transition-all"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Primary CTA: Post listing */}
            <Link
              to="/user/create-listing"
              className="flex items-center gap-1.5 bg-eco-800 hover:bg-eco-700 active:scale-95 text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-2.5 rounded-xl shadow-soft hover:shadow-card transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng tin</span>
              <span className="sm:hidden">Đăng</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-charcoal-700 hover:text-eco-800 rounded-xl hover:bg-sand-100 transition-colors"
              aria-label="Mở menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-sand-200 px-4 pt-3 pb-6 space-y-4 animate-slide-up">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm đồ điện tử, sách, xe đạp..."
              className="w-full bg-sand-100 text-sm text-charcoal-900 rounded-xl pl-10 pr-4 py-2.5 border border-sand-200"
            />
            <Search className="w-4 h-4 text-sand-500 absolute left-3.5 top-3 pointer-events-none" />
          </form>

          <nav className="flex flex-col space-y-2 text-sm font-medium text-charcoal-800">
            <Link
              to="/explore"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-sand-100"
            >
              Khám phá đồ cũ
            </Link>
            <Link
              to="/explore?type=EXCHANGE"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-sand-100 flex items-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4 text-eco-600" />
              Góc Đổi đồ
            </Link>
            <Link
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-sand-100"
            >
              Danh mục ngành hàng
            </Link>
            <Link
              to="/safety"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-sand-100"
            >
              Cẩm nang an toàn gặp mặt
            </Link>
            {currentUser?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-eco-50 text-eco-900 font-semibold"
              >
                Trang Quản trị Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
