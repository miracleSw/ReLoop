import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Layers,
  FolderTree,
  AlertTriangle,
  Star,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Bell,
  ArrowRight
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { currentUser, reports, products } = useApp();
  const location = useLocation();

  const pendingReportsCount = reports.filter((r) => r.status === 'PENDING').length;
  const flaggedPostsCount = products.filter((p) => p.flagProhibited || p.status === 'LOCKED').length;

  const navItems = [
    {
      to: '/admin',
      label: 'Tổng quan Thống kê',
      icon: <LayoutDashboard className="w-4 h-4" />,
      exact: true,
    },
    {
      to: '/admin/users',
      label: 'Quản lý Người dùng',
      icon: <Users className="w-4 h-4" />,
    },
    {
      to: '/admin/posts',
      label: 'Kiểm duyệt Bài đăng',
      icon: <Layers className="w-4 h-4" />,
      badge: flaggedPostsCount > 0 ? `${flaggedPostsCount}` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      to: '/admin/categories',
      label: 'Quản lý Danh mục',
      icon: <FolderTree className="w-4 h-4" />,
    },
    {
      to: '/admin/reports',
      label: 'Báo cáo & Tranh chấp',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: pendingReportsCount > 0 ? `${pendingReportsCount}` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      to: '/admin/reviews',
      label: 'Đánh giá & Khiếu nại',
      icon: <Star className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-charcoal-900 flex flex-col">
      {/* ADMIN TOPBAR */}
      <header className="h-16 bg-charcoal-900 text-white px-6 flex items-center justify-between border-b border-charcoal-800 z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-eco-600 text-white flex items-center justify-center font-bold text-xs">
            RL
          </div>
          <span className="font-extrabold text-base tracking-tight">
            Re<span className="text-eco-400">Loop</span> Admin Portal
          </span>
          <span className="text-[10px] bg-white/10 text-emerald-300 font-semibold px-2 py-0.5 rounded ml-2">
            HUSC-33 Management
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-sand-300 hover:text-white transition-colors"
          >
            <span>Về giao diện Sàn</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="h-4 w-px bg-white/20" />

          <div className="flex items-center gap-2">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
              alt="Admin"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-400"
            />
            <span className="text-xs font-semibold text-white hidden sm:inline">
              Trọng Nghĩa (Lead Admin)
            </span>
          </div>
        </div>
      </header>

      {/* ADMIN WORKSPACE (SIDEBAR + MAIN CONTENT) */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 bg-white border-r border-sand-200 p-4 space-y-6 flex-shrink-0">
          <div className="text-[11px] font-bold text-sand-500 uppercase tracking-wider px-3">
            Hệ thống Quản trị
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-eco-800 text-white font-bold shadow-soft'
                      : 'text-charcoal-700 hover:bg-sand-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-sand-100">
            <div className="p-3 bg-eco-50 rounded-2xl border border-eco-200 text-xs text-eco-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-eco-700" />
                <span>Quyền hạn Admin</span>
              </div>
              <p className="text-[11px] text-eco-800 leading-snug">
                Toàn quyền kiểm duyệt hàng cấm, khóa tài khoản vi phạm và đối soát bằng chứng giao dịch.
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN ADMIN CONTENT OUTLET */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
