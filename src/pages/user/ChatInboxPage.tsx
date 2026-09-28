import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ChatInboxPage: React.FC = () => {
  const { currentUser, messages, transactions, products, users, sendMessage } = useApp();
  // Filter transactions where currentUser is buyer or seller (UC16 / Privacy Guard)
  const myTransactions = transactions.filter(
    (t) => t.buyerId === currentUser.id || t.sellerId === currentUser.id
  );
  const [selectedTxId, setSelectedTxId] = useState<string>(myTransactions[0]?.id || '');
  const [inputContent, setInputContent] = useState('');

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

  // If user has no active transactions
  if (myTransactions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-sand-100 text-sand-500 mx-auto flex items-center justify-center">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-charcoal-900">Hộp thư trao đổi trống</h2>
          <p className="text-sm text-sand-600 max-w-md mx-auto leading-relaxed">
            Bạn chưa có cuộc hẹn hoặc giao dịch đang thực hiện nào. Khi bạn chấp thuận hoặc được chấp thuận đề nghị trao đổi / mua bán, kênh đối thoại riêng tư sẽ tự động kích hoạt tại đây.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link
            to="/user/exchanges"
            className="px-5 py-2.5 bg-sand-100 hover:bg-sand-200 text-charcoal-800 rounded-xl text-xs font-bold transition-colors"
          >
            Quản lý đề nghị
          </Link>
          <Link
            to="/explore"
            className="px-5 py-2.5 bg-eco-800 hover:bg-eco-700 text-white rounded-xl text-xs font-bold shadow-soft transition-all"
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
          Hộp thư trao đổi đề nghị (Offer Messages)
        </h1>
        <p className="text-xs sm:text-sm text-sand-600 mt-1">
          Kênh đối thoại thương lượng chi tiết và thỏa thuận địa điểm công cộng an toàn. Lịch sử trao đổi được lưu trữ 90 ngày làm bằng chứng đối soát.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-sand-200 shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* LEFT COLUMN: CONVERSATION LIST (4 COLS) */}
        <div className="md:col-span-4 border-r border-sand-200 flex flex-col">
          <div className="p-4 border-b border-sand-100 bg-sand-50/50">
            <span className="text-xs font-bold text-charcoal-800 uppercase tracking-wider">
              Cuộc đối thoại ({myTransactions.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-sand-50">
            {myTransactions.map((tx) => {
              const other = users.find((u) => u.id === (tx.buyerId === currentUser.id ? tx.sellerId : tx.buyerId));
              const prod = products.find((p) => p.id === tx.productId);
              const isSelected = tx.id === selectedTxId;

              return (
                <button
                  key={tx.id}
                  onClick={() => setSelectedTxId(tx.id)}
                  className={`w-full text-left p-4 transition-colors flex items-start gap-3 ${
                    isSelected ? 'bg-eco-50/80 border-l-4 border-eco-700' : 'hover:bg-sand-50'
                  }`}
                >
                  <img
                    src={other?.avatar}
                    alt={other?.fullName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-sand-300 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-charcoal-900 truncate">
                        {other?.fullName}
                      </span>
                      <span className="text-[10px] text-sand-400">
                        {new Date(tx.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="text-[11px] text-eco-800 font-medium truncate mt-0.5">
                      Về: {prod?.title}
                    </div>
                    <div className="text-[11px] text-sand-500 truncate mt-0.5">
                      Điểm hẹn: {tx.appointmentLocation}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT THREAD (8 COLS) */}
        <div className="md:col-span-8 flex flex-col justify-between bg-sand-50/30">
          {/* Thread Header */}
          {partner && (
            <div className="p-4 border-b border-sand-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={partner.avatar}
                  alt={partner.fullName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-eco-500"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-charcoal-900">{partner.fullName}</span>
                    <CheckCircle2 className="w-4 h-4 text-eco-600" />
                  </div>
                  <span className="text-[11px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                    ★ {partner.trustScore}đ Uy tín
                  </span>
                </div>
              </div>

              {/* Fast links */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${partner.phone}`}
                  className="p-2 bg-sand-100 hover:bg-sand-200 text-charcoal-700 rounded-xl transition-colors"
                  title="Gọi trực tiếp"
                >
                  <PhoneCall className="w-4 h-4 text-eco-700" />
                </a>
                <Link
                  to={`/user/transactions/${activeTx?.id}`}
                  className="px-3 py-1.5 bg-eco-800 text-white rounded-xl text-xs font-semibold hover:bg-eco-700"
                >
                  Xem lịch hẹn
                </Link>
              </div>
            </div>
          )}

          {/* Safety Reminder Banner */}
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Tuyệt đối không chuyển tiền cọc trước. Thỏa thuận gặp mặt ban ngày tại quán cafe, TTTM đông người.
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5 max-h-[380px]">
            {threadMessages.length === 0 ? (
              <div className="text-center py-10 text-xs text-sand-500 italic">
                Bắt đầu cuộc trò chuyện để thống nhất giờ giấc và điểm hẹn...
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
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-eco-800 text-white rounded-br-none shadow-soft'
                          : 'bg-white text-charcoal-900 border border-sand-200 rounded-bl-none shadow-subtle'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-sand-400 mt-1 px-1">
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
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-sand-200 flex items-center gap-2">
            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Nhập tin nhắn trao đổi về địa điểm, thời gian hẹn..."
              className="flex-1 bg-sand-50 border border-sand-200 text-xs sm:text-sm rounded-xl px-4 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-eco-500/20"
            />
            <button
              type="submit"
              disabled={!inputContent.trim()}
              className="p-2.5 bg-eco-800 hover:bg-eco-700 disabled:opacity-40 text-white rounded-xl shadow-soft transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
