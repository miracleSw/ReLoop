import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
import { SpotlightBanner } from '../../components/common/SpotlightBanner';
import {
  Search,
  ArrowRight,
  ArrowRightLeft,
  ShieldCheck,
  MapPin,
  Sparkles,
  Recycle,
  Users,
  CheckCircle2,
  TrendingUp,
  Leaf,
  Layers,
  ChevronRight,
  Shield
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, categories, users } = useApp();
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/explore?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  // Available products for customer discovery
  const publicProducts = products.filter(
    (p) => p.status === 'AVAILABLE' || p.status === 'RESERVED'
  );

  const featuredProduct = publicProducts.find((p) => p.id === 'prod-1') || publicProducts[0];

  const filteredTrending = publicProducts.filter((p) => {
    if (selectedCategoryTab === 'all') return true;
    return p.categoryId === selectedCategoryTab;
  });

  const exchangeOnlyProducts = publicProducts.filter(
    (p) => p.type === 'EXCHANGE' || p.type === 'BOTH'
  );

  return (
    <div className="relative space-y-20 pb-20 overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 inset-x-0 h-[650px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none" />

      {/* 1. SHOWCASE SPOTLIGHT HERO BANNER & QUICK DISCOVERY */}
      <section className="pt-6 sm:pt-10 space-y-6 sm:space-y-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SpotlightBanner />
        </div>

        {/* QUICK SEARCH & POPULAR DISCOVERY BAR */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-full shadow-[0_15px_35px_-5px_rgba(15,23,42,0.08)] border border-slate-200/90 focus-within:border-eco-500 focus-within:ring-4 focus-within:ring-eco-500/15 transition-all">
            <form
              onSubmit={handleHeroSearch}
              className="flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-3 flex-1 pl-4 w-full">
                <Search className="w-5 h-5 text-sand-400 flex-shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Tìm máy ảnh film, bàn phím cơ, xe đạp, nội thất mây..."
                  className="w-full text-sm sm:text-base text-charcoal-900 bg-transparent placeholder:text-sand-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-eco-600 via-emerald-600 to-teal-600 hover:from-eco-500 hover:to-teal-500 active:scale-95 text-white font-bold text-sm rounded-xl sm:rounded-full transition-all flex items-center justify-center gap-2 shadow-md shadow-eco-600/25 hover:shadow-lg hover:shadow-eco-500/35 flex-shrink-0"
              >
                <span>Tìm kiếm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Fast tag chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-sand-600">
            <span className="font-semibold text-sand-500">Tìm kiếm phổ biến:</span>
            {['Olympus', 'Bàn phím cơ', 'Ghế mây', 'Xe đạp Touring', 'Linen Blazer', 'Sách tối giản'].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/explore?q=${encodeURIComponent(tag)}`)}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-eco-50/80 hover:text-eco-800 text-charcoal-700 border border-slate-200/90 shadow-subtle hover:border-eco-300 transition-all font-semibold"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-card hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-eco-700 flex items-center justify-center mb-5 shadow-subtle group-hover:scale-105 transition-transform">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-charcoal-900 group-hover:text-eco-700 transition-colors">
              Cơ chế Đổi đồ (Barter) linh hoạt
            </h3>
            <p className="text-xs sm:text-sm text-sand-600 mt-2 leading-relaxed">
              Chọn món đồ từ kho cá nhân để gửi đề nghị đổi lấy món đồ yêu thích. Hỗ trợ thỏa thuận bù trừ tiền mặt minh bạch và sòng phẳng.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-card hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 text-teal-700 flex items-center justify-center mb-5 shadow-subtle group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-charcoal-900 group-hover:text-teal-700 transition-colors">
              Gặp mặt trực tiếp tại nơi công cộng
            </h3>
            <p className="text-xs sm:text-sm text-sand-600 mt-2 leading-relaxed">
              Ẩn hoàn toàn số điện thoại trên bài đăng công khai; chỉ mở liên hệ khi chốt đề nghị. Hẹn gặp kiểm tra thực tế tại quán cafe, TTTM đông người.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-card hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-clay-600 flex items-center justify-center mb-5 shadow-subtle group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-charcoal-900 group-hover:text-clay-600 transition-colors">
              Đánh giá uy tín 2 chiều & Chống ảo
            </h3>
            <p className="text-xs sm:text-sm text-sand-600 mt-2 leading-relaxed">
              Chỉ mở quyền chấm sao khi cả hai bên cùng xác nhận đã bàn giao hàng ngoài đời. Tiêu chí chuẩn hóa: đúng giờ, lịch sự và đúng mô tả.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY DISCOVERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-eco-700 uppercase tracking-wider bg-eco-50 px-3 py-1 rounded-full border border-eco-200/60 inline-flex">
              <Layers className="w-4 h-4" />
              <span>Khám phá theo ngành hàng</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-2">
              Danh mục đồ cũ tuyển chọn
            </h2>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-eco-700 hover:text-eco-900 group"
          >
            <span>Xem tất cả danh mục</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/explore?category=${cat.id}`}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:shadow-[0_12px_24px_-6px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-300 text-center group flex flex-col items-center justify-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-gradient-to-tr group-hover:from-eco-600 group-hover:to-teal-500 text-charcoal-700 group-hover:text-white flex items-center justify-center shadow-subtle transition-all duration-300 mb-3">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-charcoal-900 group-hover:text-eco-600 transition-colors">
                {cat.name}
              </h4>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5">
                {cat.productCount} sản phẩm
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED EDITORIAL SPOTLIGHT */}
      {featuredProduct && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="text-xs font-bold text-eco-700 uppercase tracking-wider bg-eco-50 px-3 py-1 rounded-full border border-eco-200/60 inline-flex">
              Tiêu điểm tuần này
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-2">
              Món đồ được quan tâm nhiều nhất
            </h2>
          </div>
          <ProductCard product={featuredProduct} variant="featured" />
        </section>
      )}

      {/* 5. TRENDING ITEMS WITH CATEGORY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-eco-700 uppercase tracking-wider bg-eco-50 px-3 py-1 rounded-full border border-eco-200/60 inline-flex">
              <TrendingUp className="w-4 h-4" />
              <span>Sản phẩm mới đăng tải</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-2">
              Đồ cũ quanh khu vực của bạn
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryTab === 'all'
                  ? 'bg-gradient-to-r from-eco-700 to-eco-600 text-white shadow-md shadow-eco-700/20'
                  : 'bg-white text-charcoal-700 hover:bg-eco-50 hover:text-eco-800 border border-slate-200/80'
              }`}
            >
              Tất cả món đồ
            </button>
            {categories.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryTab(c.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategoryTab === c.id
                    ? 'bg-gradient-to-r from-eco-700 to-eco-600 text-white shadow-md shadow-eco-700/20'
                    : 'bg-white text-charcoal-700 hover:bg-eco-50 hover:text-eco-800 border border-slate-200/80'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTrending.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} variant="standard" />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-eco-50 text-eco-800 font-bold text-sm border border-slate-300 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all"
          >
            <span>Khám phá toàn bộ {publicProducts.length} sản phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. CORNER: GÓC TRAO ĐỔI ĐỒ (BARTER SHOWCASE) */}
      <section className="bg-gradient-to-b from-emerald-50/70 via-teal-50/30 to-emerald-50/50 py-16 sm:py-20 border-y border-emerald-100/80 relative overflow-hidden">
        {/* Soft background ambient glow orbs */}
        <div className="w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl absolute top-0 right-0 pointer-events-none" />
        <div className="w-96 h-96 bg-teal-400/10 rounded-full blur-3xl absolute bottom-0 left-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-eco-700 uppercase tracking-wider bg-white/80 px-3 py-1 rounded-full border border-eco-200/80 inline-flex shadow-subtle">
                <ArrowRightLeft className="w-4 h-4 text-eco-600" />
                <span>Không cần tiền mặt</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-2">
                Góc Đổi Đồ — Kéo dài vòng đời vật dụng
              </h2>
              <p className="text-xs sm:text-sm text-sand-600 mt-1.5 max-w-xl leading-relaxed">
                Những sản phẩm sẵn sàng giao lưu đổi lấy món đồ khác. Dùng đồ không dùng nữa để đổi lấy món đồ bạn cần!
              </p>
            </div>
            <Link
              to="/explore?type=EXCHANGE"
              className="text-xs sm:text-sm font-bold text-eco-700 hover:text-eco-900 flex items-center gap-1.5 group"
            >
              <span>Xem tất cả tin nhận đổi đồ</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exchangeOnlyProducts.slice(0, 3).map((prod) => (
              <ProductCard key={prod.id} product={prod} variant="standard" />
            ))}
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS: MEETUP 4 BƯỚC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-eco-700 uppercase tracking-wider bg-eco-50 px-3 py-1 rounded-full border border-eco-200/60 inline-flex">
            Quy trình vận hành
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-2">
            Giao dịch gặp mặt an toàn tại ReLoop
          </h2>
          <p className="text-xs sm:text-sm text-sand-600 mt-2">
            Mô hình Face-to-Face Meetup giúp bạn kiểm tra sản phẩm tận mắt, không sợ ảnh ảo hay giao sai hàng.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all relative group">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-eco-700 to-teal-600 text-white font-extrabold text-sm flex items-center justify-center mb-5 shadow-md shadow-eco-600/30 group-hover:scale-105 transition-transform">
              1
            </span>
            <h4 className="text-base font-bold text-charcoal-900 group-hover:text-eco-700 transition-colors">Đăng tin & Khám phá</h4>
            <p className="text-xs text-sand-600 mt-2 leading-relaxed">
              Người bán đăng ảnh thật, tình trạng chi tiết và khu vực (Quận/Huyện). Người mua lọc sản phẩm gần mình nhất.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all relative group">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-eco-700 to-teal-600 text-white font-extrabold text-sm flex items-center justify-center mb-5 shadow-md shadow-eco-600/30 group-hover:scale-105 transition-transform">
              2
            </span>
            <h4 className="text-base font-bold text-charcoal-900 group-hover:text-eco-700 transition-colors">Gửi đề nghị Mua / Đổi</h4>
            <p className="text-xs text-sand-600 mt-2 leading-relaxed">
              Chọn đồ từ kho của mình để đem đổi kèm bù trừ tiền, hoặc gửi giá mua mong muốn qua hộp thư thương lượng.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all relative group">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-eco-700 to-teal-600 text-white font-extrabold text-sm flex items-center justify-center mb-5 shadow-md shadow-eco-600/30 group-hover:scale-105 transition-transform">
              3
            </span>
            <h4 className="text-base font-bold text-charcoal-900 group-hover:text-eco-700 transition-colors">Hẹn gặp nơi công cộng</h4>
            <p className="text-xs text-sand-600 mt-2 leading-relaxed">
              Khi được chấp thuận, hệ thống mở SĐT/Zalo. Hai bên chọn quán cafe, sảnh TTTM ban ngày để kiểm tra thực tế.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all relative group">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-eco-700 to-teal-600 text-white font-extrabold text-sm flex items-center justify-center mb-5 shadow-md shadow-eco-600/30 group-hover:scale-105 transition-transform">
              4
            </span>
            <h4 className="text-base font-bold text-charcoal-900 group-hover:text-eco-700 transition-colors">Xác nhận & Chấm sao</h4>
            <p className="text-xs text-sand-600 mt-2 leading-relaxed">
              Cả 2 bên cùng bấm xác nhận trên hệ thống để hoàn tất giao dịch và viết nhận xét uy tín cho đối phương.
            </p>
          </div>
        </div>
      </section>

      {/* 8. TRUSTED SELLERS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-card">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-eco-700 uppercase tracking-wider bg-eco-50 px-3 py-1 rounded-full border border-eco-200/60 inline-flex">
                Thành viên nổi bật
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-2">
                Người dùng uy tín cao trong cộng đồng
              </h2>
            </div>
            <Link
              to="/explore"
              className="text-xs sm:text-sm font-bold text-eco-700 hover:text-eco-900 flex items-center gap-1 group"
            >
              <span>Xem tất cả người bán</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users
              .filter((u) => u.role !== 'ADMIN' && u.status === 'ACTIVE')
              .slice(0, 3)
              .map((u) => (
                <Link
                  key={u.id}
                  to={`/sellers/${u.id}`}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-emerald-300 hover:bg-white hover:shadow-soft transition-all duration-300 group flex items-start gap-4 hover:-translate-y-0.5"
                >
                  <img
                    src={u.avatar}
                    alt={u.fullName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-subtle flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-charcoal-900 group-hover:text-eco-600 truncate transition-colors">
                        {u.fullName}
                      </h4>
                      <CheckCircle2 className="w-4 h-4 text-eco-600 flex-shrink-0" />
                    </div>
                    <div className="text-[11px] text-sand-500 mt-0.5 font-medium">
                      {u.district}, {u.province}
                    </div>
                    <div className="mt-2.5 flex items-center gap-3 text-xs">
                      <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full text-[10px] shadow-subtle">
                        ★ {u.trustScore}đ Uy tín
                      </span>
                      <span className="text-sand-500 text-[11px] font-medium">
                        {u.totalTransactions} giao dịch
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl sm:rounded-4xl bg-gradient-to-r from-eco-900 via-eco-800 to-teal-900 text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-elevated border border-emerald-500/20">
          {/* Ambient Lighting Blobs */}
          <div className="w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl absolute -top-16 -left-16 pointer-events-none" />
          <div className="w-80 h-80 bg-teal-400/20 rounded-full blur-3xl absolute -bottom-16 -right-16 pointer-events-none" />

          <div className="max-w-2xl mx-auto relative z-10 space-y-5">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Bạn có món đồ đang nằm im một góc?
            </h2>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
              Mỗi món đồ không còn dùng đến với bạn có thể là món bảo bối của người khác. Đăng tin chỉ mất 2 phút và hoàn toàn miễn phí.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/user/create-listing"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-eco-950 font-bold text-sm hover:bg-emerald-50 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-soft"
              >
                + Đăng tin bán hoặc đổi ngay
              </Link>
              <Link
                to="/explore"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/25 backdrop-blur-md hover:-translate-y-0.5"
              >
                Khám phá kho đồ cũ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
