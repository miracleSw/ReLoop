import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ChatInboxPage: React.FC = () => {
  const { currentUser, messages, transactions, products, users, sendMessage } = useApp();
  // Filter transactions where currentUser is buyer or seller (UC16 / Privacy Guard)
  const myTransactions = transactions.filter(
    (t) => t.buyerId === currentUser?.id || t.sellerId === currentUser?.id
  );
  const [selectedTxId, setSelectedTxId] = useState<string>(myTransactions[0]?.id || '');
  const [inputContent, setInputContent] = useState('');
  const [mobileTab, setMobileTab] = useState<'list' | 'thread'>('thread');

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

  // If user has no active transactions
  if (myTransactions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 text-slate-400 mx-auto flex items-center justify-center shadow-xs">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Hộp thư trao đổi trống</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Bạn chưa có cuộc hẹn hoặc giao dịch đang thực hiện nào. Khi bạn chấp thuận hoặc được chấp thuận đề nghị trao đổi / mua bán, kênh đối thoại riêng tư sẽ tự động kích hoạt tại đây.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link
            to="/user/exchanges"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            Quản lý đề nghị
          </Link>
          <Link
            to="/explore"
            className="px-5 py-2.5 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald hover:shadow-lg transition-all"
          >
            Khám phá món đồ ngay
          </Link>
        </div>
      </div>
    );
  }

  // Active transaction strictly scoped to user's transactions
  const activeTx = myTransactions.find((t) => t.id === selectedTxId) || myTransactions[0];
  const targetProd = products.find((p) => p.id === activeTx?.productId);
  const isBuyer = activeTx?.buyerId === currentUser.id;
  const partner = users.find((u) => u.id === (isBuyer ? activeTx?.sellerId : activeTx?.buyerId));

  // Filter messages for active transaction
  const threadMessages = activeTx ? messages.filter((m) => m.transactionId === activeTx.id) : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !partner || !activeTx) return;

    sendMessage(activeTx.id, partner.id, inputContent.trim());
    setInputContent('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-eco-800 uppercase tracking-wider bg-eco-100/70 px-3 py-1 rounded-full border border-eco-200/80 mb-2 shadow-xs">
          <MessageSquare className="w-3.5 h-3.5 text-eco-700" />
          <span>Kênh đối thoại trực tiếp</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <span>Hộp thư trao đổi đề nghị (Offer Messages)</span>
          <span className="inline-flex items-center justify-center p-1 rounded-lg bg-eco-100/70 text-eco-700">
            <Sparkles className="w-4 h-4" />
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kênh đối thoại thương lượng chi tiết và thỏa thuận địa điểm công cộng an toàn. Lịch sử trao đổi được lưu trữ 90 ngày làm bằng chứng đối soát.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_35px_-8px_rgba(16,185,129,0.08)] overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-14rem)] min-h-[500px] max-h-[780px]">
        {/* LEFT COLUMN: CONVERSATION LIST (4 COLS) */}
        <div className={`md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/40 ${mobileTab === 'thread' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-200/80 bg-white flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Cuộc đối thoại ({myTransactions.length})
            </span>
            <span className="text-[11px] text-eco-700 font-bold bg-eco-50 px-2 py-0.5 rounded-full border border-eco-200/60">
              Đang hoạt động
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {myTransactions.map((tx) => {
              const other = users.find((u) => u.id === (tx.buyerId === currentUser.id ? tx.sellerId : tx.buyerId));
              const prod = products.find((p) => p.id === tx.productId);
              const isSelected = tx.id === (activeTx?.id || selectedTxId);

              return (
                <button
                  key={tx.id}
                  onClick={() => {
                    setSelectedTxId(tx.id);
                    setMobileTab('thread');
                  }}
                  className={`w-full text-left p-4 transition-all flex items-start gap-3.5 relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-eco-50/90 via-eco-50/40 to-transparent border-l-4 border-eco-600 shadow-xs'
                      : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={other?.avatar}
                      alt={other?.fullName}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-200/80 flex-shrink-0 shadow-xs"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs truncate ${isSelected ? 'font-black text-slate-900' : 'font-bold text-slate-800'}`}>
                        {other?.fullName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(tx.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="text-[11px] text-eco-700 font-semibold truncate mt-0.5">
                      Về: {prod?.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span>{tx.appointmentLocation}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT THREAD (8 COLS) */}
        <div className={`md:col-span-8 flex flex-col justify-between bg-slate-50/30 ${mobileTab === 'list' ? 'hidden md:flex' : 'flex'}`}>
          {/* Thread Header */}
          {partner && (
            <div className="p-3.5 sm:p-4 border-b border-slate-200/80 bg-white flex items-center justify-between shadow-xs gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileTab('list')}
                  className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex-shrink-0"
                  aria-label="Quay lại danh sách hội thoại"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="relative flex-shrink-0">
                  <img
                    src={partner.avatar}
                    alt={partner.fullName}
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl object-cover ring-2 ring-eco-500/80 shadow-xs"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-slate-900 truncate">{partner.fullName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-eco-600 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                    <span className="text-[9px] sm:text-[10px] text-emerald-800 bg-emerald-100 px-1.5 sm:px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                      ★ {partner.trustScore}đ
                    </span>
                    {targetProd && (
                      <span className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                        • {targetProd.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Fast links */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <a
                  href={`tel:${partner.phone}`}
                  className="p-2 sm:p-2.5 bg-slate-100 hover:bg-eco-50 hover:text-eco-700 text-slate-700 rounded-xl transition-colors border border-slate-200"
                  title="Gọi trực tiếp"
                >
                  <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
                <Link
                  to={`/user/transactions/${activeTx?.id}`}
                  className="px-2.5 sm:px-3.5 py-2 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-glow-emerald hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">Xem lịch hẹn</span>
                </Link>
              </div>
            </div>
          )}

          {/* Safety Reminder Banner */}
          <div className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-50 to-amber-50/70 border-b border-amber-200/80 text-[11px] sm:text-xs text-amber-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="font-medium">
              <strong className="font-bold">Lưu ý an toàn:</strong> Không chuyển tiền cọc trước. Thỏa thuận gặp mặt ban ngày nơi đông người.
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 sm:p-6 overflow-y-auto space-y-4">
            {threadMessages.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-500 italic">
                  Bắt đầu cuộc trò chuyện để thống nhất giờ giấc và điểm hẹn...
                </p>
              </div>
            ) : (
              threadMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-gradient-to-r from-eco-700 to-teal-600 text-white rounded-br-xs shadow-sm font-medium'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs font-medium'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1.5 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2.5 shadow-xs">
            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Nhập tin nhắn trao đổi về địa điểm, thời gian hẹn..."
              className="flex-1 bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white transition-all font-medium placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputContent.trim()}
              className="p-3 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 disabled:opacity-40 text-white rounded-xl shadow-glow-emerald hover:shadow-lg transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
