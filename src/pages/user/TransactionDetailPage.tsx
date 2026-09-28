import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RatingStars } from '../../components/common/RatingStars';
import { ReportModal } from '../../components/common/ReportModal';
import {
  Calendar,
  MapPin,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRightLeft,
  XCircle,
  Star,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const TransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentUser,
    transactions,
    products,
    users,
    confirmTransaction,
    rescheduleMeetup,
    cancelTransaction,
    submitReview,
    reviews,
  } = useApp();

  const transaction = transactions.find((t) => t.id === id);

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Bùng hẹn / Không đến điểm hẹn');

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [criteriaPunctuality, setCriteriaPunctuality] = useState(5);
  const [criteriaCourtesy, setCriteriaCourtesy] = useState(5);
  const [criteriaAccuracy, setCriteriaAccuracy] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const [isReportOpen, setIsReportOpen] = useState(false);

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

  if (!transaction) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-sand-100 text-sand-500 mx-auto flex items-center justify-center mb-4">
          <Calendar className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-charcoal-900">Không tìm thấy giao dịch</h2>
        <p className="text-xs text-sand-600 mt-2">Mã giao dịch #{id} không tồn tại hoặc đã được xử lý lưu trữ.</p>
        <Link to="/user/transactions" className="mt-4 inline-block px-4 py-2 bg-eco-800 text-white rounded-xl text-xs font-semibold hover:bg-eco-700">
          Quay lại danh sách lịch hẹn
        </Link>
      </div>
    );
  }

  // Security check: Only buyer, seller or Admin can view this transaction (UC17 BR 17_1)
  const isBuyer = transaction.buyerId === currentUser.id;
  const isSeller = transaction.sellerId === currentUser.id;
  const isAdmin = currentUser.role === 'ADMIN';

  if (!isBuyer && !isSeller && !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-charcoal-900">Từ chối truy cập (MSG 17_1)</h2>
        <p className="text-xs text-sand-600 mt-2 leading-relaxed">
          Bạn không có quyền truy cập giao dịch này. Chi tiết lịch hẹn và số điện thoại liên lạc chỉ dành riêng cho các bên trực tiếp tham gia giao dịch.
        </p>
        <Link to="/user/transactions" className="mt-4 inline-block px-4 py-2 bg-eco-800 text-white rounded-xl text-xs font-semibold hover:bg-eco-700">
          Quay lại danh sách giao dịch của tôi
        </Link>
      </div>
    );
  }

  const buyer = users.find((u) => u.id === transaction.buyerId);
  const seller = users.find((u) => u.id === transaction.sellerId);
  const targetProduct = products.find((p) => p.id === transaction.productId);
  const offeredProduct = transaction.offeredProductId
    ? products.find((p) => p.id === transaction.offeredProductId)
    : undefined;

  const partner = isBuyer ? seller : buyer;
  const myConfirmation = isBuyer ? transaction.buyerConfirmed : transaction.sellerConfirmed;
  const partnerConfirmation = isBuyer ? transaction.sellerConfirmed : transaction.buyerConfirmed;

  // Check if I already reviewed
  const existingReview = reviews.find(
    (r) => r.transactionId === transaction.id && r.reviewerId === currentUser.id
  );

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime || !newLocation) return;
    rescheduleMeetup(transaction.id, newTime, newLocation);
    setIsRescheduleOpen(false);
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    cancelTransaction(transaction.id, cancelReason);
    setIsCancelOpen(false);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;
    submitReview({
      transactionId: transaction.id,
      targetUserId: partner.id,
      rating: reviewRating,
      criteria: {
        punctuality: criteriaPunctuality,
        courtesy: criteriaCourtesy,
        accuracy: criteriaAccuracy,
      },
      comment: reviewComment || 'Giao dịch thành công, đối tác lịch sự và uy tín.',
    });
    setIsReviewOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-sand-500 mb-1">
            <Link to="/user/transactions" className="hover:text-eco-800">
              Lịch hẹn & Giao dịch
            </Link>
            <span>/</span>
            <span>Mã GD: #{transaction.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
            Hành trình Giao dịch Gặp mặt trực tiếp
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={transaction.status} size="lg" />
        </div>
      </div>

      {/* 2. TRANSACTION JOURNEY PROGRESS TIMELINE */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 sm:p-8">
        <h3 className="text-xs font-bold text-sand-500 uppercase tracking-wider mb-6">
          Tiến trình cuộc hẹn (Transaction Journey)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-eco-50 border border-eco-200 space-y-1.5 relative">
            <div className="flex items-center gap-2 text-eco-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-eco-600" />
              <span>1. Lên lịch hẹn</span>
            </div>
            <p className="text-[11px] text-eco-900 leading-snug">
              Chốt thời gian & địa điểm công cộng đông người
            </p>
          </div>

          {/* Step 2 */}
          <div
            className={`p-4 rounded-2xl border space-y-1.5 transition-all ${
              transaction.status !== 'CANCELLED'
                ? 'bg-eco-50 border-eco-200'
                : 'bg-sand-50 border-sand-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2 text-eco-800 font-bold text-xs">
              <MapPin className="w-4 h-4 text-eco-600" />
              <span>2. Gặp mặt trực tiếp</span>
            </div>
            <p className="text-[11px] text-eco-900 leading-snug">
              Kiểm tra hàng tận mắt trước khi bàn giao
            </p>
          </div>

          {/* Step 3 */}
          <div
            className={`p-4 rounded-2xl border space-y-1.5 transition-all ${
              myConfirmation || partnerConfirmation
                ? 'bg-eco-50 border-eco-200'
                : 'bg-sand-50 border-sand-200'
            }`}
          >
            <div className="flex items-center gap-2 text-charcoal-900 font-bold text-xs">
              {transaction.status === 'COMPLETED' ? (
                <CheckCircle2 className="w-4 h-4 text-eco-600" />
              ) : (
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
              )}
              <span>3. Xác nhận 2 chiều</span>
            </div>
            <p className="text-[11px] text-sand-600 leading-snug">
              {transaction.buyerConfirmed && transaction.sellerConfirmed
                ? 'Cả hai bên đã xác nhận hoàn tất'
                : myConfirmation
                ? 'Bạn đã xác nhận (Chờ đối tác)'
                : 'Chờ 2 bên cùng bấm hoàn tất'}
            </p>
          </div>

          {/* Step 4 */}
          <div
            className={`p-4 rounded-2xl border space-y-1.5 transition-all ${
              transaction.status === 'COMPLETED'
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-sand-50 border-sand-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2 text-charcoal-900 font-bold text-xs">
              <Star className="w-4 h-4 text-amber-500" />
              <span>4. Chấm sao uy tín</span>
            </div>
            <p className="text-[11px] text-sand-600 leading-snug">
              Đánh giá đúng giờ, lịch sự và chất lượng đồ
            </p>
          </div>
        </div>
      </div>

      {/* 3. PARTNERS & MUTUAL UNLOCKED CONTACT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Partner Card with Unlocked Phone & Zalo */}
        <div className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-100">
            <span className="text-xs font-bold text-eco-800 uppercase tracking-wider">
              {isBuyer ? 'Người bán (Đối tác hẹn gặp):' : 'Người mua/đổi (Đối tác hẹn gặp):'}
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              ★ {partner?.trustScore}đ Uy tín
            </span>
          </div>

          {partner && (
            <div className="flex items-start gap-4">
              <img
                src={partner.avatar}
                alt={partner.fullName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-eco-500"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <h4 className="text-base font-bold text-charcoal-900">{partner.fullName}</h4>
                <div className="text-xs text-sand-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-eco-600" />
                  {partner.district}, {partner.province}
                </div>
                <div className="text-xs text-sand-500">
                  {partner.totalTransactions} giao dịch hoàn tất • Đánh giá {partner.rating.toFixed(1)}/5.0
                </div>
              </div>
            </div>
          )}

          {/* Unlocked Contact Actions (UC15: SĐT & Zalo Deep link) */}
          <div className="pt-2 grid grid-cols-2 gap-3">
            <a
              href={`tel:${partner?.phone}`}
              className="py-2.5 px-3 bg-eco-50 hover:bg-eco-100 text-eco-900 border border-eco-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-eco-700" />
              <span>Gọi: {partner?.phone}</span>
            </a>

            {partner?.zaloPhone ? (
              <a
                href={`https://zalo.me/${partner.zaloPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-sky-700" />
                <span>Chat Zalo</span>
              </a>
            ) : (
              <Link
                to="/user/messages"
                className="py-2.5 px-3 bg-sand-100 hover:bg-sand-200 text-charcoal-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hộp thư ReLoop</span>
              </Link>
            )}
          </div>
        </div>

        {/* Appointment Information Card */}
        <div className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-100">
            <span className="text-xs font-bold text-sand-500 uppercase tracking-wider">
              Lịch hẹn công cộng
            </span>
            {transaction.status === 'APPOINTED' && (
              <button
                onClick={() => {
                  setNewTime(transaction.appointmentTime);
                  setNewLocation(transaction.appointmentLocation);
                  setIsRescheduleOpen(true);
                }}
                className="text-xs text-eco-700 hover:underline font-semibold"
              >
                Dời lịch hẹn
              </button>
            )}
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-eco-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-charcoal-900 block">Thời gian gặp:</span>
                <span className="text-sand-700">
                  {new Date(transaction.appointmentTime).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-eco-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-charcoal-900 block">Địa điểm công cộng:</span>
                <span className="text-sand-700">{transaction.appointmentLocation}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
            Ưu tiên hẹn ban ngày tại quán cafe, sảnh TTTM có camera an ninh. Kiểm tra kỹ ngoại hình và chức năng máy trước khi bàn giao.
          </div>
        </div>
      </div>

      {/* 4. TRANSACTION ITEMS DISPLAY */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-charcoal-900">Chi tiết sản phẩm bàn giao</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Product */}
          <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 flex items-center gap-3">
            {targetProduct && (
              <>
                <img
                  src={targetProduct.images[0]}
                  alt={targetProduct.title}
                  className="w-16 h-16 rounded-xl object-cover border border-sand-200 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold text-sand-500">Món đồ đăng bán/đổi:</span>
                  <h4 className="text-xs font-bold text-charcoal-900 truncate mt-0.5">
                    {targetProduct.title}
                  </h4>
                  <div className="text-xs font-extrabold text-clay-700 mt-1">
                    {targetProduct.price ? `${targetProduct.price.toLocaleString('vi-VN')}₫` : 'Trao đổi'}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Offered Product (if Barter) */}
          {offeredProduct && (
            <div className="p-4 rounded-2xl bg-eco-50/70 border border-eco-200 flex items-center gap-3">
              <img
                src={offeredProduct.images[0]}
                alt={offeredProduct.title}
                className="w-16 h-16 rounded-xl object-cover border border-sand-200 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-eco-800">Món đồ đối ứng:</span>
                <h4 className="text-xs font-bold text-charcoal-900 truncate mt-0.5">
                  {offeredProduct.title}
                </h4>
                {transaction.compensationAmount && transaction.compensationAmount > 0 && (
                  <div className="text-xs font-bold text-clay-700 mt-1">
                    Bù thêm: +{transaction.compensationAmount.toLocaleString('vi-VN')}₫
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. TWO-WAY CONFIRMATION ACTION BOX (UC19) */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-charcoal-900">
              Xác nhận hoàn tất giao dịch 2 bên (2-Way Confirmation)
            </h3>
            <p className="text-xs sm:text-sm text-sand-600 mt-0.5">
              Sau khi gặp mặt và bàn giao sản phẩm ngoài đời, cả 2 bên bấm xác nhận để hoàn tất giao dịch.
            </p>
          </div>

          {/* Confirmation State Badges */}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 ${
                myConfirmation
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-sand-100 text-sand-600'
              }`}
            >
              {myConfirmation ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              <span>Bạn: {myConfirmation ? 'Đã xác nhận' : 'Chưa xác nhận'}</span>
            </span>

            <span
              className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 ${
                partnerConfirmation
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-sand-100 text-sand-600'
              }`}
            >
              {partnerConfirmation ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
              <span>Đối tác: {partnerConfirmation ? 'Đã xác nhận' : 'Chưa xác nhận'}</span>
            </span>
          </div>
        </div>

        {/* State notification banner */}
        {myConfirmation && !partnerConfirmation && (
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-sky-900 font-medium">
            <Clock className="w-5 h-5 text-sky-600 flex-shrink-0 animate-pulse" />
            <span>
              Bạn đã xác nhận bàn giao hàng! Đang chờ đối tác ({partner?.fullName}) bấm xác nhận hoàn tất trên hệ thống.
            </span>
          </div>
        )}

        {transaction.status === 'COMPLETED' && (
          <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-emerald-950">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Giao dịch đã hoàn tất thành công!</h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Bài đăng đã được tự động đóng. Cả hai bạn đều được cộng +1 vào hồ sơ giao dịch uy tín.
                </p>
              </div>
            </div>

            {/* Leave Review Button */}
            {!existingReview ? (
              <button
                onClick={() => setIsReviewOpen(true)}
                className="px-5 py-2.5 bg-eco-800 hover:bg-eco-700 text-white font-bold text-xs rounded-xl shadow-soft flex items-center gap-1.5 whitespace-nowrap"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Đánh giá đối tác ngay</span>
              </button>
            ) : (
              <span className="text-xs text-emerald-800 font-semibold bg-white/60 px-3 py-1 rounded-lg">
                ✓ Bạn đã gửi đánh giá
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {transaction.status !== 'COMPLETED' && transaction.status !== 'CANCELLED' && (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-sand-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCancelOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl"
              >
                Hủy cuộc hẹn
              </button>
              <button
                onClick={() => setIsReportOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-sand-600 hover:text-rose-600 flex items-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Báo cáo bùng hẹn</span>
              </button>
            </div>

            {!myConfirmation && (
              <button
                onClick={() => confirmTransaction(transaction.id)}
                className="px-8 py-3 bg-eco-800 hover:bg-eco-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-soft transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tôi đã gặp & bàn giao hàng xong</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* RESCHEDULE MODAL */}
      {isRescheduleOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-elevated">
            <h3 className="text-lg font-bold text-charcoal-900">Dời lịch hẹn gặp mặt</h3>
            <p className="text-xs text-sand-600">
              Chỉ dời lịch trước giờ hẹn tối thiểu 2 tiếng khi có sự đồng thuận 2 bên.
            </p>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Thời gian hẹn mới
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Địa điểm công cộng mới
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
                />
              </div>
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRescheduleOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-sand-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-eco-800 text-white rounded-xl text-xs font-bold"
                >
                  Xác nhận dời lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL MODAL (BR 17_4) */}
      {isCancelOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-elevated">
            <h3 className="text-lg font-bold text-charcoal-900">Hủy lịch hẹn gặp mặt</h3>
            <p className="text-xs text-sand-600">
              Bài đăng sẽ được tự động phục hồi về trạng thái Còn hàng (AVAILABLE) để tiếp nhận đề nghị khác.
            </p>
            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Lý do hủy hẹn
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
                >
                  <option value="Bùng hẹn / Không đến điểm hẹn">Bùng hẹn / Không đến điểm hẹn</option>
                  <option value="Sản phẩm không như mô tả">Sản phẩm thực tế không như mô tả</option>
                  <option value="Không thỏa thuận được">Không thỏa thuận được thêm chi tiết</option>
                  <option value="Lý do cá nhân đột xuất">Lý do cá nhân đột xuất</option>
                </select>
              </div>
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCancelOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-sand-700"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold"
                >
                  Xác nhận hủy hẹn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2-WAY REVIEW MODAL (UC20) */}
      {isReviewOpen && partner && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-elevated">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-charcoal-900">
                Đánh giá uy tín đối tác: {partner.fullName}
              </h3>
              <p className="text-xs text-sand-600">
                Chỉ mở quyền chấm sao sau khi giao dịch hoàn tất. Mỗi mã giao dịch chỉ đánh giá 1 lần.
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Overall stars */}
              <div className="text-center py-2">
                <span className="text-xs font-bold text-charcoal-800 block mb-2">Chấm điểm chung</span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-sand-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Standardized Criteria */}
              <div className="space-y-3 bg-sand-50 p-4 rounded-2xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-charcoal-800">1. Đúng giờ khi hẹn gặp:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCriteriaPunctuality(s)}
                        className={`w-6 h-6 rounded-md font-bold text-xs ${
                          s <= criteriaPunctuality ? 'bg-amber-400 text-white' : 'bg-sand-200 text-sand-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-charcoal-800">2. Lịch sự, tôn trọng đối tác:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCriteriaCourtesy(s)}
                        className={`w-6 h-6 rounded-md font-bold text-xs ${
                          s <= criteriaCourtesy ? 'bg-amber-400 text-white' : 'bg-sand-200 text-sand-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-charcoal-800">3. Sản phẩm đúng mô tả thực tế:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCriteriaAccuracy(s)}
                        className={`w-6 h-6 rounded-md font-bold text-xs ${
                          s <= criteriaAccuracy ? 'bg-amber-400 text-white' : 'bg-sand-200 text-sand-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Nhận xét chi tiết
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm gặp mặt, thái độ đối tác và tình trạng món đồ..."
                  className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-eco-500/20"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-sand-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-eco-800 hover:bg-eco-700 text-white rounded-xl text-xs font-bold shadow-soft"
                >
                  Gửi đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {partner && (
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          targetType="USER"
          targetId={partner.id}
          targetTitle={`Đối tác ${partner.fullName} trong giao dịch #${transaction.id}`}
        />
      )}
    </div>
  );
};
