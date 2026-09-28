import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, HeartHandshake, Recycle, Leaf, MapPin, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-900 text-sand-200 pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* IMPACT BANNER */}
        <div className="bg-charcoal-800/80 rounded-3xl p-6 sm:p-8 mb-16 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-eco-600/20 text-eco-400 flex items-center justify-center flex-shrink-0">
              <Recycle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">
                Tác động sinh thái từ Cộng đồng ReLoop
              </h4>
              <p className="text-sand-400 text-sm mt-0.5">
                Mỗi món đồ trao đổi là một vòng đời mới được bắt đầu, giảm tải khai thác tài nguyên thiên nhiên.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 sm:gap-10 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 text-center md:text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">3,820+</div>
              <div className="text-xs text-sand-400 font-medium">Món đồ tuần hoàn</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-eco-400">48.5 Tấn</div>
              <div className="text-xs text-sand-400 font-medium">CO₂ giảm phát thải</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-clay-400">94.2%</div>
              <div className="text-xs text-sand-400 font-medium">Giao dịch hài lòng</div>
            </div>
          </div>
        </div>

        {/* MAIN COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-charcoal-800">
          {/* Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-eco-600 text-white flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Re<span className="text-eco-400">Loop</span>
              </span>
            </div>
            <p className="text-sm text-sand-400 leading-relaxed max-w-sm">
              Nền tảng mua bán & trao đổi đồ đã qua sử dụng theo mô hình Gặp mặt trực tiếp an toàn tại địa phương. Thúc đẩy lối sống tối giản, văn minh và bền vững cho thế hệ tương lai.
            </p>
            <div className="flex items-center gap-2 text-xs text-sand-400">
              <MapPin className="w-4 h-4 text-eco-500" />
              <span>Phục vụ toàn quốc: TP. Hồ Chí Minh • Hà Nội • Đà Nẵng • Huế</span>
            </div>
          </div>

          {/* Column 2: Khám phá */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Khám phá sàn
            </h5>
            <ul className="space-y-2.5 text-sm text-sand-400">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  Toàn bộ sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/explore?type=EXCHANGE" className="hover:text-white transition-colors">
                  Góc trao đổi đồ cũ
                </Link>
              </li>
              <li>
                <Link to="/explore?condition=Mới 99%" className="hover:text-white transition-colors">
                  Đồ tuyển chọn 99%
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  Tất cả danh mục
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Chính sách an toàn */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              An toàn & Quy chuẩn
            </h5>
            <ul className="space-y-2.5 text-sm text-sand-400">
              <li>
                <Link to="/safety" className="hover:text-white transition-colors">
                  Cẩm nang gặp mặt an toàn
                </Link>
              </li>
              <li>
                <Link to="/safety#prohibited" className="hover:text-white transition-colors">
                  Danh mục hàng cấm
                </Link>
              </li>
              <li>
                <Link to="/safety#privacy" className="hover:text-white transition-colors">
                  Bảo vệ địa chỉ & SĐT
                </Link>
              </li>
              <li>
                <Link to="/safety#retention" className="hover:text-white transition-colors">
                  Lưu trữ bằng chứng 90 ngày
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Thành viên */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Tài khoản
            </h5>
            <ul className="space-y-2.5 text-sm text-sand-400">
              <li>
                <Link to="/user/dashboard" className="hover:text-white transition-colors">
                  Bảng điều khiển cá nhân
                </Link>
              </li>
              <li>
                <Link to="/user/products" className="hover:text-white transition-colors">
                  Quản lý kho đồ cá nhân
                </Link>
              </li>
              <li>
                <Link to="/user/create-listing" className="hover:text-white transition-colors">
                  Đăng tin bán hoặc đổi
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-eco-400 transition-colors">
                  Cổng Quản trị Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sand-500 gap-4">
          <p>© 2026 ReLoop Marketplace — HUSC-33 Software Engineering Capstone Project.</p>
          <div className="flex items-center gap-6">
            <span>Thiết kế theo chuẩn Nature Eco Living</span>
            <span>Giao dịch Face-to-Face an toàn</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
