import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../../components/common/RatingStars';
import { Review } from '../../types';
import {
  Star,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  X,
  AlertCircle,
  Filter,
  Check,
  Ban
} from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const { reviews, users, resolveReviewAppeal, showToast } = useApp();
  const [filterMode, setFilterMode] = useState<'ALL' | 'APPEALED'>('ALL');
  const [selectedReviewForModal, setSelectedReviewForModal] = useState<Review | null>(null);

  const appealedReviews = reviews.filter((r) => r.isAppealed);
  const displayedReviews = filterMode === 'APPEALED' ? appealedReviews : reviews;

  const handleResolve = (action: 'REMOVE_REVIEW' | 'DISMISS') => {
    if (!selectedReviewForModal) return;
    resolveReviewAppeal(selectedReviewForModal.id, action);
    setSelectedReviewForModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal-900">
            Giám sát Đánh giá & Xử lý Khiếu nại (UC27)
          </h1>
          <p className="text-xs text-sand-600 mt-0.5">
            Giám sát tính minh bạch của các đánh giá 2 chiều và giải quyết khiếu nại đánh giá vu khống.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'ALL'
                ? 'bg-white text-charcoal-900 shadow-soft'
                : 'text-slate-600 hover:text-charcoal-800'
            }`}
          >
            Tất cả ({reviews.length})
          </button>
          <button
            onClick={() => setFilterMode('APPEALED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'APPEALED'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-soft'
                : 'text-amber-800 hover:bg-amber-100/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Có khiếu nại ({appealedReviews.length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden">
        {displayedReviews.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Không có đánh giá nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          displayedReviews.map((rev) => {
            const reviewer = users.find((u) => u.id === rev.reviewerId);
            const targetUser = users.find((u) => u.id === rev.targetUserId);

            return (
              <div key={rev.id} className="p-6 sm:p-7 space-y-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-charcoal-900">
                      {reviewer?.fullName} → {targetUser?.fullName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Mã GD: #{rev.transactionId} • {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RatingStars rating={rev.rating} size="sm" />
                    <button
                      onClick={() => resolveReviewAppeal(rev.id, 'REMOVE_REVIEW')}
                      title="Gỡ bỏ đánh giá vi phạm tiêu chuẩn cộng đồng"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  "{rev.comment}"
                </p>

                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-[11px] text-slate-600 border border-slate-200/60">
                  <span>Đúng giờ: {rev.criteria.punctuality}★</span>
                  <span>Lịch sự: {rev.criteria.courtesy}★</span>
                  <span>Đúng mô tả: {rev.criteria.accuracy}★</span>
                </div>

                {rev.isAppealed && (
                  <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-subtle">
                    <div className="flex items-start sm:items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span>
                        <strong className="font-bold text-amber-950">Lý do khiếu nại:</strong> "{rev.appealReason}"
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedReviewForModal(rev)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl font-bold text-xs shadow-soft transition-all flex-shrink-0"
                    >
                      Xử lý khiếu nại
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Appeal Resolution Modal */}
      {selectedReviewForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-elevated border border-slate-200 relative animate-slide-up space-y-6">
            <button
              onClick={() => setSelectedReviewForModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-charcoal-700 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-subtle">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-charcoal-900">Xử lý Khiếu nại Đánh giá (UC27)</h3>
                <p className="text-xs text-slate-500">Đối soát tính xác thực của nội dung đánh giá</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5 font-medium">Nội dung đánh giá bị khiếu nại:</span>
                <span className="font-medium text-charcoal-800 italic">"{selectedReviewForModal.comment}"</span>
                <div className="mt-1 text-slate-500">Mức điểm: {selectedReviewForModal.rating}★</div>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-amber-800 font-bold block mb-0.5">Lý do thành viên khiếu nại:</span>
                <span className="text-charcoal-800">{selectedReviewForModal.appealReason}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Vui lòng chọn quyết định xử lý sau khi đối soát nhật ký trò chuyện và lịch hẹn gặp mặt:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleResolve('REMOVE_REVIEW')}
                className="p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200 text-xs font-bold text-left transition-all space-y-1 shadow-subtle"
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Chấp thuận & Gỡ bỏ</span>
                </div>
                <p className="text-[11px] font-normal text-rose-600/90 leading-snug">
                  Gỡ bỏ đánh giá sai sự thật và tự động tính lại điểm uy tín cho người bị khiếu nại.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleResolve('DISMISS')}
                className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-charcoal-800 border border-slate-200 text-xs font-bold text-left transition-all space-y-1 shadow-subtle"
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <Check className="w-4 h-4 text-slate-700" />
                  <span>Bác bỏ khiếu nại</span>
                </div>
                <p className="text-[11px] font-normal text-slate-600 leading-snug">
                  Đánh giá đúng thực tế giao dịch. Giữ nguyên đánh giá và đóng hồ sơ khiếu nại.
                </p>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedReviewForModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-charcoal-800 rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
