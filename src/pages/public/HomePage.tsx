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
    <div className="space-y-20 pb-20">
      {/* 1. SHOWCASE SPOTLIGHT HERO BANNER */}
      <section className="pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SpotlightBanner />
        </div>
      </section>

      {/* QUICK SEARCH & POPULAR DISCOVERY BAR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-30">
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full shadow-elevated border border-sand-200">
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
              className="w-full sm:w-auto px-7 py-3.5 bg-eco-800 hover:bg-eco-700 active:scale-95 text-white font-semibold text-sm rounded-xl sm:rounded-full transition-all flex items-center justify-center gap-2 shadow-soft flex-shrink-0"
            >
              <span>Tìm kiếm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Fast tag chips */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-sand-600">
          <span className="font-medium text-sand-500">Tìm kiếm phổ biến:</span>
          {['Olympus', 'Bàn phím cơ', 'Ghế mây', 'Xe đạp Touring', 'Linen Blazer', 'Sách tối giản'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/explore?q=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-full bg-white hover:bg-eco-50 hover:text-eco-800 text-charcoal-700 border border-sand-200 shadow-subtle transition-colors font-medium"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </section>

      {/* 2. VALUE PROPOSITION PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sand-200/80 shadow-soft hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-2xl bg-eco-50 text-eco-700 flex items-center justify-center mb-5">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-charcoal-900">
              Cơ chế Đổi đồ (Barter) linh hoạt
            </h3>
            <p className="text-xs sm:text-sm text-sand-600 mt-2 leading-relaxed">
              Chọn món đồ từ kho cá nhân để gửi đề nghị đổi lấy món đồ yêu thích. Hỗ trợ thỏa thuận bù trừ tiền mặt minh bạch và sòng phẳng.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sand-200/80 shadow-soft hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-charcoal-900">
              Gặp mặt trực tiếp tại nơi công cộng
            </h3>
            <p className="text-xs sm:text-sm text-sand-600 mt-2 leading-relaxed">
              Ẩn hoàn toàn số điện thoại trên bài đăng công khai; chỉ mở liên hệ khi chốt đề nghị. Hẹn gặp kiểm tra thực tế tại quán cafe, TTTM đông người.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sand-200/80 shadow-soft hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-2xl bg-clay-50 text-clay-700 flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-charcoal-900">
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
            <div className="flex items-center gap-1.5 text-xs font-bold text-eco-700 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Khám phá theo ngành hàng</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1">
              Danh mục đồ cũ tuyển chọn
            </h2>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-eco-800 hover:text-eco-900 group"
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
              className="p-5 rounded-2xl bg-white border border-sand-200 hover:border-eco-500 hover:shadow-card transition-all text-center group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-sand-100 group-hover:bg-eco-100 text-charcoal-700 group-hover:text-eco-800 flex items-center justify-center transition-colors mb-3">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-charcoal-900 group-hover:text-eco-800 transition-colors">
                {cat.name}
              </h4>
              <span className="text-[11px] text-sand-500 mt-1 font-medium">
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
            <span className="text-xs font-bold text-eco-700 uppercase tracking-wider">
              Tiêu điểm tuần này
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1">
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
            <div className="flex items-center gap-1.5 text-xs font-bold text-eco-700 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Sản phẩm mới đăng tải</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1">
              Đồ cũ quanh khu vực của bạn
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategoryTab === 'all'
                  ? 'bg-eco-800 text-white shadow-soft'
                  : 'bg-white text-charcoal-700 hover:bg-sand-100 border border-sand-200'
              }`}
            >
              Tất cả món đồ
            </button>
            {categories.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryTab(c.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategoryTab === c.id
                    ? 'bg-eco-800 text-white shadow-soft'
                    : 'bg-white text-charcoal-700 hover:bg-sand-100 border border-sand-200'
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
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-sand-50 text-eco-800 font-bold text-sm border border-sand-300 shadow-soft hover:shadow-card transition-all"
          >
            <span>Khám phá toàn bộ {publicProducts.length} sản phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. CORNER: GÓC TRAO ĐỔI ĐỒ (BARTER SHOWCASE) */}
      <section className="bg-sand-100/70 py-16 border-y border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-eco-700 uppercase tracking-wider">
                <ArrowRightLeft className="w-4 h-4" />
                <span>Không cần tiền mặt</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1">
                Góc Đổi Đồ — Kéo dài vòng đời vật dụng
              </h2>
              <p className="text-xs sm:text-sm text-sand-600 mt-1 max-w-xl">
                Những sản phẩm sẵn sàng giao lưu đổi lấy món đồ khác. Dùng đồ không dùng nữa để đổi lấy món đồ bạn cần!
              </p>
            </div>
            <Link
              to="/explore?type=EXCHANGE"
              className="text-xs sm:text-sm font-semibold text-eco-800 hover:text-eco-900 flex items-center gap-1"
            >
              <span>Xem tất cả tin nhận đổi đồ</span>
              <ChevronRight className="w-4 h-4" />
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
          <span className="text-xs font-bold text-eco-700 uppercase tracking-wider">
            Quy trình vận hành
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1">
            Giao dịch gặp mặt an toàn tại ReLoop
          </h2>
          <p className="text-xs sm:text-sm text-sand-600 mt-2">
            Mô hình Face-to-Face Meetup giúp bạn kiểm tra sản phẩm tận mắt, không sợ ảnh ảo hay giao sai hàng.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white border border-sand-200 relative">
            <span className="w-8 h-8 rounded-full bg-eco-800 text-white font-bold text-xs flex items-center justify-center mb-4">
              1
            </span>
            <h4 className="text-base font-bold text-charcoal-900">Đăng tin & Khám phá</h4>
            <p className="text-xs text-sand-600 mt-2 leading-relaxed">
              Người bán đăng ảnh thật, tình trạng chi tiết và khu vực (Quận/Huyện). Người mua lọc sản phẩm gần mình nhất.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white border border-sand-200 relative">
            <span className="w-8 h-8 rounded-full bg-eco-800 text-white font-bold text-xs flex items-center justify-center mb-4">
              2
            </span>
            <h4 className="text-base font-bold text-charcoal-900">Gửi đề nghị Mua / Đổi</h4>
            <p className="text-xs text-sand-600 mt-2 leading-relaxed">
              Chọn đồ từ kho của mình để đem đổi kèm bù trừ tiền, hoặc gửi giá mua mong muốn qua hộp thư thương lượng.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white border border-sand-200 relative">
            <span className="w-8 h-8 rounded-full bg-eco-800 text-white font-bold text-xs flex items-center justify-center mb-4">
              3
            </span>
            <h4 className="text-base font-bold text-charcoal-900">Hẹn gặp nơi công cộng</h4>
            <p className="text-xs text-sand-600 mt-2 leading-relaxed">
              Khi được chấp thuận, hệ thống mở SĐT/Zalo. Hai bên chọn quán cafe, sảnh TTTM ban ngày để kiểm tra thực tế.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-white border border-sand-200 relative">
            <span className="w-8 h-8 rounded-full bg-eco-800 text-white font-bold text-xs flex items-center justify-center mb-4">
              4
            </span>
            <h4 className="text-base font-bold text-charcoal-900">Xác nhận & Chấm sao</h4>
            <p className="text-xs text-sand-600 mt-2 leading-relaxed">
              Cả 2 bên cùng bấm xác nhận trên hệ thống để hoàn tất giao dịch và viết nhận xét uy tín cho đối phương.
            </p>
          </div>
        </div>
      </section>

      {/* 8. TRUSTED SELLERS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-sand-200 shadow-card">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-eco-700 uppercase tracking-wider">
                Thành viên nổi bật
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1">
                Người dùng uy tín cao trong cộng đồng
              </h2>
            </div>
            <Link
              to="/explore"
              className="text-xs sm:text-sm font-semibold text-eco-800 hover:text-eco-900"
            >
              Xem tất cả người bán →
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
                  className="p-5 rounded-2xl bg-sand-50/70 border border-sand-200/80 hover:border-eco-400 hover:shadow-soft transition-all group flex items-start gap-4"
                >
                  <img
                    src={u.avatar}
                    alt={u.fullName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-eco-500 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-charcoal-900 group-hover:text-eco-800 truncate">
                        {u.fullName}
                      </h4>
                      <CheckCircle2 className="w-4 h-4 text-eco-600 flex-shrink-0" />
                    </div>
                    <div className="text-[11px] text-sand-600 mt-0.5">
                      {u.district}, {u.province}
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                        ★ {u.trustScore}đ Uy tín
                      </span>
                      <span className="text-sand-600 text-[11px]">
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
        <div className="rounded-3xl sm:rounded-4xl bg-eco-900 text-white p-8 sm:p-14 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10 space-y-5">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Bạn có món đồ đang nằm im một góc?
            </h2>
            <p className="text-sand-300 text-xs sm:text-sm leading-relaxed">
              Mỗi món đồ không còn dùng đến với bạn có thể là món bảo bối của người khác. Đăng tin chỉ mất 2 phút và hoàn toàn miễn phí.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/user/create-listing"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-eco-900 font-bold text-sm hover:bg-sand-100 transition-colors shadow-soft"
              >
                + Đăng tin bán hoặc đổi ngay
              </Link>
              <Link
                to="/explore"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/20"
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
