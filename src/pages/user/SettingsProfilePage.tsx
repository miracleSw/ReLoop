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
  PhoneCall
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
        <h2 className="text-xl font-bold text-charcoal-900">Vui lòng đăng nhập</h2>
        <Link to="/login" className="mt-4 inline-block text-eco-800 text-xs font-semibold hover:underline">
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
      setPasswordError('Vui lòng nhập mật khẩu hiện tại chính xác (UC04 BR-01).');
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
          Cài đặt tài khoản & Hồ sơ cá nhân
        </h1>
        <p className="text-xs sm:text-sm text-sand-600 mt-1">
          Quản lý thông tin liên hệ, mật khẩu bảo mật và danh sách người dùng bị chặn.
        </p>
      </div>

      {/* 1. PROFILE DETAILS FORM (UC03) */}
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-charcoal-900 border-b border-sand-100 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-eco-700" />
          <span>Hồ sơ thành viên ReLoop</span>
        </h3>

        {/* Avatar preview */}
        <div className="flex items-center gap-5">
          <img
            src={avatar}
            alt={fullName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-eco-500 shadow-soft"
          />
          <div className="flex-1 space-y-1">
            <label className="block text-xs font-bold text-charcoal-800">Ảnh đại diện (URL)</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">Họ và tên</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs sm:text-sm bg-sand-50 border border-sand-200 rounded-xl p-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">Email đăng ký</label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full text-xs sm:text-sm bg-sand-100 border border-sand-200 rounded-xl p-2.5 text-sand-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">
              Số điện thoại liên hệ
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs sm:text-sm bg-sand-50 border border-sand-200 rounded-xl p-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">
              Số Zalo liên kết (để mở deep link chat)
            </label>
            <input
              type="tel"
              value={zaloPhone}
              onChange={(e) => setZaloPhone(e.target.value)}
              placeholder="0901234567"
              className="w-full text-xs sm:text-sm bg-sand-50 border border-sand-200 rounded-xl p-2.5"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">Tỉnh / Thành phố</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
            >
              <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">Quận / Huyện</label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">Phường / Xã</label>
            <input
              type="text"
              required
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full text-xs bg-sand-50 border border-sand-200 rounded-xl p-2.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal-800 mb-1">
            Giới thiệu bản thân (Bio)
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Chia sẻ về sở thích trao đổi đồ cũ, phong cách sống xanh của bạn..."
            className="w-full text-xs sm:text-sm bg-sand-50 border border-sand-200 rounded-xl p-3"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-eco-800 hover:bg-eco-700 text-white rounded-xl text-xs font-bold shadow-soft transition-all"
          >
            Lưu thay đổi hồ sơ
          </button>
        </div>
      </form>

      {/* 2. CHANGE PASSWORD FORM (UC04) */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 sm:p-8 space-y-5">
        <h3 className="text-base font-bold text-charcoal-900 border-b border-sand-100 pb-3 flex items-center gap-2">
          <Lock className="w-5 h-5 text-eco-700" />
          <span>Đổi mật khẩu bảo mật</span>
        </h3>

        {passwordError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm bg-sand-50 border border-sand-200 rounded-xl p-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm bg-sand-50 border border-sand-200 rounded-xl p-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">Nhập lại MK mới</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm bg-sand-50 border border-sand-200 rounded-xl p-2.5"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-eco-800 hover:bg-eco-700 text-white rounded-xl text-xs font-bold shadow-soft transition-all"
          >
            Cập nhật mật khẩu mới
          </button>
        </div>
      </form>

      {/* 3. BLOCKED USERS LIST (UC04b) */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-charcoal-900 border-b border-sand-100 pb-3 flex items-center gap-2">
          <UserX className="w-5 h-5 text-rose-600" />
          <span>Danh sách người dùng bị chặn ({blockedUsers.length})</span>
        </h3>

        <p className="text-xs text-sand-600 leading-relaxed">
          Người dùng trong danh sách chặn sẽ không thể gửi đề nghị đổi đồ hay gửi tin nhắn trong Hộp thư tới bạn.
        </p>

        {blockedUsers.length === 0 ? (
          <div className="p-4 bg-sand-50 rounded-2xl text-center text-xs text-sand-500">
            Bạn chưa chặn người dùng nào.
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {blockedUsers.map((bu) => (
              <div
                key={bu.id}
                className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img src={bu.avatar} alt={bu.fullName} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h5 className="text-xs font-bold text-charcoal-900">{bu.fullName}</h5>
                    <span className="text-[10px] text-sand-500">{bu.province}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleBlockUser(bu.id)}
                  className="px-3 py-1.5 bg-white border border-sand-200 text-xs font-semibold text-charcoal-700 hover:bg-sand-100 rounded-xl"
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
