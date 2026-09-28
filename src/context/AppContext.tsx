import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Product,
  Category,
  BarterRequest,
  BuyRequest,
  MeetupTransaction,
  Message,
  Review,
  Report,
  Notification,
  SystemStats,
  ProductStatus,
  UserStatus,
  WishlistItem
} from '../types';
import {
  mockUsers,
  mockProducts,
  mockCategories,
  mockBarterRequests,
  mockBuyRequests,
  mockTransactions,
  mockMessages,
  mockReviews,
  mockReports,
  mockNotifications,
  mockSystemStats,
  mockWishlist
} from '../data/mockData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  currentUser: User | null;
  currentRole: 'GUEST' | 'USER' | 'ADMIN';
  users: User[];
  products: Product[];
  categories: Category[];
  barterRequests: BarterRequest[];
  buyRequests: BuyRequest[];
  transactions: MeetupTransaction[];
  messages: Message[];
  reviews: Review[];
  reports: Report[];
  notifications: Notification[];
  favorites: string[];
  wishlist: WishlistItem[];
  stats: SystemStats;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  loginAs: (userId: string | null) => void;
  resetData: () => void;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'views' | 'favoritesCount' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setProductStatus: (id: string, status: ProductStatus) => void;
  toggleFavorite: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  incrementProductViews: (productId: string) => void;
  
  // Login prompt modal
  isLoginPromptOpen: boolean;
  loginPromptMessage: string;
  openLoginPrompt: (message?: string) => void;
  closeLoginPrompt: () => void;
  
  // User actions
  updateProfile: (updates: Partial<User>) => void;
  lockUser: (userId: string, durationDays: number, reason: string) => void;
  unlockUser: (userId: string) => void;
  toggleBlockUser: (targetUserId: string) => void;
  
  // Offer / Transaction actions
  createBarterRequest: (data: { targetProductId: string; offeredProductId: string; compensationAmount: number; note: string }) => boolean;
  createBuyRequest: (data: { targetProductId: string; offeredPrice: number; note: string; meetupLocationPreference?: string }) => boolean;
  acceptBarterRequest: (requestId: string) => void;
  rejectBarterRequest: (requestId: string, reason?: string) => void;
  cancelBarterRequest: (requestId: string) => void;
  acceptBuyRequest: (requestId: string) => void;
  rejectBuyRequest: (requestId: string, reason?: string) => void;
  cancelBuyRequest: (requestId: string) => void;
  confirmTransaction: (transactionId: string) => void;
  rescheduleMeetup: (transactionId: string, newTime: string, newLocation: string) => void;
  cancelTransaction: (transactionId: string, reason: string) => void;
  
  // Messaging
  sendMessage: (transactionId: string, receiverId: string, content: string) => void;
  
  // Review actions
  submitReview: (data: { transactionId: string; targetUserId: string; rating: number; criteria: { punctuality: number; courtesy: number; accuracy: number }; comment: string }) => void;
  appealReview: (reviewId: string, reason: string) => void;
  resolveReviewAppeal: (reviewId: string, action: 'DISMISS' | 'REMOVE_REVIEW') => void;
  
  // Report actions
  submitReport: (data: { targetType: 'POST' | 'USER'; targetId: string; reason: any; description: string; evidenceImages: string[] }) => void;
  processReport: (reportId: string, actionTaken: 'WARNING' | 'DOCK_TRUST' | 'LOCK_USER' | 'REMOVE_POST' | 'DISMISSED', resolutionNote: string) => void;
  
  // Category actions
  addCategory: (cat: Omit<Category, 'id' | 'productCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  toggleHideCategory: (id: string) => void;
  
  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'reloop_state_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const setStored = (key: string, value: any) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };

  const [users, setUsers] = useState<User[]>(() => getStored('users', mockUsers));
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => getStored('currentUserId', 'user-1'));
  const [products, setProducts] = useState<Product[]>(() => getStored('products', mockProducts));
  const [categories, setCategories] = useState<Category[]>(() => getStored('categories', mockCategories));
  const [barterRequests, setBarterRequests] = useState<BarterRequest[]>(() => getStored('barterRequests', mockBarterRequests));
  const [buyRequests, setBuyRequests] = useState<BuyRequest[]>(() => getStored('buyRequests', mockBuyRequests));
  const [transactions, setTransactions] = useState<MeetupTransaction[]>(() => getStored('transactions', mockTransactions));
  const [messages, setMessages] = useState<Message[]>(() => getStored('messages', mockMessages));
  const [reviews, setReviews] = useState<Review[]>(() => getStored('reviews', mockReviews));
  const [reports, setReports] = useState<Report[]>(() => getStored('reports', mockReports));
  const [notifications, setNotifications] = useState<Notification[]>(() => getStored('notifications', mockNotifications));
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => getStored('wishlist', mockWishlist));
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Login prompt modal state
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState('');
  const openLoginPrompt = (message?: string) => {
    setLoginPromptMessage(message || 'Vui lòng đăng nhập để lưu sản phẩm vào danh sách yêu thích!');
    setIsLoginPromptOpen(true);
  };
  const closeLoginPrompt = () => {
    setIsLoginPromptOpen(false);
  };

  // Dynamic reactive stats computed live from state collections
  const stats: SystemStats = {
    totalUsers: users.length,
    totalPosts: products.length,
    totalTransactions: transactions.filter((t) => t.status === 'COMPLETED').length,
    totalReports: reports.length,
    activeUsers: users.filter((u) => u.status === 'ACTIVE').length,
    lockedUsers: users.filter((u) => u.status === 'LOCKED').length,
    availablePosts: products.filter((p) => p.status === 'AVAILABLE').length,
    reservedPosts: products.filter((p) => p.status === 'RESERVED').length,
    completedPosts: products.filter((p) => p.status === 'COMPLETED').length,
    lockedPosts: products.filter((p) => p.status === 'LOCKED').length,
    successRate: transactions.length > 0
      ? Math.round((transactions.filter((t) => t.status === 'COMPLETED').length / transactions.length) * 100)
      : 94.2,
    disputeRate: transactions.length > 0
      ? Math.round((transactions.filter((t) => t.status === 'DISPUTED').length / transactions.length) * 100)
      : 3,
    categoryDistribution: mockSystemStats.categoryDistribution,
    monthlyTrend: mockSystemStats.monthlyTrend,
  };

  // Sync to local storage
  useEffect(() => setStored('users', users), [users]);
  useEffect(() => setStored('currentUserId', currentUserId), [currentUserId]);
  useEffect(() => setStored('products', products), [products]);
  useEffect(() => setStored('categories', categories), [categories]);
  useEffect(() => setStored('barterRequests', barterRequests), [barterRequests]);
  useEffect(() => setStored('buyRequests', buyRequests), [buyRequests]);
  useEffect(() => setStored('transactions', transactions), [transactions]);
  useEffect(() => setStored('messages', messages), [messages]);
  useEffect(() => setStored('reviews', reviews), [reviews]);
  useEffect(() => setStored('reports', reports), [reports]);
  useEffect(() => setStored('notifications', notifications), [notifications]);
  useEffect(() => setStored('wishlist', wishlist), [wishlist]);

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const currentRole = currentUser ? currentUser.role : 'GUEST';

  // Derived favorites array for current user
  const favorites = React.useMemo(() => {
    if (!currentUser) return [];
    return wishlist.filter((w) => w.userId === currentUser.id).map((w) => w.productId);
  }, [wishlist, currentUser]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loginAs = (userId: string | null) => {
    setCurrentUserId(userId);
    if (!userId) {
      showToast('Đã chuyển sang chế độ Khách (Guest)', 'info');
    } else {
      const u = users.find((x) => x.id === userId);
      if (u) {
        showToast(`Đã chuyển vai trò: ${u.fullName} (${u.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'})`, 'success');
      }
    }
  };

  const resetData = () => {
    localStorage.clear();
    setUsers(mockUsers);
    setCurrentUserId('user-1');
    setProducts(mockProducts);
    setCategories(mockCategories);
    setBarterRequests(mockBarterRequests);
    setBuyRequests(mockBuyRequests);
    setTransactions(mockTransactions);
    setMessages(mockMessages);
    setReviews(mockReviews);
    setReports(mockReports);
    setNotifications(mockNotifications);
    setWishlist(mockWishlist);
    showToast('Đã khôi phục dữ liệu mẫu ban đầu!', 'info');
  };

  // Helper: notify users who saved a product in their wishlist
  const notifyWishlistSubscribers = (
    productId: string,
    event: 'PRICE_DROP' | 'RESERVED' | 'COMPLETED',
    extra?: { oldPrice?: number; newPrice?: number; excludeUserIds?: string[] }
  ) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const excluded = new Set([prod.sellerId, ...(extra?.excludeUserIds || [])]);
    const wishers = wishlist.filter((w) => w.productId === productId && !excluded.has(w.userId));

    if (wishers.length === 0) return;

    let title = '';
    let message = '';

    if (event === 'PRICE_DROP') {
      title = 'Giảm giá sản phẩm trong Yêu thích!';
      message = `Sản phẩm "${prod.title}" trong danh sách yêu thích của bạn vừa giảm giá xuống còn ${extra?.newPrice?.toLocaleString('vi-VN')}₫ (${extra?.newPrice?.toLocaleString('vi-VN')} VNĐ)! (Giá cũ: ${extra?.oldPrice?.toLocaleString('vi-VN')}₫)`;
    } else if (event === 'RESERVED') {
      title = 'Sản phẩm yêu thích đang tạm giữ';
      message = `Sản phẩm "${prod.title}" bạn quan tâm đã có người hẹn gặp / đang có hẹn giao dịch (RESERVED)!`;
    } else if (event === 'COMPLETED') {
      title = 'Sản phẩm yêu thích đã hoàn tất';
      message = `Sản phẩm "${prod.title}" bạn quan tâm đã giao dịch thành công (COMPLETED)!`;
    }

    const newNotifs: Notification[] = wishers.map((w, idx) => ({
      id: `notif-wl-${event}-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      userId: w.userId,
      type: 'SYSTEM',
      title,
      message,
      link: `/products/${productId}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    }));

    setNotifications((prev) => [...newNotifs, ...prev]);
  };

  // Product operations
  const addProduct = (productData: Omit<Product, 'id' | 'views' | 'favoritesCount' | 'createdAt' | 'updatedAt'>): Product => {
    const newProd: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      views: 1,
      favoritesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast('Đăng tin sản phẩm thành công! Trạng thái: Còn hàng (AVAILABLE)', 'success');
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const oldProduct = products.find((p) => p.id === id);
    if (oldProduct && updates.price !== undefined && oldProduct.price !== undefined && updates.price < oldProduct.price) {
      notifyWishlistSubscribers(id, 'PRICE_DROP', { oldPrice: oldProduct.price, newPrice: updates.price });
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
    showToast('Cập nhật thông tin bài đăng thành công!', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setWishlist((prev) => prev.filter((w) => w.productId !== id));
    showToast('Đã xóa bài đăng khỏi hệ thống.', 'info');
  };

  const setProductStatus = (id: string, status: ProductStatus) => {
    const prod = products.find((p) => p.id === id);
    if (prod && (status === 'RESERVED' || status === 'COMPLETED')) {
      notifyWishlistSubscribers(id, status);
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p))
    );
    const statusLabels: Record<ProductStatus, string> = {
      AVAILABLE: 'Còn hàng (AVAILABLE)',
      RESERVED: 'Đã hẹn gặp / Tạm giữ (RESERVED)',
      COMPLETED: 'Đã giao dịch hoàn tất (COMPLETED)',
      HIDDEN: 'Tạm ẩn bài đăng (HIDDEN)',
      LOCKED: 'Bị khóa do vi phạm (LOCKED)',
      REMOVED: 'Đã gỡ bỏ (REMOVED)',
    };
    showToast(`Trạng thái bài đăng chuyển sang: ${statusLabels[status]}`, 'info');
  };

  const toggleFavorite = (productId: string): boolean => {
    if (!currentUser) {
      openLoginPrompt('Vui lòng đăng nhập để lưu sản phẩm vào danh sách yêu thích!');
      return false;
    }
    const isFav = wishlist.some((w) => w.userId === currentUser.id && w.productId === productId);
    if (isFav) {
      setWishlist((prev) => prev.filter((w) => !(w.userId === currentUser.id && w.productId === productId)));
      setProducts((prods) =>
        prods.map((p) =>
          p.id === productId ? { ...p, favoritesCount: Math.max(0, p.favoritesCount - 1) } : p
        )
      );
      showToast('Đã xóa khỏi danh sách yêu thích', 'info');
      return false;
    } else {
      const newItem: WishlistItem = {
        userId: currentUser.id,
        productId,
        savedAt: new Date().toISOString(),
      };
      setWishlist((prev) => [newItem, ...prev]);
      setProducts((prods) =>
        prods.map((p) =>
          p.id === productId ? { ...p, favoritesCount: p.favoritesCount + 1 } : p
        )
      );
      showToast('Đã thêm vào danh sách yêu thích', 'success');
      return true;
    }
  };

  const removeFromWishlist = (productId: string) => {
    if (!currentUser) return;
    setWishlist((prev) => prev.filter((w) => !(w.userId === currentUser.id && w.productId === productId)));
    setProducts((prods) =>
      prods.map((p) =>
        p.id === productId ? { ...p, favoritesCount: Math.max(0, p.favoritesCount - 1) } : p
      )
    );
    showToast('Đã xóa khỏi danh sách yêu thích', 'info');
  };

  const incrementProductViews = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, views: p.views + 1 } : p))
    );
  };

  // User profile
  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u)));
    showToast('Cập nhật hồ sơ cá nhân thành công!', 'success');
  };

  const lockUser = (userId: string, durationDays: number, reason: string) => {
    if (currentUser?.id === userId) {
      showToast('Quản trị viên không được phép tự khóa chính tài khoản Admin đang đăng nhập (BR-03).', 'error');
      throw new Error('Quản trị viên không được phép tự khóa chính tài khoản Admin đang đăng nhập (BR-03).');
    }
    const lockedUntil = new Date(Date.now() + durationDays * 86400000).toISOString();
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'LOCKED', lockedUntil, lockReason: reason } : u))
    );
    showToast(`Đã khóa tài khoản thành viên trong ${durationDays} ngày.`, 'warning');
  };

  const unlockUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'ACTIVE', lockedUntil: undefined, lockReason: undefined } : u))
    );
    showToast('Đã mở khóa tài khoản thành công!', 'success');
  };

  const toggleBlockUser = (targetUserId: string) => {
    if (!currentUser) return;
    const isBlocked = currentUser.blockedUserIds.includes(targetUserId);
    const updatedBlocked = isBlocked
      ? currentUser.blockedUserIds.filter((id) => id !== targetUserId)
      : [...currentUser.blockedUserIds, targetUserId];
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, blockedUserIds: updatedBlocked } : u))
    );
    showToast(isBlocked ? 'Đã bỏ chặn người dùng' : 'Đã thêm người dùng vào danh sách chặn', 'info');
  };

  // Barter requests
  const createBarterRequest = (data: {
    targetProductId: string;
    offeredProductId: string;
    compensationAmount: number;
    note: string;
  }): boolean => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để gửi đề nghị trao đổi!', 'error');
      return false;
    }
    const targetProd = products.find((p) => p.id === data.targetProductId);
    if (!targetProd) return false;

    const newReq: BarterRequest = {
      id: 'barter-' + Date.now(),
      targetProductId: data.targetProductId,
      offeredProductId: data.offeredProductId,
      senderId: currentUser.id,
      receiverId: targetProd.sellerId,
      compensationAmount: data.compensationAmount,
      note: data.note,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBarterRequests((prev) => [newReq, ...prev]);

    // Send notification to seller
    const newNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: targetProd.sellerId,
      type: 'OFFER',
      title: 'Đề nghị đổi đồ mới!',
      message: `${currentUser.fullName} vừa gửi đề nghị trao đổi cho sản phẩm "${targetProd.title}".`,
      link: '/user/exchanges',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Gửi đề nghị trao đổi thành công! Hãy đợi đối phương phản hồi.', 'success');
    return true;
  };

  const createBuyRequest = (data: {
    targetProductId: string;
    offeredPrice: number;
    note: string;
    meetupLocationPreference?: string;
  }): boolean => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để gửi đề xuất mua!', 'error');
      return false;
    }
    const targetProd = products.find((p) => p.id === data.targetProductId);
    if (!targetProd) return false;

    const newReq: BuyRequest = {
      id: 'buy-' + Date.now(),
      targetProductId: data.targetProductId,
      senderId: currentUser.id,
      receiverId: targetProd.sellerId,
      offeredPrice: data.offeredPrice,
      note: data.note,
      meetupLocationPreference: data.meetupLocationPreference,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    setBuyRequests((prev) => [newReq, ...prev]);

    const newNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: targetProd.sellerId,
      type: 'OFFER',
      title: 'Đề xuất mua hàng mới!',
      message: `${currentUser.fullName} gửi đề xuất mua "${targetProd.title}" với mức giá ${data.offeredPrice.toLocaleString('vi-VN')}₫.`,
      link: '/user/exchanges',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Gửi đề xuất mua thành công! Hãy đợi người bán phản hồi.', 'success');
    return true;
  };

  const acceptBarterRequest = (requestId: string) => {
    const req = barterRequests.find((r) => r.id === requestId);
    if (!req) return;

    // 1. Mark this request ACCEPTED
    setBarterRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'ACCEPTED', updatedAt: new Date().toISOString() } : r
      )
    );

    // 2. Mark other pending barter requests for same target product ON_HOLD (Waitlist Queue)
    setBarterRequests((prev) =>
      prev.map((r) =>
        r.targetProductId === req.targetProductId && r.id !== requestId && r.status === 'PENDING'
          ? { ...r, status: 'ON_HOLD', updatedAt: new Date().toISOString() }
          : r
      )
    );

    // 3. Also mark other pending buy requests for same target product ON_HOLD
    setBuyRequests((prev) =>
      prev.map((b) =>
        b.targetProductId === req.targetProductId && b.status === 'PENDING'
          ? { ...b, status: 'ON_HOLD' }
          : b
      )
    );

    // 4. Mark target product RESERVED
    setProducts((prev) =>
      prev.map((p) =>
        p.id === req.targetProductId ? { ...p, status: 'RESERVED', updatedAt: new Date().toISOString() } : p
      )
    );
    notifyWishlistSubscribers(req.targetProductId, 'RESERVED', { excludeUserIds: [req.senderId, req.receiverId] });

    // 5. Create Meetup Transaction
    const newTx: MeetupTransaction = {
      id: 'tx-' + Date.now(),
      requestId: req.id,
      requestType: 'BARTER',
      buyerId: req.senderId,
      sellerId: req.receiverId,
      productId: req.targetProductId,
      offeredProductId: req.offeredProductId,
      compensationAmount: req.compensationAmount,
      appointmentTime: new Date(Date.now() + 2 * 86400000).toISOString(),
      appointmentLocation: 'Địa điểm công cộng thỏa thuận (ví dụ: The Coffee House gần trung tâm)',
      buyerConfirmed: false,
      sellerConfirmed: false,
      status: 'APPOINTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // 6. Notify the buyer
    const targetProd = products.find((p) => p.id === req.targetProductId);
    const newNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: req.senderId,
      type: 'TRANSACTION',
      title: 'Đề nghị trao đổi được chấp thuận!',
      message: `Người bán đã đồng ý trao đổi "${targetProd?.title}". Hãy kiểm tra thông tin liên hệ và trao đổi lịch hẹn.`,
      link: `/user/transactions/${newTx.id}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Đã chấp nhận đề nghị! Tin đăng chuyển sang Tạm giữ (RESERVED) và đã mở thông tin liên hệ.', 'success');
  };

  const rejectBarterRequest = (requestId: string, reason?: string) => {
    setBarterRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'REJECTED', rejectReason: reason, updatedAt: new Date().toISOString() } : r
      )
    );
    showToast('Đã từ chối đề nghị trao đổi.', 'info');
  };

  const cancelBarterRequest = (requestId: string) => {
    setBarterRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'CANCELLED', updatedAt: new Date().toISOString() } : r
      )
    );
    showToast('Đã hủy đề nghị trao đổi của bạn.', 'info');
  };

  const acceptBuyRequest = (requestId: string) => {
    const req = buyRequests.find((r) => r.id === requestId);
    if (!req) return;

    // 1. Mark this buy request ACCEPTED
    setBuyRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'ACCEPTED' } : r))
    );

    // 2. Mark other pending buy requests for same target product ON_HOLD
    setBuyRequests((prev) =>
      prev.map((b) =>
        b.targetProductId === req.targetProductId && b.id !== requestId && b.status === 'PENDING'
          ? { ...b, status: 'ON_HOLD' }
          : b
      )
    );

    // 3. Mark pending barter requests for same target product ON_HOLD
    setBarterRequests((prev) =>
      prev.map((r) =>
        r.targetProductId === req.targetProductId && r.status === 'PENDING'
          ? { ...r, status: 'ON_HOLD', updatedAt: new Date().toISOString() }
          : r
      )
    );

    // 4. Mark target product RESERVED
    setProducts((prev) =>
      prev.map((p) =>
        p.id === req.targetProductId ? { ...p, status: 'RESERVED', updatedAt: new Date().toISOString() } : p
      )
    );
    notifyWishlistSubscribers(req.targetProductId, 'RESERVED', { excludeUserIds: [req.senderId, req.receiverId] });

    // 5. Create Meetup Transaction
    const newTx: MeetupTransaction = {
      id: 'tx-' + Date.now(),
      requestId: req.id,
      requestType: 'BUY',
      buyerId: req.senderId,
      sellerId: req.receiverId,
      productId: req.targetProductId,
      agreedPrice: req.offeredPrice,
      appointmentTime: new Date(Date.now() + 2 * 86400000).toISOString(),
      appointmentLocation: req.meetupLocationPreference || 'Địa điểm công cộng trung tâm (Highlands Coffee / TTTM)',
      buyerConfirmed: false,
      sellerConfirmed: false,
      status: 'APPOINTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // 6. Notify the buyer
    const targetProd = products.find((p) => p.id === req.targetProductId);
    const newNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: req.senderId,
      type: 'TRANSACTION',
      title: 'Đề xuất mua hàng được chấp thuận!',
      message: `Người bán đã đồng ý mức giá ${req.offeredPrice.toLocaleString('vi-VN')}₫ cho "${targetProd?.title}". Hãy hẹn gặp trực tiếp.`,
      link: `/user/transactions/${newTx.id}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Đã chấp nhận đề xuất mua! Đã tạo lịch hẹn gặp và mở thông tin liên hệ.', 'success');
  };

  const rejectBuyRequest = (requestId: string, reason?: string) => {
    setBuyRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'REJECTED', rejectReason: reason } : r))
    );
    showToast('Đã từ chối đề xuất mua.', 'info');
  };

  const cancelBuyRequest = (requestId: string) => {
    setBuyRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'CANCELLED' } : r))
    );
    showToast('Đã hủy đề xuất mua.', 'info');
  };

  // Transaction confirmations & appointments
  const confirmTransaction = (transactionId: string) => {
    if (!currentUser) return;
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) return;

    const isBuyer = tx.buyerId === currentUser.id;
    const isSeller = tx.sellerId === currentUser.id;
    if (!isBuyer && !isSeller) return;

    const updatedBuyerConfirmed = isBuyer ? true : tx.buyerConfirmed;
    const updatedSellerConfirmed = isSeller ? true : tx.sellerConfirmed;
    const isFullyCompleted = updatedBuyerConfirmed && updatedSellerConfirmed;

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === transactionId) {
          return {
            ...t,
            buyerConfirmed: updatedBuyerConfirmed,
            sellerConfirmed: updatedSellerConfirmed,
            status: isFullyCompleted ? 'COMPLETED' : t.status,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    if (isFullyCompleted) {
      // Mark target product COMPLETED
      // AND mark offered product COMPLETED if barter exchange!
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === tx.productId || (tx.offeredProductId && p.id === tx.offeredProductId)) {
            return { ...p, status: 'COMPLETED', updatedAt: new Date().toISOString() };
          }
          return p;
        })
      );
      notifyWishlistSubscribers(tx.productId, 'COMPLETED', { excludeUserIds: [tx.buyerId, tx.sellerId] });
      if (tx.offeredProductId) {
        notifyWishlistSubscribers(tx.offeredProductId, 'COMPLETED', { excludeUserIds: [tx.buyerId, tx.sellerId] });
      }

      // Auto-close any ON_HOLD offers for these products (UC14/15)
      setBarterRequests((prev) =>
        prev.map((r) =>
          (r.targetProductId === tx.productId || (tx.offeredProductId && r.offeredProductId === tx.offeredProductId)) && r.status === 'ON_HOLD'
            ? { ...r, status: 'CANCELLED', rejectReason: 'Sản phẩm đã hoàn tất giao dịch với đối tác khác.', updatedAt: new Date().toISOString() }
            : r
        )
      );

      setBuyRequests((prev) =>
        prev.map((b) =>
          b.targetProductId === tx.productId && b.status === 'ON_HOLD'
            ? { ...b, status: 'CANCELLED', rejectReason: 'Sản phẩm đã hoàn tất giao dịch với đối tác khác.' }
            : b
        )
      );

      // Increment transactions count for both users
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === tx.buyerId || u.id === tx.sellerId) {
            return { ...u, totalTransactions: u.totalTransactions + 1 };
          }
          return u;
        })
      );

      showToast('Giao dịch HOÀN TẤT THÀNH CÔNG! Cả 2 bên đã xác nhận và mở quyền đánh giá uy tín.', 'success');
    } else {
      showToast('Bạn đã xác nhận bàn giao hàng! Đang chờ đối tác bấm xác nhận để hoàn tất.', 'info');
    }
  };

  const rescheduleMeetup = (transactionId: string, newTime: string, newLocation: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              appointmentTime: newTime,
              appointmentLocation: newLocation,
              status: 'RESCHEDULED',
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    showToast('Đã dời lịch hẹn gặp thành công và gửi thông báo cho đối phương.', 'success');
  };

  const cancelTransaction = (transactionId: string, reason: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'CANCELLED', cancelReason: reason } : t))
    );

    // Revert target product to AVAILABLE
    // And revert offered product to AVAILABLE if barter
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === tx.productId || (tx.offeredProductId && p.id === tx.offeredProductId)) {
          return { ...p, status: 'AVAILABLE', updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );

    // Revert ON_HOLD offers back to PENDING so seller can choose another offer! (UC14, UC17 BR 17_4)
    setBarterRequests((prev) =>
      prev.map((r) =>
        r.targetProductId === tx.productId && r.status === 'ON_HOLD'
          ? { ...r, status: 'PENDING', updatedAt: new Date().toISOString() }
          : r
      )
    );

    setBuyRequests((prev) =>
      prev.map((b) =>
        b.targetProductId === tx.productId && b.status === 'ON_HOLD'
          ? { ...b, status: 'PENDING' }
          : b
      )
    );

    showToast('Giao dịch đã hủy. Bài đăng được phục hồi trạng thái Còn hàng (AVAILABLE) và kích hoạt lại hàng chờ.', 'info');
  };

  // Messages
  const sendMessage = (transactionId: string, receiverId: string, content: string) => {
    if (!currentUser) return;
    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      transactionId,
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Reviews
  const submitReview = (data: {
    transactionId: string;
    targetUserId: string;
    rating: number;
    criteria: { punctuality: number; courtesy: number; accuracy: number };
    comment: string;
  }) => {
    if (!currentUser) return;
    const tx = transactions.find((t) => t.id === data.transactionId);
    if (!tx || tx.status !== 'COMPLETED') {
      showToast('Chỉ có thể đánh giá khi giao dịch đã hoàn tất thành công (COMPLETED).', 'error');
      return;
    }

    const alreadyReviewed = reviews.some(
      (r) => r.transactionId === data.transactionId && r.reviewerId === currentUser.id
    );
    if (alreadyReviewed) {
      showToast('Mỗi bên chỉ được đánh giá 01 lần cho mỗi giao dịch hoàn tất.', 'warning');
      return;
    }

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      transactionId: data.transactionId,
      reviewerId: currentUser.id,
      targetUserId: data.targetUserId,
      rating: data.rating,
      criteria: data.criteria,
      comment: data.comment,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate rating & review count for target user
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === data.targetUserId) {
          const userReviews = [...reviews.filter((r) => r.targetUserId === u.id), newRev];
          const avg = userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length;
          return {
            ...u,
            rating: Math.round(avg * 10) / 10,
            reviewCount: userReviews.length,
          };
        }
        return u;
      })
    );

    showToast('Gửi đánh giá uy tín thành công! Cảm ơn bạn đã đóng góp cho cộng đồng ReLoop.', 'success');
  };

  const appealReview = (reviewId: string, reason: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isAppealed: true, appealReason: reason } : r))
    );
    showToast('Đã gửi khiếu nại đánh giá lên Ban Quản Trị để đối soát.', 'info');
  };

  const resolveReviewAppeal = (reviewId: string, action: 'DISMISS' | 'REMOVE_REVIEW') => {
    const rev = reviews.find((r) => r.id === reviewId);
    if (!rev) return;

    if (action === 'REMOVE_REVIEW') {
      const updatedReviews = reviews.filter((r) => r.id !== reviewId);
      setReviews(updatedReviews);

      // Recalculate target user's ratings without this review
      const targetUserReviews = updatedReviews.filter((r) => r.targetUserId === rev.targetUserId);
      const avg = targetUserReviews.length > 0
        ? targetUserReviews.reduce((acc, r) => acc + r.rating, 0) / targetUserReviews.length
        : 5.0;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === rev.targetUserId
            ? { ...u, rating: Math.round(avg * 10) / 10, reviewCount: targetUserReviews.length }
            : u
        )
      );
      showToast('Đã gỡ bỏ đánh giá vi phạm và cập nhật lại điểm uy tín cho thành viên.', 'success');
    } else {
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isAppealed: false, appealReason: undefined } : r))
      );
      showToast('Đã bác bỏ khiếu nại và giữ nguyên đánh giá.', 'info');
    }
  };

  // Reports
  const submitReport = (data: {
    targetType: 'POST' | 'USER';
    targetId: string;
    reason: any;
    description: string;
    evidenceImages: string[];
  }) => {
    if (!currentUser) return;
    const newReport: Report = {
      id: 'rep-' + Date.now(),
      reporterId: currentUser.id,
      targetType: data.targetType,
      targetId: data.targetId,
      reason: data.reason,
      description: data.description,
      evidenceImages: data.evidenceImages,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
    showToast('Đã gửi báo cáo vi phạm thành công. Admin sẽ kiểm tra và đối soát bằng chứng.', 'success');
  };

  const processReport = (
    reportId: string,
    actionTaken: 'WARNING' | 'DOCK_TRUST' | 'LOCK_USER' | 'REMOVE_POST' | 'DISMISSED',
    resolutionNote: string
  ) => {
    const rep = reports.find((r) => r.id === reportId);
    if (!rep) return;

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'PROCESSED',
              actionTaken,
              resolutionNote,
              resolvedAt: new Date().toISOString(),
            }
          : r
      )
    );

    if (actionTaken === 'LOCK_USER' && rep.targetType === 'USER') {
      lockUser(rep.targetId, 30, `Xử lý vi phạm từ báo cáo ${reportId}: ${resolutionNote}`);
    } else if (actionTaken === 'REMOVE_POST' && rep.targetType === 'POST') {
      setProductStatus(rep.targetId, 'REMOVED');
    } else if (actionTaken === 'DOCK_TRUST') {
      const targetUserId = rep.targetType === 'USER' ? rep.targetId : products.find((p) => p.id === rep.targetId)?.sellerId;
      if (targetUserId) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUserId ? { ...u, trustScore: Math.max(0, u.trustScore - 15) } : u))
        );
      }
    }

    showToast(`Đã xử lý báo cáo [${actionTaken}]: ${resolutionNote}`, 'success');
  };

  // Categories
  const addCategory = (catData: Omit<Category, 'id' | 'productCount'>) => {
    const newCat: Category = {
      ...catData,
      id: 'cat-' + Date.now(),
      productCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Đã thêm danh mục mới: ${catData.name}`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Cập nhật thông tin danh mục thành công!', 'success');
  };

  const toggleHideCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isHidden: !c.isHidden } : c))
    );
    showToast('Đã thay đổi trạng thái hiển thị danh mục.', 'info');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('Đã đánh dấu tất cả thông báo là đã đọc.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        users,
        products,
        categories,
        barterRequests,
        buyRequests,
        transactions,
        messages,
        reviews,
        reports,
        notifications,
        favorites,
        wishlist,
        stats,
        toasts,
        showToast,
        dismissToast,
        loginAs,
        resetData,
        addProduct,
        updateProduct,
        deleteProduct,
        setProductStatus,
        toggleFavorite,
        removeFromWishlist,
        incrementProductViews,
        isLoginPromptOpen,
        loginPromptMessage,
        openLoginPrompt,
        closeLoginPrompt,
        updateProfile,
        lockUser,
        unlockUser,
        toggleBlockUser,
        createBarterRequest,
        createBuyRequest,
        acceptBarterRequest,
        rejectBarterRequest,
        cancelBarterRequest,
        acceptBuyRequest,
        rejectBuyRequest,
        cancelBuyRequest,
        confirmTransaction,
        rescheduleMeetup,
        cancelTransaction,
        sendMessage,
        submitReview,
        appealReview,
        resolveReviewAppeal,
        submitReport,
        processReport,
        addCategory,
        updateCategory,
        toggleHideCategory,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
