import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
import { VIETNAM_LOCATIONS } from '../../data/mockData';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Layers,
  MapPin,
  Tag,
  ArrowRightLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const PAGE_SIZE = 12;

export const ExplorePage: React.FC = () => {
  const { products, categories, currentUser } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL search params extraction
  const urlQuery = searchParams.get('q') || '';
  const urlCategory = searchParams.get('category') || 'all';
  const urlType = searchParams.get('type') || 'all';
  const urlCondition = searchParams.get('condition') || 'all';
  const urlProvince = searchParams.get('province') || 'all';
  const urlDistrict = searchParams.get('district') || 'all';
  const urlMin = searchParams.get('min') || '';
  const urlMax = searchParams.get('max') || '';

  // Filter states
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedType, setSelectedType] = useState(urlType);
  const [selectedCondition, setSelectedCondition] = useState(urlCondition);
  const [selectedProvince, setSelectedProvince] = useState(urlProvince);
  const [selectedDistrict, setSelectedDistrict] = useState(urlDistrict);

  // Price filter states (Custom inputs & Presets)
  const [priceMin, setPriceMin] = useState<string>(urlMin);
  const [priceMax, setPriceMax] = useState<string>(urlMax);
  const [priceError, setPriceError] = useState<string>('');
  const [pricePreset, setPricePreset] = useState<string>(urlMin || urlMax ? 'custom' : 'all');

  // Tabs: 'latest' (Mới nhất) | 'featured' (Nổi bật)
  const [activeTab, setActiveTab] = useState<'latest' | 'featured'>('latest');
  const [sortBy, setSortBy] = useState<string>('default');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Location prioritization preference
  const [prioritizeNearMe, setPrioritizeNearMe] = useState(true);

  // Sync state if URL search params change
  useEffect(() => {
    setSearchTerm(urlQuery);
    setSelectedCategory(urlCategory);
    setSelectedType(urlType);
    setSelectedCondition(urlCondition);
    setSelectedProvince(urlProvince);
    setSelectedDistrict(urlDistrict);
    if (urlMin || urlMax) {
      setPriceMin(urlMin);
      setPriceMax(urlMax);
      setPricePreset('custom');
      validateAndSetPrice(urlMin, urlMax);
    }
  }, [urlQuery, urlCategory, urlType, urlCondition, urlProvince, urlDistrict, urlMin, urlMax]);

  // When province changes, reset district
  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedDistrict('all');
    setCurrentPage(1);
  };

  // Price validation
  const validateAndSetPrice = (minVal: string, maxVal: string) => {
    setPriceError('');
    const minNum = minVal.trim() !== '' ? Number(minVal) : null;
    const maxNum = maxVal.trim() !== '' ? Number(maxVal) : null;

    if (minNum !== null && (isNaN(minNum) || minNum < 0 || !Number.isInteger(minNum))) {
      setPriceError('Giá "Từ" phải là số nguyên không âm.');
      return false;
    }
    if (maxNum !== null && (isNaN(maxNum) || maxNum < 0 || !Number.isInteger(maxNum))) {
      setPriceError('Giá "Đến" phải là số nguyên không âm.');
      return false;
    }
    if (minNum !== null && maxNum !== null && minNum > maxNum) {
      setPriceError('Giá "Từ" phải nhỏ hơn hoặc bằng giá "Đến".');
      return false;
    }
    return true;
  };

  const handlePriceMinChange = (val: string) => {
    setPriceMin(val);
    setPricePreset('custom');
    validateAndSetPrice(val, priceMax);
    setCurrentPage(1);
  };

  const handlePriceMaxChange = (val: string) => {
    setPriceMax(val);
    setPricePreset('custom');
    validateAndSetPrice(priceMin, val);
    setCurrentPage(1);
  };

  const applyPricePreset = (presetId: string) => {
    setPricePreset(presetId);
    setPriceError('');
    setCurrentPage(1);
    if (presetId === 'all') {
      setPriceMin('');
      setPriceMax('');
    } else if (presetId === 'under500k') {
      setPriceMin('0');
      setPriceMax('500000');
    } else if (presetId === '500k-2m') {
      setPriceMin('500000');
      setPriceMax('2000000');
    } else if (presetId === '2m-5m') {
      setPriceMin('2000000');
      setPriceMax('5000000');
    } else if (presetId === 'over5m') {
      setPriceMin('5000000');
      setPriceMax('');
    }
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedCondition('all');
    setSelectedProvince('all');
    setSelectedDistrict('all');
    setPriceMin('');
    setPriceMax('');
    setPricePreset('all');
    setPriceError('');
    setActiveTab('latest');
    setSortBy('default');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Reset page when any core filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedType, selectedCondition, selectedProvince, selectedDistrict, activeTab, sortBy]);

  // Province list
  const provinces = Object.keys(VIETNAM_LOCATIONS);
  const availableDistricts = selectedProvince !== 'all' ? VIETNAM_LOCATIONS[selectedProvince] || [] : [];

  // Filter products
  const filteredProducts = useMemo(() => {
    const minPriceNum = priceMin.trim() !== '' ? Number(priceMin) : null;
    const maxPriceNum = priceMax.trim() !== '' ? Number(priceMax) : null;
    const isPriceValid = !priceError && (minPriceNum === null || minPriceNum >= 0) && (maxPriceNum === null || maxPriceNum >= 0) && (minPriceNum === null || maxPriceNum === null || minPriceNum <= maxPriceNum);

    return products.filter((p) => {
      // UC10 Requirement: AVAILABLE-only default feed (strictly excludes RESERVED, COMPLETED, LOCKED, HIDDEN, REMOVED)
      if (p.status !== 'AVAILABLE') {
        return false;
      }

      // Keyword search (case-insensitive across product title, description, and category name, with Vietnamese diacritics and token matching support)
      if (searchTerm.trim()) {
        const rawQ = searchTerm.trim().toLowerCase();
        const normQ = rawQ
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'd');
        const queryTokens = normQ.split(/\s+/).filter(Boolean);

        const catObj = categories.find((c) => c.id === p.categoryId);
        const catName = catObj ? catObj.name : '';

        const normTitle = p.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'd');
        const normDesc = p.description
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'd');
        const normCat = catName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'd');

        const exactMatch =
          p.title.toLowerCase().includes(rawQ) ||
          p.description.toLowerCase().includes(rawQ) ||
          catName.toLowerCase().includes(rawQ);

        const tokensMatch =
          queryTokens.length > 0 &&
          queryTokens.every(
            (token) => normTitle.includes(token) || normDesc.includes(token) || normCat.includes(token)
          );

        if (!exactMatch && !tokensMatch) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      // Transaction Type filter
      if (selectedType !== 'all') {
        if (selectedType === 'EXCHANGE' && p.type === 'SELL') return false;
        if (selectedType === 'SELL' && p.type === 'EXCHANGE') return false;
        if (selectedType === 'BOTH' && p.type !== 'BOTH') return false;
      }

      // Condition filter
      if (selectedCondition !== 'all' && p.condition !== selectedCondition) {
        return false;
      }

      // Province filter
      if (selectedProvince !== 'all' && p.location.province !== selectedProvince) {
        return false;
      }

      // Dependent District filter
      if (selectedDistrict !== 'all' && p.location.district !== selectedDistrict) {
        return false;
      }

      // Price filter validation and check
      if (isPriceValid) {
        const itemPrice = p.price || 0;
        if (minPriceNum !== null && itemPrice < minPriceNum) {
          return false;
        }
        if (maxPriceNum !== null && itemPrice > maxPriceNum) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Explicit sorts take full priority
      if (sortBy === 'price-asc') {
        const diff = (a.price || 0) - (b.price || 0);
        if (diff !== 0) return diff;
      } else if (sortBy === 'price-desc') {
        const diff = (b.price || 0) - (a.price || 0);
        if (diff !== 0) return diff;
      } else if (sortBy === 'views') {
        const diff = b.views - a.views;
        if (diff !== 0) return diff;
      }

      // Mock user location prioritization for default feed/tabs (items in user's province bubble up)
      if (prioritizeNearMe && currentUser?.province) {
        const aNear = a.location.province === currentUser.province ? 1 : 0;
        const bNear = b.location.province === currentUser.province ? 1 : 0;
        if (aNear !== bNear) {
          return bNear - aNear;
        }
      }

      // Tabs
      if (activeTab === 'featured') {
        return b.views - a.views;
      }
      // 'latest' tab (default)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    products,
    categories,
    searchTerm,
    selectedCategory,
    selectedType,
    selectedCondition,
    selectedProvince,
    selectedDistrict,
    priceMin,
    priceMax,
    priceError,
    activeTab,
    sortBy,
    prioritizeNearMe,
    currentUser,
  ]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  // Recommended products for empty state: 6 newest AVAILABLE products
  const recommendedNewest = useMemo(() => {
    return products
      .filter((p) => p.status === 'AVAILABLE')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [products]);

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    selectedCondition !== 'all' ||
    selectedProvince !== 'all' ||
    selectedDistrict !== 'all' ||
    priceMin !== '' ||
    priceMax !== '' ||
    pricePreset !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. TOP HEADER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Khám phá kho đồ cũ
          </h1>
          <p className="text-xs sm:text-sm text-sand-500 mt-1">
            Tìm thấy <span className="font-bold text-eco-700">{filteredProducts.length}</span> món đồ sẵn sàng giao dịch
          </p>
        </div>

        {/* Global search input */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tiêu đề, mô tả hoặc danh mục..."
              className="w-full text-xs sm:text-sm bg-white border border-slate-200/90 rounded-full pl-10 pr-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-soft"
            />
            <Search className="w-4 h-4 text-sand-400 absolute left-3.5 top-3 pointer-events-none" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-sand-400 hover:text-charcoal-700"
                aria-label="Xóa từ khóa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Drawer Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-charcoal-800 shadow-soft hover:bg-slate-50 flex-shrink-0"
          >
            <Filter className="w-4 h-4 text-eco-700" />
            <span>Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* 2. ACTIVE FILTER CHIPS */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 p-3.5 bg-white rounded-2xl border border-slate-200/80 text-xs shadow-soft">
          <span className="font-bold text-sand-500 mr-1">Đang lọc theo:</span>

          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-eco-100 text-eco-800 font-semibold border border-eco-200/60 shadow-subtle">
              Từ khóa: "{searchTerm}"
              <button onClick={() => setSearchTerm('')} className="hover:text-eco-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-eco-100 text-eco-800 font-semibold border border-eco-200/60 shadow-subtle">
              {categories.find((c) => c.id === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-eco-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedType !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-eco-100 text-eco-800 font-semibold border border-eco-200/60 shadow-subtle">
              {selectedType === 'EXCHANGE' ? 'Góc Đổi đồ' : selectedType === 'SELL' ? 'Cần bán' : 'Cả hai'}
              <button onClick={() => setSelectedType('all')} className="hover:text-eco-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCondition !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-eco-100 text-eco-800 font-semibold border border-eco-200/60 shadow-subtle">
              Tình trạng: {selectedCondition}
              <button onClick={() => setSelectedCondition('all')} className="hover:text-eco-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedProvince !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-eco-100 text-eco-800 font-semibold border border-eco-200/60 shadow-subtle">
              Khu vực: {selectedProvince}
              <button onClick={() => handleProvinceChange('all')} className="hover:text-eco-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedDistrict !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-eco-100 text-eco-800 font-semibold border border-eco-200/60 shadow-subtle">
              Quận/Huyện: {selectedDistrict}
              <button onClick={() => setSelectedDistrict('all')} className="hover:text-eco-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(priceMin !== '' || priceMax !== '') && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-eco-100 text-eco-800 font-semibold border border-eco-200/60 shadow-subtle">
              Khoảng giá: {priceMin ? `${Number(priceMin).toLocaleString('vi-VN')}₫` : '0₫'} - {priceMax ? `${Number(priceMax).toLocaleString('vi-VN')}₫` : 'Trở lên'}
              <button onClick={() => applyPricePreset('all')} className="hover:text-eco-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleClearFilters}
            className="ml-auto text-xs text-rose-600 hover:underline font-bold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}

      {/* 3. MAIN CONTENT: SIDEBAR FILTERS + PRODUCT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-charcoal-900">
                <SlidersHorizontal className="w-4 h-4 text-eco-700" />
                <span>Bộ lọc chi tiết</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-sand-500 hover:text-rose-600 font-medium transition-colors"
                >
                  Đặt lại
                </button>
              )}
            </div>

            {/* Filter: Category */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2.5">
                Danh mục ngành hàng
              </label>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3.5 py-2 rounded-xl transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-eco-50 text-eco-900 font-bold border-l-2 border-eco-600'
                      : 'text-sand-700 hover:bg-slate-50'
                  }`}
                >
                  Tất cả ngành hàng
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl transition-all flex items-center justify-between ${
                      selectedCategory === c.id
                        ? 'bg-eco-50 text-eco-900 font-bold border-l-2 border-eco-600'
                        : 'text-sand-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-sand-400 font-semibold">{c.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Transaction Type */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2.5">
                Hình thức giao dịch
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'EXCHANGE', label: 'Đổi đồ' },
                  { id: 'SELL', label: 'Bán' },
                  { id: 'BOTH', label: 'Cả hai' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedType(item.id)}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      selectedType === item.id
                        ? 'bg-gradient-to-r from-eco-700 to-eco-600 text-white border-eco-600 shadow-soft'
                        : 'bg-white text-charcoal-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Location Province */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2.5">
                Tỉnh / Thành phố
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-charcoal-800 focus:outline-none focus:ring-4 focus:ring-eco-500/15 font-medium"
              >
                <option value="all">Toàn quốc (Tất cả tỉnh/thành)</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter: Dependent District */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2.5">
                Quận / Huyện {selectedProvince === 'all' && <span className="text-sand-400 font-normal">(Chọn tỉnh trước)</span>}
              </label>
              <select
                value={selectedDistrict}
                disabled={selectedProvince === 'all'}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-charcoal-800 focus:outline-none focus:ring-4 focus:ring-eco-500/15 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="all">Tất cả quận/huyện</option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter: Condition */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2.5">
                Tình trạng sản phẩm
              </label>
              <div className="space-y-1.5 text-xs">
                {['all', 'Mới 99%', 'Còn tốt', 'Đã sử dụng nhiều', 'Cần sửa chữa'].map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl transition-all ${
                      selectedCondition === cond
                        ? 'bg-eco-50 text-eco-900 font-bold border-l-2 border-eco-600'
                        : 'text-sand-700 hover:bg-slate-50'
                    }`}
                  >
                    {cond === 'all' ? 'Mọi tình trạng' : cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Custom From / To Price Inputs */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                Khoảng giá (VNĐ)
              </label>

              {/* Custom From / To inputs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-sand-500 mb-1">Từ (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    step={50000}
                    value={priceMin}
                    onChange={(e) => handlePriceMinChange(e.target.value)}
                    placeholder="0"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-eco-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-sand-500 mb-1">Đến (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    step={50000}
                    value={priceMax}
                    onChange={(e) => handlePriceMaxChange(e.target.value)}
                    placeholder="Vô cực"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-eco-500/20"
                  />
                </div>
              </div>

              {priceError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-700 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{priceError}</span>
                </div>
              )}

              {/* Quick Presets */}
              <div className="space-y-1 text-xs pt-1">
                <span className="block text-[10px] font-bold text-sand-400 uppercase tracking-wider mb-1">
                  Mức giá gợi ý nhanh
                </span>
                {[
                  { id: 'all', label: 'Tất cả mức giá' },
                  { id: 'under500k', label: 'Dưới 500.000₫' },
                  { id: '500k-2m', label: '500.000₫ - 2.000.000₫' },
                  { id: '2m-5m', label: '2.000.000₫ - 5.000.000₫' },
                  { id: 'over5m', label: 'Trên 5.000.000₫' },
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => applyPricePreset(range.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition-all ${
                      pricePreset === range.id
                        ? 'bg-eco-100 text-eco-900 font-bold'
                        : 'text-sand-600 hover:bg-slate-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID & CONTROLS */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB BAR & SORTING HEADER */}
          <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Latest and Featured Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
              <button
                onClick={() => {
                  setActiveTab('latest');
                  setSortBy('default');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'latest' && sortBy === 'default'
                    ? 'bg-white text-eco-900 shadow-subtle'
                    : 'text-sand-600 hover:text-charcoal-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-eco-600" />
                <span>Mới nhất</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('featured');
                  setSortBy('default');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'featured' && sortBy === 'default'
                    ? 'bg-white text-eco-900 shadow-subtle'
                    : 'text-sand-600 hover:text-charcoal-900'
                }`}
              >
                <span>Nổi bật</span>
              </button>
            </div>

            {/* Secondary Sort & Count */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs w-full sm:w-auto">
              <span className="text-sand-500 font-medium">
                <span className="font-bold text-charcoal-900">{filteredProducts.length}</span> sản phẩm
              </span>

              <div className="flex items-center gap-1.5">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-4 focus:ring-eco-500/15"
                >
                  <option value="default">Sắp xếp mặc định</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                  <option value="views">Lượt xem nhiều nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="space-y-8">
              {/* MSG 10_1 Empty state */}
              <div className="p-10 sm:p-14 text-center bg-white rounded-3xl border border-slate-200/90 shadow-soft space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-sand-400 flex items-center justify-center mx-auto shadow-subtle">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-charcoal-900">
                  Không tìm thấy sản phẩm phù hợp. Hãy thử thay đổi từ khóa hoặc bộ lọc!
                </h3>
                <p className="text-xs sm:text-sm text-sand-500 max-w-md mx-auto">
                  Hãy thử nới lỏng các tiêu chí lọc giá, xóa tìm kiếm từ khóa hoặc khôi phục lại bộ lọc mặc định.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2.5 bg-gradient-to-r from-eco-600 via-eco-700 to-teal-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-md transition-all"
                  >
                    Xóa toàn bộ bộ lọc
                  </button>
                </div>
              </div>

              {/* 6 Newest recommendations */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-eco-600" />
                    <h3 className="text-base sm:text-lg font-black text-charcoal-900">
                      Gợi ý cho bạn: 6 sản phẩm mới nhất trên ReLoop
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {recommendedNewest.map((prod) => (
                    <ProductCard key={prod.id} product={prod} variant="standard" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Product Grid (max 12 per page) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} variant="standard" />
                ))}
              </div>

              {/* 4. PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 text-xs">
                  <span className="text-sand-500">
                    Hiển thị trang <span className="font-bold text-charcoal-900">{currentPage}</span> / <span className="font-bold text-charcoal-900">{totalPages}</span> ({filteredProducts.length} sản phẩm)
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-charcoal-800 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-subtle"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Trước</span>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-xl font-bold transition-all text-xs ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-eco-700 to-teal-600 text-white shadow-glow-emerald'
                            : 'bg-white border border-slate-200 text-charcoal-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-charcoal-800 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-subtle"
                    >
                      <span>Sau</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 5. MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm lg:hidden flex justify-end animate-fade-in">
          <div className="bg-white w-full max-w-[320px] sm:max-w-xs h-full p-5 sm:p-6 overflow-y-auto space-y-6 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-sand-100">
              <h3 className="font-bold text-sm text-charcoal-900">Bộ lọc tìm kiếm</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-sand-400 hover:text-charcoal-700 p-1"
                aria-label="Đóng bộ lọc"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-2">Danh mục</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              >
                <option value="all">Tất cả ngành hàng</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Province */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-2">Tỉnh / Thành phố</label>
              <select
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              >
                <option value="all">Toàn quốc</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Dependent District */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-2">Quận / Huyện</label>
              <select
                value={selectedDistrict}
                disabled={selectedProvince === 'all'}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 disabled:opacity-50"
              >
                <option value="all">Tất cả quận/huyện</option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Transaction Type */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-2">Hình thức</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              >
                <option value="all">Tất cả hình thức</option>
                <option value="EXCHANGE">Đổi đồ</option>
                <option value="SELL">Bán</option>
                <option value="BOTH">Cả hai</option>
              </select>
            </div>

            {/* Mobile Condition */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-2">Tình trạng</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              >
                <option value="all">Mọi tình trạng</option>
                {['Mới 99%', 'Còn tốt', 'Đã sử dụng nhiều', 'Cần sửa chữa'].map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Price Inputs */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-2">Khoảng giá (VNĐ)</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="number"
                  min={0}
                  step={50000}
                  value={priceMin}
                  onChange={(e) => handlePriceMinChange(e.target.value)}
                  placeholder="Từ..."
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="number"
                  min={0}
                  step={50000}
                  value={priceMax}
                  onChange={(e) => handlePriceMaxChange(e.target.value)}
                  placeholder="Đến..."
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              {priceError && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{priceError}</p>
              )}
            </div>

            {/* Mobile Form actions */}
            <div className="pt-6 border-t border-sand-100 flex items-center gap-3">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-2.5 border border-slate-200 text-xs font-semibold text-charcoal-700 rounded-xl hover:bg-slate-50"
              >
                Đặt lại
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-gradient-to-r from-eco-700 to-teal-600 text-white text-xs font-bold rounded-xl shadow-glow-emerald"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
