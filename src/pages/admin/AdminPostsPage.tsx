import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Product, ProductStatus } from '../../types';
import {
  Layers,
  Search,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  Eye,
  AlertOctagon,
  X,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminPostsPage: React.FC = () => {
  const { products, setProductStatus, deleteProduct, users } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedPost, setSelectedPost] = useState<Product | null>(null);

  const filteredPosts = products.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal-900">
            Kiểm duyệt Bài đăng & Sản phẩm (UC24)
          </h1>
          <p className="text-xs text-sand-600 mt-0.5">
            Kiểm soát hàng cấm, đối soát vi phạm chính sách cộng đồng và gỡ bỏ bài đăng giả mạo (UC26).
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-soft">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tiêu đề, mô tả..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
          />
          <Search className="w-4 h-4 text-sand-400 absolute left-3 top-3 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          {['ALL', 'AVAILABLE', 'RESERVED', 'LOCKED', 'REMOVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-eco-700 to-eco-600 text-white shadow-glow-emerald'
                  : 'bg-slate-100 text-charcoal-700 hover:bg-slate-200/70'
              }`}
            >
              {st === 'ALL'
                ? 'Tất cả bài'
                : st === 'AVAILABLE'
                ? 'Đang mở'
                : st === 'RESERVED'
                ? 'Tạm giữ'
                : st === 'LOCKED'
                ? 'Bị khóa'
                : 'Đã gỡ'}
            </button>
          ))}
        </div>
      </div>

      {/* POSTS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-800">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Sản phẩm</th>
                <th className="py-3.5 px-4">Người đăng</th>
                <th className="py-3.5 px-4">Giá / Hình thức</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Cảnh báo vi phạm</th>
                <th className="py-3.5 px-5 text-right">Kiểm duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map((p) => {
                const seller = users.find((u) => u.id === p.sellerId);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Media & Title */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0 shadow-subtle"
                        />
                        <div className="min-w-0 max-w-xs">
                          <button
                            onClick={() => setSelectedPost(p)}
                            className="font-bold text-charcoal-900 hover:text-eco-600 text-left line-clamp-1 transition-colors"
                          >
                            {p.title}
                          </button>
                          <span className="text-[11px] text-slate-500">
                            {p.location.district}, {p.location.province}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-charcoal-900 block truncate">
                        {seller?.fullName}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-medium">
                        ★ {seller?.trustScore}đ Uy tín
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-clay-700">
                      {p.price ? `${p.price.toLocaleString('vi-VN')}₫` : 'Trao đổi đồ'}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} size="sm" />
                    </td>

                    {/* Prohibited items keyword flag */}
                    <td className="py-3.5 px-4">
                      {p.flagProhibited || p.prohibitedKeywordFound ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-200">
                          <AlertOctagon className="w-3 h-3 text-rose-600" />
                          <span>Hàng cấm: {p.prohibitedKeywordFound || 'Vi phạm'}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Hợp lệ
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.status === 'LOCKED' ? (
                          <button
                            onClick={() => setProductStatus(p.id, 'AVAILABLE')}
                            className="px-3 py-1.5 bg-gradient-to-r from-eco-600 to-teal-600 hover:from-eco-500 hover:to-teal-500 text-white rounded-xl text-[11px] font-bold shadow-soft transition-all"
                          >
                            Phê duyệt lại
                          </button>
                        ) : (
                          <button
                            onClick={() => setProductStatus(p.id, 'LOCKED')}
                            className="px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-xl text-[11px] font-bold transition-colors"
                          >
                            Khóa bài
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm('Gỡ bỏ bài đăng vi phạm này vĩnh viễn khỏi hệ thống? (UC26)')) {
                              setProductStatus(p.id, 'REMOVED');
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Gỡ bài vĩnh viễn (UC26)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* POST DETAIL INSPECTION DRAWER */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-lg h-full p-6 sm:p-8 overflow-y-auto space-y-6 animate-slide-up relative border-l border-slate-200 shadow-elevated">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-charcoal-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Thẩm định bài đăng #{selectedPost.id}
              </span>
              <h3 className="text-lg font-bold text-charcoal-900 mt-1">{selectedPost.title}</h3>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge status={selectedPost.status} size="sm" />
                <span className="text-xs text-slate-500">{selectedPost.condition}</span>
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-2 gap-2">
              {selectedPost.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Detail ${i}`}
                  className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow-subtle"
                />
              ))}
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl text-xs border border-slate-200/80">
              <div>
                <span className="text-slate-500 font-semibold block">Mô tả người đăng:</span>
                <p className="mt-1 text-charcoal-800 leading-relaxed whitespace-pre-line font-normal">
                  {selectedPost.description}
                </p>
              </div>

              {selectedPost.wantedExchangeItems && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-eco-800 font-bold block">Đồ muốn đổi:</span>
                  <p className="mt-0.5 text-charcoal-800">{selectedPost.wantedExchangeItems}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <Link
                to={`/products/${selectedPost.id}`}
                target="_blank"
                className="text-xs font-bold text-eco-700 hover:underline flex items-center gap-1"
              >
                <span>Xem trên trang công khai</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => {
                  setProductStatus(selectedPost.id, 'REMOVED');
                  setSelectedPost(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20"
              >
                Gỡ bài đăng vi phạm (UC26)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
