import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Layers,
  ArrowRightLeft,
  Calendar,
  MessageSquare,
  Star,
  PlusCircle,
  Heart,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const {
    currentUser,
    products,
    barterRequests,
    buyRequests,
    transactions,
    notifications,
    messages,
    favorites,
  } = useApp();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-charcoal-900">Vui lòng đăng nhập</h2>
        <p className="text-xs text-sand-600 mt-1">
          Hãy đăng nhập để truy cập Bảng điều khiển cá nhân.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-block px-6 py-2.5 bg-eco-800 text-white rounded-xl text-xs font-semibold"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // User's listings
  const myListings = products.filter((p) => p.sellerId === currentUser.id);
  const activeListings = myListings.filter((p) => p.status === 'AVAILABLE');
  const reservedListings = myListings.filter((p) => p.status === 'RESERVED');

  // Received pending barter and buy offers
  const receivedPendingBarter = barterRequests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'PENDING'
  );
  const receivedPendingBuy = buyRequests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'PENDING'
  );
  const receivedPendingOffersCount = receivedPendingBarter.length + receivedPendingBuy.length;

  // Active meetup transactions
  const activeTransactions = transactions.filter(
    (t) =>
      (t.buyerId === currentUser.id || t.sellerId === currentUser.id) &&
      (t.status === 'APPOINTED' || t.status === 'RESCHEDULED')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. WELCOME HEADER & QUICK ACTIONS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Ambient glow in background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-eco-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <img
            src={currentUser.avatar}
            alt={currentUser.fullName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-eco-500/80 shadow-soft"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
                Xin chào, {currentUser.fullName}
              </h1>
              <span className="text-xs font-bold text-eco-800 bg-gradient-to-r from-eco-50 to-teal-50 border border-eco-200/80 px-2.5 py-0.5 rounded-full shadow-subtle">
                ★ {currentUser.trustScore} điểm uy tín
              </span>
            </div>
            <p className="text-xs text-sand-500 mt-1 font-medium">
              Khu vực sinh sống: <span className="font-semibold text-charcoal-800">{currentUser.district}, {currentUser.province}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-10">
          <Link
            to="/user/create-listing"
            className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-emerald transition-all whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 flex-shrink-0" />
            <span>+ Đăng tin mới</span>
          </Link>
          <Link
            to="/explore"
            className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-charcoal-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200/60 whitespace-nowrap"
          >
            <span>Khám phá sàn</span>
          </Link>
        </div>
      </div>

      {/* 2. OVERVIEW METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link
          to="/user/products"
          className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-eco-500 hover:shadow-card shadow-soft transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sand-500 uppercase tracking-wider">Kho đồ cá nhân</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-eco-50 to-teal-100 text-eco-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-subtle">
              <Layers className="w-4 h-4 text-eco-700" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-charcoal-900 tracking-tight">{myListings.length}</div>
          <div className="text-[11px] text-eco-700 font-semibold mt-1">
            {activeListings.length} món đang mở bán / đổi
          </div>
        </Link>

        <Link
          to="/user/exchanges"
          className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-sky-500 hover:shadow-card shadow-soft transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sand-500 uppercase tracking-wider">Đề nghị nhận được</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-50 to-blue-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-subtle">
              <ArrowRightLeft className="w-4 h-4 text-sky-600" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-charcoal-900 tracking-tight">
            {receivedPendingOffersCount}
          </div>
          <div className="text-[11px] text-sky-600 font-semibold mt-1">
            {receivedPendingOffersCount > 0 ? 'Đang chờ bạn phản hồi' : 'Đã phản hồi hết'}
          </div>
        </Link>

        <Link
          to="/user/transactions"
          className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-500 hover:shadow-card shadow-soft transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sand-500 uppercase tracking-wider">Lịch hẹn & Giao dịch</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-subtle">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-charcoal-900 tracking-tight">
            {activeTransactions.length}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            {activeTransactions.length > 0 ? 'Có buổi hẹn sắp tới' : 'Chưa có lịch hẹn mới'}
          </div>
        </Link>

        <Link
          to="/user/wishlist"
          className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-clay-500 hover:shadow-card shadow-soft transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sand-500 uppercase tracking-wider">Danh sách yêu thích</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-clay-50 to-orange-100 text-clay-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-subtle">
              <Heart className="w-4 h-4 text-clay-600" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-charcoal-900 tracking-tight">{favorites.length}</div>
          <div className="text-[11px] text-clay-600 font-semibold mt-1">Món đồ đang theo dõi</div>
        </Link>
      </div>

      {/* 3. ACTIVE MEETUP APPOINTMENTS NOTIFICATION */}
      {activeTransactions.length > 0 && (
        <section className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-50/90 border border-amber-200/80 rounded-3xl p-6 sm:p-7 space-y-4 shadow-subtle">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-700 animate-pulse" />
            <h3 className="font-extrabold text-sm sm:text-base text-amber-950 tracking-tight">
              Bạn có {activeTransactions.length} giao dịch hẹn gặp đang diễn ra!
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTransactions.map((tx) => {
              const prod = products.find((p) => p.id === tx.productId);
              return (
                <div key={tx.id} className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-sand-500 mb-2">
                      <span className="font-semibold">Mã GD: #{tx.id}</span>
                      <StatusBadge status={tx.status} size="sm" />
                    </div>
                    <h4 className="text-sm font-bold text-charcoal-900 truncate">
                      {prod?.title}
                    </h4>
                    <p className="text-xs text-sand-600 mt-1.5">
                      Địa điểm: <strong className="text-charcoal-900">{tx.appointmentLocation}</strong>
                    </p>
                    <p className="text-xs text-sand-600 mt-0.5">
                      Thời gian: <strong className="text-charcoal-900">{new Date(tx.appointmentTime).toLocaleString('vi-VN')}</strong>
                    </p>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-amber-800 font-bold">
                      {tx.buyerConfirmed || tx.sellerConfirmed
                        ? '1 bên đã xác nhận'
                        : 'Chờ gặp mặt trực tiếp'}
                    </span>
                    <Link
                      to={`/user/transactions/${tx.id}`}
                      className="px-4 py-2 bg-gradient-to-r from-eco-700 to-teal-600 text-white rounded-xl text-xs font-bold hover:from-eco-600 hover:to-teal-500 shadow-subtle transition-all"
                    >
                      Chi tiết lịch hẹn →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. CURRENT ACTIVE LISTINGS PREVIEW */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-900">
              Bài đăng của bạn ({myListings.length})
            </h2>
            <p className="text-xs text-sand-600 mt-0.5">
              Quản lý trạng thái Còn hàng, Đã hẹn hoặc Tạm ẩn bài viết.
            </p>
          </div>
          <Link
            to="/user/products"
            className="text-xs font-semibold text-eco-800 hover:text-eco-900"
          >
            Quản lý tất cả trong Kho đồ →
          </Link>
        </div>

        {myListings.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-sand-200 text-center space-y-3">
            <Layers className="w-10 h-10 text-sand-300 mx-auto" />
            <p className="text-xs sm:text-sm text-sand-600">
              Bạn chưa có món đồ nào trong kho cá nhân.
            </p>
            <Link
              to="/user/create-listing"
              className="inline-block px-5 py-2.5 bg-eco-800 text-white rounded-xl text-xs font-semibold"
            >
              + Đăng tin ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {myListings.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} variant="standard" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
