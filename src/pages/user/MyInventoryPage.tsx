import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Product, ProductStatus } from '../../types';
import {
  Layers,
  PlusCircle,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  ArrowRightLeft,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Package
} from 'lucide-react';

export const MyInventoryPage: React.FC = () => {
  const { currentUser, products, setProductStatus, deleteProduct, barterRequests, buyRequests } = useApp();
  const [activeTab, setActiveTab] = useState<string>('ALL');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">Vui lòng đăng nhập</h2>
        <Link to="/login" className="mt-4 inline-block text-eco-700 text-sm font-semibold hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const myListings = products.filter((p) => p.sellerId === currentUser.id);

  const filteredListings = myListings.filter((p) => {
    if (activeTab === 'ALL') return true;
    return p.status === activeTab;
  });

  const getOffersCount = (productId: string) => {
    const barterCount = barterRequests.filter((r) => r.targetProductId === productId && r.status === 'PENDING').length;
    const buyCount = buyRequests.filter((r) => r.targetProductId === productId && r.status === 'PENDING').length;
    return barterCount + buyCount;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Kho đồ cá nhân
          </h1>
        </div>

        <Link
          to="/user/create-listing"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-emerald hover:shadow-lg transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng tin mới</span>
        </Link>
      </div>

      {/* 2. STATUS TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80 scrollbar-none min-w-0 max-w-full">
        {[
          { id: 'ALL', label: 'Tất cả', count: myListings.length },
          {
            id: 'AVAILABLE',
            label: 'Còn hàng',
            count: myListings.filter((p) => p.status === 'AVAILABLE').length,
          },
          {
            id: 'RESERVED',
            label: 'Đang có hẹn',
            count: myListings.filter((p) => p.status === 'RESERVED').length,
          },
          {
            id: 'COMPLETED',
            label: 'Đã giao dịch',
            count: myListings.filter((p) => p.status === 'COMPLETED').length,
          },
          {
            id: 'HIDDEN',
            label: 'Tạm ẩn',
            count: myListings.filter((p) => p.status === 'HIDDEN').length,
          },
          {
            id: 'LOCKED',
            label: 'Tạm khóa',
            count: myListings.filter((p) => p.status === 'LOCKED').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 text-white shadow-glow-emerald'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-xs'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. LISTINGS TABLE / CARD LIST */}
      {filteredListings.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Không có món đồ nào trong mục này
          </h3>
          <p className="text-xs text-slate-500">
            Chưa có sản phẩm nào được lưu ở trạng thái này.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((prod) => {
            const pendingOffersCount = getOffersCount(prod.id);

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-6px_rgba(16,185,129,0.1)] transition-all flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-5 group w-full max-w-full overflow-hidden"
              >
                {/* Product details */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 w-full max-w-full">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-2xl border border-slate-200 flex-shrink-0 bg-slate-50">
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <StatusBadge status={prod.status} size="sm" />
                      <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                        {prod.condition}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium truncate max-w-[120px] sm:max-w-[150px]">
                        {prod.location.district}, {prod.location.province}
                      </span>
                    </div>

                    <Link to={`/products/${prod.id}`}>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 hover:text-eco-700 truncate transition-colors flex items-center gap-1.5">
                        <span className="truncate">{prod.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-eco-600 transition-colors flex-shrink-0" />
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                      {prod.price ? (
                        <span className="font-black text-clay-600 text-sm whitespace-nowrap">
                          {prod.price.toLocaleString('vi-VN')}₫
                        </span>
                      ) : (
                        <span className="font-bold text-eco-700 flex items-center gap-1 whitespace-nowrap">
                          <ArrowRightLeft className="w-3 h-3" /> Trao đổi đồ
                        </span>
                      )}
                      <span className="text-slate-300 hidden sm:inline">•</span>
                      <span className="text-slate-500 whitespace-nowrap">{prod.views} lượt xem</span>
                      <span className="text-slate-300 hidden sm:inline">•</span>
                      <span className="text-slate-500 whitespace-nowrap">{prod.favoritesCount} quan tâm</span>
                    </div>
                  </div>
                </div>

                {/* Received offers pill */}
                {pendingOffersCount > 0 && (
                  <Link
                    to="/user/exchanges"
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/90 text-xs font-bold flex items-center gap-2 shadow-xs hover:bg-emerald-100 transition-colors w-full lg:w-auto justify-center"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{pendingOffersCount} đề nghị đang chờ phản hồi</span>
                  </Link>
                )}

                {/* Actions dropdown/buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start sm:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {/* Status Toggle Button (UC08: Ẩn/Hiện tin) */}
                  {prod.status === 'AVAILABLE' && (
                    <button
                      onClick={() => setProductStatus(prod.id, 'HIDDEN')}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors text-xs font-bold flex items-center gap-1.5 border border-slate-200"
                      title="Tạm ẩn bài đăng"
                    >
                      <EyeOff className="w-4 h-4" />
                      <span>Ẩn tin</span>
                    </button>
                  )}

                  {prod.status === 'HIDDEN' && (
                    <button
                      onClick={() => setProductStatus(prod.id, 'AVAILABLE')}
                      className="px-3 py-2 text-eco-700 hover:text-eco-900 hover:bg-eco-50 rounded-xl transition-colors text-xs font-bold flex items-center gap-1.5 border border-eco-200"
                      title="Mở lại bài đăng"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Hiện tin</span>
                    </button>
                  )}

                  {/* Edit button (UC06: only if not locked or completed) */}
                  {prod.status !== 'LOCKED' && (
                    <Link
                      to={`/user/edit-listing/${prod.id}`}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors text-xs font-bold flex items-center gap-1.5 border border-slate-200"
                      title="Chỉnh sửa bài đăng"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Sửa</span>
                    </Link>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      if (window.confirm('Bạn có chắc muốn xóa vĩnh viễn bài đăng này khỏi kho đồ?')) {
                        deleteProduct(prod.id);
                      }
                    }}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs font-bold flex items-center gap-1.5 border border-rose-200"
                    title="Xóa bài đăng"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
