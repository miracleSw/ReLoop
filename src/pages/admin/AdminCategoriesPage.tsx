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
          className="px-5 py-2.5 bg-eco-800 hover:bg-eco-700 text-white rounded-xl text-xs font-bold shadow-soft flex items-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Thêm danh mục mới</span>
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-800">
            <thead className="bg-sand-50 border-b border-sand-200 text-sand-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Tên danh mục</th>
                <th className="py-3.5 px-4">Mã định danh (Slug)</th>
                <th className="py-3.5 px-4 text-center">Thứ tự hiển thị</th>
                <th className="py-3.5 px-4 text-center">Số bài đăng</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-sand-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-charcoal-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-eco-100 text-eco-800 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <div>{c.name}</div>
                      <div className="text-[11px] text-sand-500 font-normal line-clamp-1">
                        {c.description}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-sand-600">{c.slug}</td>

                  <td className="py-3.5 px-4 text-center font-bold text-charcoal-800">
                    {c.displayOrder}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="bg-sand-100 text-charcoal-700 font-bold px-2 py-0.5 rounded-full text-[11px]">
                      {c.productCount} bài
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {c.isHidden ? (
                      <span className="text-[11px] text-sand-500 bg-sand-100 px-2 py-0.5 rounded font-medium">
                        Đang ẩn
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                        Hiển thị
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Hide/Show Toggle */}
                      <button
                        onClick={() => toggleHideCategory(c.id)}
                        className="p-1.5 hover:bg-sand-100 text-sand-600 rounded-lg"
                        title={c.isHidden ? 'Mở hiển thị' : 'Tạm ẩn danh mục'}
                      >
                        {c.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditingCategory(c)}
                        className="p-1.5 hover:bg-sand-100 text-charcoal-700 rounded-lg"
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
        <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-elevated">
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
                  className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
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
                  className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5 font-mono"
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
                  className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả ngành hàng để người dùng dễ phân loại..."
                  className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-sand-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-eco-800 text-white rounded-xl text-xs font-bold shadow-soft"
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
        <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-elevated">
            <h3 className="text-lg font-bold text-charcoal-900">Chỉnh sửa danh mục ngành hàng</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">Tên danh mục</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">Mã Slug</label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5 font-mono"
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
                  className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
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
                  className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-xs font-semibold text-sand-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-eco-800 text-white rounded-xl text-xs font-bold shadow-soft"
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
