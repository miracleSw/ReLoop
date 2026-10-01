import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Settings,
  Shield,
  Lock,
  UserX,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  PhoneCall,
  Sparkles,
  MapPin,
  KeyRound
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SettingsProfilePage: React.FC = () => {
  const { currentUser, updateProfile, users, toggleBlockUser, showToast } = useApp();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [zaloPhone, setZaloPhone] = useState(currentUser?.zaloPhone || '');
  const [province, setProvince] = useState(currentUser?.province || 'Hồ Chí Minh');
  const [district, setDistrict] = useState(currentUser?.district || 'Quận 1');
  const [ward, setWard] = useState(currentUser?.ward || 'Phường Bến Nghé');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">Vui lòng đăng nhập</h2>
        <Link to="/login" className="mt-4 inline-block text-eco-700 text-xs font-semibold hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      phone,
      zaloPhone,
      province,
      district,
      ward,
      bio,
      avatar,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (oldPassword !== 'password123' && oldPassword.length === 0) {
      setPasswordError('Mật khẩu hiện tại không chính xác.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Mật khẩu mới xác nhận không trùng khớp.');
      return;
    }

    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    showToast('Đổi mật khẩu thành công! Mật khẩu mới đã được cập nhật.', 'success');
  };

  const blockedUsers = users.filter((u) => currentUser.blockedUserIds.includes(u.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-eco-800 uppercase tracking-wider bg-eco-100/70 px-3 py-1 rounded-full border border-eco-200/80 mb-2 shadow-xs">
          <Settings className="w-3.5 h-3.5 text-eco-700" />
          <span>Thiết lập tài khoản</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <span>Cài đặt tài khoản & Hồ sơ cá nhân</span>
          <span className="inline-flex items-center justify-center p-1 rounded-lg bg-eco-100/70 text-eco-700">
            <Sparkles className="w-4 h-4" />
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Quản lý thông tin liên hệ, mật khẩu bảo mật và danh sách người dùng bị chặn.
        </p>
      </div>

      {/* 1. PROFILE DETAILS FORM (UC03) */}
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_35px_-8px_rgba(16,185,129,0.08)] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-eco-100/70 text-eco-700">
              <User className="w-4 h-4" />
            </span>
            <span>Hồ sơ thành viên ReLoop</span>
          </h3>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
            ★ {currentUser.trustScore} điểm tín nhiệm
          </span>
        </div>

        {/* Avatar preview */}
        <div className="flex items-center gap-5 p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-slate-50/60 to-emerald-50/20 border border-slate-200/80">
          <img
            src={avatar}
            alt={fullName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-eco-500/80 shadow-sm flex-shrink-0"
          />
          <div className="flex-1 space-y-1.5 min-w-0">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Ảnh đại diện (URL)</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">Email đăng ký</label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full text-xs sm:text-sm font-medium bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
              Số điện thoại liên hệ <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
              Số Zalo liên kết (để mở deep link chat)
            </label>
            <input
              type="tel"
              value={zaloPhone}
              onChange={(e) => setZaloPhone(e.target.value)}
              placeholder="0901234567"
              className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Location */}
        <div className="p-5 bg-gradient-to-br from-slate-50 via-slate-50/60 to-emerald-50/20 rounded-2xl border border-slate-200/80 space-y-3.5">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
            <span className="p-1 rounded-lg bg-eco-100 text-eco-700">
              <MapPin className="w-4 h-4" />
            </span>
            <span>Địa chỉ cư trú & giao dịch mặc định</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tỉnh / Thành phố</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-eco-500/20 text-slate-800"
              >
                <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Quận / Huyện</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-eco-500/20 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phường / Xã</label>
              <input
                type="text"
                required
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-eco-500/20 text-slate-800"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
            Giới thiệu bản thân (Bio)
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Chia sẻ về sở thích trao đổi đồ cũ, phong cách sống xanh của bạn..."
            className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white transition-all text-slate-800 leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald hover:shadow-lg transition-all"
          >
            Lưu thay đổi hồ sơ
          </button>
        </div>
      </form>

      {/* 2. CHANGE PASSWORD FORM (UC04) */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_35px_-8px_rgba(16,185,129,0.08)] p-6 sm:p-8 space-y-5">
        <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-eco-100/70 text-eco-700">
            <KeyRound className="w-4 h-4" />
          </span>
          <span>Đổi mật khẩu bảo mật</span>
        </h3>

        {passwordError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2.5 font-semibold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{passwordError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">Nhập lại MK mới</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white text-slate-800"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald hover:shadow-lg transition-all"
          >
            Cập nhật mật khẩu mới
          </button>
        </div>
      </form>

      {/* 3. BLOCKED USERS LIST (UC04b) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_35px_-8px_rgba(16,185,129,0.08)] p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-rose-100 text-rose-600">
            <UserX className="w-4 h-4" />
          </span>
          <span>Danh sách người dùng bị chặn ({blockedUsers.length})</span>
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed">
          Người dùng trong danh sách chặn sẽ không thể gửi đề nghị đổi đồ hay gửi tin nhắn trong Hộp thư tới bạn.
        </p>

        {blockedUsers.length === 0 ? (
          <div className="p-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-center text-xs text-slate-400">
            Bạn chưa chặn người dùng nào.
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {blockedUsers.map((bu) => (
              <div
                key={bu.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={bu.avatar} alt={bu.fullName} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 flex-shrink-0" />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{bu.fullName}</h5>
                    <span className="text-[10px] text-slate-500 truncate block">{bu.province}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleBlockUser(bu.id)}
                  className="px-3.5 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl shadow-xs transition-colors flex-shrink-0"
                >
                  Bỏ chặn
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
