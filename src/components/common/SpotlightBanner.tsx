import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Sparkles,
  ArrowRight,
  ArrowRightLeft,
  ShieldCheck,
  CheckCircle2,
  Star,
  Leaf,
  Clock,
  RotateCcw,
  Camera,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface EcoMetric {
  label: string;
  value: string;
  subtext?: string;
  iconName?: 'leaf' | 'recycle' | 'star' | 'shield' | 'clock' | 'sparkles';
}

export interface SpotlightAuthor {
  name: string;
  location: string;
  rating: string | number;
  avatar: string;
  verified?: boolean;
}

export interface SpotlightItem {
  id: string;
  collection: string;
  pillBadge: string;
  headlinePrefix: string;
  headlineHighlight: string;
  highlightColor?: 'emerald' | 'clay';
  author: SpotlightAuthor;
  description: string;
  metadataBadges: string[];
  primaryCta: {
    label: string;
    link: string;
  };
  secondaryCta: {
    label: string;
    link: string;
  };
  ecoMetrics: [EcoMetric, EcoMetric, EcoMetric];
  images: {
    front: string;
    mid: string;
    back: string;
  };
  productId?: string;
}

export const defaultSpotlightSlides: SpotlightItem[] = [
  {
    id: 'spotlight-1',
    collection: 'Máy ảnh phim Olympus OM-1 Vintage',
    pillBadge: 'Bộ sưu tập tuyển chọn • Tiêu điểm tuần hoàn',
    headlinePrefix: 'Ghi lại khoảnh khắc cùng',
    headlineHighlight: 'cỗ máy cơ học nguyên bản',
    highlightColor: 'emerald',
    author: {
      name: 'Minh Triết',
      location: 'Q.1, TP.HCM',
      rating: '5.0★',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      verified: true
    },
    description:
      'Dòng SLR cơ học huyền thoại của Yoshihisa Maitani với kính ngắm siêu sáng 0.92x. Cơ tốc 1s - 1/1000s đanh giòn, đo sáng kim chỉ nhạy bén, đồng hành cùng bạn trên mọi nẻo đường sáng tạo bền vững.',
    metadataBadges: ['Độ mới 95%', 'Kèm Lens 50mm f/1.8', 'Định giá: 2.800.000 đ'],
    primaryCta: {
      label: 'Xem chi tiết & Giao lưu',
      link: '/explore?q=Olympus'
    },
    secondaryCta: {
      label: 'Đề nghị đổi đồ',
      link: '/explore?q=Olympus'
    },
    ecoMetrics: [
      { label: 'Giảm phát thải', value: '-8.4 kg CO₂', iconName: 'leaf' },
      { label: 'Bảo tồn giá trị', value: 'Bảo lưu 45 năm', iconName: 'clock' },
      { label: 'Thẩm định chất lượng', value: '100% Hoạt động tốt', iconName: 'shield' }
    ],
    images: {
      front: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
      mid: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
      back: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80'
    }
  },
  {
    id: 'spotlight-2',
    collection: 'Ghế mây bập bênh Thư Giãn Mid-Century',
    pillBadge: 'Nội thất thủ công • Sợi tự nhiên bản địa',
    headlinePrefix: 'Hơi thở thiên nhiên cho',
    headlineHighlight: 'góc đọc sách bình yên',
    highlightColor: 'clay',
    author: {
      name: 'Thu Hà',
      location: 'Bình Thạnh',
      rating: '4.9★',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      verified: true
    },
    description:
      'Chế tác thủ công từ song mây tự nhiên đã qua xử lý khử khuẩn và phủ dầu sáp hữu cơ an toàn. Độ đàn hồi êm ái lý tưởng cho những buổi chiều thư giãn thanh thản bên trang sách yêu thích.',
    metadataBadges: ['Chất liệu Mây tự nhiên', 'Đã khử khuẩn & phủ dầu sáp', 'Trao đổi đồ gia dụng'],
    primaryCta: {
      label: 'Xem chi tiết & Đặt hẹn',
      link: '/explore?category=cat-home'
    },
    secondaryCta: {
      label: 'Đề nghị đổi đồ',
      link: '/explore?category=cat-home'
    },
    ecoMetrics: [
      { label: 'Giảm phát thải', value: '-18.2 kg CO₂', iconName: 'leaf' },
      { label: 'Vòng tuần hoàn', value: 'Vật liệu tái sinh', iconName: 'recycle' },
      { label: 'Tay nghề nghệ nhân', value: 'Thủ công 100%', iconName: 'star' }
    ],
    images: {
      front: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
      mid: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=900&q=80',
      back: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80'
    }
  },
  {
    id: 'spotlight-3',
    collection: 'Bàn phím cơ Custom HHKB Layout Gỗ Óc Chó',
    pillBadge: 'Đồ công nghệ bền vững • Re-engineered',
    headlinePrefix: 'Nâng tầm góc làm việc tối giản với',
    headlineHighlight: 'cảm giác gõ êm ái',
    highlightColor: 'emerald',
    author: {
      name: 'Hoàng Nam',
      location: 'Cầu Giấy, Hà Nội',
      rating: '5.0★',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      verified: true
    },
    description:
      'Bộ vỏ phay CNC từ gỗ óc chó nguyên khối đã lau dầu dưỡng gỗ, kết hợp switch Linear bôi trơn Krytox 205g0 mượt mà. Layout 60% công thái học gọn gàng, giảm mỏi cổ tay khi làm việc đường dài.',
    metadataBadges: ['Switch bôi trơn Krytox', 'Keycap PBT Retro', 'Định giá: 1.650.000 đ'],
    primaryCta: {
      label: 'Xem chi tiết bàn phím',
      link: '/products/prod-2'
    },
    secondaryCta: {
      label: 'Giao lưu phụ kiện',
      link: '/explore?category=cat-tech'
    },
    ecoMetrics: [
      { label: 'Giảm phát thải', value: '-3.1 kg CO₂', iconName: 'leaf' },
      { label: 'Vòng đời mới', value: 'Tái sinh linh kiện', iconName: 'recycle' },
      { label: 'Độ bền vượt trội', value: 'Độ bền 10 năm', iconName: 'shield' }
    ],
    images: {
      front: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
      mid: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80',
      back: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80'
    }
  },
  {
    id: 'spotlight-4',
    collection: 'Xe đạp Touring Thép Cr-Mo Khung Đôi Cổ Điển',
    pillBadge: 'Zero Emission • Phương tiện xanh thành phố',
    headlinePrefix: 'Chuyển động xanh trên từng',
    headlineHighlight: 'cung đường thành phố',
    highlightColor: 'emerald',
    author: {
      name: 'Lan Chi',
      location: 'TP. Huế',
      rating: '5.0★',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      verified: true
    },
    description:
      'Khung thép hợp kim Cr-Mo dẻo dai nguyên bản, groupset Shimano Altus 3x8 đã được cân chỉnh bảo dưỡng toàn bộ. Lựa chọn tuyệt vời cho những chuyến dạo mát cuối tuần hoặc đi làm hàng ngày không khói bụi.',
    metadataBadges: ['Độ mới 92%', 'Đã cân vành & thay xích mới', 'Sẵn sàng giao lưu / Bán'],
    primaryCta: {
      label: 'Xem chi tiết xe đạp',
      link: '/products/prod-3'
    },
    secondaryCta: {
      label: 'Đề nghị đổi đồ',
      link: '/explore?category=cat-sports'
    },
    ecoMetrics: [
      { label: 'Giảm phát thải', value: '-42.0 kg CO₂', iconName: 'leaf' },
      { label: 'Tiêu hao năng lượng', value: '0% Xăng dầu', iconName: 'recycle' },
      { label: 'Lối sống bền vững', value: '100% Vận động xanh', iconName: 'star' }
    ],
    images: {
      front: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
      mid: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=900&q=80',
      back: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=80'
    }
  }
];

