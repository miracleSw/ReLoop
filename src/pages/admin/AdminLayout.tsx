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
    <div className="min-h-screen bg-[#F8FAF9] text-charcoal-900 flex flex-col">
      {/* ADMIN TOPBAR */}
      <header className="h-16 bg-slate-900 text-white px-6 flex items-center justify-between border-b border-slate-800/80 z-30 sticky top-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-eco-500 to-teal-500 text-white flex items-center justify-center font-black text-xs shadow-glow-emerald">
            RL
          </div>
          <span className="font-extrabold text-base tracking-tight">
            Re<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Loop</span> Admin Portal
          </span>
          <span className="text-[10px] bg-white/10 text-emerald-300 border border-white/15 font-bold px-2.5 py-0.5 rounded-full ml-2">
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

          <div className="flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
              alt="Admin"
              className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-400/80"
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
        <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 p-4 space-y-6 flex-shrink-0">
          <div className="text-[11px] font-bold text-sand-400 uppercase tracking-wider px-3">
            Hệ thống Quản trị
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-eco-700 to-eco-600 text-white font-bold shadow-glow-emerald'
                      : 'text-charcoal-700 hover:bg-slate-50 hover:text-eco-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-100">
            <div className="p-3.5 bg-gradient-to-br from-eco-50/80 to-teal-50/80 rounded-2xl border border-eco-200/80 text-xs text-eco-950 space-y-1 shadow-subtle">
              <div className="font-bold flex items-center gap-1.5 text-eco-800">
                <ShieldCheck className="w-4 h-4 text-eco-700" />
                <span>Quyền hạn Admin</span>
              </div>
              <p className="text-[11px] text-eco-800 leading-snug font-normal">
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
