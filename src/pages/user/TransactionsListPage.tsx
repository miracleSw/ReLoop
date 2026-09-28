import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Calendar, MapPin, CheckCircle2, Clock, ArrowRight, ArrowRightLeft } from 'lucide-react';

export const TransactionsListPage: React.FC = () => {
  const { currentUser, transactions, products, users } = useApp();
  const [filterTab, setFilterTab] = useState<string>('ALL');

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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
          Lịch hẹn & Giao dịch gặp mặt
        </h1>
        <p className="text-xs sm:text-sm text-sand-600 mt-1">
          Theo dõi tiến trình các cuộc hẹn bàn giao đồ trực tiếp ngoài đời và xác nhận 2 chiều.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-sand-200 text-xs scrollbar-none">
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
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterTab === tab.id
                ? 'bg-eco-800 text-white shadow-soft'
                : 'bg-white text-charcoal-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 rounded-full ${filterTab === tab.id ? 'bg-white/20' : 'bg-sand-100 text-sand-600'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Transactions List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-sand-200 space-y-3">
          <Calendar className="w-12 h-12 text-sand-300 mx-auto" />
          <h3 className="text-base font-bold text-charcoal-900">Chưa có giao dịch nào</h3>
          <p className="text-xs text-sand-600">
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
                className="bg-white rounded-3xl border border-sand-200 p-5 sm:p-6 shadow-soft hover:shadow-card transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {targetProd && (
                    <img
                      src={targetProd.images[0]}
                      alt={targetProd.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-sand-200 flex-shrink-0"
                    />
                  )}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={tx.status} size="sm" />
                      <span className="text-[11px] text-sand-400">Mã: #{tx.id}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-charcoal-900 truncate">
                      {targetProd?.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-sand-600">
                      <span>Đối tác: <strong className="text-charcoal-800">{partner?.fullName}</strong></span>
                      <span>•</span>
                      <span>Địa điểm: <strong className="text-charcoal-800">{tx.appointmentLocation}</strong></span>
                      <span>•</span>
                      <span>Hẹn: <strong>{new Date(tx.appointmentTime).toLocaleDateString('vi-VN')}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-sand-100">
                  <Link
                    to={`/user/transactions/${tx.id}`}
                    className="px-5 py-2.5 bg-eco-800 hover:bg-eco-700 text-white rounded-xl text-xs font-bold shadow-soft flex items-center gap-1.5 transition-all"
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
