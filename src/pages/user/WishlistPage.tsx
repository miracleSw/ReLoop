import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
import { Heart, ArrowRight, Sparkles, LogIn, UserPlus, ShieldAlert, Layers } from 'lucide-react';
import { Product } from '../../types';

export const WishlistPage: React.FC = () => {
  const { currentUser, wishlist, products, removeFromWishlist } = useApp();

  // Route protection for Guest
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-100 to-amber-100 text-rose-600 flex items-center justify-center mx-auto shadow-subtle border border-rose-200/80">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-charcoal-900 tracking-tight">
            Yêu cầu đăng nhập để truy cập Wishlist
          </h2>
          <p className="text-sm text-sand-600 max-w-md mx-auto leading-relaxed">
            Danh sách yêu thích được lưu riêng cho từng tài khoản cá nhân. Vui lòng đăng nhập để xem các món đồ bạn đã lưu hoặc theo dõi biến động giá.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 text-white rounded-xl text-sm font-bold shadow-glow-emerald hover:shadow-lg transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập ngay</span>
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-charcoal-800 rounded-xl text-sm font-bold hover:bg-slate-50 shadow-subtle transition-all"
          >
            <UserPlus className="w-4 h-4 text-sand-500" />
            <span>Đăng ký tài khoản</span>
          </Link>
        </div>
      </div>
    );
  }

  // Filter wishlist items belonging to the current logged-in user, sorted newest savedAt first
  const userWishlistItems = wishlist
    .filter((w) => w.userId === currentUser.id)
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());

  const savedProducts = userWishlistItems
    .map((w) => products.find((p) => p.id === w.productId))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-200/80 mb-2 shadow-xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Bộ sưu tập yêu thích</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Danh sách yêu thích</span>
            <span className="inline-flex items-center justify-center p-1 rounded-lg bg-eco-100/70 text-eco-700">
              <Sparkles className="w-4 h-4" />
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lưu lại để theo dõi trạng thái món đồ hoặc chuẩn bị đồ để trao đổi.
          </p>
        </div>

        {savedProducts.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs">
              {savedProducts.length} sản phẩm đã lưu
            </span>
          </div>
        )}
      </div>

      {/* Empty State */}
      {savedProducts.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_35px_-8px_rgba(16,185,129,0.08)] space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-50 to-rose-100/80 border border-rose-200 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
            <Heart className="w-8 h-8 fill-rose-500/20" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Chưa có món đồ nào được lưu</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Hãy bấm biểu tượng trái tim trên các sản phẩm khi khám phá để lưu lại và theo dõi nhanh.
          </p>
          <div className="pt-2">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-glow-emerald hover:shadow-lg transition-all"
            >
              <span>Khám phá sản phẩm ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {savedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              variant="standard"
              showRemoveButton={true}
              onRemove={() => removeFromWishlist(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
