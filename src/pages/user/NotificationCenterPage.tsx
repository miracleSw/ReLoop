import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, Clock, ShieldCheck, ArrowRightLeft, Calendar, Sparkles, CheckCheck, Inbox } from 'lucide-react';

export const NotificationCenterPage: React.FC = () => {
  const { notifications, currentUser, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');

  const userNotifications = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id)
    : [];

  const filtered = userNotifications.filter((n) => {
    if (filterType === 'ALL') return true;
    return n.type === filterType;
  });

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Thông báo</span>
            {unreadCount > 0 && (
              <span className="shrink-0 whitespace-nowrap text-xs font-black bg-gradient-to-r from-clay-500 to-rose-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                {unreadCount} mới
              </span>
            )}
          </h1>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-eco-700 hover:bg-slate-50 shadow-xs transition-all"
        >
          <CheckCheck className="w-4 h-4 text-eco-600" />
          <span className="whitespace-nowrap">Đánh dấu đã đọc</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80 text-xs scrollbar-none min-w-0 max-w-full">
        {[
          { id: 'ALL', label: 'Tất cả' },
          { id: 'OFFER', label: 'Đề nghị' },
          { id: 'TRANSACTION', label: 'Lịch hẹn' },
          { id: 'REVIEW', label: 'Đánh giá' },
          { id: 'SYSTEM', label: 'Hệ thống' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              filterType === tab.id
                ? 'bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 text-white shadow-glow-emerald'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-xs'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_35px_-8px_rgba(16,185,129,0.08)] divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Không có thông báo nào</h3>
            <p className="text-xs text-slate-500">
              Bạn chưa có thông báo nào thuộc danh mục này.
            </p>
          </div>
        ) : (
          filtered.map((n) => {
            const iconBadge =
              n.type === 'OFFER' ? (
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
              ) : n.type === 'TRANSACTION' ? (
                <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Calendar className="w-5 h-5" />
                </div>
              ) : n.type === 'REVIEW' ? (
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Bell className="w-5 h-5" />
                </div>
              );

            return (
              <Link
                key={n.id}
                to={n.link}
                onClick={() => markNotificationRead(n.id)}
                className={`p-5 flex items-start gap-4 transition-all hover:bg-slate-50/80 relative group ${
                  !n.isRead
                    ? 'bg-gradient-to-r from-eco-50/50 via-teal-50/15 to-transparent border-l-4 border-eco-500'
                    : 'border-l-4 border-transparent'
                }`}
              >
                {iconBadge}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs sm:text-sm font-black transition-colors ${!n.isRead ? 'text-slate-900 group-hover:text-eco-700' : 'text-slate-800'}`}>
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-300" />
                      {new Date(n.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                </div>

                {!n.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-clay-500 ring-4 ring-clay-100 flex-shrink-0 mt-2" />
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};
