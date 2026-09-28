import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, Clock, ShieldCheck, ArrowRightLeft, Calendar } from 'lucide-react';

export const NotificationCenterPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = notifications.filter((n) => {
    if (filterType === 'ALL') return true;
    return n.type === filterType;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
            Trung tâm thông báo (Notification Center)
          </h1>
          <p className="text-xs sm:text-sm text-sand-600 mt-1">
            Cập nhật biến động các đề nghị giao dịch, nhắc nhở lịch hẹn và thông báo hệ thống.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="text-xs font-semibold text-eco-800 hover:underline"
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-sand-200 text-xs">
        {[
          { id: 'ALL', label: 'Tất cả thông báo' },
          { id: 'OFFER', label: 'Đề nghị Mua/Đổi' },
          { id: 'TRANSACTION', label: 'Lịch hẹn gặp' },
          { id: 'REVIEW', label: 'Đánh giá uy tín' },
          { id: 'SYSTEM', label: 'Hệ thống ReLoop' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-eco-800 text-white shadow-soft'
                : 'bg-white text-charcoal-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-card divide-y divide-sand-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-sand-500">
            Không có thông báo nào trong mục này.
          </div>
        ) : (
          filtered.map((n) => (
            <Link
              key={n.id}
              to={n.link}
              onClick={() => markNotificationRead(n.id)}
              className={`p-5 flex items-start gap-4 hover:bg-sand-50 transition-colors ${
                !n.isRead ? 'bg-eco-50/40' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-eco-100 text-eco-800 flex items-center justify-center flex-shrink-0">
                {n.type === 'OFFER' ? (
                  <ArrowRightLeft className="w-5 h-5" />
                ) : n.type === 'TRANSACTION' ? (
                  <Calendar className="w-5 h-5" />
                ) : n.type === 'REVIEW' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-charcoal-900">{n.title}</h4>
                  <span className="text-[10px] text-sand-400">
                    {new Date(n.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <p className="text-xs text-sand-700 mt-1 leading-relaxed">{n.message}</p>
              </div>

              {!n.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-clay-500 flex-shrink-0 mt-2" />
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
