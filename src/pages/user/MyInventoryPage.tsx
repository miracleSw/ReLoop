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
  MoreVertical
} from 'lucide-react';

export const MyInventoryPage: React.FC = () => {
  const { currentUser, products, setProductStatus, deleteProduct, barterRequests, buyRequests } = useApp();
  const [activeTab, setActiveTab] = useState<string>('ALL');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-charcoal-900">Vui lòng đăng nhập</h2>
        <Link to="/login" className="mt-4 inline-block text-eco-800 text-sm font-semibold hover:underline">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
            Kho đồ cá nhân (Personal Inventory)
          </h1>
          <p className="text-xs sm:text-sm text-sand-600 mt-1">
            Quản lý toàn bộ danh sách sản phẩm đăng tải và theo dõi trạng thái các giao dịch gặp mặt.
          </p>
        </div>

        <Link
          to="/user/create-listing"
          className="px-5 py-3 rounded-xl bg-eco-800 hover:bg-eco-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-soft transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Đăng món đồ mới</span>
        </Link>
      </div>

      {/* 2. STATUS TABS (UC07) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-sand-200 scrollbar-none">
        {[
          { id: 'ALL', label: 'Tất cả bài đăng', count: myListings.length },
          {
            id: 'AVAILABLE',
            label: 'Còn hàng (AVAILABLE)',
            count: myListings.filter((p) => p.status === 'AVAILABLE').length,
          },
          {
            id: 'RESERVED',
            label: 'Đã hẹn gặp (RESERVED)',
            count: myListings.filter((p) => p.status === 'RESERVED').length,
          },
          {
            id: 'COMPLETED',
            label: 'Đã giao dịch (COMPLETED)',
            count: myListings.filter((p) => p.status === 'COMPLETED').length,
          },
          {
            id: 'HIDDEN',
            label: 'Tạm ẩn (HIDDEN)',
            count: myListings.filter((p) => p.status === 'HIDDEN').length,
          },
          {
            id: 'LOCKED',
            label: 'Bị khóa (LOCKED)',
            count: myListings.filter((p) => p.status === 'LOCKED').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-eco-800 text-white shadow-soft'
                : 'bg-white text-charcoal-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-sand-100 text-sand-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. LISTINGS TABLE / CARD LIST */}
      {filteredListings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-sand-200 space-y-3">
          <Layers className="w-12 h-12 text-sand-300 mx-auto" />
          <h3 className="text-base font-bold text-charcoal-900">
            Không có món đồ nào trong mục này
          </h3>
          <p className="text-xs text-sand-600">
            Bạn chưa có sản phẩm nào thuộc trạng thái "{activeTab}".
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((prod) => {
            const pendingOffersCount = getOffersCount(prod.id);

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-sand-200 p-4 sm:p-5 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Product details */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-sand-200 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={prod.status} size="sm" />
                      <span className="text-[11px] font-semibold bg-sand-100 text-charcoal-700 px-2 py-0.5 rounded">
                        {prod.condition}
                      </span>
                      <span className="text-[11px] text-sand-500">
                        {prod.location.district}, {prod.location.province}
                      </span>
                    </div>

                    <Link to={`/products/${prod.id}`}>
                      <h3 className="text-sm sm:text-base font-bold text-charcoal-900 hover:text-eco-800 truncate">
                        {prod.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-3 text-xs">
                      {prod.price ? (
                        <span className="font-extrabold text-clay-700">
                          {prod.price.toLocaleString('vi-VN')}₫
                        </span>
                      ) : (
                        <span className="font-bold text-eco-800 flex items-center gap-1">
                          <ArrowRightLeft className="w-3 h-3" /> Trao đổi
                        </span>
                      )}
                      <span className="text-sand-400">•</span>
                      <span className="text-sand-500">{prod.views} lượt xem</span>
                      <span className="text-sand-400">•</span>
                      <span className="text-sand-500">{prod.favoritesCount} quan tâm</span>
                    </div>
                  </div>
                </div>

                {/* Received offers pill */}
                {pendingOffersCount > 0 && (
                  <Link
                    to="/user/exchanges"
                    className="px-3 py-1.5 rounded-xl bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1.5 animate-pulse"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>{pendingOffersCount} đề nghị mới đang chờ duyệt!</span>
                  </Link>
                )}

                {/* Actions dropdown/buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-sand-100">
                  {/* Status Toggle Button (UC08: Ẩn/Hiện tin) */}
                  {prod.status === 'AVAILABLE' && (
                    <button
                      onClick={() => setProductStatus(prod.id, 'HIDDEN')}
                      className="p-2 text-sand-600 hover:text-charcoal-900 hover:bg-sand-100 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
                      title="Tạm ẩn bài đăng"
                    >
                      <EyeOff className="w-4 h-4" />
                      <span className="hidden sm:inline">Ẩn tin</span>
                    </button>
                  )}

                  {prod.status === 'HIDDEN' && (
                    <button
                      onClick={() => setProductStatus(prod.id, 'AVAILABLE')}
                      className="p-2 text-eco-700 hover:text-eco-900 hover:bg-eco-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
                      title="Mở lại bài đăng"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Hiện tin</span>
                    </button>
                  )}

                  {/* Edit button (UC06: only if not locked or completed) */}
                  {prod.status !== 'LOCKED' && (
                    <Link
                      to={`/user/edit-listing/${prod.id}`}
                      className="p-2 text-sand-600 hover:text-charcoal-900 hover:bg-sand-100 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
                      title="Chỉnh sửa bài đăng"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Sửa</span>
                    </Link>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      if (window.confirm('Bạn có chắc muốn xóa vĩnh viễn bài đăng này khỏi kho đồ?')) {
                        deleteProduct(prod.id);
                      }
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
                    title="Xóa bài đăng"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Xóa</span>
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
