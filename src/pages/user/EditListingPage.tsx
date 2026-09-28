import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProductCondition, TransactionType } from '../../types';
import { UploadCloud, X, AlertTriangle, CheckCircle2, MapPin, Info } from 'lucide-react';
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
        <h2 className="text-xl font-bold text-charcoal-900">Không tìm thấy bài đăng</h2>
        <Link to="/user/products" className="mt-4 inline-block text-eco-800 text-xs font-semibold hover:underline">
          Về kho đồ cá nhân
        </Link>
      </div>
    );
  }

  // UC06: Only owner can edit
  if (product.sellerId !== currentUser.id) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-rose-700">Không có quyền chỉnh sửa</h2>
        <p className="text-xs text-sand-600 mt-1">
          Bạn chỉ có thể chỉnh sửa bài đăng do chính mình tạo ra (BR UC06).
        </p>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-sand-500">Mã bài đăng: #{product.id}</span>
            <StatusBadge status={product.status} size="sm" />
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal-900">Chỉnh sửa bài đăng sản phẩm</h1>
          <p className="text-xs text-sand-600 mt-0.5">
            Cập nhật lại thông tin, mô tả thực tế, hình ảnh hoặc khu vực gặp mặt trực tiếp.
          </p>
        </div>
        <Link to="/user/products" className="text-xs font-semibold text-sand-600 hover:text-charcoal-900">
          ← Về kho đồ
        </Link>
      </div>

      {isLockedOrCompleted && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Lưu ý nghiệp vụ (HUSC-33):</strong> Bài đăng đang ở trạng thái{' '}
            <span className="font-bold underline">{product.status}</span> (đã chấp thuận đề nghị hoặc đã hoàn tất).
            Để bảo vệ sự minh bạch giao dịch, bạn không thể thay đổi giá bán hoặc hình thức trao đổi trong khi lịch hẹn đang diễn ra.
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 border border-rose-200">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 space-y-6 shadow-soft">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-charcoal-800 mb-1.5">Tiêu đề bài đăng <span className="text-rose-500">*</span></label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm bg-sand-50 border border-sand-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-eco-500/20"
          />
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1.5">Danh mục</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full text-xs sm:text-sm bg-sand-50 border border-sand-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-eco-500/20"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1.5">Tình trạng</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ProductCondition)}
              className="w-full text-xs sm:text-sm bg-sand-50 border border-sand-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-eco-500/20"
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
            <label className="text-xs font-bold text-charcoal-800">
              Hình ảnh thực tế ({images.length}/5) <span className="text-rose-500">*</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-sand-200 group shadow-subtle">
                <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Xóa ảnh"
                >
                  <X className="w-5 h-5" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-eco-800 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                    Ảnh bìa
                  </span>
                )}
              </div>
            ))}

            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-eco-400 bg-eco-50/50 hover:bg-eco-100/60 flex flex-col items-center justify-center text-eco-800 transition-colors text-[10px] font-bold"
              >
                <UploadCloud className="w-5 h-5 mb-0.5 text-eco-700" />
                <span>+ Thêm ảnh</span>
              </button>
            )}
          </div>
        </div>

        {/* Price & Exchange fields */}
        {!isLockedOrCompleted && type !== 'EXCHANGE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-1.5">Giá bán (VNĐ)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                className="w-full text-sm font-bold text-clay-700 bg-sand-50 border border-sand-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-eco-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-1.5">Giá gốc (VNĐ)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(parseInt(e.target.value) || 0)}
                className="w-full text-sm bg-sand-50 border border-sand-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-eco-500/20"
              />
            </div>
          </div>
        )}

        {!isLockedOrCompleted && type !== 'SELL' && (
          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1.5">Đồ muốn đổi</label>
            <input
              type="text"
              value={wantedExchangeItems}
              onChange={(e) => setWantedExchangeItems(e.target.value)}
              className="w-full text-sm bg-sand-50 border border-sand-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-eco-500/20"
            />
          </div>
        )}

        {/* Location selector */}
        <div className="p-4 bg-sand-50 rounded-2xl border border-sand-200/80 space-y-3">
          <label className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-eco-700" />
            <span>Khu vực giao dịch gặp mặt</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-sand-600 mb-1">Tỉnh / Thành phố</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full text-xs bg-white border border-sand-200 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block text-[11px] text-sand-600 mb-1">Quận / Huyện</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs bg-white border border-sand-200 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block text-[11px] text-sand-600 mb-1">Phường / Xã</label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full text-xs bg-white border border-sand-200 rounded-xl p-2.5"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-charcoal-800 mb-1.5">Mô tả chi tiết <span className="text-rose-500">*</span></label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm bg-sand-50 border border-sand-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-eco-500/20"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-sand-100">
          <button
            type="button"
            onClick={() => navigate('/user/products')}
            className="px-5 py-2.5 rounded-xl border border-sand-200 text-xs font-semibold text-charcoal-700 hover:bg-sand-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-eco-800 text-white text-xs font-bold shadow-soft hover:bg-eco-700 transition-all"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};
