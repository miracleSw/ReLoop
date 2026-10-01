import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowLeft,
  ArrowDown,
  Clock,
  Compass
} from 'lucide-react';
import { User } from '../../types';

export const ChatInboxPage: React.FC = () => {
  const { currentUser, messages, transactions, products, users, sendMessage } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTxId = searchParams.get('tx') || searchParams.get('transactionId');

  // Filter transactions where currentUser is buyer or seller (UC16 / Privacy Guard)
  const myTransactions = useMemo(() => {
    if (!currentUser) return [];
    return transactions.filter(
      (t) => t.buyerId === currentUser.id || t.sellerId === currentUser.id
    );
  }, [transactions, currentUser]);

  const [selectedTxId, setSelectedTxId] = useState<string>(() => {
    if (queryTxId && myTransactions.some((t) => t.id === queryTxId)) {
      return queryTxId;
    }
    return myTransactions[0]?.id || '';
  });

  const [inputContent, setInputContent] = useState('');
  const [mobileTab, setMobileTab] = useState<'list' | 'thread'>('thread');
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  // Sync when queryTxId changes from external navigation (e.g. user clicked a link with ?tx=tx-2 or browser back/forward)
  const prevQueryTxIdRef = useRef(queryTxId);
  useEffect(() => {
    if (queryTxId !== prevQueryTxIdRef.current) {
      prevQueryTxIdRef.current = queryTxId;
      if (queryTxId && myTransactions.some((t) => t.id === queryTxId)) {
        setSelectedTxId(queryTxId);
        setMobileTab('thread');
      }
    }
  }, [queryTxId, myTransactions]);

  // Fallback if selectedTxId is invalid or not in myTransactions
  useEffect(() => {
    if (myTransactions.length > 0 && (!selectedTxId || !myTransactions.some((t) => t.id === selectedTxId))) {
      setSelectedTxId(myTransactions[0].id);
    }
  }, [myTransactions, selectedTxId]);

  // Handle explicit conversation selection
  const handleSelectConversation = useCallback((txId: string) => {
    setSelectedTxId(txId);
    prevQueryTxIdRef.current = txId;
    setSearchParams({ tx: txId }, { replace: true });
    setMobileTab('thread');
  }, [setSearchParams]);

  // Active transaction strictly scoped to user's transactions
  const activeTx = useMemo(() => {
    return myTransactions.find((t) => t.id === selectedTxId) || myTransactions[0];
  }, [myTransactions, selectedTxId]);

  const targetProd = useMemo(() => {
    return products.find((p) => p.id === activeTx?.productId);
  }, [products, activeTx?.productId]);

  const isBuyer = activeTx?.buyerId === currentUser?.id;
  const partnerId = isBuyer ? activeTx?.sellerId : activeTx?.buyerId;

  const partner = useMemo(() => {
    return users.find((u) => u.id === partnerId);
  }, [users, partnerId]);

  // Safe fallback partner object for UI consistency
  const activePartner: User = useMemo(() => {
    if (partner) return partner;
    return {
      id: partnerId || 'unknown',
      fullName: 'Đối tác trao đổi',
      email: '',
      phone: '0900000000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      province: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Bến Nghé',
      trustScore: 100,
      totalTransactions: 0,
      rating: 5.0,
      reviewCount: 0,
      role: 'USER',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      blockedUserIds: [],
    };
  }, [partner, partnerId]);

  // Filter messages for active transaction deterministically ordered by timestamp
  const threadMessages = useMemo(() => {
    if (!activeTx) return [];
    return messages
      .filter((m) => m.transactionId === activeTx.id)
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime() || 0;
        const timeB = new Date(b.timestamp).getTime() || 0;
        const timeDiff = timeA - timeB;
        if (timeDiff !== 0) return timeDiff;
        return a.id.localeCompare(b.id);
      });
  }, [messages, activeTx?.id]);

  // Refs for scrolling architecture
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const isSelfSentRef = useRef(false);

  // Check if user is scrolled near bottom
  const checkIfNearBottom = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    const threshold = 100; // 100px buffer
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceFromBottom <= threshold;
  }, []);

  // Scroll listener
  const handleScroll = useCallback(() => {
    const nearBottom = checkIfNearBottom();
    isNearBottomRef.current = nearBottom;
    setShowScrollBottomBtn(!nearBottom);
  }, [checkIfNearBottom]);

  // Robust scroll to bottom function that ONLY scrolls the message stream (never the window)
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior,
      });
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
    isNearBottomRef.current = true;
    setShowScrollBottomBtn(false);
  }, []);

  // When switching active transaction: scroll to bottom immediately and reset tracking refs
  const prevTxIdRef = useRef<string | null>(null);
  const prevLastMsgIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeTx?.id !== prevTxIdRef.current) {
      prevTxIdRef.current = activeTx?.id || null;
      isNearBottomRef.current = true;
      setShowScrollBottomBtn(false);
      const lastMsg = threadMessages[threadMessages.length - 1];
      prevLastMsgIdRef.current = lastMsg?.id || null;
      const rafId = requestAnimationFrame(() => {
        scrollToBottom('auto');
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [activeTx?.id, threadMessages, scrollToBottom]);

  // When new messages arrive in the current active transaction: auto-scroll if self-sent or near bottom
  useEffect(() => {
    const lastMsg = threadMessages[threadMessages.length - 1];
    const lastId = lastMsg?.id || null;

    if (lastId && lastId !== prevLastMsgIdRef.current) {
      prevLastMsgIdRef.current = lastId;
      const wasSelfSent = isSelfSentRef.current || lastMsg?.senderId === currentUser?.id;
      isSelfSentRef.current = false;

      if (wasSelfSent || isNearBottomRef.current) {
        const rafId = requestAnimationFrame(() => {
          scrollToBottom('smooth');
        });
        return () => cancelAnimationFrame(rafId);
      } else {
        // User was scrolled up reading older messages: keep position, show jump button
        setShowScrollBottomBtn(true);
      }
    }
  }, [threadMessages, currentUser?.id, scrollToBottom]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputContent.trim();
    if (!trimmed || !activeTx) return;

    isSelfSentRef.current = true;
    isNearBottomRef.current = true;
    setShowScrollBottomBtn(false);
    sendMessage(activeTx.id, activePartner.id, trimmed);
    setInputContent('');
  };

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

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-4 space-y-2 sm:space-y-3.5 w-full min-w-0">
      {/* Header — compact on mobile, rich on desktop */}
      <div className="pb-1 sm:pb-3 border-b border-slate-200/80 flex-shrink-0 min-w-0">
        <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-eco-800 uppercase tracking-wider bg-eco-100/70 px-3 py-1 rounded-full border border-eco-200/80 mb-1.5 shadow-xs">
          <MessageSquare className="w-3.5 h-3.5 text-eco-700" />
          <span>Kênh đối thoại trực tiếp</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Hộp thư trao đổi đề nghị</span>
            <span className="hidden sm:inline-flex items-center justify-center p-1 rounded-lg bg-eco-100/70 text-eco-700">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </h1>
        </div>
        <p className="hidden sm:block text-xs text-slate-500 mt-0.5 truncate">
          Kênh đối thoại thương lượng chi tiết và thỏa thuận địa điểm công cộng an toàn. Lịch sử trao đổi được lưu trữ 90 ngày.
        </p>
      </div>

      {/* Chat Container Card — perfectly sized to viewport across mobile & desktop */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_10px_35px_-8px_rgba(16,185,129,0.08)] overflow-hidden grid grid-cols-1 md:grid-cols-12 w-full min-w-0 min-h-0 h-[calc(100dvh-7.5rem)] sm:h-[calc(100vh-14rem)] min-h-[360px] sm:min-h-[460px] max-h-[760px]">
        {/* LEFT COLUMN: CONVERSATION LIST (4 COLS) */}
        <div className={`md:col-span-4 border-r border-slate-200 flex flex-col min-h-0 min-w-0 bg-slate-50/40 h-full ${mobileTab === 'thread' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-3 sm:p-4 border-b border-slate-200/80 bg-white flex items-center justify-between flex-shrink-0 min-w-0">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Cuộc đối thoại ({myTransactions.length})
            </span>
            <span className="text-[11px] text-eco-700 font-bold bg-eco-50 px-2 py-0.5 rounded-full border border-eco-200/60 flex-shrink-0">
              Đang hoạt động
            </span>
          </div>

          <div
            id="conversation-list-stream"
            data-testid="conversation-list-stream"
            className="flex-1 min-h-0 min-w-0 overflow-y-auto divide-y divide-slate-100"
          >
            {myTransactions.map((tx) => {
              const other = users.find((u) => u.id === (tx.buyerId === currentUser.id ? tx.sellerId : tx.buyerId));
              const prod = products.find((p) => p.id === tx.productId);
              const isSelected = tx.id === (activeTx?.id || selectedTxId);

              return (
                <button
                  key={tx.id}
                  onClick={() => handleSelectConversation(tx.id)}
                  className={`w-full text-left p-3 sm:p-4 transition-all flex items-start gap-2.5 sm:gap-3 relative min-w-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-eco-50/90 via-eco-50/40 to-transparent border-l-4 border-eco-600 shadow-xs'
                      : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={other?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={other?.fullName || 'Người dùng'}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover ring-2 ring-slate-200/80 shadow-xs"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 min-w-0">
                      <span className={`text-xs truncate ${isSelected ? 'font-black text-slate-900' : 'font-bold text-slate-800'}`}>
                        {other?.fullName || 'Đối tác trao đổi'}
                      </span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {new Date(tx.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="text-[11px] text-eco-700 font-semibold truncate mt-0.5 min-w-0">
                      Về: {prod?.title || 'Sản phẩm giao dịch'}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1 min-w-0">
                      <Compass className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{tx.appointmentLocation || 'Địa điểm hẹn'}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT THREAD (8 COLS) */}
        <div className={`md:col-span-8 flex flex-col h-full min-h-0 min-w-0 bg-slate-50/30 relative ${mobileTab === 'list' ? 'hidden md:flex' : 'flex'}`}>
          {/* Thread Header */}
          <div className="p-2.5 sm:p-4 border-b border-slate-200/80 bg-white flex items-center justify-between shadow-xs gap-2 flex-shrink-0 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setMobileTab('list')}
                className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex-shrink-0 cursor-pointer"
                aria-label="Quay lại danh sách hội thoại"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="relative flex-shrink-0">
                <img
                  src={activePartner.avatar}
                  alt={activePartner.fullName}
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl object-cover ring-2 ring-eco-500/80 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs sm:text-sm font-black text-slate-900 truncate">{activePartner.fullName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-eco-600 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 min-w-0">
                  <span className="text-[9px] sm:text-[10px] text-emerald-800 bg-emerald-100 px-1.5 sm:px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                    ★ {activePartner.trustScore}đ
                  </span>
                  {targetProd && (
                    <span className="text-[10px] sm:text-[11px] text-slate-500 truncate min-w-0">
                      • {targetProd.title}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Fast links */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <a
                href={`tel:${activePartner.phone}`}
                className="p-1.5 sm:p-2.5 bg-slate-100 hover:bg-eco-50 hover:text-eco-700 text-slate-700 rounded-xl transition-colors border border-slate-200 flex-shrink-0"
                title="Gọi trực tiếp"
                aria-label={`Gọi trực tiếp ${activePartner.fullName}`}
              >
                <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <Link
                to={`/user/transactions/${activeTx?.id}`}
                className="px-2 sm:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-glow-emerald hover:shadow-lg transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">Xem lịch hẹn</span>
              </Link>
            </div>
          </div>

          {/* Safety Reminder Banner */}
          <div className="px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-amber-50 to-amber-50/70 border-b border-amber-200/80 text-[10px] sm:text-xs text-amber-900 flex items-center gap-2 flex-shrink-0 min-w-0">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
            <span className="font-medium min-w-0 truncate sm:whitespace-normal">
              <strong className="font-bold">Lưu ý an toàn:</strong> Không chuyển tiền cọc trước. Thỏa thuận gặp ban ngày nơi công cộng.
            </span>
          </div>

          {/* Messages Stream — The ONLY vertically scrolling area */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            id="chat-message-stream"
            data-testid="chat-message-stream"
            className="flex-1 min-h-0 min-w-0 p-3 sm:p-5 overflow-y-auto overflow-x-hidden space-y-4"
          >
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
                    className={`w-full max-w-full min-w-0 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] min-w-0 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed [overflow-wrap:anywhere] [word-break:break-word] break-words whitespace-pre-wrap chat-bubble-content ${
                        isMe
                          ? 'bg-gradient-to-r from-eco-700 to-teal-600 text-white rounded-br-xs shadow-sm font-medium'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs font-medium'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1.5 flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                      {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} className="h-0 w-full flex-shrink-0" />
          </div>

          {/* Floating jump to newest button when scrolled up */}
          {showScrollBottomBtn && (
            <button
              type="button"
              onClick={() => scrollToBottom('smooth')}
              className="absolute bottom-16 sm:bottom-20 right-3.5 sm:right-6 bg-white/95 backdrop-blur-xs hover:bg-white text-eco-700 hover:text-eco-800 border border-eco-200 px-3 py-1.5 rounded-full shadow-md text-xs font-bold flex items-center gap-1.5 transition-all z-10 animate-bounce-subtle cursor-pointer"
              aria-label="Cuộn xuống tin nhắn mới nhất"
            >
              <ArrowDown className="w-3.5 h-3.5 text-eco-600" />
              <span>Tin mới nhất</span>
            </button>
          )}

          {/* Message Input Bar — Stays fixed at bottom of chat panel */}
          <form
            onSubmit={handleSend}
            id="chat-composer-form"
            data-testid="chat-composer-form"
            className="p-2 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2 sm:gap-2.5 shadow-xs flex-shrink-0 min-w-0 w-full"
          >
            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (isComposing || e.nativeEvent.isComposing || (e as any).keyCode === 229)) {
                  e.preventDefault();
                }
              }}
              placeholder="Nhập tin nhắn trao đổi về địa điểm, thời gian hẹn..."
              className="flex-1 min-w-0 bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-slate-800 focus:outline-none focus:ring-4 focus:ring-eco-500/15 focus:border-eco-600 focus:bg-white transition-all font-medium placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputContent.trim()}
              className="flex-shrink-0 p-2 sm:p-2.5 bg-gradient-to-r from-eco-700 via-eco-600 to-teal-600 hover:from-eco-600 hover:to-teal-500 disabled:opacity-40 text-white rounded-xl shadow-glow-emerald hover:shadow-lg transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
              aria-label="Gửi tin nhắn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ChatInboxPage;
