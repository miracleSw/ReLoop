import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BarterRequest, BuyRequest } from '../../types';
import {
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
  Tag,
  MapPin,
  DollarSign,
  Inbox,
  Send,
  ArrowRight
} from 'lucide-react';

export const ExchangeManagementPage: React.FC = () => {
  const {
    currentUser,
    barterRequests,
    buyRequests,
    products,
    users,
    acceptBarterRequest,
    rejectBarterRequest,
    cancelBarterRequest,
    acceptBuyRequest,
    rejectBuyRequest,
    cancelBuyRequest,
  } = useApp();

  const [offerKind, setOfferKind] = useState<'BARTER' | 'BUY'>('BARTER');
  const [activeMainTab, setActiveMainTab] = useState<'RECEIVED' | 'SENT'>('RECEIVED');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Confirmation modal state
  const [confirmAcceptBarter, setConfirmAcceptBarter] = useState<BarterRequest | null>(null);
  const [confirmAcceptBuy, setConfirmAcceptBuy] = useState<BuyRequest | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Vui lòng đăng nhập</h2>
        <Link to="/login" className="mt-4 inline-block text-eco-700 text-xs font-semibold hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // Filter Barter requests
  const relevantBarter = barterRequests.filter((r) =>
    activeMainTab === 'RECEIVED' ? r.receiverId === currentUser.id : r.senderId === currentUser.id
  );
  const filteredBarter = relevantBarter.filter((r) =>
    statusFilter === 'ALL' ? true : r.status === statusFilter
  );

  // Filter Buy requests
  const relevantBuy = buyRequests.filter((r) =>
    activeMainTab === 'RECEIVED' ? r.receiverId === currentUser.id : r.senderId === currentUser.id
  );
  const filteredBuy = relevantBuy.filter((r) =>
    statusFilter === 'ALL' ? true : r.status === statusFilter
  );

  const pendingReceivedBarterCount = barterRequests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'PENDING'
  ).length;
  const pendingReceivedBuyCount = buyRequests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'PENDING'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Quản lý đề nghị giao dịch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi, thương lượng và phản hồi các đề nghị trao đổi hoặc mua bán sản phẩm.
          </p>
        </div>
      </div>

      {/* 2. OFFER KIND TOGGLE (BARTER VS BUY PROPOSALS) */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 border border-slate-200 rounded-2xl max-w-md shadow-xs">
        <button
          onClick={() => setOfferKind('BARTER')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            offerKind === 'BARTER'
              ? 'bg-white text-eco-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className={`w-4 h-4 ${offerKind === 'BARTER' ? 'text-eco-600' : 'text-slate-400'}`} />
          <span>Đề nghị Đổi đồ</span>
          {pendingReceivedBarterCount > 0 && (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold shadow-xs">
              {pendingReceivedBarterCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setOfferKind('BUY')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            offerKind === 'BUY'
              ? 'bg-white text-clay-700 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tag className={`w-4 h-4 ${offerKind === 'BUY' ? 'text-clay-600' : 'text-slate-400'}`} />
          <span>Đề xuất Mua trực tiếp</span>
          {pendingReceivedBuyCount > 0 && (
            <span className="text-[10px] bg-clay-100 text-clay-700 px-2 py-0.5 rounded-full font-extrabold shadow-xs">
              {pendingReceivedBuyCount}
            </span>
          )}
        </button>
      </div>

      {/* 3. MAIN TABS (Received vs Sent) */}
      <div className="flex items-center gap-4 border-b border-slate-200 overflow-x-auto scrollbar-none min-w-0 max-w-full pb-0.5">
        <button
          onClick={() => setActiveMainTab('RECEIVED')}
          className={`pb-3.5 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
            activeMainTab === 'RECEIVED'
              ? 'border-eco-600 text-eco-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Đề nghị nhận được (Cho bài đăng của tôi)</span>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
            activeMainTab === 'RECEIVED' ? 'bg-eco-100 text-eco-800' : 'bg-slate-100 text-slate-600'
          }`}>
            {offerKind === 'BARTER'
              ? barterRequests.filter((r) => r.receiverId === currentUser.id).length
              : buyRequests.filter((r) => r.receiverId === currentUser.id).length}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('SENT')}
          className={`pb-3.5 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
            activeMainTab === 'SENT'
              ? 'border-eco-600 text-eco-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Đề nghị tôi đã gửi đi</span>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
            activeMainTab === 'SENT' ? 'bg-eco-100 text-eco-800' : 'bg-slate-100 text-slate-600'
          }`}>
            {offerKind === 'BARTER'
              ? barterRequests.filter((r) => r.senderId === currentUser.id).length
              : buyRequests.filter((r) => r.senderId === currentUser.id).length}
          </span>
        </button>
      </div>

      {/* 4. STATUS SUB-FILTER CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs min-w-0 max-w-full">
        {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'ON_HOLD'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              statusFilter === st
                ? 'bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 text-white shadow-glow-emerald'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-xs'
            }`}
          >
            {st === 'ALL'
              ? 'Tất cả trạng thái'
              : st === 'PENDING'
              ? 'Chờ duyệt'
              : st === 'ACCEPTED'
              ? 'Đã chấp thuận'
              : st === 'REJECTED'
              ? 'Đã từ chối'
              : 'Trong hàng chờ (ON_HOLD)'}
          </button>
        ))}
      </div>

      {/* 5A. RENDER BARTER OFFERS */}
      {offerKind === 'BARTER' && (
        <div className="space-y-6">
          {filteredBarter.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                <ArrowRightLeft className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Không có đề nghị đổi đồ nào</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hiện chưa có đề nghị trao đổi sản phẩm nào phù hợp với bộ lọc này.
              </p>
            </div>
          ) : (
            filteredBarter.map((req) => {
              const targetProd = products.find((p) => p.id === req.targetProductId);
              const offeredProd = products.find((p) => p.id === req.offeredProductId);
              const otherUser = users.find(
                (u) => u.id === (activeMainTab === 'RECEIVED' ? req.senderId : req.receiverId)
              );

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_-6px_rgba(16,185,129,0.12)] transition-all p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 relative overflow-hidden w-full max-w-full"
                >
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <StatusBadge status={req.status} size="sm" />
                      <span className="text-xs font-semibold text-slate-500">Mã: #{req.id}</span>
                      <span className="text-slate-300 hidden sm:inline">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(req.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    {otherUser && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {activeMainTab === 'RECEIVED' ? 'Người gửi đề nghị:' : 'Người nhận đề nghị:'}
                        </span>
                        <Link
                          to={`/sellers/${otherUser.id}`}
                          className="flex items-center gap-2 hover:text-eco-700 transition-colors bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/80"
                        >
                          <img
                            src={otherUser.avatar}
                            alt={otherUser.fullName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-slate-800">
                            {otherUser.fullName}
                          </span>
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-extrabold">
                            ★ {otherUser.trustScore}đ
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* VISUAL COMPARISON: ITEM A <-> ITEM B + CASH */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-center bg-gradient-to-br from-slate-50 via-slate-50/60 to-emerald-50/20 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 w-full max-w-full">
                    {/* Item 1: Offered Item */}
                    <div className="lg:col-span-5 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0 w-full">
                      {offeredProd ? (
                        <>
                          <img
                            src={offeredProd.images[0]}
                            alt={offeredProd.title}
                            className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-eco-700 tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {activeMainTab === 'RECEIVED' ? 'Món đồ họ muốn đổi:' : 'Món đồ của bạn:'}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              {offeredProd.title}
                            </h4>
                            <div className="text-[11px] text-slate-500 mt-1">
                              Tình trạng: <span className="font-semibold text-slate-700">{offeredProd.condition}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">Món đồ không còn khả dụng</span>
                      )}
                    </div>

                    {/* Center Swap Arrow + Compensation badge */}
                    <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 lg:py-0 min-w-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-eco-700 to-teal-500 text-white flex items-center justify-center shadow-glow-emerald flex-shrink-0">
                        <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      {req.compensationAmount > 0 && (
                        <div className="mt-2 text-center max-w-full">
                          <span className="text-[10px] font-black text-clay-700 bg-clay-50 border border-clay-200 px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-xs inline-block truncate max-w-full">
                            + {req.compensationAmount.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Item 2: Target Item */}
                    <div className="lg:col-span-5 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0 w-full">
                      {targetProd ? (
                        <>
                          <img
                            src={targetProd.images[0]}
                            alt={targetProd.title}
                            className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                              {activeMainTab === 'RECEIVED' ? 'Món đồ của bạn:' : 'Món đồ mục tiêu:'}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              {targetProd.title}
                            </h4>
                            <div className="text-[11px] text-slate-500 mt-1">
                              Tình trạng: <span className="font-semibold text-slate-700">{targetProd.condition}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">Sản phẩm không tồn tại</span>
                      )}
                    </div>
                  </div>

                  {/* Note message */}
                  {req.note && (
                    <div className="p-3.5 sm:p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-eco-600" />
                        Lời nhắn thương lượng:
                      </span>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line italic">
                        "{req.note}"
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  {activeMainTab === 'RECEIVED' && req.status === 'PENDING' && (
                    <div className="pt-2 flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                      <button
                        onClick={() => rejectBarterRequest(req.id, 'Đã tìm được đề nghị phù hợp hơn')}
                        className="px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                      >
                        Từ chối đề nghị
                      </button>

                      <button
                        onClick={() => setConfirmAcceptBarter(req)}
                        className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-glow-emerald hover:shadow-lg transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Chấp nhận trao đổi</span>
                      </button>
                    </div>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/90 shadow-sm">
                      <div className="flex items-center gap-2.5 text-emerald-950 font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>Đề nghị đã được chấp thuận! Lịch hẹn gặp mặt đã được khởi tạo.</span>
                      </div>
                      <Link
                        to="/user/transactions"
                        className="px-4 py-2 bg-gradient-to-r from-eco-700 to-teal-600 text-white font-bold text-xs rounded-xl shadow-glow-emerald hover:shadow-lg whitespace-nowrap transition-all"
                      >
                        Xem hành trình gặp mặt →
                      </Link>
                    </div>
                  )}

                  {activeMainTab === 'SENT' && req.status === 'PENDING' && (
                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => cancelBarterRequest(req.id)}
                        className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-300 rounded-xl transition-colors"
                      >
                        Hủy đề nghị của tôi
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 5B. RENDER BUY PROPOSALS */}
      {offerKind === 'BUY' && (
        <div className="space-y-6">
          {filteredBuy.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                <Tag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Không có đề xuất mua nào</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hiện chưa có đề xuất mua trực tiếp nào phù hợp với bộ lọc này.
              </p>
            </div>
          ) : (
            filteredBuy.map((req) => {
              const targetProd = products.find((p) => p.id === req.targetProductId);
              const otherUser = users.find(
                (u) => u.id === (activeMainTab === 'RECEIVED' ? req.senderId : req.receiverId)
              );

              const priceDiff = targetProd?.price ? req.offeredPrice - targetProd.price : 0;

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_-6px_rgba(16,185,129,0.12)] transition-all p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 relative overflow-hidden w-full max-w-full"
                >
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <StatusBadge status={req.status} size="sm" />
                      <span className="text-xs font-semibold text-slate-500">Mã đề xuất: #{req.id}</span>
                      <span className="text-slate-300 hidden sm:inline">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(req.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    {otherUser && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {activeMainTab === 'RECEIVED' ? 'Người gửi đề xuất:' : 'Người bán:'}
                        </span>
                        <Link
                          to={`/sellers/${otherUser.id}`}
                          className="flex items-center gap-2 hover:text-eco-700 transition-colors bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/80"
                        >
                          <img
                            src={otherUser.avatar}
                            alt={otherUser.fullName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-slate-800">
                            {otherUser.fullName}
                          </span>
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-extrabold">
                            ★ {otherUser.trustScore}đ
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* BUY PROPOSAL DETAILS: TARGET PRODUCT + PROPOSED PRICE */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 items-center bg-gradient-to-br from-slate-50 via-slate-50/60 to-amber-50/20 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 w-full max-w-full">
                    {/* Target Product */}
                    <div className="md:col-span-6 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0 w-full">
                      {targetProd ? (
                        <>
                          <img
                            src={targetProd.images[0]}
                            alt={targetProd.title}
                            className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                              Sản phẩm bài đăng:
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              {targetProd.title}
                            </h4>
                            <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                              <span>Giá niêm yết:</span>
                              <strong className="text-slate-800 font-bold whitespace-nowrap">
                                {targetProd.price?.toLocaleString('vi-VN')}₫
                              </strong>
                            </div>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">Sản phẩm không tồn tại</span>
                      )}
                    </div>

                    {/* Proposed Price Highlight */}
                    <div className="md:col-span-6 bg-gradient-to-br from-clay-50 to-amber-50/40 p-3 sm:p-4 rounded-2xl border border-clay-200/80 shadow-sm space-y-1.5 w-full">
                      <span className="text-[10px] uppercase font-bold text-clay-800 tracking-wider flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-clay-600 flex-shrink-0" />
                        Mức giá đề xuất mua:
                      </span>
                      <div className="flex flex-wrap items-baseline gap-2 sm:gap-2.5">
                        <span className="text-xl sm:text-2xl font-black text-clay-700 tracking-tight whitespace-nowrap">
                          {req.offeredPrice.toLocaleString('vi-VN')}₫
                        </span>
                        {priceDiff !== 0 && (
                          <span
                            className={`text-[10px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                              priceDiff > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {priceDiff > 0 ? `+${priceDiff.toLocaleString('vi-VN')}₫` : `${priceDiff.toLocaleString('vi-VN')}₫`} so với giá gốc
                          </span>
                        )}
                      </div>
                      {req.meetupLocationPreference && (
                        <div className="text-xs text-slate-700 flex items-center gap-1.5 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-eco-700 flex-shrink-0" />
                          <span className="truncate">Điểm hẹn: <strong className="font-semibold text-slate-900">{req.meetupLocationPreference}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Note message */}
                  {req.note && (
                    <div className="p-3.5 sm:p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-eco-600" />
                        Lời nhắn từ người mua:
                      </span>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line italic">
                        "{req.note}"
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  {activeMainTab === 'RECEIVED' && req.status === 'PENDING' && (
                    <div className="pt-2 flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                      <button
                        onClick={() => rejectBuyRequest(req.id, 'Mức giá chưa phù hợp')}
                        className="px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                      >
                        Từ chối đề xuất
                      </button>

                      <button
                        onClick={() => setConfirmAcceptBuy(req)}
                        className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-clay-600 to-clay-700 hover:from-clay-500 hover:to-clay-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Chấp nhận đề xuất mua</span>
                      </button>
                    </div>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/90 shadow-sm">
                      <div className="flex items-center gap-2.5 text-emerald-950 font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>Đề xuất đã được chấp thuận! Lịch hẹn gặp mặt đã được khởi tạo.</span>
                      </div>
                      <Link
                        to="/user/transactions"
                        className="px-4 py-2 bg-gradient-to-r from-eco-700 to-teal-600 text-white font-bold text-xs rounded-xl shadow-glow-emerald hover:shadow-lg whitespace-nowrap transition-all"
                      >
                        Xem hành trình gặp mặt →
                      </Link>
                    </div>
                  )}

                  {activeMainTab === 'SENT' && req.status === 'PENDING' && (
                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => cancelBuyRequest(req.id)}
                        className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-300 rounded-xl transition-colors"
                      >
                        Hủy đề xuất của tôi
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* CONFIRMATION POPUP FOR ACCEPT BARTER (BR 15_1) */}
      {confirmAcceptBarter && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200/90 animate-slide-up space-y-5">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                Xác nhận Chấp nhận Đề nghị Đổi đồ?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Khi chấp nhận đề nghị này, bài đăng của bạn sẽ chuyển sang trạng thái <strong className="text-slate-900">Đã hẹn gặp</strong> và hệ thống sẽ tự động tạo lịch hẹn gặp với người đổi. Các đề nghị khác sẽ chuyển sang hàng chờ. Bạn có đồng ý không?
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmAcceptBarter(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cân nhắc lại
              </button>
              <button
                type="button"
                onClick={() => {
                  acceptBarterRequest(confirmAcceptBarter.id);
                  setConfirmAcceptBarter(null);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald hover:shadow-lg transition-all"
              >
                Đồng ý chấp nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP FOR ACCEPT BUY PROPOSAL */}
      {confirmAcceptBuy && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200/90 animate-slide-up space-y-5">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                Xác nhận Chấp nhận Đề xuất Mua?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bạn đồng ý bán với mức giá{' '}
                <strong className="text-clay-700 font-black">
                  {confirmAcceptBuy.offeredPrice.toLocaleString('vi-VN')}₫
                </strong>
                . Bài đăng sẽ chuyển sang <strong className="text-slate-900">Đã hẹn gặp</strong>, mở thông tin liên hệ và tạo lịch hẹn gặp mặt trực tiếp.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmAcceptBuy(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cân nhắc lại
              </button>
              <button
                type="button"
                onClick={() => {
                  acceptBuyRequest(confirmAcceptBuy.id);
                  setConfirmAcceptBuy(null);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-clay-600 to-clay-700 hover:from-clay-500 hover:to-clay-600 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                Đồng ý bán & Hẹn gặp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
