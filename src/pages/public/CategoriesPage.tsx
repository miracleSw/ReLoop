import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Leaf, ArrowRight, Layers } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, products } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
          Danh mục sản phẩm
        </h1>
        <p className="text-sm text-sand-500 leading-relaxed">
          Tất cả sản phẩm đã qua sử dụng được sắp xếp khoa học, giúp bạn tìm kiếm nhanh chóng món đồ cần thiết trong khu vực của mình.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => {
          const sampleProducts = products.filter(
            (p) => p.categoryId === cat.id && (p.status === 'AVAILABLE' || p.status === 'RESERVED')
          );

          // Variety of lively pastel/gradient accents for category icons
          const iconGradients = [
            'from-emerald-500 to-teal-500',
            'from-sky-500 to-indigo-500',
            'from-amber-500 to-orange-500',
            'from-rose-500 to-pink-500',
            'from-teal-500 to-cyan-500',
            'from-violet-500 to-purple-500'
          ];
          const grad = iconGradients[idx % iconGradients.length];

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-card hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${grad} text-white flex items-center justify-center mb-5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform`}>
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-charcoal-900 group-hover:text-eco-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs sm:text-sm text-sand-600 mt-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                    {sampleProducts.length} bài đăng đang mở
                  </span>
                  <span className="text-sand-400 font-medium">Đã kiểm duyệt</span>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <Link
                  to={`/explore?category=${cat.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 group-hover:bg-gradient-to-r group-hover:from-eco-600 group-hover:to-teal-600 group-hover:text-white text-charcoal-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-subtle group-hover:shadow-md"
                >
                  <span>Khám phá danh mục</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
