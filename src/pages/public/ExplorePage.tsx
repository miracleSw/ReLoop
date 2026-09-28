import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
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
  Sparkles
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { products, categories } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search params extraction
  const urlQuery = searchParams.get('q') || '';
  const urlCategory = searchParams.get('category') || 'all';
  const urlType = searchParams.get('type') || 'all';
  const urlCondition = searchParams.get('condition') || 'all';
  const urlProvince = searchParams.get('province') || 'all';

  // Local filter states
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedType, setSelectedType] = useState(urlType);
  const [selectedCondition, setSelectedCondition] = useState(urlCondition);
  const [selectedProvince, setSelectedProvince] = useState(urlProvince);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    setSearchTerm(urlQuery);
    setSelectedCategory(urlCategory);
    setSelectedType(urlType);
    setSelectedCondition(urlCondition);
    setSelectedProvince(urlProvince);
  }, [urlQuery, urlCategory, urlType, urlCondition, urlProvince]);

  const provinces = ['Hồ Chí Minh', 'Hà Nội', 'Thừa Thiên Huế', 'Đà Nẵng'];

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Must be visible in public search (UC10: only APPROVED/AVAILABLE/RESERVED, exclude LOCKED, HIDDEN, REMOVED)
      if (p.status === 'LOCKED' || p.status === 'HIDDEN' || p.status === 'REMOVED') {
        return false;
      }

      // Keyword search (title + description)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }

      // Category
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      // Transaction Type
      if (selectedType !== 'all') {
        if (selectedType === 'EXCHANGE' && p.type === 'SELL') return false;
        if (selectedType === 'SELL' && p.type === 'EXCHANGE') return false;
        if (selectedType === 'BOTH' && p.type !== 'BOTH') return false;
      }

      // Condition
      if (selectedCondition !== 'all' && p.condition !== selectedCondition) {
        return false;
      }

      // Province
      if (selectedProvince !== 'all' && p.location.province !== selectedProvince) {
        return false;
      }

      // Price range
      if (priceRange !== 'all') {
        const price = p.price || 0;
        if (priceRange === 'under500k' && price > 500000) return false;
        if (priceRange === '500k-2m' && (price < 500000 || price > 2000000)) return false;
        if (priceRange === '2m-5m' && (price < 2000000 || price > 5000000)) return false;
        if (priceRange === 'over5m' && price < 5000000) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'price-asc') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'price-desc') {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === 'views') {
        return b.views - a.views;
      }
      return 0;
    });
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedType,
    selectedCondition,
    selectedProvince,
    priceRange,
    sortBy,
  ]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedCondition('all');
    setSelectedProvince('all');
    setPriceRange('all');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    selectedCondition !== 'all' ||
    selectedProvince !== 'all' ||
    priceRange !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. TOP HEADER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
            Khám phá kho đồ cũ
          </h1>
          <p className="text-xs sm:text-sm text-sand-500 mt-1">
            Tìm thấy <span className="font-bold text-eco-700">{filteredProducts.length}</span> món đồ sẵn sàng giao dịch gặp mặt
          </p>
        </div>

        {/* Global search input */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full text-sm bg-white border border-slate-200/90 rounded-full pl-10 pr-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-soft"
            />
            <Search className="w-4 h-4 text-sand-400 absolute left-3.5 top-3 pointer-events-none" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-sand-400 hover:text-charcoal-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Drawer Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-charcoal-800 shadow-soft hover:bg-slate-50"
          >
            <Filter className="w-4 h-4 text-eco-700" />
            <span>Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* 2. ACTIVE FILTER CHIPS */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3.5 bg-white rounded-2xl border border-slate-200/80 text-xs shadow-soft">
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
              <button onClick={() => setSelectedProvince('all')} className="hover:text-eco-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {priceRange !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-eco-100 text-eco-800 font-semibold border border-eco-200/60 shadow-subtle">
              Khoảng giá
              <button onClick={() => setPriceRange('all')} className="hover:text-eco-950">
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
                Khu vực địa phương
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-charcoal-800 focus:outline-none focus:ring-4 focus:ring-eco-500/15 font-medium"
              >
                <option value="all">Toàn quốc (Tất cả khu vực)</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
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

            {/* Filter: Price Range */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2.5">
                Khoảng giá (VNĐ)
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', label: 'Tất cả mức giá' },
                  { id: 'under500k', label: 'Dưới 500.000₫' },
                  { id: '500k-2m', label: '500.000₫ - 2.000.000₫' },
                  { id: '2m-5m', label: '2.000.000₫ - 5.000.000₫' },
                  { id: 'over5m', label: 'Trên 5.000.000₫' },
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setPriceRange(range.id)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl transition-all ${
                      priceRange === range.id
                        ? 'bg-eco-50 text-eco-900 font-bold border-l-2 border-eco-600'
                        : 'text-sand-700 hover:bg-slate-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID & SORT CONTROLS */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <div className="flex items-center justify-between bg-white p-3.5 px-5 rounded-2xl border border-slate-200/80 shadow-soft">
            <span className="text-xs text-sand-500 font-medium">
              Hiển thị <span className="font-bold text-charcoal-900">{filteredProducts.length}</span> kết quả
            </span>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-sand-500 hidden sm:inline font-medium">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-4 focus:ring-eco-500/15"
              >
                <option value="newest">Mới đăng nhất</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="views">Lượt xem nhiều nhất</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-sand-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">
                Không tìm thấy món đồ phù hợp
              </h3>
              <p className="text-xs sm:text-sm text-sand-500 max-w-md mx-auto">
                Hãy thử nới lỏng các tiêu chí lọc, tìm từ khóa ngắn hơn hoặc khôi phục lại bộ lọc mặc định.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-2 px-6 py-2.5 bg-gradient-to-r from-eco-600 to-teal-600 text-white rounded-full text-xs sm:text-sm font-bold hover:shadow-md transition-all"
              >
                Xóa toàn bộ bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} variant="standard" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="bg-white w-full max-w-[280px] sm:max-w-xs h-full p-5 sm:p-6 overflow-y-auto space-y-6 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-sand-100">
              <h3 className="font-bold text-sm text-charcoal-900">Bộ lọc tìm kiếm</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-sand-400 hover:text-charcoal-700"
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
                className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
              >
                <option value="all">Tất cả ngành hàng</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Location */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-2">Khu vực</label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
              >
                <option value="all">Toàn quốc</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Form actions */}
            <div className="pt-6 border-t border-sand-100 flex items-center gap-3">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-2.5 border border-sand-200 text-xs font-semibold text-charcoal-700 rounded-xl"
              >
                Đặt lại
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-eco-800 text-white text-xs font-semibold rounded-xl"
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
