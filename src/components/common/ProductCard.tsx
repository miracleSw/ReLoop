import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { Heart, MapPin, ArrowRightLeft, ShieldCheck, Star, ChevronRight, Trash2 } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80';
const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';

interface ProductCardProps {
  product: Product;
  variant?: 'standard' | 'featured' | 'compact';
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'standard',
  onRemove,
  showRemoveButton = false,
}) => {
  const { favorites, toggleFavorite, users, categories, currentUser } = useApp();
  const isFavorite = favorites.includes(product.id);
  const isOwner = currentUser?.id === product.sellerId;
  const seller = users.find((u) => u.id === product.sellerId);
  const category = categories.find((c) => c.id === product.categoryId);

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return price.toLocaleString('vi-VN') + '₫';
  };

  const discountPercent =
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // 1. COMPACT VARIANT
  if (variant === 'compact') {
    return (
      <Link
        to={`/products/${product.id}`}
        className="group flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 hover:border-emerald-300 hover:shadow-card transition-all duration-300"
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
          <img
            src={product.images[0]}
            alt={product.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] bg-slate-100 text-charcoal-700 font-semibold px-2 py-0.5 rounded-md whitespace-nowrap">
              {product.condition}
            </span>
            <span className="text-[10px] text-sand-500 truncate">
              {product.location.district}
            </span>
          </div>
          <h4 className="text-xs font-semibold text-charcoal-900 group-hover:text-eco-600 transition-colors leading-snug line-clamp-2">
            {product.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            {product.price ? (
              <span className="text-xs font-bold text-clay-600 whitespace-nowrap">
                {formatPrice(product.price)}
              </span>
            ) : (
              <span className="text-xs font-bold text-eco-600 flex items-center gap-1 whitespace-nowrap">
                <ArrowRightLeft className="w-3 h-3" /> Trao đổi đồ
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // 2. FEATURED EDITORIAL SPOTLIGHT VARIANT ("Món đồ được quan tâm nhiều nhất")
  if (variant === 'featured') {
    return (
      <div className="group bg-white rounded-3xl sm:rounded-4xl border border-slate-200/90 shadow-card hover:shadow-elevated hover:border-emerald-300/80 transition-all duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 w-full max-w-full">
        {/* Top/Left: Image Rail (Stacked on mobile/tablet, 5 cols on desktop lg+) */}
        <div className="lg:col-span-5 relative bg-slate-100 overflow-hidden flex flex-col justify-center">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-full w-full overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold bg-white/95 backdrop-blur-md text-eco-900 px-3.5 py-1.5 rounded-full shadow-subtle border border-white/80 whitespace-nowrap">
                {product.condition}
              </span>
              {(showRemoveButton || product.status !== 'AVAILABLE') && (
                <StatusBadge status={product.status} size="sm" />
              )}
              {category && (
                <span className="hidden sm:inline-block text-xs font-semibold bg-charcoal-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full whitespace-nowrap">
                  {category.name}
                </span>
              )}
            </div>

            {/* Favorite / Remove button (hidden for post owner) */}
            {!isOwner && (
              showRemoveButton ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onRemove) onRemove();
                    else toggleFavorite(product.id);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/95 text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-subtle"
                  title="Xóa khỏi danh sách yêu thích"
                  aria-label="Xóa khỏi danh sách yêu thích"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-subtle ${
                    isFavorite
                      ? 'bg-rose-500 text-white shadow-rose-500/40'
                      : 'bg-white/90 text-charcoal-700 hover:bg-white hover:text-rose-500 hover:scale-105'
                  }`}
                  aria-label="Lưu sản phẩm"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              )
            )}

            {/* Barter Tag on image */}
            {(product.type === 'EXCHANGE' || product.type === 'BOTH') && (
              <div className="absolute bottom-4 left-4">
                <span className="text-xs font-bold bg-gradient-to-r from-eco-700 to-teal-700 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-white/20 whitespace-nowrap">
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Sẵn sàng Đổi đồ
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom/Right: Rich Content Rail (7 cols on desktop lg+) */}
        <div className="lg:col-span-7 p-5 sm:p-7 lg:p-8 flex flex-col justify-between space-y-4 sm:space-y-5">
          <div className="space-y-3 sm:space-y-4">
            {/* Meta Header */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-sand-500 font-medium">
              <span className="flex items-center gap-1 font-semibold text-charcoal-700">
                <MapPin className="w-3.5 h-3.5 text-eco-600 flex-shrink-0" />
                {product.location.district}, {product.location.province}
              </span>
              <span>•</span>
              <span className="text-eco-800 font-semibold bg-eco-50 px-2.5 py-0.5 rounded-full border border-eco-200/60 inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-eco-600" />
                Gặp mặt an toàn
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline text-sand-400">
                {product.views} lượt xem
              </span>
            </div>

            {/* Title */}
            <Link to={`/products/${product.id}`} className="block group/title">
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-charcoal-900 group-hover/title:text-eco-600 transition-colors leading-snug">
                {product.title}
              </h3>
            </Link>

            {/* Natural Description without artificial clamping */}
            <p className="text-xs sm:text-sm text-sand-600 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Wanted Exchange Items */}
            {product.wantedExchangeItems && (
              <div className="p-3.5 sm:p-4 bg-gradient-to-r from-eco-50/90 via-teal-50/60 to-emerald-50/80 rounded-2xl border border-eco-200/80 text-xs shadow-subtle">
                <div className="font-bold text-eco-900 flex items-center gap-1.5 mb-1">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-eco-600 flex-shrink-0" />
                  <span>Món đồ mong muốn trao đổi:</span>
                </div>
                <p className="text-eco-800 text-xs sm:text-[13px] leading-relaxed font-medium">
                  {product.wantedExchangeItems}
                </p>
              </div>
            )}

            {/* Seller Trust Profile Bar */}
            {seller && (
              <Link
                to={`/sellers/${seller.id}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all group/seller"
              >
                <img
                  src={seller.avatar}
                  alt={seller.fullName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_AVATAR;
                  }}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400 shadow-subtle flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-charcoal-900 group-hover/seller:text-eco-700 truncate">
                      {seller.fullName}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                      Người bán uy tín
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-sand-500">
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {seller.rating.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span className="text-eco-700 font-semibold">
                      ★ {seller.trustScore} điểm uy tín
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{seller.totalTransactions} giao dịch</span>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Bottom Bar: Price & CTA */}
          <div className="pt-4 sm:pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center lg:flex-col xl:flex-row xl:items-center justify-between gap-3 sm:gap-4">
            <div>
              {product.price ? (
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black text-clay-600 font-sans tracking-tight">
                      {formatPrice(product.price)}
                    </span>
                    {discountPercent && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full whitespace-nowrap">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="text-xs text-sand-400 line-through mt-0.5 block whitespace-nowrap">
                      Giá gốc: {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-base sm:text-lg font-bold text-eco-700 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-eco-600" />
                  Giao lưu đổi đồ
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto lg:w-full xl:w-auto">
              <Link
                to={`/products/${product.id}`}
                className="w-full sm:w-auto lg:w-full xl:w-auto px-5 sm:px-7 py-3 bg-gradient-to-r from-eco-600 via-emerald-600 to-teal-600 hover:from-eco-500 hover:to-teal-500 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-full transition-all shadow-md shadow-eco-600/20 hover:shadow-lg hover:shadow-eco-500/30 text-center flex items-center justify-center gap-2 flex-shrink-0"
              >
                <span>Xem chi tiết & Giao dịch</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. STANDARD GRID CARD VARIANT
  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_-8px_rgba(16,185,129,0.15)] hover:border-emerald-300 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5 h-full">
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 flex-shrink-0">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Condition pill & Status badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none">
          <span className="text-[11px] font-bold bg-white/95 backdrop-blur-md text-charcoal-800 px-3 py-1 rounded-full shadow-subtle border border-white/60 whitespace-nowrap">
            {product.condition}
          </span>
          {(showRemoveButton || product.status !== 'AVAILABLE') && (
            <StatusBadge status={product.status} size="sm" />
          )}
        </div>

        {/* Barter Pill if supports exchange */}
        {(product.type === 'EXCHANGE' || product.type === 'BOTH') && (
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <span className="text-[10px] font-bold bg-gradient-to-r from-eco-700 to-teal-700 text-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-subtle border border-white/20 whitespace-nowrap">
              <ArrowRightLeft className="w-3 h-3 text-emerald-300" />
              Đổi đồ
            </span>
          </div>
        )}

        {/* Favorite / Remove button (hidden for post owner) */}
        {!isOwner && (
          showRemoveButton ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onRemove) onRemove();
                else toggleFavorite(product.id);
              }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/95 text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-subtle"
              title="Xóa khỏi danh sách yêu thích"
              aria-label="Xóa khỏi danh sách yêu thích"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-subtle ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-rose-500/40'
                  : 'bg-white/85 text-charcoal-700 hover:bg-white hover:text-rose-500'
              }`}
              aria-label="Lưu sản phẩm"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )
        )}
      </div>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          {/* Location & District */}
          <div className="flex items-center gap-1 text-[11px] text-sand-500 font-medium">
            <MapPin className="w-3 h-3 text-eco-600 flex-shrink-0" />
            <span className="truncate">
              {product.location.district}, {product.location.province}
            </span>
          </div>

          {/* Title - Natural Wrap without artificial line clipping */}
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="text-sm sm:text-base font-bold text-charcoal-900 group-hover:text-eco-600 transition-colors leading-snug break-words">
              {product.title}
            </h3>
          </Link>

          {/* Wanted exchange preview if exchange type */}
          {product.wantedExchangeItems && (
            <div className="text-[11px] text-eco-900 bg-gradient-to-r from-eco-50/90 to-teal-50/70 p-2.5 rounded-xl border border-eco-200/60 leading-tight">
              <span className="font-semibold text-eco-700 flex items-center gap-1 mb-0.5">
                <ArrowRightLeft className="w-3 h-3 text-eco-600 flex-shrink-0" /> Đổi lấy:
              </span>
              <span className="text-eco-800 break-words">{product.wantedExchangeItems}</span>
            </div>
          )}
        </div>

        {/* Price & Seller footer */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            {product.price ? (
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-base sm:text-lg font-black text-clay-600 tracking-tight whitespace-nowrap">
                    {formatPrice(product.price)}
                  </span>
                  {discountPercent && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1 py-0.5 rounded whitespace-nowrap">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <span className="text-[11px] text-sand-400 line-through block whitespace-nowrap">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs sm:text-sm font-bold text-eco-700 flex items-center gap-1">
                <ArrowRightLeft className="w-3.5 h-3.5 text-eco-600 flex-shrink-0" />
                <span className="truncate">Đổi ngang / Bù tiền</span>
              </span>
            )}
          </div>

          {seller && (
            <Link
              to={`/sellers/${seller.id}`}
              className="flex items-center gap-1.5 text-right hover:opacity-80 transition-opacity flex-shrink-0"
              title={`Người bán: ${seller.fullName} (${seller.trustScore} điểm uy tín)`}
            >
              <div className="hidden xs:block sm:block text-right">
                <div className="text-[11px] font-semibold text-charcoal-800 max-w-[85px] truncate">
                  {seller.fullName}
                </div>
                <div className="text-[10px] text-eco-700 font-semibold flex items-center justify-end gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                  {seller.rating.toFixed(1)}
                </div>
              </div>
              <img
                src={seller.avatar}
                alt={seller.fullName}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_AVATAR;
                }}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-eco-400 flex-shrink-0"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
