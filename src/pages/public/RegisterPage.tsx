import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { users, addUser, loginAs, showToast } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // BR-01: Email format and duplicate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Định dạng email không hợp lệ.');
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setErrorMsg('Email này đã được sử dụng bởi một tài khoản khác.');
      return;
    }

    // BR-02: Phone duplicate
    if (users.some((u) => u.phone === phone.trim())) {
      setErrorMsg('Số điện thoại này đã được sử dụng.');
      return;
    }

    // BR-03: Password match
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    // Password complexity check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg('Mật khẩu cần tối thiểu 8 ký tự, gồm cả chữ hoa, chữ thường và chữ số.');
      return;
    }

    // Trigger OTP modal
    setShowOtpModal(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setErrorMsg('Mã OTP phải có đủ 4-6 chữ số.');
      return;
    }

    // Create user in system state
    const newId = 'user-' + Date.now();
    addUser({
      id: newId,
      fullName,
      email,
      phone,
      zaloPhone: phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      province,
      district,
      ward: 'Phường trung tâm',
      trustScore: 100, // starting clean score
      totalTransactions: 0,
      rating: 5.0,
      reviewCount: 0,
      role: 'USER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      blockedUserIds: [],
      bio: 'Thành viên mới gia nhập cộng đồng tiêu dùng tuần hoàn ReLoop.',
    });

    loginAs(newId);
    showToast('Xác thực OTP thành công! Chào mừng bạn gia nhập ReLoop.', 'success');
    navigate('/user/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row">
      {/* LEFT: EDITORIAL STORY */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#064E3B] via-[#043E30] to-[#022C22] text-white p-8 sm:p-14 lg:p-20 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold shadow-subtle">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Xác thực Danh tính Thực qua OTP</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Trở thành một phần của <br />
            <span className="font-editorial italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
              lối sống bền vững.
            </span>
          </h2>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-md font-normal">
            Mỗi tài khoản tại ReLoop đều được xác thực số điện thoại và email thật để loại trừ tài khoản ảo, giúp các cuộc hẹn gặp mặt ngoài đời diễn ra an tâm tuyệt đối.
          </p>
        </div>

        <div className="relative z-10 pt-10 border-t border-white/15 text-xs text-sand-300 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span className="text-white font-medium">Khởi đầu với 100 điểm uy tín sinh thái</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Bảo vệ quyền riêng tư số điện thoại & địa chỉ nhà riêng</span>
          </div>
        </div>
      </div>

      {/* RIGHT: REGISTER FORM */}
      <div className="lg:w-1/2 p-5 sm:p-12 lg:p-16 flex items-center justify-center bg-[#F8FAF9]">
        <div className="max-w-md w-full space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Đăng ký tài khoản ReLoop
            </h1>
            <p className="text-xs sm:text-sm text-sand-500 mt-1">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-bold text-eco-700 hover:text-eco-900 hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                Họ và tên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Trần Văn Nam"
                className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-subtle transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-subtle transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901234567"
                  className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-subtle transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Tỉnh / Thành phố
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 text-charcoal-800 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-subtle"
                >
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">TP. Hà Nội</option>
                  <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                  <option value="Đà Nẵng">TP. Đà Nẵng</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Quận / Huyện
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Quận 1, Cầu Giấy..."
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-subtle"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Mật khẩu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-subtle"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Nhập lại mật khẩu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-subtle"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 active:scale-[0.98] text-white font-bold text-sm shadow-glow-emerald hover:shadow-lg transition-all"
            >
              Tiếp tục xác thực OTP
            </button>
          </form>
        </div>
      </div>

      {/* OTP SIMULATION MODAL (UC01) */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-elevated border border-slate-200 animate-slide-up text-center space-y-4">
            <div className="w-14 h-14 bg-gradient-to-br from-eco-100 to-teal-100 text-eco-700 rounded-2xl flex items-center justify-center mx-auto shadow-subtle">
              <ShieldCheck className="w-7 h-7 text-eco-600" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900">Xác thực mã kích hoạt</h3>
            <p className="text-xs text-sand-500 leading-relaxed">
              Mã kích hoạt tài khoản đã được gửi đến email{' '}
              <strong className="text-charcoal-900">{email}</strong>.
            </p>

            <div className="p-3 bg-gradient-to-r from-eco-50 to-teal-50 rounded-2xl border border-eco-200 text-xs text-eco-800 font-semibold">
              Mã xác nhận: <span className="text-base font-black text-eco-800">8888</span>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Nhập 8888"
                className="w-full text-center tracking-widest text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl py-3 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
              />

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-eco-700 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white rounded-xl font-bold text-xs shadow-glow-emerald transition-all"
              >
                Xác nhận & Hoàn tất tạo tài khoản
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
