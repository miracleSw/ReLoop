import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white/95 backdrop-blur-xl shadow-glow-emerald',
    error: 'border-rose-200 bg-white/95 backdrop-blur-xl shadow-card',
    warning: 'border-amber-200 bg-white/95 backdrop-blur-xl shadow-card',
    info: 'border-sky-200 bg-white/95 backdrop-blur-xl shadow-card',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border transition-all duration-300 transform translate-y-0 opacity-100 ${borders[toast.type]}`}
        >
          {icons[toast.type]}
          <div className="flex-1 text-sm font-semibold text-charcoal-900 leading-snug">
            {toast.message}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-sand-400 hover:text-charcoal-600 transition-colors p-0.5"
            aria-label="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
