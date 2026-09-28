import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LogIn, UserPlus, X, ShieldAlert, Heart } from 'lucide-react';

export const LoginPromptModal: React.FC = () => {
  const { isLoginPromptOpen, loginPromptMessage, closeLoginPrompt } = useApp();
  const navigate = useNavigate();

  if (!isLoginPromptOpen) return null;

  const handleLogin = () => {
    closeLoginPrompt();
    navigate('/login');
  };

  const handleRegister = () => {
    closeLoginPrompt();
    navigate('/register');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-elevated border border-slate-200/90 animate-slide-up relative">
        {/* Close Button */}
        <button
          onClick={closeLoginPrompt}
          className="absolute top-5 right-5 text-sand-400 hover:text-charcoal-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-gradient-to-tr from-rose-100 to-amber-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-subtle">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500/20" />
          </div>
          <h3 id="login-prompt-title" className="text-xl font-black text-charcoal-900 tracking-tight">
            Yêu cầu đăng nhập
          </h3>
          <p className="text-xs sm:text-sm text-sand-600 leading-relaxed px-2">
            {loginPromptMessage || 'Vui lòng đăng nhập vào tài khoản ReLoop để thực hiện thao tác này!'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleLogin}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-emerald hover:shadow-lg transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập ngay</span>
          </button>

          <button
            onClick={handleRegister}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-charcoal-800 font-bold text-sm flex items-center justify-center gap-2 shadow-subtle transition-all"
          >
            <UserPlus className="w-4 h-4 text-sand-500" />
            <span>Tạo tài khoản mới</span>
          </button>

          <button
            onClick={closeLoginPrompt}
            className="w-full py-2.5 text-xs text-sand-500 hover:text-charcoal-700 font-semibold transition-colors"
          >
            Để sau (Tiếp tục duyệt)
          </button>
        </div>
      </div>
    </div>
  );
};
