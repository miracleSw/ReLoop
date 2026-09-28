import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../../components/common/RatingStars';
import { Review } from '../../types';
import { Star, ShieldAlert, CheckCircle2, MessageSquare, AlertTriangle } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { currentUser, reviews, users, appealReview } = useApp();
  const [activeTab, setActiveTab] = useState<'RECEIVED' | 'GIVEN'>('RECEIVED');
  const [appealingReviewId, setAppealingReviewId] = useState<string | null>(null);
  const [appealReason, setAppealReason] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-charcoal-900">Vui lòng đăng nhập</h2>
        <Link to="/login" className="mt-4 inline-block text-eco-800 text-xs font-semibold hover:underline">
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
          Đánh giá uy tín & Phản hồi (Reviews & Appeals)
        </h1>
        <p className="text-xs sm:text-sm text-sand-600 mt-1">
          Hệ thống đánh giá 2 chiều minh bạch sau các giao dịch gặp mặt hoàn tất thành công.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-sand-200">
        <button
          onClick={() => setActiveTab('RECEIVED')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'RECEIVED'
              ? 'border-eco-800 text-eco-900'
              : 'border-transparent text-sand-500 hover:text-charcoal-800'
          }`}
        >
          Đánh giá tôi nhận được ({receivedReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('GIVEN')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'GIVEN'
              ? 'border-eco-800 text-eco-900'
              : 'border-transparent text-sand-500 hover:text-charcoal-800'
          }`}
        >
          Đánh giá tôi đã gửi ({givenReviews.length})
        </button>
      </div>

      {/* Reviews List */}
      {currentList.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-sand-200 space-y-3">
          <Star className="w-12 h-12 text-sand-300 mx-auto" />
          <h3 className="text-base font-bold text-charcoal-900">Chưa có đánh giá nào</h3>
          <p className="text-xs text-sand-600">
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
                className="bg-white rounded-3xl border border-sand-200 p-6 shadow-soft space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={partnerUser?.avatar}
                      alt={partnerUser?.fullName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-eco-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-charcoal-900">
                        {activeTab === 'RECEIVED' ? 'Từ:' : 'Gửi đến:'} {partnerUser?.fullName}
                      </div>
                      <span className="text-[11px] text-sand-400">
                        Ngày {new Date(rev.createdAt).toLocaleDateString('vi-VN')} • Mã GD: #{rev.transactionId}
                      </span>
                    </div>
                  </div>

                  <RatingStars rating={rev.rating} size="md" />
                </div>

                <p className="text-xs sm:text-sm text-sand-800 leading-relaxed font-normal">
                  "{rev.comment}"
                </p>

                {/* 3 standardized criteria */}
                <div className="p-3 bg-sand-50 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-sand-700">
                  <span>
                    ⏰ Đúng giờ: <strong>{rev.criteria.punctuality} ★</strong>
                  </span>
                  <span>
                    🤝 Lịch sự, tôn trọng: <strong>{rev.criteria.courtesy} ★</strong>
                  </span>
                  <span>
                    📦 Đúng mô tả sản phẩm: <strong>{rev.criteria.accuracy} ★</strong>
                  </span>
                </div>

                {/* Appeal action if received */}
                {activeTab === 'RECEIVED' && (
                  <div className="pt-2 flex items-center justify-end">
                    {rev.isAppealed ? (
                      <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 font-medium">
                        Đang khiếu nại lên BQT
                      </span>
                    ) : (
                      <button
                        onClick={() => setAppealingReviewId(rev.id)}
                        className="text-xs text-sand-500 hover:text-rose-600 font-semibold flex items-center gap-1"
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
        <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-elevated">
            <h3 className="text-lg font-bold text-charcoal-900">Khiếu nại đánh giá</h3>
            <p className="text-xs text-sand-600">
              Quản trị viên sẽ đối soát nội dung Hộp thư đề nghị và lịch sử cuộc hẹn để xem xét gỡ bỏ đánh giá ác ý.
            </p>
            <form onSubmit={handleAppealSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Lý do khiếu nại chi tiết
                </label>
                <textarea
                  rows={3}
                  required
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  placeholder="Giải trình rõ lý do đánh giá này là sai sự thật, vu khống hoặc xúc phạm..."
                  className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-eco-500/20"
                />
              </div>
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAppealingReviewId(null)}
                  className="px-4 py-2 text-xs font-semibold text-sand-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-eco-800 text-white rounded-xl text-xs font-bold"
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
