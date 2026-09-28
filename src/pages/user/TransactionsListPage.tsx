import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Calendar, MapPin, CheckCircle2, Clock, ArrowRight, ArrowRightLeft, Sparkles, Compass } from 'lucide-react';

export const TransactionsListPage: React.FC = () => {
  const { currentUser, transactions, products, users } = useApp();
  const [filterTab, setFilterTab] = useState<string>('ALL');

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

  // Transactions where current user is buyer or seller
  const myTransactions = transactions.filter(
    (t) => t.buyerId === currentUser.id || t.sellerId === currentUser.id
  );

  const filtered = myTransactions.filter((t) => {
    if (filterTab === 'ALL') return true;
    return t.status === filterTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-eco-800 uppercase tracking-wider bg-eco-100/70 px-3 py-1 rounded-full border border-eco-200/80 mb-2 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-eco-700" />
          <span>Theo dõi cuộc hẹn trực tiếp</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <span>Lịch hẹn & Giao dịch gặp mặt</span>
          <span className="inline-flex items-center justify-center p-1 rounded-lg bg-eco-100/70 text-eco-700">
            <Sparkles className="w-4 h-4" />
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Theo dõi tiến trình các cuộc hẹn bàn giao đồ trực tiếp ngoài đời và xác nhận 2 chiều.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80 text-xs scrollbar-none min-w-0 max-w-full">
        {[
          { id: 'ALL', label: 'Tất cả cuộc hẹn', count: myTransactions.length },
          {
            id: 'APPOINTED',
            label: 'Đã lên lịch (APPOINTED)',
            count: myTransactions.filter((t) => t.status === 'APPOINTED').length,
          },
          {
            id: 'COMPLETED',
            label: 'Hoàn tất thành công (COMPLETED)',
            count: myTransactions.filter((t) => t.status === 'COMPLETED').length,
          },
          {
            id: 'CANCELLED',
            label: 'Đã hủy (CANCELLED)',
            count: myTransactions.filter((t) => t.status === 'CANCELLED').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
              filterTab === tab.id
                ? 'bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 text-white shadow-glow-emerald'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-xs'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${filterTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Transactions List */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Chưa có giao dịch nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Khi bạn hoặc đối phương chấp nhận một đề nghị trao đổi / mua bán, lịch hẹn sẽ hiển thị tại đây.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((tx) => {
            const isBuyer = tx.buyerId === currentUser.id;
            const partner = users.find((u) => u.id === (isBuyer ? tx.sellerId : tx.buyerId));
            const targetProd = products.find((p) => p.id === tx.productId);

            return (
              <div
                key={tx.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_-6px_rgba(16,185,129,0.1)] transition-all flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-5 group w-full max-w-full overflow-hidden"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 w-full max-w-full">
                  {targetProd && (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-2xl border border-slate-200 flex-shrink-0 bg-slate-50">
                      <img
                        src={targetProd.images[0]}
                        alt={targetProd.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={tx.status} size="sm" />
                      <span className="text-[11px] font-semibold text-slate-400">Mã: #{tx.id}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                      {targetProd?.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 font-medium">
                      <span>Đối tác: <strong className="text-slate-800 font-bold">{partner?.fullName}</strong></span>
                      <span className="text-slate-300 hidden sm:inline">•</span>
                      <span className="flex items-center gap-1 min-w-0 max-w-full">
                        <Compass className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">Địa điểm: <strong className="text-slate-800 font-bold">{tx.appointmentLocation}</strong></span>
                      </span>
                      <span className="text-slate-300 hidden sm:inline">•</span>
                      <span className="whitespace-nowrap">Hẹn: <strong className="text-slate-800 font-bold">{new Date(tx.appointmentTime).toLocaleDateString('vi-VN')}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                  <Link
                    to={`/user/transactions/${tx.id}`}
                    className="w-full md:w-auto justify-center px-5 py-2.5 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald hover:shadow-lg flex items-center gap-2 transition-all"
                  >
                    <span>Xem hành trình chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
