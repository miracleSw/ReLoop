import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { User } from '../../types';
import {
  Users,
  Search,
  Lock,
  Unlock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  X,
  PhoneCall
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { users, currentUser, lockUser, unlockUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'LOCKED'>('ALL');

  // Lock user modal state
  const [lockingUser, setLockingUser] = useState<User | null>(null);
  const [lockDays, setLockDays] = useState<number>(30);
  const [lockReason, setLockReason] = useState('Vi phạm điều khoản cộng đồng ReLoop');
  const [errorMsg, setErrorMsg] = useState('');

  // Selected user detail drawer
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter((u) => {
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = u.fullName.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone.includes(q);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  const handleExecuteLock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockingUser) return;

    // BR-03: Admin cannot lock self
    if (lockingUser.id === currentUser?.id) {
      setErrorMsg('Bạn không thể tự khóa tài khoản của chính mình.');
      return;
    }

    lockUser(lockingUser.id, lockDays, lockReason);
    setLockingUser(null);
    setErrorMsg('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal-900">
            Quản lý người dùng
          </h1>
          <p className="text-xs text-sand-600 mt-0.5">
            Tra cứu thông tin thành viên, chỉ số uy tín và quản lý trạng thái tài khoản.
          </p>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-soft min-w-0 max-w-full">
        <div className="relative w-full lg:w-80 flex-shrink-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-500"
          />
          <Search className="w-4 h-4 text-sand-400 absolute left-3 top-3 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1 sm:pb-0 w-full lg:w-auto scrollbar-none min-w-0 max-w-full">
          <span className="text-slate-500 font-medium flex-shrink-0">Trạng thái:</span>
          {(['ALL', 'ACTIVE', 'LOCKED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-eco-700 to-eco-600 text-white shadow-glow-emerald'
                  : 'bg-slate-100 text-charcoal-700 hover:bg-slate-200/70'
              }`}
            >
              {st === 'ALL' ? 'Tất cả' : st === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
            </button>
          ))}
        </div>
      </div>

      {/* USER TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-800">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Thành viên</th>
                <th className="py-3.5 px-4">Khu vực</th>
                <th className="py-3.5 px-4 text-center">Uy tín</th>
                <th className="py-3.5 px-4 text-center">Giao dịch</th>
                <th className="py-3.5 px-4">Vai trò</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isCurrentAdmin = u.id === currentUser?.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User info */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.fullName}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 shadow-subtle flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="font-bold text-charcoal-900 hover:text-eco-600 text-left truncate block transition-colors"
                          >
                            {u.fullName}
                          </button>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {u.district}, {u.province}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-extrabold text-emerald-800 bg-emerald-100/80 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px]">
                        ★ {u.trustScore}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-charcoal-800">
                      {u.totalTransactions}
                    </td>

                    <td className="py-3.5 px-4">
                      {u.role === 'ADMIN' ? (
                        <span className="font-bold text-xs text-eco-900 bg-eco-100 border border-eco-200/80 px-2.5 py-0.5 rounded-full">
                          ADMIN
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium">User</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={u.status} size="sm" />
                      {u.status === 'LOCKED' && u.lockedUntil && (
                        <div className="text-[10px] text-rose-600 mt-0.5">
                          Đến {new Date(u.lockedUntil).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.status === 'LOCKED' ? (
                          <button
                            onClick={() => unlockUser(u.id)}
                            className="px-3 py-1.5 bg-gradient-to-r from-eco-600 to-teal-600 hover:from-eco-500 hover:to-teal-500 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-soft transition-all"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Mở khóa</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (isCurrentAdmin) {
                                alert('Bạn không thể tự khóa chính tài khoản của mình.');
                                return;
                              }
                              setLockingUser(u);
                            }}
                            disabled={isCurrentAdmin}
                            className="px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-700 disabled:opacity-30 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Khóa</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOCK USER MODAL (UC25) */}
      {lockingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-elevated border border-slate-200 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-subtle">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-charcoal-900 text-center">
              Khóa tài khoản: {lockingUser.fullName}
            </h3>

            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 border border-rose-200">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleExecuteLock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Thời hạn khóa tài khoản
                </label>
                <select
                  value={lockDays}
                  onChange={(e) => setLockDays(parseInt(e.target.value))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500"
                >
                  <option value={7}>Tạm khóa 7 ngày</option>
                  <option value={30}>Tạm khóa 30 ngày (Gian lận, bùng hẹn)</option>
                  <option value={3650}>Khóa vĩnh viễn (Lừa đảo, hàng cấm nghiêm trọng)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Lý do xử lý chế tài
                </label>
                <textarea
                  rows={3}
                  required
                  value={lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLockingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/25"
                >
                  Xác nhận Khóa tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER DETAIL DRAWER */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 sm:p-8 overflow-y-auto space-y-6 animate-slide-up relative border-l border-slate-200 shadow-elevated">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-charcoal-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-subtle"
              />
              <div>
                <h3 className="text-lg font-bold text-charcoal-900">{selectedUser.fullName}</h3>
                <span className="text-xs text-slate-500">{selectedUser.email}</span>
                <div className="mt-1">
                  <StatusBadge status={selectedUser.status} size="sm" />
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl text-xs border border-slate-200/80">
              <div>
                <span className="text-slate-500 block font-medium">Số điện thoại:</span>
                <span className="font-semibold text-charcoal-800">{selectedUser.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Khu vực:</span>
                <span className="font-semibold text-charcoal-800">
                  {selectedUser.ward}, {selectedUser.district}, {selectedUser.province}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Điểm uy tín:</span>
                <span className="font-extrabold text-emerald-800">{selectedUser.trustScore}/100</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Số giao dịch gặp mặt hoàn tất:</span>
                <span className="font-bold text-charcoal-800">{selectedUser.totalTransactions} cuộc hẹn</span>
              </div>
            </div>

            {selectedUser.lockReason && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
                <span className="font-bold block">Lý do bị khóa:</span>
                <p className="mt-1">{selectedUser.lockReason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
