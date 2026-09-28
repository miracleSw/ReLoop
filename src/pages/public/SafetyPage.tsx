import React from 'react';
import { ShieldCheck, AlertOctagon, Lock, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export const SafetyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-eco-700 uppercase tracking-wider bg-eco-50 px-3 py-1 rounded-full border border-eco-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Tiêu chuẩn cộng đồng</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900">
          Quy định Chính sách An toàn & Bảo mật ReLoop
        </h1>
        <p className="text-sm text-sand-600 max-w-xl mx-auto leading-relaxed">
          Nguyên tắc cốt lõi giúp bảo vệ mọi thành viên khi tham gia mua bán và trao đổi đồ đã qua sử dụng theo mô hình gặp mặt trực tiếp.
        </p>
      </div>

      <div className="space-y-8">
        {/* POLICY 1: PROHIBITED ITEMS */}
        <div id="prohibited" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-card transition-all space-y-4">
          <div className="flex items-center gap-3.5 text-rose-600">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
              <AlertOctagon className="w-6 h-6 text-rose-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-900">
              1. Danh mục Hàng cấm nghiêm ngặt (Prohibited Items Policy)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-sand-600 leading-relaxed">
            Hệ thống ReLoop tuyệt đối nghiêm cấm đăng tải, rao bán hoặc trao đổi các mặt hàng sau. Vi phạm sẽ bị xóa bài đăng ngay lập tức và khóa tài khoản vĩnh viễn:
          </p>
          <ul className="space-y-2.5 text-xs sm:text-sm text-charcoal-800">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              <span>Vũ khí quân dụng, súng đạn, công cụ hỗ trợ, hung khí nguy hiểm, pháo hoa/pháo nổ.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              <span>Ma túy, chất kích thích, thuốc lá điện tử, shisha, rượu cồn nồng độ cao không rõ nguồn gốc.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              <span>Động vật hoang dã quý hiếm cần bảo tồn và các sản phẩm chế tác từ chúng (ngà voi, sừng tê...).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              <span>Hàng giả, hàng nhái nhãn hiệu, vi phạm quyền sở hữu trí tuệ, phần mềm crack/tài khoản lậu.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              <span>Thuốc chữa bệnh kê đơn, dược phẩm đặc trị, thực phẩm tươi sống dễ ôi thiu không an toàn.</span>
            </li>
          </ul>
        </div>

        {/* POLICY 2: PRIVACY & PUBLIC MEETUP */}
        <div id="privacy" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-card transition-all space-y-4">
          <div className="flex items-center gap-3.5 text-eco-700">
            <div className="w-11 h-11 rounded-2xl bg-eco-50 border border-eco-100 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-eco-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-900">
              2. Bảo vệ Vị trí & Thông tin Liên hệ cá nhân (Privacy & Public Meetup)
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-sand-600 leading-relaxed">
            <p>
              • <strong className="text-charcoal-900">Bảo vệ địa chỉ riêng:</strong> Tuyệt đối không công khai số nhà, ngõ ngách, số phòng trên bài đăng. ReLoop chỉ hiển thị cấp Phường/Xã, Quận/Huyện, Tỉnh/TP để người dùng tìm kiếm khu vực gần nhất.
            </p>
            <p>
              • <strong className="text-charcoal-900">Ẩn số điện thoại:</strong> Số điện thoại và liên kết Zalo được ẩn hoàn toàn; hệ thống chỉ tự động hiển thị khi Người bán đã bấm chấp thuận chính thức một đề nghị trao đổi/mua hàng.
            </p>
            <p>
              • <strong className="text-charcoal-900">Điểm hẹn công cộng:</strong> Bắt buộc thỏa thuận gặp gỡ tại nơi công cộng đông người (quán cafe, sảnh trung tâm thương mại, cổng trường học/ủy ban ban ngày). Tuyệt đối không hẹn tại nơi vắng vẻ hoặc đêm khuya.
            </p>
          </div>
        </div>

        {/* POLICY 3: EVIDENCE RETENTION */}
        <div id="retention" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-card transition-all space-y-4">
          <div className="flex items-center gap-3.5 text-teal-700">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-900">
              3. Lưu trữ Bằng chứng & Dữ liệu Giao dịch 90 Ngày
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-sand-600 leading-relaxed">
            <p>
              • Toàn bộ nội dung trao đổi trong Hộp thư đề nghị, lịch sử cập nhật trạng thái lịch hẹn và hình ảnh bằng chứng báo cáo được hệ thống lưu trữ tối thiểu <strong className="text-charcoal-900">90 ngày</strong>.
            </p>
            <p>
              • Đây là căn cứ bắt buộc để Quản trị viên đối soát khi xử lý các trường hợp bùng hẹn, thông tin sai sự thật hoặc khiếu nại đánh giá oan uổng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
