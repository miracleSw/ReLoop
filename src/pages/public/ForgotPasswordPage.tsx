import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Mail, Lock, AlertTriangle, CheckCircle2, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { users, showToast } = useApp();
  const navigate = useNavigate();

  // Multi-step: 1 = Enter Email/Phone, 2 = Verify OTP, 3 = Reset Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [accountInput, setAccountInput] = useState('');
  const [targetUserEmail, setTargetUserEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // BR-04: OTP 3-minute countdown timer
  const [otpTimer, setOtpTimer] = useState(180);
  const [resendCount, setResendCount] = useState(0); // BR-06: max 3 resends in 15 mins
  const [otpRetryCount, setOtpRetryCount] = useState(0); // BR-05: max 5 failed attempts

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmed = accountInput.trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === trimmed || u.phone === accountInput.trim()
    );

    if (!found) {
      setErrorMsg('Không tìm thấy tài khoản với Email hoặc Số điện thoại này.');
      return;
    }

    setTargetUserEmail(found.email);
    setStep(2);
    setOtpTimer(180);
    setOtpRetryCount(0);
    showToast(`Mã xác thực đã được gửi đến ${found.email}.`, 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // OTP expiration check
    if (otpTimer <= 0) {
      setErrorMsg('Mã xác thực đã hết hạn hiệu lực. Vui lòng bấm gửi lại mã mới.');
      return;
    }

    // Failed attempt limit (max 5)
    if (otpCode !== '8888') {
      const newRetries = otpRetryCount + 1;
      setOtpRetryCount(newRetries);
      if (newRetries >= 5) {
        setErrorMsg('Bạn đã nhập sai mã xác thực quá 5 lần. Mã này đã bị vô hiệu hóa, vui lòng gửi lại mã mới.');
        setOtpCode('');
        return;
      }
      setErrorMsg(`Mã xác thực không chính xác. Bạn còn ${5 - newRetries} lần thử.`);
      return;
    }

    // OTP correct
    setStep(3);
  };

  const handleResendOtp = () => {
    if (resendCount >= 3) {
      setErrorMsg('Bạn đã gửi lại mã nhiều lần liên tiếp. Vui lòng thử lại sau ít phút.');
      return;
    }
    setResendCount((c) => c + 1);
    setOtpTimer(180);
    setOtpRetryCount(0);
    setOtpCode('');
    setErrorMsg('');
    showToast('Đã gửi lại mã xác thực mới.', 'info');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Password complexity check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số.');
      return;
    }

    // Password confirmation check
    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    // New password differs from current
    if (newPassword === 'password123') {
      setErrorMsg('Mật khẩu mới không được trùng với mật khẩu hiện tại của bạn.');
      return;
    }

    setStep(4);
    showToast('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.', 'success');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row">
      {/* LEFT: EDITORIAL BRANDING */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#064E3B] via-[#043E30] to-[#022C22] text-white p-8 sm:p-14 lg:p-20 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold shadow-subtle">
            <KeyRound className="w-3.5 h-3.5 text-emerald-300" />
            <span>Khôi phục Mật khẩu & Bảo mật Tài khoản</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Lấy lại quyền truy cập <br />
            <span className="font-editorial italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
              an toàn và nhanh chóng.
            </span>
          </h2>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-md font-normal">
            Hệ thống xác thực hai lớp qua mã OTP giúp bảo vệ tuyệt đối hồ sơ uy tín, lịch sử giao dịch và kho đồ cá nhân của bạn.
          </p>
        </div>

        <div className="relative z-10 pt-10 border-t border-white/15 text-xs text-sand-300 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Bảo mật 2 lớp qua mã xác thực gửi về Email hoặc Số điện thoại</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Bảo vệ tài khoản, hồ sơ uy tín và lịch sử giao dịch</span>
          </div>
        </div>
      </div>

      {/* RIGHT: FORGOT PASSWORD FORM */}
      <div className="lg:w-1/2 p-5 sm:p-12 lg:p-20 flex items-center justify-center bg-[#F8FAF9]">
        <div className="max-w-md w-full space-y-6">
          <div>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sand-600 hover:text-eco-800 mb-4 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang Đăng nhập</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              {step === 1 && 'Quên mật khẩu?'}
              {step === 2 && 'Xác thực mã bảo mật'}
              {step === 3 && 'Tạo mật khẩu mới'}
              {step === 4 && 'Khôi phục thành công!'}
            </h1>
            <p className="text-xs sm:text-sm text-sand-500 mt-1">
              {step === 1 && 'Nhập Email hoặc Số điện thoại để nhận mã xác thực đặt lại mật khẩu.'}
              {step === 2 && `Mã xác thực đã được gửi đến ${targetUserEmail}.`}
              {step === 3 && 'Thiết lập mật khẩu mới cho tài khoản của bạn.'}
              {step === 4 && 'Mật khẩu tài khoản đã được cập nhật thành công.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-start gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: REQUEST OTP */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Email hoặc Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={accountInput}
                    onChange={(e) => setAccountInput(e.target.value)}
                    placeholder="name@example.com hoặc 0901234567"
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-subtle"
                  />
                  <Mail className="w-4 h-4 text-sand-400 absolute left-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white font-bold text-sm shadow-glow-emerald transition-all"
              >
                Gửi mã xác thực
              </button>
            </form>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-semibold text-center">
                Mã xác nhận: <span className="text-base font-black text-emerald-900">8888</span>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Thời gian hiệu lực còn: <span className="font-bold">{Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5 text-center">
                  Nhập mã xác thực 4 chữ số
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="8888"
                  className="w-full text-center tracking-widest text-2xl font-bold bg-white border border-slate-200 rounded-xl py-3 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-subtle"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-sand-500">
                <span>Chưa nhận được mã?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpTimer > 120 || resendCount >= 3}
                  className="font-bold text-eco-700 hover:underline disabled:text-sand-400 disabled:no-underline"
                >
                  Gửi lại mã {resendCount > 0 ? `(${resendCount}/3)` : ''}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white font-bold text-sm shadow-glow-emerald transition-all"
              >
                Xác nhận & Tiếp tục
              </button>
            </form>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Mật khẩu mới <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự, có hoa, thường, số"
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-subtle"
                  />
                  <Lock className="w-4 h-4 text-sand-400 absolute left-3.5 top-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-sand-500 mt-1">
                  Tối thiểu 8 ký tự, gồm cả chữ hoa, chữ thường và chữ số.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full text-sm bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500 shadow-subtle"
                  />
                  <Lock className="w-4 h-4 text-sand-400 absolute left-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white font-bold text-sm shadow-glow-emerald transition-all"
              >
                Cập nhật mật khẩu mới
              </button>
            </form>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-subtle">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">Mật khẩu đã được đặt lại</h3>
              <p className="text-xs text-sand-600">
                Bạn có thể sử dụng mật khẩu mới vừa tạo để đăng nhập vào tài khoản ReLoop.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-eco-700 to-teal-600 text-white font-bold text-sm shadow-glow-emerald transition-all"
              >
                Đăng nhập ngay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
