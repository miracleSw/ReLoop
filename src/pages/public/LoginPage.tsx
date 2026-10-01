import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Shield, Sparkles, AlertTriangle, ArrowRight, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { users, loginAs } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('hoangnam.eco@gmail.com');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetUser = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!targetUser) {
      setErrorMsg('Tài khoản email này chưa được đăng ký trên ReLoop.');
      return;
    }

    // Check LOCKED status (UC02 BR-02)
    if (targetUser.status === 'LOCKED') {
      setErrorMsg(
        `Tài khoản này đang bị KHÓA do vi phạm: "${targetUser.lockReason}". Vui lòng liên hệ BQT để khiếu nại.`
      );
      return;
    }

    loginAs(targetUser.id);
    if (targetUser.role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/user/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row">
      {/* LEFT: EDITORIAL STORYTELLING SIDEBAR */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#064E3B] via-[#043E30] to-[#022C22] text-white p-8 sm:p-14 lg:p-20 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span>Cộng đồng Tiêu Dùng Tuần Hoàn</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Nơi những món đồ cũ <br />
            <span className="font-editorial italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
              tìm thấy hành trình mới.
            </span>
          </h2>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-md font-normal">
            Hơn 3,800 món đồ được trao đổi và tái sử dụng thay vì vứt bỏ. Cùng ReLoop xây dựng văn hóa tiêu dùng bền vững, minh bạch và an toàn.
          </p>
        </div>

        <div className="relative z-10 pt-10 border-t border-white/15 text-xs text-sand-300 space-y-1">
          <p className="font-bold text-white">Mô hình Face-to-Face an toàn tại địa phương</p>
          <p className="text-sand-300">Kiểm tra tận mắt • Thỏa thuận sòng phẳng • Đánh giá 2 chiều</p>
        </div>
      </div>

      {/* RIGHT: CLEAR AUTH FORM */}
      <div className="lg:w-1/2 p-5 sm:p-12 lg:p-20 flex items-center justify-center bg-[#F8FAF9]">
        <div className="max-w-md w-full space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Đăng nhập tài khoản
            </h1>
            <p className="text-xs sm:text-sm text-sand-500 mt-1">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-bold text-eco-700 hover:text-eco-900 hover:underline">
                Đăng ký thành viên mới
              </Link>
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                Địa chỉ Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-sm bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-subtle"
                />
                <Mail className="w-4 h-4 text-sand-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-charcoal-800">Mật khẩu</label>
                <Link to="/forgot-password" className="text-xs text-eco-700 hover:underline font-semibold">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-subtle"
                />
                <Lock className="w-4 h-4 text-sand-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-eco-600 via-emerald-600 to-teal-600 hover:from-eco-500 hover:to-teal-500 active:scale-98 text-white font-bold text-sm shadow-md shadow-eco-600/25 hover:shadow-lg transition-all"
            >
              Đăng nhập ReLoop
            </button>
          </form>

          {/* QUICK PERSONA LOGIN HELPER */}
          <div className="pt-6 border-t border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-sand-500 uppercase tracking-wider block text-center">
              Tài khoản trải nghiệm nhanh:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEmail('hoangnam.eco@gmail.com');
                  setPassword('password123');
                }}
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-eco-500 hover:bg-eco-50/50 text-left font-semibold text-charcoal-800 transition-colors shadow-subtle"
              >
                👤 Hoàng Nam (Bán)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('minhanh.greenlife@gmail.com');
                  setPassword('password123');
                }}
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-eco-500 hover:bg-eco-50/50 text-left font-semibold text-charcoal-800 transition-colors shadow-subtle"
              >
                👤 Minh Anh (Mua/Đổi)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@reloop.vn');
                  setPassword('password123');
                }}
                className="p-2.5 rounded-xl bg-eco-50 border border-eco-200 hover:border-eco-600 text-left font-bold text-eco-900 transition-colors shadow-subtle"
              >
                👑 Trọng Nghĩa (Admin)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('vankiet.baduser@gmail.com');
                  setPassword('password123');
                }}
                className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 hover:border-rose-400 text-left font-semibold text-rose-800 transition-colors shadow-subtle"
                title="Tài khoản vi phạm quy định"
              >
                🚫 Văn Kiệt (Bị khóa)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
