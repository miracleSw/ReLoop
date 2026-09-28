import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
import { Heart, Search, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { favorites, products } = useApp();

  const savedProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
          Danh sách món đồ quan tâm (Wishlist)
        </h1>
        <p className="text-xs sm:text-sm text-sand-600 mt-1">
          Lưu lại để theo dõi biến động trạng thái hoặc chuẩn bị đồ để đổi.
        </p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-sand-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-sand-100 text-sand-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-charcoal-900">Chưa có món đồ nào được lưu</h3>
          <p className="text-xs sm:text-sm text-sand-600 max-w-sm mx-auto">
            Hãy bấm biểu tượng trái tim trên các sản phẩm khi khám phá để lưu lại và theo dõi nhanh.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-eco-800 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-eco-700 transition-colors shadow-soft"
          >
            <span>Khám phá sản phẩm ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedProducts.map((p) => (
            <ProductCard key={p.id} product={p} variant="standard" />
          ))}
        </div>
      )}
    </div>
  );
};
