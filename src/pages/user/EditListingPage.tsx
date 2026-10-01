import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProductCondition, TransactionType } from '../../types';
import { UploadCloud, X, AlertTriangle, CheckCircle2, MapPin, Info, ArrowLeft, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const EditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, products, updateProduct, categories } = useApp();

  const product = products.find((p) => p.id === id);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<TransactionType>('BOTH');
  const [condition, setCondition] = useState<ProductCondition>('Còn tốt');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [wantedExchangeItems, setWantedExchangeItems] = useState('');
  const [description, setDescription] = useState('');
  const [province, setProvince] = useState('Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [ward, setWard] = useState('Phường Bến Nghé');
  const [images, setImages] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setCategoryId(product.categoryId);
      setType(product.type);
      setCondition(product.condition);
      setPrice(product.price || 0);
      setOriginalPrice(product.originalPrice || 0);
      setWantedExchangeItems(product.wantedExchangeItems || '');
      setDescription(product.description);
      setImages(product.images || []);
      if (product.location) {
        setProvince(product.location.province || 'Hồ Chí Minh');
        setDistrict(product.location.district || 'Quận 1');
        setWard(product.location.ward || 'Phường Bến Nghé');
      }
    }
  }, [product]);

  if (!currentUser || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Không tìm thấy bài đăng</h2>
        <Link
          to="/user/products"
          className="mt-4 inline-flex items-center gap-1.5 text-eco-700 text-xs font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Về kho đồ cá nhân
        </Link>
      </div>
    );
  }

  // UC06: Only owner can edit
  if (product.sellerId !== currentUser.id) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-rose-700">Không có quyền chỉnh sửa</h2>
        <p className="text-xs text-slate-600 mt-1">
          Bạn chỉ có thể chỉnh sửa bài đăng do chính mình tạo ra.
        </p>
        <Link
          to="/user/products"
          className="mt-4 inline-flex items-center gap-1.5 text-eco-700 text-xs font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Về kho đồ cá nhân
        </Link>
      </div>
    );
  }

  const isLockedOrCompleted = product.status === 'RESERVED' || product.status === 'COMPLETED';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      setErrorMsg('Tối đa 5 hình ảnh cho mỗi bài đăng.');
      return;
    }
    const filesToLoad = files.slice(0, remainingSlots);
    filesToLoad.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setImages((prev) => (prev.length < 5 ? [...prev, result] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
    setErrorMsg('');
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      setErrorMsg('Bài đăng phải có ít nhất 1 hình ảnh đại diện.');
      return;
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 10) {
      setErrorMsg('Tiêu đề phải có ít nhất 10 ký tự.');
      return;
    }
    if (description.trim().length < 20) {
      setErrorMsg('Mô tả phải có ít nhất 20 ký tự.');
      return;
    }
    if (images.length === 0) {
      setErrorMsg('Vui lòng giữ lại ít nhất 1 ảnh của sản phẩm.');
      return;
    }

    updateProduct(product.id, {
      title,
      categoryId,
      type: isLockedOrCompleted ? product.type : type,
      condition,
      price: !isLockedOrCompleted && type !== 'EXCHANGE' ? price : product.price,
      originalPrice: !isLockedOrCompleted && type !== 'EXCHANGE' ? originalPrice : product.originalPrice,
      wantedExchangeItems: !isLockedOrCompleted && type !== 'SELL' ? wantedExchangeItems : product.wantedExchangeItems,
      description,
      images,
      location: {
        province,
        district,
        ward,
      },
    });

    navigate('/user/products');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Mã: #{product.id}
            </span>
            <StatusBadge status={product.status} size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Chỉnh sửa bài đăng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cập nhật lại thông tin, mô tả thực tế, hình ảnh hoặc khu vực gặp mặt trực tiếp.
          </p>
        </div>
        <Link
          to="/user/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-eco-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về kho đồ</span>
        </Link>
      </div>

      {isLockedOrCompleted && (
        <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-sm">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Lưu ý:</strong> Bài đăng đang có người hẹn giao dịch hoặc đã hoàn tất.
            Để đảm bảo tính minh bạch, bạn không thể thay đổi giá hoặc hình thức trao đổi trong lúc này.
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 text-rose-700 text-xs rounded-2xl flex items-center gap-2.5 border border-rose-200 shadow-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-[0_10px_35px_-8px_rgba(16,185,129,0.08)]">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
            Tiêu đề bài đăng <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white transition-all text-slate-800"
            placeholder="Nhập tiêu đề rõ ràng, chi tiết..."
          />
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
              Danh mục
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white transition-all font-medium text-slate-800"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
              Tình trạng
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ProductCondition)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white transition-all font-medium text-slate-800"
            >
              <option value="Mới 99%">Mới 99%</option>
              <option value="Còn tốt">Còn tốt</option>
              <option value="Đã sử dụng nhiều">Đã sử dụng nhiều</option>
              <option value="Cần sửa chữa">Cần sửa chữa</option>
            </select>
          </div>
        </div>

        {/* Images Manager */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Hình ảnh thực tế ({images.length}/5) <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-500">Kéo ảnh đầu tiên làm ảnh bìa</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200/90 group shadow-sm bg-slate-50"
              >
                <img src={img} alt="Uploaded" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs"
                  title="Xóa ảnh"
                >
                  <X className="w-5 h-5 text-rose-300 hover:text-white" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 bg-gradient-to-r from-eco-700 to-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Ảnh bìa
                  </span>
                )}
              </div>
            ))}

            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-2xl border-2 border-dashed border-eco-400 bg-eco-50/50 hover:bg-eco-100/60 flex flex-col items-center justify-center text-eco-700 transition-colors text-[11px] font-bold gap-1 group shadow-sm"
              >
                <UploadCloud className="w-6 h-6 text-eco-600 group-hover:scale-110 transition-transform" />
                <span>+ Thêm ảnh</span>
              </button>
            )}
          </div>
        </div>

        {/* Price & Exchange fields */}
        {!isLockedOrCompleted && type !== 'EXCHANGE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                Giá bán (VNĐ)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                className="w-full text-base font-black text-clay-600 bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-4 focus:ring-clay-500/15 focus:border-clay-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                Giá gốc (VNĐ)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(parseInt(e.target.value) || 0)}
                className="w-full text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white transition-all"
              />
            </div>
          </div>
        )}

        {!isLockedOrCompleted && type !== 'SELL' && (
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
              Đồ muốn đổi (Gợi ý trao đổi)
            </label>
            <input
              type="text"
              value={wantedExchangeItems}
              onChange={(e) => setWantedExchangeItems(e.target.value)}
              className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white transition-all text-slate-800"
              placeholder="VD: Sách lập trình, máy tính bảng mini, cây cảnh..."
            />
          </div>
        )}

        {/* Location selector */}
        <div className="p-5 bg-gradient-to-br from-slate-50 via-slate-50/50 to-emerald-50/30 rounded-2xl border border-slate-200 space-y-3.5">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
            <span className="p-1 rounded-lg bg-eco-100 text-eco-700">
              <MapPin className="w-4 h-4" />
            </span>
            <span>Khu vực giao dịch gặp mặt</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tỉnh / Thành phố</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-eco-500/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Quận / Huyện</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-eco-500/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phường / Xã</label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-eco-500/20"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
            Mô tả chi tiết <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white transition-all text-slate-800 leading-relaxed"
            placeholder="Mô tả nguồn gốc, tình trạng thực tế, bảo hành hoặc phụ kiện đi kèm..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/user/products')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white text-xs font-bold shadow-glow-emerald hover:shadow-lg transition-all"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};
