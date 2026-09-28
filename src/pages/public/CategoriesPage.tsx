import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Leaf, ArrowRight, Layers } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, products } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-eco-700 uppercase tracking-wider bg-eco-50 px-3 py-1 rounded-full border border-eco-200">
          <Layers className="w-3.5 h-3.5" />
          <span>Hệ thống phân loại chuẩn</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900">
          Danh mục ngành hàng ReLoop
        </h1>
        <p className="text-sm text-sand-600 leading-relaxed">
          Tất cả sản phẩm đã qua sử dụng được sắp xếp khoa học, giúp bạn tìm kiếm nhanh chóng món đồ cần thiết trong khu vực của mình.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const sampleProducts = products.filter(
            (p) => p.categoryId === cat.id && (p.status === 'AVAILABLE' || p.status === 'RESERVED')
          );

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-sand-200 shadow-soft hover:shadow-card transition-all p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-eco-100 text-eco-800 flex items-center justify-center mb-5">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-charcoal-900">{cat.name}</h3>
                <p className="text-xs sm:text-sm text-sand-600 mt-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-4 pt-4 border-t border-sand-100 flex items-center justify-between text-xs text-sand-500">
                  <span className="font-semibold text-charcoal-800">
                    {sampleProducts.length} bài đăng đang mở
                  </span>
                  <span>Đã kiểm duyệt</span>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <Link
                  to={`/explore?category=${cat.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-sand-100 hover:bg-eco-50 hover:text-eco-900 text-charcoal-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Khám phá danh mục</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
