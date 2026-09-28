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
      <div className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.fullName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-eco-500 shadow-soft"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900">
                Xin chào, {currentUser.fullName}
              </h1>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                ★ {currentUser.trustScore}đ Uy tín
              </span>
            </div>
            <p className="text-xs text-sand-600 mt-1">
              Khu vực sinh sống: <span className="font-semibold text-charcoal-800">{currentUser.district}, {currentUser.province}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            to="/user/create-listing"
            className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-eco-800 hover:bg-eco-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-soft transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Đăng tin mới</span>
          </Link>
          <Link
            to="/explore"
            className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Khám phá sàn</span>
          </Link>
        </div>
      </div>

      {/* 2. OVERVIEW METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link
          to="/user/products"
          className="p-5 rounded-3xl bg-white border border-sand-200 hover:border-eco-400 hover:shadow-card transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sand-600">Kho đồ cá nhân</span>
            <div className="w-8 h-8 rounded-xl bg-eco-100 text-eco-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-charcoal-900">{myListings.length}</div>
          <div className="text-[11px] text-eco-700 font-medium mt-1">
            {activeListings.length} món đang mở bán / đổi
          </div>
        </Link>

        <Link
          to="/user/exchanges"
          className="p-5 rounded-3xl bg-white border border-sand-200 hover:border-eco-400 hover:shadow-card transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sand-600">Đề nghị nhận được</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-charcoal-900">
            {receivedPendingOffersCount}
          </div>
          <div className="text-[11px] text-sky-700 font-medium mt-1">
            {receivedPendingOffersCount > 0 ? 'Đang chờ bạn phản hồi' : 'Đã phản hồi hết'}
          </div>
        </Link>

        <Link
          to="/user/transactions"
          className="p-5 rounded-3xl bg-white border border-sand-200 hover:border-eco-400 hover:shadow-card transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sand-600">Lịch hẹn gặp mặt</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-charcoal-900">
            {activeTransactions.length}
          </div>
          <div className="text-[11px] text-amber-800 font-medium mt-1">
            {activeTransactions.length > 0 ? 'Có buổi hẹn sắp tới' : 'Chưa có lịch hẹn mới'}
          </div>
        </Link>

        <Link
          to="/user/wishlist"
          className="p-5 rounded-3xl bg-white border border-sand-200 hover:border-eco-400 hover:shadow-card transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sand-600">Đồ yêu thích</span>
            <div className="w-8 h-8 rounded-xl bg-clay-100 text-clay-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-charcoal-900">{favorites.length}</div>
          <div className="text-[11px] text-clay-700 font-medium mt-1">Món đồ đang theo dõi</div>
        </Link>
      </div>

      {/* 3. ACTIVE MEETUP APPOINTMENTS NOTIFICATION */}
      {activeTransactions.length > 0 && (
        <section className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-700 animate-pulse" />
            <h3 className="font-bold text-sm sm:text-base text-amber-950">
              Bạn có {activeTransactions.length} giao dịch hẹn gặp đang diễn ra!
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTransactions.map((tx) => {
              const prod = products.find((p) => p.id === tx.productId);
              return (
                <div key={tx.id} className="bg-white p-4 rounded-2xl border border-amber-200 shadow-subtle flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-sand-500 mb-1.5">
                      <span>Mã GD: #{tx.id}</span>
                      <StatusBadge status={tx.status} size="sm" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-charcoal-900 truncate">
                      {prod?.title}
                    </h4>
                    <p className="text-xs text-sand-600 mt-1">
                      Địa điểm: <strong className="text-charcoal-800">{tx.appointmentLocation}</strong>
                    </p>
                    <p className="text-xs text-sand-600 mt-0.5">
                      Thời gian: <strong className="text-charcoal-800">{new Date(tx.appointmentTime).toLocaleString('vi-VN')}</strong>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-sand-100 flex items-center justify-between">
                    <span className="text-[11px] text-amber-800 font-medium">
                      {tx.buyerConfirmed || tx.sellerConfirmed
                        ? '1 bên đã xác nhận'
                        : 'Chờ gặp mặt trực tiếp'}
                    </span>
                    <Link
                      to={`/user/transactions/${tx.id}`}
                      className="px-3.5 py-1.5 bg-eco-800 text-white rounded-lg text-xs font-semibold hover:bg-eco-700"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {myListings.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} variant="standard" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
