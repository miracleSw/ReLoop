import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../../components/common/RatingStars';
import { Review } from '../../types';
import { Star, ShieldAlert, CheckCircle2, MessageSquare, AlertTriangle, Sparkles, Clock, ThumbsUp, ShieldCheck } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { currentUser, reviews, users, appealReview } = useApp();
  const [activeTab, setActiveTab] = useState<'RECEIVED' | 'GIVEN'>('RECEIVED');
  const [appealingReviewId, setAppealingReviewId] = useState<string | null>(null);
  const [appealReason, setAppealReason] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">Vui lòng đăng nhập</h2>
        <Link to="/login" className="mt-4 inline-block text-eco-700 text-xs font-semibold hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const receivedReviews = reviews.filter((r) => r.targetUserId === currentUser.id);
  const givenReviews = reviews.filter((r) => r.reviewerId === currentUser.id);
  const currentList = activeTab === 'RECEIVED' ? receivedReviews : givenReviews;

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealingReviewId || !appealReason.trim()) return;
    appealReview(appealingReviewId, appealReason.trim());
    setAppealingReviewId(null);
    setAppealReason('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Đánh giá uy tín & Phản hồi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Hệ thống đánh giá 2 chiều minh bạch sau các giao dịch gặp mặt hoàn tất thành công.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-200 overflow-x-auto scrollbar-none min-w-0 max-w-full pb-0.5">
        <button
          onClick={() => setActiveTab('RECEIVED')}
          className={`pb-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
            activeTab === 'RECEIVED'
              ? 'border-eco-600 text-eco-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Đánh giá tôi nhận được</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
            activeTab === 'RECEIVED' ? 'bg-eco-100 text-eco-800' : 'bg-slate-100 text-slate-600'
          }`}>
            {receivedReviews.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('GIVEN')}
          className={`pb-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
            activeTab === 'GIVEN'
              ? 'border-eco-600 text-eco-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Đánh giá tôi đã gửi</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
            activeTab === 'GIVEN' ? 'bg-eco-100 text-eco-800' : 'bg-slate-100 text-slate-600'
          }`}>
            {givenReviews.length}
          </span>
        </button>
      </div>

      {/* Reviews List */}
      {currentList.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Chưa có đánh giá nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'RECEIVED'
              ? 'Sau khi hoàn tất các giao dịch gặp mặt, đối tác sẽ viết nhận xét uy tín cho bạn tại đây.'
              : 'Bạn chưa viết đánh giá nào cho đối tác sau giao dịch.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map((rev) => {
            const partnerUser = users.find(
              (u) => u.id === (activeTab === 'RECEIVED' ? rev.reviewerId : rev.targetUserId)
            );

            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_-6px_rgba(16,185,129,0.1)] transition-all space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={partnerUser?.avatar}
                      alt={partnerUser?.fullName}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {activeTab === 'RECEIVED' ? 'Từ:' : 'Gửi đến:'} {partnerUser?.fullName}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Ngày {new Date(rev.createdAt).toLocaleDateString('vi-VN')} • Mã GD: #{rev.transactionId}
                      </span>
                    </div>
                  </div>

                  <RatingStars rating={rev.rating} size="md" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic">
                  "{rev.comment}"
                </p>

                {/* 3 standardized criteria */}
                <div className="p-4 bg-gradient-to-r from-slate-50 via-slate-50/60 to-emerald-50/20 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span>⏰ Đúng giờ:</span>
                    <strong className="text-slate-900">{rev.criteria.punctuality} ★</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span>🤝 Lịch sự, tôn trọng:</span>
                    <strong className="text-slate-900">{rev.criteria.courtesy} ★</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span>📦 Đúng mô tả sản phẩm:</span>
                    <strong className="text-slate-900">{rev.criteria.accuracy} ★</strong>
                  </span>
                </div>

                {/* Appeal action if received */}
                {activeTab === 'RECEIVED' && (
                  <div className="pt-2 flex items-center justify-end">
                    {rev.isAppealed ? (
                      <span className="text-xs text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/90 font-bold flex items-center gap-1.5 shadow-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Đang khiếu nại lên BQT</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setAppealingReviewId(rev.id)}
                        className="text-xs text-slate-500 hover:text-rose-600 font-bold flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-xl hover:bg-rose-50"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Khiếu nại đánh giá sai sự thật</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* APPEAL MODAL (UC21) */}
      {appealingReviewId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">Khiếu nại đánh giá</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Quản trị viên sẽ đối soát nội dung Hộp thư đề nghị và lịch sử cuộc hẹn để xem xét gỡ bỏ đánh giá ác ý.
              </p>
            </div>

            <form onSubmit={handleAppealSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                  Lý do khiếu nại chi tiết <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  placeholder="Giải trình rõ lý do đánh giá này là sai sự thật, vu khống hoặc xúc phạm..."
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white transition-all text-slate-800"
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAppealingReviewId(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald hover:shadow-lg transition-all"
                >
                  Gửi khiếu nại lên Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