export interface SpotlightBannerProps {
  slides?: SpotlightItem[];
  autoPlayInterval?: number;
  className?: string;
  onSlideChange?: (index: number) => void;
}

export const SpotlightBanner: React.FC<SpotlightBannerProps> = ({
  slides = defaultSpotlightSlides,
  autoPlayInterval = 5000,
  className = '',
  onSlideChange
}) => {
  const navigate = useNavigate();
  const activeSlides = slides && slides.length > 0 ? slides : defaultSpotlightSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isSwipingRef = useRef(false);

  const totalSlides = activeSlides.length;
  const current = activeSlides[currentSlide] || activeSlides[0];

  const goToSlide = useCallback(
    (index: number) => {
      const targetIndex = (index + totalSlides) % totalSlides;
      progressRef.current = 0;
      setCurrentSlide(targetIndex);
      setProgress(0);
      onSlideChange?.(targetIndex);
    },
    [totalSlides, onSlideChange]
  );

  const nextSlide = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentSlide((prev) => {
      const nextIndex = (prev + 1) % totalSlides;
      onSlideChange?.(nextIndex);
      return nextIndex;
    });
  }, [totalSlides, onSlideChange]);

  const prevSlide = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentSlide((prev) => {
      const prevIndex = (prev - 1 + totalSlides) % totalSlides;
      onSlideChange?.(prevIndex);
      return prevIndex;
    });
  }, [totalSlides, onSlideChange]);

  const nextSlideRef = useRef(nextSlide);
  useEffect(() => {
    nextSlideRef.current = nextSlide;
  }, [nextSlide]);

  // Auto-play timer with progress ticker
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const stepMs = 50;
    const increment = (stepMs / autoPlayInterval) * 100;

    const timer = setInterval(() => {
      progressRef.current += increment;
      if (progressRef.current >= 100) {
        progressRef.current = 0;
        setProgress(0);
        nextSlideRef.current();
      } else {
        setProgress(progressRef.current);
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, totalSlides]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const tagName = activeEl?.tagName;
      if (
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT' ||
        activeEl?.isContentEditable
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingRef.current = false;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartXRef.current;

    // Check vertical movement if clientY is available
    const hasY =
      touchStartYRef.current !== undefined &&
      touchStartYRef.current !== null &&
      e.changedTouches[0]?.clientY !== undefined;
    const diffY = hasY ? e.changedTouches[0].clientY - (touchStartYRef.current ?? 0) : 0;

    // Only process horizontal swipe if horizontal movement exceeds vertical movement
    if ((!hasY || Math.abs(diffX) > Math.abs(diffY)) && Math.abs(diffX) > 50) {
      isSwipingRef.current = true;
      if (diffX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
      // Keep isSwiping flag briefly to prevent accidental tap/click navigation
      setTimeout(() => {
        isSwipingRef.current = false;
      }, 200);
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const renderEcoIcon = (name?: string) => {
    switch (name) {
      case 'leaf':
        return <Leaf className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'clock':
        return <Clock className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'shield':
        return <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'recycle':
        return <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'star':
        return <Star className="w-3.5 h-3.5 flex-shrink-0" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />;
    }
  };

  return (
    <div
      className={clsx(
        'relative rounded-3xl lg:rounded-4xl bg-gradient-to-br from-eco-950 via-[#122416] to-charcoal-900 text-white p-6 sm:p-10 lg:p-14 overflow-hidden shadow-elevated border border-eco-900/60 select-none group/banner touch-pan-y',
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="ReLoop Spotlight Showcase Banner"
    >
      {/* Ambient Lighting Blobs (Emerald & Terracotta Clay) */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 bg-eco-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: '6s' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-16 w-80 h-80 bg-clay-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: '8s' }}
        aria-hidden="true"
      />

      {/* 45-degree Diagonal Micro-grid Texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 0, rgba(255, 255, 255, 0.15) 1px, transparent 0, transparent 18px)'
        }}
        aria-hidden="true"
      />

      {/* Floating Arrow Controls (Desktop / Tablet) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 backdrop-blur-md text-white border border-white/15 hidden md:flex items-center justify-center transition-all shadow-lg hover:shadow-emerald-500/20"
        aria-label="Xem sản phẩm trước"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 backdrop-blur-md text-white border border-white/15 hidden md:flex items-center justify-center transition-all shadow-lg hover:shadow-emerald-500/20"
        aria-label="Xem sản phẩm tiếp theo"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Main Content Layout: Left Storytelling (58%) & Right 3D Card Fan Deck (42%) */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-8 lg:gap-12">
        {/* LEFT COLUMN: Storytelling & Action Hub (58% width on desktop) */}
        <div
          key={`left-${current.id}`}
          className="w-full lg:w-[58%] flex flex-col justify-between space-y-6 animate-fade-in"
        >
          {/* Top Pill Badge */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse flex-shrink-0" />
              <span className="truncate">{current.pillBadge}</span>
            </div>
          </div>

          {/* Display Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.2] tracking-tight">
            {current.headlinePrefix}{' '}
            <span
              className={clsx(
                'font-editorial italic font-normal block sm:inline',
                current.highlightColor === 'clay' ? 'text-clay-300' : 'text-emerald-300'
              )}
            >
              {current.headlineHighlight}
            </span>
          </h2>

          {/* Sub-author / Owner info & Verification */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-sand-300 text-xs sm:text-sm font-medium">
            <img
              src={current.author.avatar}
              alt={current.author.name}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-1 ring-white/30 flex-shrink-0"
            />
            <span className="text-white font-semibold">{current.author.name}</span>
            <span className="text-sand-500">•</span>
            <span>{current.author.location}</span>
            <span className="text-sand-500">•</span>
            <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-xs font-semibold text-amber-300 border border-white/10">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
              <span>{current.author.rating}</span>
            </span>
            {current.author.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <span>Đã xác minh</span>
              </span>
            )}
          </div>

          {/* Concise Description (Max 3 lines) */}
          <p className="text-sand-200/90 text-sm sm:text-base leading-relaxed max-w-xl line-clamp-3 font-normal">
            {current.description}
          </p>

          {/* Metadata Badges (Frosted glass badges) */}
          <div className="flex flex-wrap items-center gap-2">
            {current.metadataBadges.map((badge, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md border border-white/15 text-sand-100 shadow-sm"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
            <Link
              to={current.primaryCta.link}
              className="bg-white text-charcoal-900 hover:bg-sand-100 font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-elevated transition-all duration-300 hover:gap-3 group"
            >
              <span>{current.primaryCta.label}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to={current.secondaryCta.link}
              className="border border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm px-5 py-3 rounded-full flex items-center gap-2 transition-all group"
            >
              <ArrowRightLeft className="w-4 h-4 text-emerald-300 transition-transform group-hover:rotate-180" />
              <span>{current.secondaryCta.label}</span>
            </Link>
          </div>

          {/* Eco Impact Metric Strip */}
          <div className="flex flex-row gap-2 sm:gap-3 pt-2">
            {current.ecoMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-3.5 flex-1 min-w-[85px] sm:min-w-[90px] flex flex-col justify-between transition-colors hover:bg-black/35"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  {renderEcoIcon(metric.iconName)}
                  <span className="text-[10px] sm:text-[11px] text-sand-300 font-medium truncate">
                    {metric.label}
                  </span>
                </div>
                <div className="text-xs sm:text-sm lg:text-base font-bold text-white tracking-tight truncate">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Card Fan Deck (42% width on desktop) */}
        <div className="w-full lg:w-[42%] flex items-center justify-center pt-2 lg:pt-0">
          <div
            key={`deck-${current.id}`}
            className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] h-[340px] sm:h-[400px] lg:h-[450px] flex items-center justify-center [perspective:1200px] [transform-style:preserve-3d] group/fandeck cursor-pointer select-none animate-fade-in"
            onClick={() => {
              if (isSwipingRef.current) return;
              navigate(current.primaryCta.link);
            }}
            title={`Khám phá ngay: ${current.collection}`}
            aria-label={`Khám phá sản phẩm: ${current.collection}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(current.primaryCta.link);
              }
            }}
          >
            {/* Back Layer Card (-10deg -> -13deg on hover) */}
            <div className="absolute w-[210px] sm:w-[260px] lg:w-[280px] h-[270px] sm:h-[340px] lg:h-[370px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 z-10 transition-all duration-500 ease-out transform-gpu will-change-transform -rotate-[10deg] scale-90 -translate-x-8 sm:-translate-x-12 translate-y-3 group-hover/fandeck:-rotate-[13deg] group-hover/fandeck:scale-95 group-hover/fandeck:-translate-x-12 sm:group-hover/fandeck:-translate-x-16 group-hover/fandeck:translate-y-0">
              <img
                src={current.images.back}
                alt={`${current.collection} - Không gian phong cách sống`}
                className="w-full h-full object-cover filter brightness-[0.82] contrast-[1.05]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium text-sand-200 border border-white/10">
                Không gian bài trí
              </span>
            </div>

            {/* Mid Layer Card (-3deg -> -6deg on hover) */}
            <div className="absolute w-[210px] sm:w-[260px] lg:w-[280px] h-[270px] sm:h-[340px] lg:h-[370px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.65)] border border-white/15 z-20 transition-all duration-500 ease-out transform-gpu will-change-transform -rotate-[3deg] scale-95 -translate-x-2 translate-y-1 group-hover/fandeck:-rotate-[6deg] group-hover/fandeck:scale-100 group-hover/fandeck:-translate-x-4 group-hover/fandeck:-translate-y-2">
              <img
                src={current.images.mid}
                alt={`${current.collection} - Góc chụp chi tiết kiểm định`}
                className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium text-sand-200 border border-white/10">
                Chi tiết chất liệu
              </span>
            </div>

            {/* Front Layer Card (+5deg -> +8deg on hover) */}
            <div className="absolute w-[210px] sm:w-[260px] lg:w-[280px] h-[270px] sm:h-[340px] lg:h-[370px] rounded-2xl ring-1 ring-white/30 shadow-2xl overflow-hidden border border-white/20 z-30 transition-all duration-500 ease-out transform-gpu will-change-transform rotate-[5deg] scale-100 translate-x-6 sm:translate-x-10 translate-y-0 group-hover/fandeck:rotate-[8deg] group-hover/fandeck:scale-105 group-hover/fandeck:translate-x-10 sm:group-hover/fandeck:translate-x-14 group-hover/fandeck:-translate-y-2">
              <img
                src={current.images.front}
                alt={`${current.collection} - Ảnh sắc nét`}
                className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.05] transition-transform duration-700 group-hover/fandeck:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

              {/* Verified Camera Badge */}
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold text-emerald-300 border border-white/20 flex items-center gap-1.5 shadow-lg">
                <Camera className="w-3 h-3 text-emerald-400" />
                <span>Ảnh chụp thật 100%</span>
              </span>

              {/* Bottom Card Title Banner */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pt-10 text-left pointer-events-none">
                <div className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                  {current.collection}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] sm:text-[11px] text-sand-300">
                  <span className="text-emerald-300 font-medium">ReLoop Verified</span>
                  <span>•</span>
                  <span>Cam kết đúng mô tả</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROLS & TIMELINE PROGRESS */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 mt-6 sm:mt-8 z-20 relative">
        {/* Timeline Progress Indicators */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {activeSlides.map((s, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToSlide(index)}
                className="focus:outline-none py-1.5 group/indicator cursor-pointer"
                aria-label={`Chuyển tới slide ${index + 1}: ${s.collection}`}
                aria-current={isActive ? 'true' : 'false'}
              >
                {isActive ? (
                  <div className="w-14 sm:w-20 h-2 bg-white/20 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-75 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ) : (
                  <div className="w-2.5 h-2 rounded-full bg-white/30 group-hover/indicator:bg-white/60 group-hover/indicator:w-6 transition-all duration-300" />
                )}
              </button>
            );
          })}
        </div>

        {/* Slide Counter, Status & Mobile Arrow buttons */}
        <div className="flex items-center gap-3 text-xs text-sand-300 font-mono">
          {isPaused && (
            <span className="text-[11px] text-sand-300 bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full font-sans animate-fade-in">
              Đang tạm dừng
            </span>
          )}
          <span>
            <strong className="text-white text-sm">0{currentSlide + 1}</strong>
            <span className="opacity-60"> / 0{activeSlides.length}</span>
          </span>

          {/* Quick Mobile Prev/Next navigation */}
          <div className="flex items-center gap-1.5 md:hidden ml-2">
            <button
              type="button"
              onClick={prevSlide}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white border border-white/10"
              aria-label="Slide trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white border border-white/10"
              aria-label="Slide tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotlightBanner;
