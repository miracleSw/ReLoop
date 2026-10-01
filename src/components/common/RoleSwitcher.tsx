import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, UserCheck, Eye, RotateCcw, ChevronDown, Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, currentRole, users, loginAs, resetData } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

  if (isCollapsed) {
    return (
      <aside aria-label="Chuyển đổi tài khoản" className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-white/95 backdrop-blur-xl text-charcoal-900 rounded-full shadow-[0_8px_25px_-5px_rgba(16,185,129,0.25)] border border-slate-200/90 p-2 sm:p-2.5 flex items-center gap-1.5 text-xs hover:scale-105 transition-all"
          title="Chuyển tài khoản"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
          <span className="font-bold text-eco-700 text-[11px] sm:text-xs">
            {currentRole === 'ADMIN' ? '👑' : currentUser ? '👤' : '👀'}
          </span>
        </button>
      </aside>
    );
  }

  return (
    <aside aria-label="Chuyển đổi tài khoản" className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 max-w-[calc(100vw-1.5rem)]">
      <div className="bg-white/95 backdrop-blur-xl text-charcoal-900 rounded-2xl shadow-[0_12px_30px_-5px_rgba(16,185,129,0.18)] border border-slate-200/90 p-1.5 sm:p-2.5 flex items-center gap-1.5 sm:gap-2 text-xs">
        <div className="flex items-center gap-1.5 pl-1 sm:pl-2 min-w-0">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50 flex-shrink-0" />
          <span className="text-slate-500 font-medium hidden sm:inline">Tài khoản:</span>
          <span className="font-bold text-eco-700 truncate max-w-[90px] sm:max-w-[140px] md:max-w-none">
            {currentRole === 'ADMIN'
              ? '👑 Quản trị viên'
              : currentUser
              ? `👤 ${currentUser.fullName}`
              : '👀 Khách'}
          </span>
        </div>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200/80 text-charcoal-800 font-semibold px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl transition-all text-[11px] sm:text-xs"
            title="Đổi tài khoản"
          >
            <span>Đổi</span>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70" />
          </button>

          {isOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-72 max-w-[calc(100vw-2rem)] bg-white text-charcoal-900 rounded-2xl shadow-elevated border border-slate-200 p-2 animate-slide-up z-50">
              <div className="px-3 py-2 border-b border-sand-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-charcoal-700 uppercase tracking-wider">
                  Chuyển nhanh tài khoản
                </span>
                <span className="text-[10px] bg-eco-100 text-eco-800 font-semibold px-1.5 py-0.5 rounded">
                  Tài khoản mẫu
                </span>
              </div>

              <div className="py-1 space-y-1">
                {/* Admin */}
                <button
                  onClick={() => {
                    loginAs('user-admin');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                    currentUser?.id === 'user-admin'
                      ? 'bg-eco-50 text-eco-900 font-semibold'
                      : 'hover:bg-sand-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-eco-800 text-white flex items-center justify-center text-[11px]">
                      👑
                    </span>
                    <div>
                      <div className="text-xs font-semibold">Nguyễn Trọng Nghĩa</div>
                      <div className="text-[10px] text-eco-700">Quản trị viên (Admin)</div>
                    </div>
                  </div>
                  {currentUser?.id === 'user-admin' && <Check className="w-4 h-4 text-eco-700" />}
                </button>

                {/* Seller: Hoang Nam */}
                <button
                  onClick={() => {
                    loginAs('user-1');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                    currentUser?.id === 'user-1'
                      ? 'bg-eco-50 text-eco-900 font-semibold'
                      : 'hover:bg-sand-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      className="w-6 h-6 rounded-full object-cover"
                      alt="Hoàng Nam"
                    />
                    <div>
                      <div className="text-xs font-semibold">Hoàng Nam (Người bán)</div>
                      <div className="text-[10px] text-sand-500">Chủ bài đăng Fuji X-T20 & Xe đạp</div>
                    </div>
                  </div>
                  {currentUser?.id === 'user-1' && <Check className="w-4 h-4 text-eco-700" />}
                </button>

                {/* Buyer/Trader: Minh Anh */}
                <button
                  onClick={() => {
                    loginAs('user-2');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                    currentUser?.id === 'user-2'
                      ? 'bg-eco-50 text-eco-900 font-semibold'
                      : 'hover:bg-sand-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                      className="w-6 h-6 rounded-full object-cover"
                      alt="Minh Anh"
                    />
                    <div>
                      <div className="text-xs font-semibold">Minh Anh (Người mua/đổi)</div>
                      <div className="text-[10px] text-sand-500">Đã gửi đề nghị đổi phím Keychron</div>
                    </div>
                  </div>
                  {currentUser?.id === 'user-2' && <Check className="w-4 h-4 text-eco-700" />}
                </button>

                {/* Other User: Quoc Huy */}
                <button
                  onClick={() => {
                    loginAs('user-3');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                    currentUser?.id === 'user-3'
                      ? 'bg-eco-50 text-eco-900 font-semibold'
                      : 'hover:bg-sand-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                      className="w-6 h-6 rounded-full object-cover"
                      alt="Quốc Huy"
                    />
                    <div>
                      <div className="text-xs font-semibold">Quốc Huy (Thành viên mới)</div>
                      <div className="text-[10px] text-sand-500">Đăng bán ghế Ergonomic & Guitar</div>
                    </div>
                  </div>
                  {currentUser?.id === 'user-3' && <Check className="w-4 h-4 text-eco-700" />}
                </button>

                {/* Guest */}
                <button
                  onClick={() => {
                    loginAs(null);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                    !currentUser ? 'bg-eco-50 text-eco-900 font-semibold' : 'hover:bg-sand-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sand-200 text-charcoal-700 flex items-center justify-center text-xs">
                      👀
                    </span>
                    <div>
                      <div className="text-xs font-semibold">Khách (Chưa đăng nhập)</div>
                      <div className="text-[10px] text-sand-500">Trải nghiệm chế độ xem</div>
                    </div>
                  </div>
                  {!currentUser && <Check className="w-4 h-4 text-eco-700" />}
                </button>
              </div>

              {/* Fast quick jumps */}
              <div className="mt-2 pt-2 border-t border-sand-100 flex items-center justify-between px-1">
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] text-eco-700 hover:underline font-medium flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Vào trang Admin
                </Link>
                <Link
                  to="/user/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] text-eco-700 hover:underline font-medium flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Vào trang Cá nhân
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Reset Mock Data button */}
        <button
          onClick={resetData}
          className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-eco-700 rounded-xl transition-all"
          title="Đặt lại dữ liệu mẫu"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Collapse button */}
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all text-[11px] font-bold"
          title="Thu gọn"
        >
          ✕
        </button>
      </div>
    </aside>
  );
};
