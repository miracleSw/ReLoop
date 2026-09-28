import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { Heart, MapPin, ArrowRightLeft, ShieldCheck, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  variant?: 'standard' | 'featured' | 'compact';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'standard',
}) => {
  const { favorites, toggleFavorite, users } = useApp();
  const isFavorite = favorites.includes(product.id);
  const seller = users.find((u) => u.id === product.sellerId);

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return price.toLocaleString('vi-VN') + '₫';
  };

  const discountPercent =
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // COMPACT VARIANT
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
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] bg-slate-100 text-charcoal-700 font-semibold px-2 py-0.5 rounded-md">
              {product.condition}
            </span>
            <span className="text-[10px] text-sand-500 truncate">
              {product.location.district}
            </span>
          </div>
          <h4 className="text-xs font-semibold text-charcoal-900 truncate group-hover:text-eco-600 transition-colors">
            {product.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            {product.price ? (
              <span className="text-xs font-bold text-clay-600">
                {formatPrice(product.price)}
              </span>
            ) : (
              <span className="text-xs font-bold text-eco-600 flex items-center gap-1">
                <ArrowRightLeft className="w-3 h-3" /> Trao đổi đồ
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // FEATURED EDITORIAL VARIANT
  if (variant === 'featured') {
    return (
      <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden hover:shadow-elevated hover:border-emerald-300/80 transition-all duration-300 flex flex-col md:flex-row">
        {/* Image rail */}
        <div className="md:w-1/2 relative overflow-hidden bg-slate-100 min-h-[280px]">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="text-xs font-bold bg-white/95 backdrop-blur-md text-eco-900 px-3.5 py-1 rounded-full shadow-subtle border border-white/60">
              {product.condition}
            </span>
            {product.status !== 'AVAILABLE' && <StatusBadge status={product.status} size="sm" />}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(product.id);
            }}
            className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-subtle ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-rose-500/40'
                : 'bg-white/90 text-charcoal-700 hover:bg-white hover:text-rose-500'
            }`}
            aria-label="Lưu sản phẩm"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content details */}
        <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-sand-500 mb-2">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-eco-600" />
                {product.location.district}, {product.location.province}
              </span>
              <span>•</span>
              <span className="text-eco-700 font-semibold bg-eco-50 px-2 py-0.5 rounded-full border border-eco-200/60">
                Gặp mặt an toàn
              </span>
            </div>

            <Link to={`/products/${product.id}`}>
              <h3 className="text-lg md:text-xl font-bold text-charcoal-900 group-hover:text-eco-600 transition-colors line-clamp-2">
                {product.title}
              </h3>
            </Link>

            <p className="text-xs sm:text-sm text-sand-600 mt-2.5 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {product.wantedExchangeItems && (
              <div className="mt-4 p-3 bg-gradient-to-r from-eco-50/90 to-teal-50/70 rounded-2xl border border-eco-200/70 text-xs">
                <div className="font-bold text-eco-900 flex items-center gap-1.5 mb-0.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-eco-600" />
                  Món đồ mong muốn đổi:
                </div>
                <div className="text-eco-800 text-[11px] line-clamp-2">
                  {product.wantedExchangeItems}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <div>
              {product.price ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-clay-600 font-sans tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-sand-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-base font-bold text-eco-700 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-eco-600" />
                  Giao lưu đổi đồ
                </span>
              )}
            </div>

            <Link
              to={`/products/${product.id}`}
              className="px-6 py-2.5 bg-gradient-to-r from-eco-600 via-emerald-600 to-teal-600 hover:from-eco-500 hover:to-teal-500 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-full transition-all shadow-md shadow-eco-600/20 hover:shadow-lg hover:shadow-eco-500/30"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD GRID CARD VARIANT
  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_-8px_rgba(16,185,129,0.15)] hover:border-emerald-300 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5">
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Condition pill & Status badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none">
          <span className="text-[11px] font-bold bg-white/95 backdrop-blur-md text-charcoal-800 px-3 py-1 rounded-full shadow-subtle border border-white/60">
            {product.condition}
          </span>
          {product.status !== 'AVAILABLE' && <StatusBadge status={product.status} size="sm" />}
        </div>

        {/* Barter Pill if supports exchange */}
        {(product.type === 'EXCHANGE' || product.type === 'BOTH') && (
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <span className="text-[10px] font-bold bg-gradient-to-r from-eco-700 to-teal-700 text-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-subtle border border-white/20">
              <ArrowRightLeft className="w-3 h-3 text-emerald-300" />
              Đổi đồ
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
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
      </div>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & District */}
          <div className="flex items-center gap-1 text-[11px] text-sand-500 mb-1.5 font-medium">
            <MapPin className="w-3 h-3 text-eco-600 flex-shrink-0" />
            <span className="truncate">
              {product.location.district}, {product.location.province}
            </span>
          </div>

          {/* Title */}
          <Link to={`/products/${product.id}`}>
            <h3 className="text-sm sm:text-base font-bold text-charcoal-900 group-hover:text-eco-600 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Wanted exchange preview if exchange type */}
          {product.wantedExchangeItems && (
            <p className="mt-2 text-[11px] text-eco-900 bg-gradient-to-r from-eco-50/90 to-teal-50/70 p-2.5 rounded-xl line-clamp-1 border border-eco-200/60">
              <span className="font-semibold text-eco-700">Đổi lấy:</span> {product.wantedExchangeItems}
            </p>
          )}
        </div>

        {/* Price & Seller footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
          <div>
            {product.price ? (
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-black text-clay-600 tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                  {discountPercent && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1 py-0.2 rounded">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <span className="text-[11px] text-sand-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm font-bold text-eco-700 flex items-center gap-1">
                <ArrowRightLeft className="w-3.5 h-3.5 text-eco-600" />
                Đổi ngang / Bù tiền
              </span>
            )}
          </div>

          {seller && (
            <Link
              to={`/sellers/${seller.id}`}
              className="flex items-center gap-1.5 text-right hover:opacity-80 transition-opacity"
              title={`Người bán: ${seller.fullName} (${seller.trustScore}đ uy tín)`}
            >
              <div className="hidden sm:block">
                <div className="text-[11px] font-semibold text-charcoal-800 max-w-[80px] truncate">
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
                className="w-6 h-6 rounded-full object-cover ring-2 ring-eco-400"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
