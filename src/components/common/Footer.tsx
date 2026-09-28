import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, HeartHandshake, Recycle, Leaf, MapPin, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-[#F0FDF4]/70 via-[#F8FAF9] to-white text-slate-600 pt-16 pb-12 border-t border-emerald-100/90 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="w-[500px] h-[500px] max-w-full bg-emerald-400/10 rounded-full blur-3xl absolute -top-40 right-0 pointer-events-none" />
      <div className="w-[400px] h-[400px] max-w-full bg-teal-400/10 rounded-full blur-3xl absolute bottom-0 left-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* IMPACT BANNER */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 lg:p-8 mb-16 border border-emerald-100/90 shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-eco-600 to-teal-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-eco-600/30">
              <Recycle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-charcoal-900 font-bold text-lg">
                Tác động sinh thái từ Cộng đồng ReLoop
              </h4>
              <p className="text-slate-600 text-sm mt-0.5">
                Mỗi món đồ trao đổi là một vòng đời mới được bắt đầu, giảm tải khai thác tài nguyên thiên nhiên.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 border-t lg:border-t-0 lg:border-l border-slate-200/80 pt-6 lg:pt-0 lg:pl-8 text-center sm:text-left w-full lg:w-auto flex-shrink-0">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-charcoal-900">3,820+</div>
              <div className="text-xs text-slate-500 font-medium">Món đồ tuần hoàn</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-eco-600">48.5 Tấn</div>
              <div className="text-xs text-slate-500 font-medium">CO₂ giảm phát thải</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-clay-600">94.2%</div>
              <div className="text-xs text-slate-500 font-medium">Giao dịch hài lòng</div>
            </div>
          </div>
        </div>

        {/* MAIN COLUMNS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-slate-200/80">
          {/* Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-eco-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-eco-600/25">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl text-charcoal-900 tracking-tight">
                Re<span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-600 to-teal-600">Loop</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Nền tảng mua bán & trao đổi đồ đã qua sử dụng theo mô hình Gặp mặt trực tiếp an toàn tại địa phương. Thúc đẩy lối sống tối giản, văn minh và bền vững cho thế hệ tương lai.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-eco-600 flex-shrink-0" />
              <span>Phục vụ toàn quốc: TP. Hồ Chí Minh • Hà Nội • Đà Nẵng • Huế</span>
            </div>
          </div>

          {/* Column 2: Khám phá */}
          <div>
            <h5 className="text-charcoal-900 font-bold text-sm mb-4 uppercase tracking-wider">
              Khám phá sàn
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/explore" className="hover:text-eco-700 transition-colors">
                  Toàn bộ sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/explore?type=EXCHANGE" className="hover:text-eco-700 transition-colors">
                  Góc trao đổi đồ cũ
                </Link>
              </li>
              <li>
                <Link to="/explore?condition=Mới 99%" className="hover:text-eco-700 transition-colors">
                  Đồ tuyển chọn 99%
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-eco-700 transition-colors">
                  Tất cả danh mục
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Chính sách an toàn */}
          <div>
            <h5 className="text-charcoal-900 font-bold text-sm mb-4 uppercase tracking-wider">
              An toàn & Quy chuẩn
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/safety" className="hover:text-eco-700 transition-colors">
                  Cẩm nang gặp mặt an toàn
                </Link>
              </li>
              <li>
                <Link to="/safety#prohibited" className="hover:text-eco-700 transition-colors">
                  Danh mục hàng cấm
                </Link>
              </li>
              <li>
                <Link to="/safety#privacy" className="hover:text-eco-700 transition-colors">
                  Bảo vệ địa chỉ & SĐT
                </Link>
              </li>
              <li>
                <Link to="/safety#retention" className="hover:text-eco-700 transition-colors">
                  Lưu trữ bằng chứng 90 ngày
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Thành viên */}
          <div>
            <h5 className="text-charcoal-900 font-bold text-sm mb-4 uppercase tracking-wider">
              Tài khoản
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/user/dashboard" className="hover:text-eco-700 transition-colors">
                  Bảng điều khiển cá nhân
                </Link>
              </li>
              <li>
                <Link to="/user/products" className="hover:text-eco-700 transition-colors">
                  Quản lý kho đồ cá nhân
                </Link>
              </li>
              <li>
                <Link to="/user/create-listing" className="hover:text-eco-700 transition-colors">
                  Đăng tin bán hoặc đổi
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-eco-700 hover:text-eco-800 font-semibold transition-colors">
                  Cổng Quản trị Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 text-center sm:text-left">
          <p>© 2026 ReLoop Marketplace — HUSC-33 Software Engineering Capstone Project.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-eco-800 border border-emerald-200/80 font-medium">
              <Leaf className="w-3.5 h-3.5 text-eco-600" /> Chuẩn Nature Eco Living
            </span>
            <span>Giao dịch Face-to-Face an toàn</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
