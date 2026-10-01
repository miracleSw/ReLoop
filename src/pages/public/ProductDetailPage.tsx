import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RatingStars } from '../../components/common/RatingStars';
import { ProductCard } from '../../components/common/ProductCard';
import { ReportModal } from '../../components/common/ReportModal';
import {
  MapPin,
  Heart,
  Share2,
  ShieldCheck,
  ArrowRightLeft,
  PhoneCall,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  ArrowRight,
  Edit,
  X,
  Maximize2
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    users,
    currentUser,
    favorites,
    toggleFavorite,
    createBarterRequest,
    createBuyRequest,
    reviews,
    showToast,
    incrementProductViews,
    openLoginPrompt,
  } = useApp();

  const product = products.find((p) => p.id === id);
  const seller = users.find((u) => u.id === product?.sellerId);
  const isFavorite = product ? favorites.includes(product.id) : false;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isBarterModalOpen, setIsBarterModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Barter Form State
  const [selectedMyProductId, setSelectedMyProductId] = useState<string>('');
  const [compensationAmount, setCompensationAmount] = useState<number>(0);
  const [barterNote, setBarterNote] = useState<string>('');
  const [barterError, setBarterError] = useState<string>('');

  // Buy Form State
  const [buyOfferedPrice, setBuyOfferedPrice] = useState<number>(product?.price || 0);
  const [buyNote, setBuyNote] = useState<string>('');
  const [buyLocationPref, setBuyLocationPref] = useState<string>('');
  const [buyError, setBuyError] = useState<string>('');

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const isOwner = Boolean(currentUser && seller && currentUser.id === seller.id);

  // Status validation: Locked, Removed, Nonexistent or unauthorized Hidden product behavior (MSG 11_1)
  const isInvalid =
    !product ||
    !seller ||
    product.status === 'LOCKED' ||
    product.status === 'REMOVED' ||
    (product.status === 'HIDDEN' && !isOwner && currentUser?.role !== 'ADMIN');

  // Increment product views on mount (simulated view tracking, only for valid listings)
  useEffect(() => {
    if (product && product.id && !isInvalid) {
      incrementProductViews(product.id);
    }
  }, [product?.id, isInvalid]);

  useEffect(() => {
    if (isInvalid) {
      showToast('Bài đăng không tồn tại hoặc đã bị gỡ bỏ!', 'error');
      navigate('/', { replace: true });
    }
  }, [isInvalid, navigate, showToast]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen || !product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % product.images.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, product]);

  if (isInvalid || !product || !seller) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal-900">Bài đăng không tồn tại hoặc đã bị gỡ bỏ!</h2>
        <p className="text-sand-600 text-sm max-w-md mx-auto">
          Sản phẩm có thể đã được gỡ hoặc bị tạm khóa do vi phạm tiêu chuẩn cộng đồng. Đang đưa bạn về trang chủ...
        </p>
      </div>
    );
  }

  // My available products for exchange
  const myAvailableProducts = products.filter(
    (p) => p.sellerId === currentUser?.id && p.status === 'AVAILABLE' && p.id !== product.id
  );

  // Seller reviews from completed transactions
  const sellerReviews = reviews.filter((r) => r.targetUserId === seller.id);

  // Related products
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.status === 'AVAILABLE')
    .slice(0, 4);

  // Mask seller phone number for public privacy (BR 12_1)
  const maskedPhone = seller.phone
    ? `${seller.phone.slice(0, 3)}****${seller.phone.slice(-3)}`
    : '090****589';

  const handleBarterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openLoginPrompt('Vui lòng đăng nhập để gửi đề nghị trao đổi đồ!');
      return;
    }
    if (!selectedMyProductId) {
      setBarterError('Vui lòng chọn 1 món đồ từ kho cá nhân của bạn để đổi.');
      return;
    }
    if (barterNote.length > 500) {
      setBarterError('Lời nhắn không được vượt quá 500 ký tự (theo quy chuẩn BR 13_2).');
      return;
    }

    const success = createBarterRequest({
      targetProductId: product.id,
      offeredProductId: selectedMyProductId,
      compensationAmount,
      note: barterNote,
    });

    if (success) {
      setIsBarterModalOpen(false);
      navigate('/user/exchanges');
    }
  };

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openLoginPrompt('Vui lòng đăng nhập để gửi đề xuất mua sản phẩm!');
      return;
    }
    if (!buyOfferedPrice || buyOfferedPrice <= 0) {
      setBuyError('Vui lòng nhập mức giá đề xuất hợp lệ.');
      return;
    }

    const success = createBuyRequest({
      targetProductId: product.id,
      offeredPrice: buyOfferedPrice,
      note: buyNote,
      meetupLocationPreference: buyLocationPref,
    });

    if (success) {
      setIsBuyModalOpen(false);
      navigate('/user/exchanges');
    }
  };

  const openLightboxWithIndex = (idx: number) => {
    setLightboxIndex(idx);
    setIsLightboxOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. BREADCRUMBS */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-sand-500 font-medium">
        <Link to="/" className="hover:text-eco-700 transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-sand-400" />
        <Link to="/explore" className="hover:text-eco-700 transition-colors">
          Khám phá
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-sand-400" />
        <span className="text-charcoal-800 font-bold truncate max-w-[140px] sm:max-w-xs">{product.title}</span>
      </nav>

      {/* 2. STATUS WARNING / SUCCESS BANNERS */}
      {product.status === 'RESERVED' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 flex items-start gap-3.5 shadow-subtle animate-slide-up">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <span className="font-bold text-sm sm:text-base text-amber-950 block">
              Đang có hẹn giao dịch (RESERVED)
            </span>
            <p className="text-xs sm:text-sm text-amber-800 mt-0.5 leading-relaxed">
              Món đồ này đang trong quá trình hẹn gặp trực tiếp với một đối tác khác. Các chức năng gửi đề xuất mua hoặc đổi đồ đang tạm đóng.
            </p>
          </div>
        </div>
      )}

      {product.status === 'COMPLETED' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-900 flex items-start gap-3.5 shadow-subtle animate-slide-up">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="font-bold text-sm sm:text-base text-emerald-950 block">
              Đã giao dịch thành công (COMPLETED)
            </span>
            <p className="text-xs sm:text-sm text-emerald-800 mt-0.5 leading-relaxed">
              Món đồ này đã hoàn tất giao dịch gặp mặt trực tiếp và được các bên xác nhận thành công trên ReLoop.
            </p>
          </div>
        </div>
      )}

      {/* 3. PRODUCT MAIN SHOWCASE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT COLUMN: IMAGE GALLERY (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image (clickable for Lightbox) */}
          <div
            onClick={() => openLightboxWithIndex(activeImageIndex)}
            className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-card cursor-zoom-in"
            title="Bấm để mở xem ảnh phóng to"
          >
            <img
              src={product.images[activeImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              <span className="text-xs font-bold bg-white/95 backdrop-blur-md text-charcoal-900 px-3.5 py-1.5 rounded-full shadow-subtle border border-slate-100">
                {product.condition}
              </span>
              <StatusBadge status={product.status} size="md" />
            </div>

            {/* Expand indicator overlay */}
            <div className="absolute bottom-4 right-4 bg-charcoal-900/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Phóng to</span>
            </div>

            {/* Wishlist Heart Button (Hidden for post owner) */}
            {!isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
                className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-subtle ${
                  isFavorite
                    ? 'bg-rose-500 text-white shadow-glow-rose'
                    : 'bg-white/90 text-charcoal-700 hover:bg-white hover:text-rose-500 hover:scale-105'
                }`}
                aria-label="Lưu tin yêu thích"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          {/* Thumbnail Rail */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-eco-600 ring-4 ring-eco-500/20 shadow-glow-emerald scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                  }`}
                  aria-label={`Ảnh ${idx + 1}`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Location & Public Meetup Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-eco-50/80 via-teal-50/50 to-emerald-50/80 border border-eco-200/80 space-y-2.5 text-xs shadow-subtle">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-eco-100 text-eco-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-eco-700" />
              </div>
              <div>
                <span className="font-bold text-eco-950 text-sm">Cam kết giao dịch trực tiếp an toàn:</span>
                <p className="text-eco-800 mt-0.5 leading-relaxed">
                  Địa chỉ nhà riêng được bảo mật hoàn toàn. Người dùng chỉ hẹn gặp tại địa điểm công cộng đông người ban ngày (quán cafe, sảnh TTTM).
                </p>
              </div>
            </div>

            {/* Proposed Meetup Location */}
            {product.proposedMeetupLocation && (
              <div className="pt-2 border-t border-eco-200/60 flex items-start gap-2 text-eco-900 font-medium">
                <MapPin className="w-4 h-4 text-eco-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Địa điểm công cộng đề xuất gặp mặt:</strong> {product.proposedMeetupLocation}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT INFO & CTAs (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Meta header */}
            <div className="flex items-center justify-between text-xs text-sand-500 font-medium">
              <span className="flex items-center gap-1.5 font-semibold text-charcoal-700">
                <MapPin className="w-3.5 h-3.5 text-eco-600" />
                {product.location.ward}, {product.location.district}, {product.location.province}
              </span>
              <span className="flex items-center gap-1 text-sand-400">
                <Eye className="w-3.5 h-3.5" />
                {product.views} lượt xem
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 leading-tight tracking-tight">
              {product.title}
            </h1>

            {/* Price / Barter Tag */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/90 shadow-soft space-y-3">
              {product.price ? (
                <div>
                  <div className="text-xs text-sand-500 font-bold uppercase tracking-wider">Mức giá đề xuất</div>
                  <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 mt-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-clay-600 font-sans tracking-tight">
                      {product.price.toLocaleString('vi-VN')}₫
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-sand-400 line-through font-medium">
                        {product.originalPrice.toLocaleString('vi-VN')}₫
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xl font-extrabold text-eco-900 flex items-center gap-2.5">
                  <ArrowRightLeft className="w-6 h-6 text-eco-600" />
                  Sẵn sàng giao lưu đổi đồ
                </div>
              )}

              {/* Wanted Exchange Items description */}
              {product.wantedExchangeItems && (
                <div className="mt-3 pt-3 border-t border-slate-200/70 text-xs">
                  <span className="font-bold text-eco-900 flex items-center gap-1.5 mb-1.5">
                    <ArrowRightLeft className="w-4 h-4 text-eco-600" />
                    Món đồ chủ tin muốn đổi:
                  </span>
                  <p className="text-eco-800 leading-relaxed font-medium bg-eco-50/60 p-3 rounded-xl border border-eco-200/50">
                    {product.wantedExchangeItems}
                  </p>
                </div>
              )}
            </div>

            {/* SELLER TRUST PROFILE CARD */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 hover:shadow-card transition-all">
              <Link to={`/sellers/${seller.id}`} className="flex items-center gap-3.5 group min-w-0 flex-1">
                <img
                  src={seller.avatar}
                  alt={seller.fullName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-eco-500/80 shadow-subtle flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-charcoal-900 group-hover:text-eco-700 transition-colors truncate">
                      {seller.fullName}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-eco-600 fill-eco-100 flex-shrink-0" />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs mt-1">
                    <RatingStars rating={seller.rating} size="sm" />
                    <span className="text-slate-300">•</span>
                    <span className="text-sand-600 font-medium truncate">{seller.totalTransactions} giao dịch</span>
                  </div>
                </div>
              </Link>

              <div className="text-right flex-shrink-0">
                <span className="inline-block text-xs font-bold text-eco-800 bg-emerald-50 border border-eco-200/80 px-2.5 sm:px-3 py-1 rounded-full shadow-subtle">
                  ★ {seller.trustScore}/100 Uy tín
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              {!isOwner ? (
                <>
                  {/* BARTER BUTTON */}
                  {(product.type === 'EXCHANGE' || product.type === 'BOTH') && (
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          openLoginPrompt('Vui lòng đăng nhập để gửi đề nghị trao đổi đồ!');
                        } else {
                          setIsBarterModalOpen(true);
                        }
                      }}
                      disabled={product.status !== 'AVAILABLE'}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base shadow-glow-emerald hover:shadow-lg transition-all flex items-center justify-center gap-2.5"
                    >
                      <ArrowRightLeft className="w-5 h-5 text-emerald-300" />
                      <span>
                        {product.status === 'RESERVED'
                          ? 'Đang có hẹn giao dịch'
                          : product.status === 'COMPLETED'
                          ? 'Đã giao dịch thành công'
                          : 'Đề nghị đổi đồ (Chọn đồ kho của bạn)'}
                      </span>
                    </button>
                  )}

                  {/* BUY PROPOSAL BUTTON */}
                  {product.type !== 'EXCHANGE' && (
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          openLoginPrompt('Vui lòng đăng nhập để gửi đề xuất mua sản phẩm!');
                        } else {
                          setIsBuyModalOpen(true);
                        }
                      }}
                      disabled={product.status !== 'AVAILABLE'}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-clay-500 to-clay-600 hover:from-clay-400 hover:to-clay-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-glow-clay transition-all flex items-center justify-center gap-2"
                    >
                      <span>
                        {product.status === 'RESERVED'
                          ? 'Đang có hẹn giao dịch'
                          : product.status === 'COMPLETED'
                          ? 'Đã giao dịch thành công'
                          : 'Gửi đề xuất Mua trực tiếp'}
                      </span>
                    </button>
                  )}

                  {/* CONTACT SELLER (Phone & Zalo modal with privacy mask) */}
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-charcoal-800 font-bold text-sm shadow-subtle transition-all flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4 text-eco-700" />
                    <span>Liên hệ người bán (Bảo mật quyền riêng tư)</span>
                  </button>
                </>
              ) : (
                /* OWNER VIEW: Edit Post and Manage */
                <div className="p-5 bg-gradient-to-br from-eco-50/70 via-white to-teal-50/60 rounded-3xl border border-eco-200 text-center space-y-3 shadow-soft">
                  <div className="text-xs font-bold text-eco-900 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-eco-600" />
                    <span>Bài đăng này thuộc quyền sở hữu của bạn</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <Link
                      to={`/user/edit-listing/${product.id}`}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-glow-emerald hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Chỉnh sửa bài đăng</span>
                    </Link>
                    <Link
                      to="/user/products"
                      className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-charcoal-800 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-subtle transition-all"
                    >
                      Quản lý trong Kho đồ cá nhân →
                    </Link>
                  </div>
                </div>
              )}

              {/* Report button (Visitors only) */}
              {!isOwner && (
                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="text-xs text-sand-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Báo cáo bài đăng vi phạm</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. PRODUCT SPECIFICATIONS & DESCRIPTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-slate-200">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-4">
            <h3 className="text-lg font-bold text-charcoal-900 tracking-tight">Mô tả chi tiết & Tình trạng thực tế</h3>
            <p className="text-sm text-sand-800 leading-relaxed whitespace-pre-line font-normal">
              {product.description}
            </p>
          </div>

          {/* Seller Feedback & Past Reviews */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-charcoal-900 tracking-tight">
                Nhận xét từ các đối tác đã giao dịch ({sellerReviews.length})
              </h3>
              <RatingStars rating={seller.rating} size="sm" />
            </div>

            {sellerReviews.length === 0 ? (
              <p className="text-xs text-sand-400 italic">Người bán chưa có nhận xét công khai nào.</p>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {sellerReviews.map((rev) => {
                  const reviewer = users.find((u) => u.id === rev.reviewerId);
                  return (
                    <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={reviewer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt="Reviewer"
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
                          />
                          <span className="text-xs font-bold text-charcoal-900">
                            {reviewer?.fullName || 'Người dùng ReLoop'}
                          </span>
                        </div>
                        <span className="text-[11px] text-sand-400">
                          {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <RatingStars rating={rev.rating} size="sm" showNumber={false} />
                      <p className="text-xs text-sand-700 leading-relaxed">{rev.comment}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Meetup Safety Checklist Column */}
        <div className="space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-eco-50/60 via-white to-teal-50/60 border border-eco-200/80 shadow-soft space-y-4 text-xs">
            <h4 className="font-bold text-sm text-charcoal-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-eco-700" />
              Cẩm nang an toàn ReLoop
            </h4>
            <ul className="space-y-3 text-sand-700 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-eco-600 flex-shrink-0 mt-0.5" />
                <span>Tuyệt đối không chuyển tiền cọc trước khi gặp mặt trực tiếp.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-eco-600 flex-shrink-0 mt-0.5" />
                <span>Hẹn gặp ban ngày tại nơi công cộng (quán cafe, TTTM, cổng trường).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-eco-600 flex-shrink-0 mt-0.5" />
                <span>Kiểm tra kỹ ngoại hình, tính năng máy trước khi bàn giao tiền/đồ.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-eco-600 flex-shrink-0 mt-0.5" />
                <span>Sau khi nhận hàng, cả 2 bên bấm "Xác nhận hoàn tất" trên hệ thống.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-charcoal-900 tracking-tight">Sản phẩm cùng danh mục quanh bạn</h3>
            <Link to={`/explore?category=${product.categoryId}`} className="text-xs font-bold text-eco-700 hover:text-eco-900 hover:underline">
              Xem thêm →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} variant="standard" />
            ))}
          </div>
        </section>
      )}

      {/* LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none animate-fade-in"
        >
          {/* Top Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10"
          >
            <span className="text-sm font-semibold bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              {lightboxIndex + 1} / {product.images.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Đóng ảnh phóng to"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Main Image in Lightbox with touch gesture support */}
          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX === null || !product) return;
              const touchEndX = e.changedTouches[0].clientX;
              const diff = touchStartX - touchEndX;
              if (Math.abs(diff) > 40) {
                if (diff > 0) {
                  // Swipe left -> next image
                  setLightboxIndex((idx) => (idx + 1) % product.images.length);
                } else {
                  // Swipe right -> prev image
                  setLightboxIndex((idx) => (idx - 1 + product.images.length) % product.images.length);
                }
              }
              setTouchStartX(null);
            }}
            className="relative max-w-5xl max-h-[80vh] flex items-center justify-center overflow-hidden"
          >
            <img
              src={product.images[lightboxIndex]}
              alt={product.title}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-elevated"
            />
          </div>

          {/* Navigation Controls */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((idx) => (idx - 1 + product.images.length) % product.images.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((idx) => (idx + 1) % product.images.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                aria-label="Ảnh sau"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Bottom Thumbnails in Lightbox */}
          {product.images.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 overflow-x-auto max-w-md px-2 py-1 bg-black/40 backdrop-blur-md rounded-2xl"
            >
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    lightboxIndex === idx ? 'border-eco-500 scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: CONTACT SELLER POPUP (UC12 / Privacy compliant) */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-elevated border border-slate-200 animate-slide-up relative">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-gradient-to-br from-eco-100 to-teal-100 text-eco-700 rounded-2xl flex items-center justify-center mx-auto shadow-subtle">
                <PhoneCall className="w-7 h-7 text-eco-600" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">
                Thông tin liên hệ người bán
              </h3>
              <p className="text-xs text-sand-500">
                Đối tác: <span className="font-bold text-charcoal-900">{seller.fullName}</span>
              </p>
            </div>

            {/* Privacy & Anti-Scam Notice (BR 12_1) */}
            <div className="mt-5 p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Chính sách bảo mật quyền riêng tư:</strong> Để ngăn chặn lừa đảo chuyển cọc và bảo vệ thông tin cá nhân, số điện thoại đầy đủ chỉ được kích hoạt trong chi tiết Lịch hẹn sau khi hai bên xác nhận giao dịch gặp mặt trực tiếp.
              </div>
            </div>

            {/* Masked Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs text-sand-500 block mb-1">Số điện thoại bảo mật:</span>
                <span className="text-base font-bold text-charcoal-900 font-mono tracking-wider">{maskedPhone}</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs text-sand-500 block mb-1">Kênh nhắn tin Zalo:</span>
                <span className="text-xs font-semibold text-charcoal-800">
                  {seller.zaloPhone ? `Liên kết bảo mật theo SĐT (${maskedPhone})` : 'Chưa kích hoạt'}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 text-charcoal-800 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SEND BARTER REQUEST (UC13) */}
      {isBarterModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-elevated border border-slate-200 animate-slide-up relative">
            <h3 className="text-xl font-bold text-charcoal-900 mb-1">
              Gửi đề nghị Trao đổi đồ
            </h3>
            <p className="text-xs text-sand-500 mb-5">
              Đổi món đồ trong kho cá nhân của bạn lấy "{product.title}".
            </p>

            {barterError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{barterError}</span>
              </div>
            )}

            {myAvailableProducts.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-xs text-charcoal-800 font-medium">
                  Kho đồ cá nhân của bạn chưa có món đồ nào sẵn sàng để đem đổi. Vui lòng đăng tin món đồ mới trước!
                </p>
                <Link
                  to="/user/create-listing"
                  className="inline-block px-5 py-2.5 bg-gradient-to-r from-eco-700 to-teal-600 text-white rounded-xl text-xs font-bold shadow-glow-emerald"
                >
                  + Đăng tin ngay
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBarterSubmit} className="space-y-5">
                {/* 1. Select my product */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-2">
                    1. Chọn món đồ của bạn để đem đổi <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-1">
                    {myAvailableProducts.map((myProd) => (
                      <button
                        key={myProd.id}
                        type="button"
                        onClick={() => {
                          setSelectedMyProductId(myProd.id);
                          setBarterError('');
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          selectedMyProductId === myProd.id
                            ? 'border-eco-600 bg-eco-50/70 ring-4 ring-eco-500/15'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={myProd.images[0]}
                          alt={myProd.title}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-charcoal-900 truncate">
                            {myProd.title}
                          </div>
                          <div className="text-[11px] text-clay-600 font-bold mt-0.5">
                            {myProd.price ? `${myProd.price.toLocaleString('vi-VN')}₫` : 'Trao đổi'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Compensation amount */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                    2. Số tiền mặt bù trừ thêm (VNĐ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50000}
                    value={compensationAmount}
                    onChange={(e) => setCompensationAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="0"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                  />
                  <p className="text-[11px] text-sand-500 mt-1">
                    Nhập 0 nếu đổi ngang không bù tiền. Nếu bạn bù thêm tiền cho chủ tin, nhập số tiền tương ứng.
                  </p>
                </div>

                {/* 3. Note */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                    3. Lời nhắn trao đổi (Tối đa 500 ký tự)
                  </label>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={barterNote}
                    onChange={(e) => setBarterNote(e.target.value)}
                    placeholder="Giới thiệu nhanh tình trạng món đồ của bạn, đề xuất địa điểm cafe hoặc khung giờ gặp mặt..."
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                  />
                  <div className="text-[10px] text-sand-400 text-right mt-0.5">
                    {barterNote.length}/500 ký tự
                  </div>
                </div>

                {/* Visual Comparison Preview */}
                {selectedMyProductId && (
                  <div className="p-3 bg-slate-100 rounded-2xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs text-charcoal-800 border border-slate-200">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="font-semibold truncate">
                        {products.find((p) => p.id === selectedMyProductId)?.title}
                      </span>
                      <ArrowRightLeft className="w-3.5 h-3.5 text-eco-600 flex-shrink-0" />
                      <span className="font-semibold truncate">{product.title}</span>
                    </div>
                    {compensationAmount > 0 && (
                      <span className="text-[11px] font-bold text-clay-600 flex-shrink-0">
                        + {compensationAmount.toLocaleString('vi-VN')}₫
                      </span>
                    )}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBarterModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-sand-600 hover:bg-slate-100 rounded-xl"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-glow-emerald"
                  >
                    Xác nhận gửi đề nghị
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: BUY PROPOSAL MODAL */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-elevated border border-slate-200 animate-slide-up relative">
            <h3 className="text-xl font-bold text-charcoal-900 mb-1">Đề xuất mua sản phẩm</h3>
            <p className="text-xs text-sand-500 mb-5">
              Thương lượng mức giá mong muốn gặp mặt trực tiếp với chủ bài đăng.
            </p>

            {buyError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{buyError}</span>
              </div>
            )}

            <form onSubmit={handleBuySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Giá bạn đề xuất (VNĐ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={10000}
                  step={50000}
                  value={buyOfferedPrice}
                  onChange={(e) => setBuyOfferedPrice(parseInt(e.target.value) || 0)}
                  className="w-full text-base font-bold text-clay-600 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
                <span className="text-[11px] text-sand-400 mt-1 block">
                  Giá niêm yết: {product.price?.toLocaleString('vi-VN')}₫
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Địa điểm công cộng đề xuất gặp mặt
                </label>
                <input
                  type="text"
                  value={buyLocationPref}
                  onChange={(e) => setBuyLocationPref(e.target.value)}
                  placeholder="Ví dụ: Highlands Coffee gần ngã tư Hàng Xanh"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Lời nhắn gửi người bán
                </label>
                <textarea
                  rows={3}
                  value={buyNote}
                  onChange={(e) => setBuyNote(e.target.value)}
                  placeholder="Tôi có thể qua xem máy vào chiều mai lúc 15:00..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBuyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-sand-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-clay-500 to-clay-600 hover:from-clay-400 hover:to-clay-500 text-white text-xs font-bold rounded-xl shadow-glow-clay"
                >
                  Gửi đề xuất mua
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="POST"
        targetId={product.id}
        targetTitle={product.title}
      />
    </div>
  );
};
