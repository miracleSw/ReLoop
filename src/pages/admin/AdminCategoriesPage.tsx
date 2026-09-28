import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import {
  FolderTree,
  PlusCircle,
  Edit,
  Eye,
  EyeOff,
  Leaf,
  Check,
  X
} from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, toggleHideCategory } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCategory({
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
      icon: 'Leaf',
      description: description.trim(),
      displayOrder,
      isHidden: false,
    });

    setName('');
    setSlug('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    updateCategory(editingCategory.id, {
      name: editingCategory.name,
      slug: editingCategory.slug,
      description: editingCategory.description,
      displayOrder: editingCategory.displayOrder,
    });

    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal-900">
            Quản lý Danh mục Ngành hàng (Category Management - UC27)
          </h1>
          <p className="text-xs text-sand-600 mt-0.5">
            Quản trị cấu trúc danh mục toàn sàn, thứ tự ưu tiên và trạng thái ẩn/hiện ngành hàng.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald flex items-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Thêm danh mục mới</span>
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-800">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Tên danh mục</th>
                <th className="py-3.5 px-4">Mã định danh (Slug)</th>
                <th className="py-3.5 px-4 text-center">Thứ tự hiển thị</th>
                <th className="py-3.5 px-4 text-center">Số bài đăng</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-charcoal-900 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-eco-50 to-teal-100 text-eco-700 flex items-center justify-center flex-shrink-0 shadow-subtle">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-charcoal-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500 font-normal line-clamp-1">
                        {c.description}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200/60 text-[11px]">
                      {c.slug}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-charcoal-800">
                    {c.displayOrder}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="bg-emerald-50 text-eco-800 border border-emerald-200/70 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                      {c.productCount} bài
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {c.isHidden ? (
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
                        Đang ẩn
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-800 bg-emerald-100/80 border border-emerald-200/80 px-2.5 py-0.5 rounded-full font-bold">
                        Hiển thị
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Hide/Show Toggle */}
                      <button
                        onClick={() => toggleHideCategory(c.id)}
                        className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-charcoal-800 rounded-lg transition-colors"
                        title={c.isHidden ? 'Mở hiển thị' : 'Tạm ẩn danh mục'}
                      >
                        {c.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditingCategory(c)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-eco-700 rounded-lg transition-colors"
                        title="Chỉnh sửa danh mục"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD CATEGORY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-elevated border border-slate-200 animate-slide-up max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-charcoal-900">Thêm danh mục ngành hàng mới</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Tên danh mục <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Đồ gốm mộc & Decor"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Mã định danh (Slug URL)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="do-gom-moc-decor"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Thứ tự ưu tiên hiển thị
                </label>
                <input
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả ngành hàng để người dùng dễ phân loại..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald"
                >
                  Lưu danh mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-elevated border border-slate-200 animate-slide-up max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-charcoal-900">Chỉnh sửa danh mục ngành hàng</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">Tên danh mục</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">Mã Slug</label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">Thứ tự</label>
                <input
                  type="number"
                  value={editingCategory.displayOrder}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      displayOrder: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">Mô tả</label>
                <textarea
                  rows={2}
                  value={editingCategory.description}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
