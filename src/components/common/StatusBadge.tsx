import React from 'react';
import { ProductStatus, OfferStatus, MeetupStatus } from '../../types';

interface StatusBadgeProps {
  status: ProductStatus | OfferStatus | MeetupStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5',
  }[size];

  // Config for each business status
  const config: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
    // Product states (UC07)
    AVAILABLE: {
      label: 'Còn hàng / Đang hiển thị',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200',
    },
    RESERVED: {
      label: 'Đã hẹn gặp / Tạm giữ',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      dot: 'bg-amber-500 animate-pulse',
      border: 'border-amber-200',
    },
    COMPLETED: {
      label: 'Đã giao dịch thành công',
      bg: 'bg-eco-50',
      text: 'text-eco-900',
      dot: 'bg-eco-600',
      border: 'border-eco-200',
    },
    HIDDEN: {
      label: 'Tạm ẩn bài đăng',
      bg: 'bg-sand-100',
      text: 'text-sand-700',
      dot: 'bg-sand-400',
      border: 'border-sand-200',
    },
    LOCKED: {
      label: 'Bị khóa bởi Admin',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      dot: 'bg-rose-500',
      border: 'border-rose-200',
    },
    REMOVED: {
      label: 'Đã gỡ bỏ vĩnh viễn',
      bg: 'bg-rose-100',
      text: 'text-rose-900',
      dot: 'bg-rose-600',
      border: 'border-rose-300',
    },

    // Offer states (UC14, UC15, UC16)
    PENDING: {
      label: 'Đang chờ duyệt',
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      dot: 'bg-sky-500 animate-pulse',
      border: 'border-sky-200',
    },
    ACCEPTED: {
      label: 'Đã chấp nhận',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200',
    },
    REJECTED: {
      label: 'Đã từ chối',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      dot: 'bg-rose-500',
      border: 'border-rose-200',
    },
    CANCELLED: {
      label: 'Đã hủy',
      bg: 'bg-sand-100',
      text: 'text-sand-600',
      dot: 'bg-sand-400',
      border: 'border-sand-200',
    },
    ON_HOLD: {
      label: 'Trong hàng chờ',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-400',
      border: 'border-amber-200',
    },

    // Meetup states (UC17, UC18)
    APPOINTED: {
      label: 'Đã lên lịch hẹn gặp',
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      dot: 'bg-teal-500',
      border: 'border-teal-200',
    },
    RESCHEDULED: {
      label: 'Đã dời lịch hẹn',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      border: 'border-amber-200',
    },
    DISPUTED: {
      label: 'Có khiếu nại / Tranh chấp',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      dot: 'bg-purple-500',
      border: 'border-purple-200',
    },

    // User states
    ACTIVE: {
      label: 'Hoạt động',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200',
    },
    PROCESSED: {
      label: 'Đã xử lý xong',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200',
    },
  };

  const item = config[status] || {
    label: status,
    bg: 'bg-sand-100',
    text: 'text-charcoal-700',
    dot: 'bg-charcoal-400',
    border: 'border-sand-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-subtle ${item.bg} ${item.text} ${item.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
      <span>{item.label}</span>
    </span>
  );
};
