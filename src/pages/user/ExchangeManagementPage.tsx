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
  DollarSign
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
        <h2 className="text-xl font-bold text-charcoal-900">Vui lòng đăng nhập</h2>
        <Link to="/login" className="mt-4 inline-block text-eco-800 text-xs font-semibold hover:underline">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-eco-700 uppercase tracking-wider bg-eco-50 px-3 py-1 rounded-full border border-eco-200 mb-2">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Trung tâm quản lý thương lượng & đề nghị</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
            Quản lý Đề nghị & Đề xuất Giao dịch
          </h1>
          <p className="text-xs sm:text-sm text-sand-600 mt-1">
            Theo dõi, thương lượng và xét duyệt cả đề nghị Đổi đồ (Barter) và đề xuất Mua trực tiếp (Buy) minh bạch.
          </p>
        </div>
      </div>

      {/* 2. OFFER KIND TOGGLE (BARTER VS BUY PROPOSALS) */}
      <div className="flex items-center gap-3 p-1.5 bg-sand-100 rounded-2xl max-w-md">
        <button
          onClick={() => setOfferKind('BARTER')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            offerKind === 'BARTER'
              ? 'bg-white text-eco-900 shadow-soft'
              : 'text-sand-600 hover:text-charcoal-800'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Đề nghị Đổi đồ</span>
          {pendingReceivedBarterCount > 0 && (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
              {pendingReceivedBarterCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setOfferKind('BUY')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            offerKind === 'BUY'
              ? 'bg-white text-clay-700 shadow-soft'
              : 'text-sand-600 hover:text-charcoal-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Đề xuất Mua trực tiếp</span>
          {pendingReceivedBuyCount > 0 && (
            <span className="text-[10px] bg-clay-100 text-clay-700 px-1.5 py-0.2 rounded-full font-bold">
              {pendingReceivedBuyCount}
            </span>
          )}
        </button>
      </div>

      {/* 3. MAIN TABS (Received vs Sent) */}
      <div className="flex items-center gap-3 border-b border-sand-200">
        <button
          onClick={() => setActiveMainTab('RECEIVED')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeMainTab === 'RECEIVED'
              ? 'border-eco-800 text-eco-900'
              : 'border-transparent text-sand-500 hover:text-charcoal-700'
          }`}
        >
          <span>Đề nghị nhận được (Cho bài đăng của tôi)</span>
          <span className="text-[11px] bg-sand-100 text-charcoal-700 px-2 py-0.5 rounded-full font-bold">
            {offerKind === 'BARTER'
              ? barterRequests.filter((r) => r.receiverId === currentUser.id).length
              : buyRequests.filter((r) => r.receiverId === currentUser.id).length}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('SENT')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeMainTab === 'SENT'
              ? 'border-eco-800 text-eco-900'
              : 'border-transparent text-sand-500 hover:text-charcoal-700'
          }`}
        >
          <span>Đề nghị tôi đã gửi đi</span>
          <span className="text-[11px] bg-sand-100 text-charcoal-700 px-2 py-0.5 rounded-full font-bold">
            {offerKind === 'BARTER'
              ? barterRequests.filter((r) => r.senderId === currentUser.id).length
              : buyRequests.filter((r) => r.senderId === currentUser.id).length}
          </span>
        </button>
      </div>

      {/* 4. STATUS SUB-FILTER CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'ON_HOLD'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
              statusFilter === st
                ? 'bg-eco-800 text-white shadow-soft'
                : 'bg-white text-charcoal-700 hover:bg-sand-100 border border-sand-200'
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
            <div className="p-12 text-center bg-white rounded-3xl border border-sand-200 space-y-3">
              <ArrowRightLeft className="w-12 h-12 text-sand-300 mx-auto" />
              <h3 className="text-base font-bold text-charcoal-900">Không có đề nghị đổi đồ nào</h3>
              <p className="text-xs text-sand-600">
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
                  className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 sm:p-8 space-y-6 relative overflow-hidden"
                >
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sand-100">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={req.status} size="sm" />
                      <span className="text-xs text-sand-500">Mã đề nghị: #{req.id}</span>
                      <span className="text-sand-300">•</span>
                      <span className="text-xs text-sand-500">
                        {new Date(req.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    {otherUser && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-sand-500">
                          {activeMainTab === 'RECEIVED' ? 'Người gửi đề nghị:' : 'Người nhận đề nghị:'}
                        </span>
                        <Link
                          to={`/sellers/${otherUser.id}`}
                          className="flex items-center gap-1.5 hover:text-eco-800 transition-colors"
                        >
                          <img
                            src={otherUser.avatar}
                            alt={otherUser.fullName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-charcoal-900">
                            {otherUser.fullName}
                          </span>
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                            ★ {otherUser.trustScore}đ
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* VISUAL COMPARISON: ITEM A <-> ITEM B + CASH */}
                  <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center bg-sand-50/80 p-5 rounded-2xl border border-sand-200/80">
                    {/* Item 1: Offered Item */}
                    <div className="md:col-span-5 bg-white p-4 rounded-xl border border-sand-200 shadow-subtle flex items-center gap-3.5">
                      {offeredProd ? (
                        <>
                          <img
                            src={offeredProd.images[0]}
                            alt={offeredProd.title}
                            className="w-16 h-16 rounded-xl object-cover border border-sand-200 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-eco-800 tracking-wider">
                              {activeMainTab === 'RECEIVED' ? 'Món đồ họ muốn đổi:' : 'Món đồ của bạn:'}
                            </span>
                            <h4 className="text-xs font-bold text-charcoal-900 truncate mt-0.5">
                              {offeredProd.title}
                            </h4>
                            <div className="text-[11px] text-sand-600 mt-1">
                              Tình trạng: <span className="font-semibold">{offeredProd.condition}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-sand-400">Món đồ không còn khả dụng</span>
                      )}
                    </div>

                    {/* Center Swap Arrow + Compensation badge */}
                    <div className="md:col-span-1 flex flex-col items-center justify-center py-2 md:py-0">
                      <div className="w-10 h-10 rounded-full bg-eco-800 text-white flex items-center justify-center shadow-soft">
                        <ArrowRightLeft className="w-5 h-5" />
                      </div>
                      {req.compensationAmount > 0 && (
                        <div className="mt-1.5 text-center">
                          <span className="text-[10px] font-bold text-clay-700 bg-clay-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                            + {req.compensationAmount.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Item 2: Target Item */}
                    <div className="md:col-span-5 bg-white p-4 rounded-xl border border-sand-200 shadow-subtle flex items-center gap-3.5">
                      {targetProd ? (
                        <>
                          <img
                            src={targetProd.images[0]}
                            alt={targetProd.title}
                            className="w-16 h-16 rounded-xl object-cover border border-sand-200 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-sand-500 tracking-wider">
                              {activeMainTab === 'RECEIVED' ? 'Món đồ của bạn:' : 'Món đồ mục tiêu:'}
                            </span>
                            <h4 className="text-xs font-bold text-charcoal-900 truncate mt-0.5">
                              {targetProd.title}
                            </h4>
                            <div className="text-[11px] text-sand-600 mt-1">
                              Tình trạng: <span className="font-semibold">{targetProd.condition}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-sand-400">Sản phẩm không tồn tại</span>
                      )}
                    </div>
                  </div>

                  {/* Note message */}
                  {req.note && (
                    <div className="p-4 bg-white rounded-2xl border border-sand-200 text-xs">
                      <span className="font-bold text-charcoal-800">Lời nhắn thương lượng:</span>
                      <p className="text-sand-700 mt-1 leading-relaxed whitespace-pre-line">
                        "{req.note}"
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  {activeMainTab === 'RECEIVED' && req.status === 'PENDING' && (
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        onClick={() => rejectBarterRequest(req.id, 'Đã tìm được đề nghị phù hợp hơn')}
                        className="px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                      >
                        Từ chối đề nghị
                      </button>

                      <button
                        onClick={() => setConfirmAcceptBarter(req)}
                        className="px-6 py-2.5 bg-eco-800 hover:bg-eco-700 text-white font-bold text-xs rounded-xl shadow-soft transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Chấp nhận trao đổi</span>
                      </button>
                    </div>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                      <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>Đề nghị đã được chấp thuận! Lịch hẹn gặp mặt đã được khởi tạo.</span>
                      </div>
                      <Link
                        to="/user/transactions"
                        className="px-4 py-2 bg-eco-800 text-white font-bold text-xs rounded-xl shadow-soft hover:bg-eco-700 whitespace-nowrap"
                      >
                        Xem hành trình gặp mặt →
                      </Link>
                    </div>
                  )}

                  {activeMainTab === 'SENT' && req.status === 'PENDING' && (
                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => cancelBarterRequest(req.id)}
                        className="px-4 py-2 text-xs font-semibold text-sand-600 hover:text-rose-600 border border-sand-200 hover:border-rose-300 rounded-xl transition-colors"
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
            <div className="p-12 text-center bg-white rounded-3xl border border-sand-200 space-y-3">
              <Tag className="w-12 h-12 text-sand-300 mx-auto" />
              <h3 className="text-base font-bold text-charcoal-900">Không có đề xuất mua nào</h3>
              <p className="text-xs text-sand-600">
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
                  className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 sm:p-8 space-y-6 relative overflow-hidden"
                >
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sand-100">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={req.status} size="sm" />
                      <span className="text-xs text-sand-500">Mã đề xuất: #{req.id}</span>
                      <span className="text-sand-300">•</span>
                      <span className="text-xs text-sand-500">
                        {new Date(req.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    {otherUser && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-sand-500">
                          {activeMainTab === 'RECEIVED' ? 'Người gửi đề xuất:' : 'Người bán:'}
                        </span>
                        <Link
                          to={`/sellers/${otherUser.id}`}
                          className="flex items-center gap-1.5 hover:text-eco-800 transition-colors"
                        >
                          <img
                            src={otherUser.avatar}
                            alt={otherUser.fullName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-charcoal-900">
                            {otherUser.fullName}
                          </span>
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                            ★ {otherUser.trustScore}đ
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* BUY PROPOSAL DETAILS: TARGET PRODUCT + PROPOSED PRICE */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-sand-50/80 p-5 rounded-2xl border border-sand-200/80">
                    {/* Target Product */}
                    <div className="md:col-span-6 bg-white p-4 rounded-xl border border-sand-200 shadow-subtle flex items-center gap-3.5">
                      {targetProd ? (
                        <>
                          <img
                            src={targetProd.images[0]}
                            alt={targetProd.title}
                            className="w-16 h-16 rounded-xl object-cover border border-sand-200 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-sand-500 tracking-wider">
                              Sản phẩm bài đăng:
                            </span>
                            <h4 className="text-xs font-bold text-charcoal-900 truncate mt-0.5">
                              {targetProd.title}
                            </h4>
                            <div className="text-[11px] text-sand-600 mt-1 flex items-center gap-2">
                              <span>Giá niêm yết:</span>
                              <strong className="text-charcoal-800">
                                {targetProd.price?.toLocaleString('vi-VN')}₫
                              </strong>
                            </div>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-sand-400">Sản phẩm không tồn tại</span>
                      )}
                    </div>

                    {/* Proposed Price Highlight */}
                    <div className="md:col-span-6 bg-clay-50/80 p-4 rounded-xl border border-clay-200/80 shadow-subtle space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-clay-800 tracking-wider flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Mức giá đề xuất mua:
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-extrabold text-clay-700">
                          {req.offeredPrice.toLocaleString('vi-VN')}₫
                        </span>
                        {priceDiff !== 0 && (
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              priceDiff > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {priceDiff > 0 ? `+${priceDiff.toLocaleString('vi-VN')}₫` : `${priceDiff.toLocaleString('vi-VN')}₫`} so với giá niêm yết
                          </span>
                        )}
                      </div>
                      {req.meetupLocationPreference && (
                        <div className="text-xs text-charcoal-700 flex items-center gap-1.5 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-eco-700 flex-shrink-0" />
                          <span>Điểm hẹn mong muốn: <strong>{req.meetupLocationPreference}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Note message */}
                  {req.note && (
                    <div className="p-4 bg-white rounded-2xl border border-sand-200 text-xs">
                      <span className="font-bold text-charcoal-800">Lời nhắn từ người mua:</span>
                      <p className="text-sand-700 mt-1 leading-relaxed whitespace-pre-line">
                        "{req.note}"
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  {activeMainTab === 'RECEIVED' && req.status === 'PENDING' && (
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        onClick={() => rejectBuyRequest(req.id, 'Mức giá chưa phù hợp')}
                        className="px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                      >
                        Từ chối đề xuất
                      </button>

                      <button
                        onClick={() => setConfirmAcceptBuy(req)}
                        className="px-6 py-2.5 bg-clay-600 hover:bg-clay-700 text-white font-bold text-xs rounded-xl shadow-soft transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Chấp nhận đề xuất mua</span>
                      </button>
                    </div>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                      <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>Đề xuất đã được chấp thuận! Lịch hẹn gặp mặt đã được khởi tạo.</span>
                      </div>
                      <Link
                        to="/user/transactions"
                        className="px-4 py-2 bg-eco-800 text-white font-bold text-xs rounded-xl shadow-soft hover:bg-eco-700 whitespace-nowrap"
                      >
                        Xem hành trình gặp mặt →
                      </Link>
                    </div>
                  )}

                  {activeMainTab === 'SENT' && req.status === 'PENDING' && (
                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => cancelBuyRequest(req.id)}
                        className="px-4 py-2 text-xs font-semibold text-sand-600 hover:text-rose-600 border border-sand-200 hover:border-rose-300 rounded-xl transition-colors"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-elevated border border-sand-200 animate-slide-up space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-charcoal-900 text-center">
              Xác nhận Chấp nhận Đề nghị Đổi đồ?
            </h3>

            <p className="text-xs sm:text-sm text-sand-700 leading-relaxed text-center">
              Khi chấp nhận đề nghị này, bài đăng của bạn sẽ chuyển sang trạng thái <strong>Tạm giữ (RESERVED)</strong> và hệ thống sẽ tự động tạo lịch hẹn gặp với người đổi. Các đề nghị khác sẽ chuyển sang hàng chờ. Bạn có đồng ý không?
            </p>

            <div className="pt-4 border-t border-sand-100 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmAcceptBarter(null)}
                className="flex-1 py-2.5 border border-sand-200 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-sand-50"
              >
                Cân nhắc lại
              </button>
              <button
                type="button"
                onClick={() => {
                  acceptBarterRequest(confirmAcceptBarter.id);
                  setConfirmAcceptBarter(null);
                }}
                className="flex-1 py-2.5 bg-eco-800 hover:bg-eco-700 text-white rounded-xl text-xs font-bold shadow-soft"
              >
                Đồng ý chấp nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP FOR ACCEPT BUY PROPOSAL */}
      {confirmAcceptBuy && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-elevated border border-sand-200 animate-slide-up space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-charcoal-900 text-center">
              Xác nhận Chấp nhận Đề xuất Mua?
            </h3>

            <p className="text-xs sm:text-sm text-sand-700 leading-relaxed text-center">
              Bạn đồng ý bán với mức giá{' '}
              <strong className="text-clay-700 font-bold">
                {confirmAcceptBuy.offeredPrice.toLocaleString('vi-VN')}₫
              </strong>
              . Bài đăng sẽ chuyển sang <strong>Tạm giữ (RESERVED)</strong>, mở thông tin liên hệ và tạo lịch hẹn gặp mặt trực tiếp.
            </p>

            <div className="pt-4 border-t border-sand-100 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmAcceptBuy(null)}
                className="flex-1 py-2.5 border border-sand-200 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-sand-50"
              >
                Cân nhắc lại
              </button>
              <button
                type="button"
                onClick={() => {
                  acceptBuyRequest(confirmAcceptBuy.id);
                  setConfirmAcceptBuy(null);
                }}
                className="flex-1 py-2.5 bg-clay-600 hover:bg-clay-700 text-white rounded-xl text-xs font-bold shadow-soft"
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
