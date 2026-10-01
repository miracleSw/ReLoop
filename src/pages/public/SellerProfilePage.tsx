import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../../components/common/RatingStars';
import { ProductCard } from '../../components/common/ProductCard';
import { ReportModal } from '../../components/common/ReportModal';
import {
  MapPin,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Star,
  Layers,
  ArrowRightLeft,
  ShieldAlert,
  Clock,
  HeartHandshake
} from 'lucide-react';

export const SellerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { users, products, reviews } = useApp();
  const [isReportOpen, setIsReportOpen] = useState(false);

  const seller = users.find((u) => u.id === id);

  if (!seller) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-charcoal-900">Không tìm thấy người dùng</h2>
        <Link to="/explore" className="mt-4 inline-block text-eco-800 text-sm font-semibold hover:underline">
          Quay lại Khám phá
        </Link>
      </div>
    );
  }

  // Active listings by this seller
  const sellerListings = products.filter(
    (p) => p.sellerId === seller.id && (p.status === 'AVAILABLE' || p.status === 'RESERVED')
  );

  // Reviews received
  const sellerReviews = reviews.filter((r) => r.targetUserId === seller.id);

  // Average criteria scores
  const avgPunctuality =
    sellerReviews.length > 0
      ? (sellerReviews.reduce((sum, r) => sum + r.criteria.punctuality, 0) / sellerReviews.length).toFixed(1)
      : '5.0';
  const avgCourtesy =
    sellerReviews.length > 0
      ? (sellerReviews.reduce((sum, r) => sum + r.criteria.courtesy, 0) / sellerReviews.length).toFixed(1)
      : '5.0';
  const avgAccuracy =
    sellerReviews.length > 0
      ? (sellerReviews.reduce((sum, r) => sum + r.criteria.accuracy, 0) / sellerReviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. SELLER HERO BANNER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle ambient glow in corner */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-eco-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={seller.avatar}
              alt={seller.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-eco-500/80 shadow-soft"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
                  {seller.fullName}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-eco-600 fill-eco-100 flex-shrink-0" />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-sand-500">
                <span className="flex items-center gap-1.5 font-medium text-charcoal-700">
                  <MapPin className="w-3.5 h-3.5 text-eco-600" />
                  {seller.district}, {seller.province}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sand-400" />
                  Tham gia từ {new Date(seller.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              {seller.bio && (
                <p className="text-xs sm:text-sm text-sand-600 max-w-xl pt-1 leading-relaxed">
                  {seller.bio}
                </p>
              )}
            </div>
          </div>

          {/* Trust Score & Badges */}
          <div className="flex flex-row md:flex-col items-end gap-3 w-full md:w-auto justify-between md:justify-start pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="text-left md:text-right bg-gradient-to-br from-eco-50 to-teal-50 border border-eco-200/70 p-3.5 px-4 rounded-2xl shadow-subtle">
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-eco-700 to-teal-600">
                ★ {seller.trustScore}/100
              </div>
              <div className="text-[11px] text-eco-900 font-bold uppercase tracking-wider mt-0.5">Điểm uy tín</div>
            </div>

            <button
              onClick={() => setIsReportOpen(true)}
              className="text-xs text-sand-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Báo cáo thành viên</span>
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="text-xl font-extrabold text-charcoal-900">{seller.totalTransactions}</div>
            <div className="text-[11px] text-sand-500 font-medium mt-0.5">Giao dịch hoàn tất</div>
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="text-xl font-extrabold text-charcoal-900">{seller.rating.toFixed(1)} / 5.0</div>
            <div className="text-[11px] text-sand-500 font-medium mt-0.5">Đánh giá chung ({sellerReviews.length})</div>
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="text-xl font-extrabold text-emerald-600">{avgPunctuality} ★</div>
            <div className="text-[11px] text-sand-500 font-medium mt-0.5">Đúng hẹn khi gặp</div>
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="text-xl font-extrabold text-eco-600">{avgAccuracy} ★</div>
            <div className="text-[11px] text-sand-500 font-medium mt-0.5">Đúng mô tả sản phẩm</div>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE LISTINGS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-charcoal-900 tracking-tight">
            Món đồ đang đăng bán / trao đổi ({sellerListings.length})
          </h2>
        </div>

        {sellerListings.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200/90 text-center text-sm text-sand-400">
            Thành viên hiện chưa có bài đăng nào đang mở.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {sellerListings.map((p) => (
              <ProductCard key={p.id} product={p} variant="standard" />
            ))}
          </div>
        )}
      </section>

      {/* 3. REVIEWS & RATINGS RECEIVED */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-charcoal-900 tracking-tight">
          Đánh giá từ đối tác sau buổi hẹn gặp ({sellerReviews.length})
        </h3>

        {sellerReviews.length === 0 ? (
          <p className="text-xs text-sand-400 italic">Chưa có đánh giá nào được ghi nhận.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sellerReviews.map((rev) => {
              const reviewer = users.find((u) => u.id === rev.reviewerId);
              return (
                <div key={rev.id} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 shadow-subtle">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={reviewer?.avatar}
                        alt={reviewer?.fullName}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                      />
                      <div>
                        <div className="text-xs font-bold text-charcoal-900">
                          {reviewer?.fullName || 'Người dùng ReLoop'}
                        </div>
                        <div className="text-[10px] text-sand-400">
                          Giao dịch ngày {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    <RatingStars rating={rev.rating} size="sm" showNumber={false} />
                  </div>

                  <p className="text-xs text-sand-700 leading-relaxed font-normal">
                    "{rev.comment}"
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-sand-500 font-medium">
                    <span>Đúng giờ: {rev.criteria.punctuality}★</span>
                    <span>Lịch sự: {rev.criteria.courtesy}★</span>
                    <span>Chuẩn mô tả: {rev.criteria.accuracy}★</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* REPORT MODAL */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="USER"
        targetId={seller.id}
        targetTitle={`Thành viên ${seller.fullName}`}
      />
    </div>
  );
};
