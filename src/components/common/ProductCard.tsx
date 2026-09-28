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
        className="group flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-sand-200/80 hover:border-eco-300 hover:shadow-soft transition-all"
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-sand-100 flex-shrink-0 relative">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] bg-sand-100 text-charcoal-700 font-semibold px-2 py-0.5 rounded-md">
              {product.condition}
            </span>
            <span className="text-[10px] text-sand-500 truncate">
              {product.location.district}
            </span>
          </div>
          <h4 className="text-xs font-semibold text-charcoal-900 truncate group-hover:text-eco-800 transition-colors">
            {product.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            {product.price ? (
              <span className="text-xs font-bold text-clay-700">
                {formatPrice(product.price)}
              </span>
            ) : (
              <span className="text-xs font-bold text-eco-700 flex items-center gap-1">
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
      <div className="group bg-white rounded-3xl border border-sand-200 shadow-card overflow-hidden hover:shadow-elevated transition-all duration-300 flex flex-col md:flex-row">
        {/* Image rail */}
        <div className="md:w-1/2 relative overflow-hidden bg-sand-100 min-h-[280px]">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="text-xs font-bold bg-white/90 backdrop-blur-md text-eco-900 px-3 py-1 rounded-full shadow-subtle">
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
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-charcoal-700 hover:bg-white hover:text-rose-500'
            }`}
            aria-label="Lưu sản phẩm"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content details */}
        <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-sand-600 mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-eco-600" />
                {product.location.district}, {product.location.province}
              </span>
              <span>•</span>
              <span className="text-eco-700 font-medium">Giao dịch gặp mặt an toàn</span>
            </div>

            <Link to={`/products/${product.id}`}>
              <h3 className="text-lg md:text-xl font-bold text-charcoal-900 group-hover:text-eco-800 transition-colors line-clamp-2">
                {product.title}
              </h3>
            </Link>

            <p className="text-xs sm:text-sm text-sand-700 mt-2.5 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {product.wantedExchangeItems && (
              <div className="mt-4 p-3 bg-eco-50/70 rounded-2xl border border-eco-200/60 text-xs">
                <div className="font-semibold text-eco-900 flex items-center gap-1.5 mb-0.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-eco-700" />
                  Món đồ mong muốn đổi:
                </div>
                <div className="text-eco-800 text-[11px] line-clamp-2">
                  {product.wantedExchangeItems}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-sand-100 flex items-center justify-between">
            <div>
              {product.price ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-clay-700 font-sans">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-sand-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-base font-bold text-eco-800 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-eco-600" />
                  Giao lưu đổi đồ
                </span>
              )}
            </div>

            <Link
              to={`/products/${product.id}`}
              className="px-5 py-2.5 bg-eco-800 hover:bg-eco-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-soft"
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
    <div className="group bg-white rounded-3xl border border-sand-200/90 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-100">
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
          <span className="text-[11px] font-bold bg-white/95 backdrop-blur-md text-charcoal-800 px-2.5 py-1 rounded-full shadow-subtle border border-white/40">
            {product.condition}
          </span>
          {product.status !== 'AVAILABLE' && <StatusBadge status={product.status} size="sm" />}
        </div>

        {/* Barter Pill if supports exchange */}
        {(product.type === 'EXCHANGE' || product.type === 'BOTH') && (
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <span className="text-[10px] font-bold bg-eco-900/90 backdrop-blur-md text-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-subtle">
              <ArrowRightLeft className="w-3 h-3 text-emerald-400" />
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
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 text-charcoal-700 hover:bg-white hover:text-rose-500'
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
          <div className="flex items-center gap-1 text-[11px] text-sand-600 mb-1.5">
            <MapPin className="w-3 h-3 text-eco-600 flex-shrink-0" />
            <span className="truncate">
              {product.location.district}, {product.location.province}
            </span>
          </div>

          {/* Title */}
          <Link to={`/products/${product.id}`}>
            <h3 className="text-sm sm:text-base font-bold text-charcoal-900 group-hover:text-eco-800 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Wanted exchange preview if exchange type */}
          {product.wantedExchangeItems && (
            <p className="mt-2 text-[11px] text-eco-800 bg-eco-50/70 p-2 rounded-xl line-clamp-1 border border-eco-100">
              <span className="font-semibold">Đổi lấy:</span> {product.wantedExchangeItems}
            </p>
          )}
        </div>

        {/* Price & Seller footer */}
        <div className="mt-4 pt-3 border-t border-sand-100 flex items-end justify-between">
          <div>
            {product.price ? (
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-extrabold text-clay-700">
                    {formatPrice(product.price)}
                  </span>
                  {discountPercent && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <span className="text-[11px] text-sand-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm font-bold text-eco-800 flex items-center gap-1">
                <ArrowRightLeft className="w-3.5 h-3.5" />
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
                <div className="text-[10px] text-eco-700 font-medium flex items-center justify-end gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                  {seller.rating.toFixed(1)}
                </div>
              </div>
              <img
                src={seller.avatar}
                alt={seller.fullName}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-eco-500"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
