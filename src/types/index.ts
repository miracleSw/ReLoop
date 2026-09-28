export type UserRole = 'USER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'LOCKED';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  province: string;
  district: string;
  ward: string;
  zaloPhone?: string;
  trustScore: number; // 0 - 100
  totalTransactions: number;
  rating: number; // 0 - 5.0
  reviewCount: number;
  role: UserRole;
  status: UserStatus;
  lockedUntil?: string;
  lockReason?: string;
  createdAt: string;
  blockedUserIds: string[];
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  displayOrder: number;
  isHidden: boolean;
  productCount: number;
}

export type ProductCondition = 'Mới 99%' | 'Còn tốt' | 'Đã sử dụng nhiều' | 'Cần sửa chữa';

export type TransactionType = 'SELL' | 'EXCHANGE' | 'BOTH';

export type ProductStatus = 'AVAILABLE' | 'RESERVED' | 'COMPLETED' | 'HIDDEN' | 'LOCKED' | 'REMOVED';

export interface ProductLocation {
  province: string;
  district: string;
  ward: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  condition: ProductCondition;
  type: TransactionType;
  price?: number; // for SELL or BOTH
  originalPrice?: number;
  wantedExchangeItems?: string; // description of what seller wants in return
  images: string[];
  location: ProductLocation;
  sellerId: string;
  status: ProductStatus;
  views: number;
  favoritesCount: number;
  createdAt: string;
  updatedAt: string;
  flagProhibited?: boolean;
  prohibitedKeywordFound?: string;
}

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'ON_HOLD';

export interface BarterRequest {
  id: string;
  targetProductId: string;
  offeredProductId: string;
  senderId: string;
  receiverId: string;
  compensationAmount: number; // positive = sender pays extra, 0 = equal
  note: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
  rejectReason?: string;
}

export interface BuyRequest {
  id: string;
  targetProductId: string;
  senderId: string;
  receiverId: string;
  offeredPrice: number;
  note: string;
  meetupLocationPreference?: string;
  status: OfferStatus;
  createdAt: string;
  rejectReason?: string;
}

export type MeetupStatus = 'APPOINTED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';

export interface MeetupTransaction {
  id: string;
  requestId: string;
  requestType: 'BARTER' | 'BUY';
  buyerId: string;
  sellerId: string;
  productId: string;
  offeredProductId?: string; // if BARTER
  compensationAmount?: number;
  agreedPrice?: number; // if BUY
  appointmentTime: string; // ISO date string
  appointmentLocation: string; // e.g., "The Coffee House, 45 Lê Duẩn, Q.1"
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
  status: MeetupStatus;
  cancelReason?: string;
  disputeNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  transactionId: string; // linked to transaction or request
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ReviewCriteria {
  punctuality: number; // 1-5 sao: Đúng giờ khi hẹn
  courtesy: number; // 1-5 sao: Thái độ lịch sự, tôn trọng
  accuracy: number; // 1-5 sao: Sản phẩm đúng như mô tả
}

export interface Review {
  id: string;
  transactionId: string;
  reviewerId: string;
  targetUserId: string;
  rating: number; // Overall 1-5
  criteria: ReviewCriteria;
  comment: string;
  createdAt: string;
  isAppealed?: boolean;
  appealReason?: string;
  isHidden?: boolean;
}

export type ReportTargetType = 'POST' | 'USER';

export type ReportReason =
  | 'Hàng cấm / Vi phạm pháp luật'
  | 'Hàng giả / Sai mô tả nghiêm trọng'
  | 'Lừa đảo / Chiếm đoạt tài sản'
  | 'Bùng hẹn / Không đến điểm hẹn'
  | 'Quấy rối / Thái độ xúc phạm'
  | 'Lý do khác';

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description: string;
  evidenceImages: string[];
  status: 'PENDING' | 'PROCESSED';
  createdAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
  actionTaken?: 'WARNING' | 'DOCK_TRUST' | 'LOCK_USER' | 'REMOVE_POST' | 'DISMISSED';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'OFFER' | 'TRANSACTION' | 'SYSTEM' | 'REVIEW' | 'WARNING';
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface SystemStats {
  totalUsers: number;
  totalPosts: number;
  totalTransactions: number;
  totalReports: number;
  activeUsers: number;
  lockedUsers?: number;
  availablePosts?: number;
  reservedPosts?: number;
  completedPosts?: number;
  lockedPosts?: number;
  successRate: number;
  disputeRate?: number;
  categoryDistribution: { name: string; count: number; percentage: number }[];
  monthlyTrend: { month: string; posts: number; transactions: number; users: number }[];
}
