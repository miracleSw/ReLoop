import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProductCondition, TransactionType } from '../../types';
import {
  UploadCloud,
  X,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck,
  Tag
} from 'lucide-react';

export const CreateListingPage: React.FC = () => {
  const { currentUser, categories, addProduct } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-tech');
  const [type, setType] = useState<TransactionType>('BOTH');
  const [condition, setCondition] = useState<ProductCondition>('Còn tốt');
  const [price, setPrice] = useState<number>(500000);
  const [originalPrice, setOriginalPrice] = useState<number>(850000);
  const [wantedExchangeItems, setWantedExchangeItems] = useState('');
  const [description, setDescription] = useState('');
  const [province, setProvince] = useState(currentUser?.province || 'Hồ Chí Minh');
  const [district, setDistrict] = useState(currentUser?.district || 'Quận 1');
  const [ward, setWard] = useState(currentUser?.ward || 'Phường Bến Nghé');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
  ]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-charcoal-900">Vui lòng đăng nhập để đăng tin</h2>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-6 py-2.5 bg-eco-800 text-white rounded-xl text-xs font-semibold"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const sampleImageLibrary = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507764983913-44473b11d132?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const remainingSlots = 10 - images.length;
    if (remainingSlots <= 0) {
      setErrorMsg('Tối đa 10 hình ảnh cho mỗi bài đăng (BR-16).');
      return;
    }
    const filesToLoad = files.slice(0, remainingSlots);
    filesToLoad.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setImages((prev) => (prev.length < 10 ? [...prev, result] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
    setErrorMsg('');
    e.target.value = '';
  };

  const handleAddSampleImage = (url: string) => {
    if (images.length >= 10) {
      setErrorMsg('Tối đa 10 hình ảnh cho mỗi bài đăng (BR-16).');
      return;
    }
    setImages([...images, url]);
    setErrorMsg('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (title.trim().length < 10) {
      setErrorMsg('Tiêu đề bài đăng phải có ít nhất 10 ký tự rõ ràng.');
      return;
    }
    if (description.trim().length < 20) {
      setErrorMsg('Mô tả tình trạng thực tế phải có ít nhất 20 ký tự để người mua nắm rõ.');
      return;
    }
    if (images.length === 0) {
      setErrorMsg('Vui lòng tải lên ít nhất 1 hình ảnh thực tế của sản phẩm (BR-16).');
      return;
    }

    // BR-15: Ràng buộc hình thức giao dịch
    if (type !== 'EXCHANGE' && (!price || price <= 0)) {
      setErrorMsg('Hình thức Mua bán bắt buộc nhập Giá bán lớn hơn 0 (BR-15 / MSG 6).');
      return;
    }
    if (type !== 'SELL' && !wantedExchangeItems.trim()) {
      setErrorMsg('Hình thức Trao đổi bắt buộc ghi rõ nhu cầu muốn đổi lấy sản phẩm gì (BR-15).');
      return;
    }

    // Check prohibited keyword simulation
    const prohibitedKeywords = ['vũ khí', 'súng', 'ma túy', 'rượu cồn nồng độ cao', 'động vật hoang dã'];
    const foundKeyword = prohibitedKeywords.find(
      (kw) =>
        title.toLowerCase().includes(kw) || description.toLowerCase().includes(kw)
    );

    const newProd = addProduct({
      title,
      description,
      categoryId,
      condition,
      type,
      price: type !== 'EXCHANGE' ? price : undefined,
      originalPrice: type !== 'EXCHANGE' ? originalPrice : undefined,
      wantedExchangeItems: type !== 'SELL' ? wantedExchangeItems : undefined,
      images,
      location: {
        province,
        district,
        ward,
      },
      sellerId: currentUser.id,
      status: foundKeyword ? 'LOCKED' : 'AVAILABLE',
      flagProhibited: !!foundKeyword,
      prohibitedKeywordFound: foundKeyword,
    });

    navigate(`/products/${newProd.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
          Đăng tin mới
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Hãy mô tả chân thực tình trạng để kết nối với những người trân trọng đồ cũ như bạn.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. FORM GRID */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Basic info */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-card space-y-5">
            <h3 className="font-bold text-base text-charcoal-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-eco-100 text-eco-800 text-xs font-extrabold flex items-center justify-center">1</span>
              <span>Thông tin cơ bản</span>
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                Tiêu đề bài đăng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Bàn phím cơ Keychron K2 V2 nhôm Hot-swap bản RGB"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 transition-all"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Nêu rõ tên hãng, dòng đời, màu sắc để người mua dễ tìm thấy.
              </span>
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Danh mục ngành hàng <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Tình trạng sản phẩm <span className="text-rose-500">*</span>
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ProductCondition)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                >
                  <option value="Mới 99%">Mới 99% (Như mới, đầy đủ phụ kiện)</option>
                  <option value="Còn tốt">Còn tốt (Có xước nhẹ, hoạt động hoàn hảo)</option>
                  <option value="Đã sử dụng nhiều">Đã sử dụng nhiều (Hao mòn theo thời gian)</option>
                  <option value="Cần sửa chữa">Cần sửa chữa (Dành cho thợ hoặc linh kiện)</option>
                </select>
              </div>
            </div>

            {/* Transaction Type Selection */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-2">
                Hình thức giao dịch <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'BOTH', label: 'Cả hai hình thức', sub: 'Ưu tiên linh hoạt' },
                  { id: 'EXCHANGE', label: 'Chỉ Đổi đồ', sub: 'Không nhận tiền mặt' },
                  { id: 'SELL', label: 'Chỉ Cần Bán', sub: 'Nhận tiền mặt' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as TransactionType)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      type === item.id
                        ? 'bg-gradient-to-r from-eco-700 to-eco-600 text-white border-transparent shadow-glow-emerald'
                        : 'bg-slate-50 border-slate-200 text-charcoal-800 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className={`text-[10px] mt-0.5 ${type === item.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {item.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price fields if SELL or BOTH */}
            {type !== 'EXCHANGE' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                    Giá bán mong muốn (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={10000}
                    step={50000}
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full text-sm font-black text-clay-600 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                    Giá gốc khi mua mới (tùy chọn)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50000}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(parseInt(e.target.value) || 0)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                  />
                </div>
              </div>
            )}

            {/* Wanted exchange items if EXCHANGE or BOTH */}
            {type !== 'SELL' && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Món đồ mong muốn đổi lại <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={wantedExchangeItems}
                  onChange={(e) => setWantedExchangeItems(e.target.value)}
                  placeholder="Ví dụ: Đổi bàn phím cơ Keychron Q1, loa Marshall hoặc tai nghe Sony..."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
              </div>
            )}
          </div>

          {/* Section: Image upload & Description */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-card space-y-5">
            <h3 className="font-bold text-base text-charcoal-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-eco-100 text-eco-800 text-xs font-extrabold flex items-center justify-center">2</span>
              <span>Hình ảnh & Mô tả thực tế</span>
            </h3>

            {/* Images */}
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
                  Ảnh chụp thực tế sản phẩm (Tối đa 5 ảnh) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  {images.length}/5 ảnh
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 group shadow-subtle">
                    <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Xóa ảnh này"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-gradient-to-r from-eco-700 to-teal-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-subtle">
                        Ảnh bìa
                      </span>
                    )}
                  </div>
                ))}

                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-2xl border-2 border-dashed border-eco-400 bg-eco-50/50 hover:bg-eco-100/60 flex flex-col items-center justify-center text-eco-800 transition-colors text-[10px] font-bold shadow-subtle"
                  >
                    <UploadCloud className="w-5 h-5 mb-0.5 text-eco-700" />
                    <span>Chọn ảnh từ máy</span>
                  </button>
                )}
              </div>

              {images.length < 5 && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <span className="text-[11px] text-slate-600 font-semibold block">
                    Hoặc chọn nhanh từ thư viện ảnh mẫu sẵn có:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sampleImageLibrary.slice(0, 5 - images.length).map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddSampleImage(url)}
                        className="w-12 h-12 rounded-xl border border-slate-200 hover:border-eco-600 overflow-hidden group transition-all"
                        title="Thêm ảnh mẫu này"
                      >
                        <img src={url} alt="Sample" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                Mô tả chi tiết sản phẩm <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả nguồn gốc, thời gian sử dụng, phụ kiện đi kèm, lý do sang nhượng hoặc đổi đồ..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
              />
            </div>
          </div>

          {/* Section: Location */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-card space-y-4">
            <h3 className="font-bold text-base text-charcoal-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-eco-100 text-eco-800 text-xs font-extrabold flex items-center justify-center">3</span>
              <span>Khu vực giao dịch gặp mặt</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">Tỉnh / Thành phố</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                >
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">Quận / Huyện</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">Phường / Xã</label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              Gợi ý: Chỉ nên chọn khu vực công cộng để đảm bảo an toàn giao dịch.
            </p>
          </div>
        </div>

        {/* RIGHT: STICKY PUBLISH SUMMARY & PREVIEW */}
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-card sticky top-28 space-y-5">
            <h3 className="font-bold text-sm text-charcoal-900 border-b border-slate-100 pb-3">
              Xem trước tóm tắt
            </h3>

            {/* Thumbnail Preview */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200 shadow-subtle">
              {images[0] ? (
                <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  Chưa có ảnh bìa
                </div>
              )}
              <span className="absolute top-2 left-2 text-[10px] font-bold bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-subtle">
                {condition}
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-500 font-medium">
                {district}, {province}
              </div>
              <h4 className="font-bold text-sm text-charcoal-900 mt-1 line-clamp-2">
                {title || 'Tiêu đề sản phẩm hiển thị ở đây...'}
              </h4>
              <div className="mt-2 text-base font-black text-clay-600">
                {type !== 'EXCHANGE' ? `${price.toLocaleString('vi-VN')}₫` : 'Trao đổi đồ'}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 text-eco-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-eco-600" />
                <span>Trạng thái ban đầu: Còn hàng</span>
              </div>
              <div className="flex items-center gap-1.5 text-eco-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-eco-600" />
                <span>Cho phép nhận đồng thời nhiều đề nghị</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 active:scale-95 text-white font-bold text-sm shadow-glow-emerald hover:shadow-lg transition-all"
            >
              Đăng tin ngay
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
