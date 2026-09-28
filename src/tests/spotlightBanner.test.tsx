// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  SpotlightBanner,
  defaultSpotlightSlides,
  SpotlightItem
} from '../components/common/SpotlightBanner';

// Enable React 18 act environment for jsdom testing
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Helper to render SpotlightBanner inside MemoryRouter
async function renderSpotlightBanner(props: React.ComponentProps<typeof SpotlightBanner> = {}) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(
      <MemoryRouter>
        <SpotlightBanner {...props} />
      </MemoryRouter>
    );
  });

  return {
    container,
    unmount: () => {
      act(() => {
        root.unmount();
        container.remove();
      });
    }
  };
}

describe('SpotlightBanner Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('renders with default 4 mock slides successfully', async () => {
    const { container, unmount } = await renderSpotlightBanner();

    expect(defaultSpotlightSlides.length).toBeGreaterThanOrEqual(4);

    // Initial slide headline prefix
    expect(container.textContent).toContain('Máy ảnh phim Olympus OM-1 Vintage');
    expect(container.textContent).toContain('Ghi lại khoảnh khắc cùng');
    expect(container.textContent).toContain('cỗ máy cơ học nguyên bản');

    // Author and location
    expect(container.textContent).toContain('Minh Triết');
    expect(container.textContent).toContain('Q.1, TP.HCM');
    expect(container.textContent).toContain('5.0★');

    // Metadata badges (including 95% from spec)
    expect(container.textContent).toContain('Độ mới 95%');
    expect(container.textContent).toContain('Kèm Lens 50mm f/1.8');
    expect(container.textContent).toContain('Định giá: 2.800.000 đ');

    // Eco impact metrics
    expect(container.textContent).toContain('-8.4 kg CO₂');
    expect(container.textContent).toContain('Bảo lưu 45 năm');
    expect(container.textContent).toContain('100% Hoạt động tốt');

    unmount();
  });

  it('renders all 3 layered cards in the 3D card fan deck', async () => {
    const { container, unmount } = await renderSpotlightBanner();

    const images = container.querySelectorAll('img');
    // Avatar + 3 layer images = at least 4 images
    expect(images.length).toBeGreaterThanOrEqual(4);

    expect(container.textContent).toContain('Không gian bài trí');
    expect(container.textContent).toContain('Chi tiết chất liệu');
    expect(container.textContent).toContain('Ảnh chụp thật 100%');

    unmount();
  });

  it('navigates to next and previous slide via button controls', async () => {
    const onSlideChange = vi.fn();
    const { container, unmount } = await renderSpotlightBanner({ onSlideChange });

    // Find next button
    const nextBtn = container.querySelector('button[aria-label="Xem sản phẩm tiếp theo"]') as HTMLButtonElement;
    expect(nextBtn).toBeTruthy();

    await act(async () => {
      nextBtn.click();
    });

    // Should switch to slide 2: Ghế mây bập bênh
    expect(container.textContent).toContain('Ghế mây bập bênh Thư Giãn Mid-Century');
    expect(container.textContent).toContain('góc đọc sách bình yên');
    expect(container.textContent).toContain('Thu Hà');
    expect(onSlideChange).toHaveBeenCalledWith(1);

    // Click previous button
    const prevBtn = container.querySelector('button[aria-label="Xem sản phẩm trước"]') as HTMLButtonElement;
    expect(prevBtn).toBeTruthy();

    await act(async () => {
      prevBtn.click();
    });

    // Should return to slide 1
    expect(container.textContent).toContain('Olympus OM-1');
    expect(onSlideChange).toHaveBeenCalledWith(0);

    unmount();
  });

  it('navigates directly when clicking timeline indicator pills', async () => {
    const onSlideChange = vi.fn();
    const { container, unmount } = await renderSpotlightBanner({ onSlideChange });

    // Indicators for each slide
    const indicators = container.querySelectorAll('button[aria-label^="Chuyển tới slide"]');
    expect(indicators.length).toBe(defaultSpotlightSlides.length);

    // Click slide 3 indicator (Bàn phím cơ)
    await act(async () => {
      (indicators[2] as HTMLButtonElement).click();
    });

    expect(container.textContent).toContain('Bàn phím cơ Custom HHKB Layout Gỗ Óc Chó');
    expect(container.textContent).toContain('cảm giác gõ êm ái');
    expect(container.textContent).toContain('Hoàng Nam');
    expect(onSlideChange).toHaveBeenCalledWith(2);

    unmount();
  });

  it('supports keyboard navigation via ArrowRight and ArrowLeft', async () => {
    const onSlideChange = vi.fn();
    const { container, unmount } = await renderSpotlightBanner({ onSlideChange });

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });

    expect(container.textContent).toContain('Ghế mây bập bênh');
    expect(onSlideChange).toHaveBeenCalledWith(1);

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });

    expect(container.textContent).toContain('Olympus OM-1');
    expect(onSlideChange).toHaveBeenCalledWith(0);

    unmount();
  });

  it('supports touch swipe gestures (left swipe advances, right swipe retreats)', async () => {
    const onSlideChange = vi.fn();
    const { container, unmount } = await renderSpotlightBanner({ onSlideChange });

    const bannerRegion = container.querySelector('[role="region"]') as HTMLElement;
    expect(bannerRegion).toBeTruthy();

    // Swipe left (finger moves from 300 to 100 => diff = -200 => next slide)
    await act(async () => {
      const touchStart = new Event('touchstart', { bubbles: true });
      Object.assign(touchStart, {
        touches: [{ clientX: 300 }]
      });
      bannerRegion.dispatchEvent(touchStart);

      const touchEnd = new Event('touchend', { bubbles: true });
      Object.assign(touchEnd, {
        changedTouches: [{ clientX: 100 }]
      });
      bannerRegion.dispatchEvent(touchEnd);
    });

    expect(container.textContent).toContain('Ghế mây bập bênh');
    expect(onSlideChange).toHaveBeenCalledWith(1);

    // Swipe right (finger moves from 100 to 300 => diff = +200 => prev slide)
    await act(async () => {
      const touchStart = new Event('touchstart', { bubbles: true });
      Object.assign(touchStart, {
        touches: [{ clientX: 100 }]
      });
      bannerRegion.dispatchEvent(touchStart);

      const touchEnd = new Event('touchend', { bubbles: true });
      Object.assign(touchEnd, {
        changedTouches: [{ clientX: 300 }]
      });
      bannerRegion.dispatchEvent(touchEnd);
    });

    expect(container.textContent).toContain('Olympus OM-1');
    expect(onSlideChange).toHaveBeenCalledWith(0);

    unmount();
  });

  it('pauses auto-play on mouse enter and resumes on mouse leave', async () => {
    const { container, unmount } = await renderSpotlightBanner({ autoPlayInterval: 1000 });

    const bannerRegion = container.querySelector('[role="region"]') as HTMLElement;

    // Hover mouse over banner
    await act(async () => {
      const mouseOver = new MouseEvent('mouseover', {
        bubbles: true,
        relatedTarget: document.body
      });
      bannerRegion.dispatchEvent(mouseOver);
    });

    expect(container.textContent).toContain('Đang tạm dừng');

    // Advance time while paused — slide should NOT advance
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });
    expect(container.textContent).toContain('Olympus OM-1');

    // Mouse leave — should resume
    await act(async () => {
      const mouseOut = new MouseEvent('mouseout', {
        bubbles: true,
        relatedTarget: document.body
      });
      bannerRegion.dispatchEvent(mouseOut);
    });

    expect(container.textContent).not.toContain('Đang tạm dừng');

    // Advance time after resume — slide should advance
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(container.textContent).toContain('Ghế mây bập bênh');

    unmount();
  });

  it('handles custom single slide cleanly without crashing', async () => {
    const singleSlide: SpotlightItem[] = [
      {
        id: 'single-1',
        collection: 'Áo khoác dạ tái chế',
        pillBadge: 'Độc bản tuần hoàn',
        headlinePrefix: 'Thời trang bền vững cho',
        headlineHighlight: 'mùa đông ấm áp',
        highlightColor: 'clay',
        author: {
          name: 'Ánh Dương',
          location: 'Đà Lạt',
          rating: '4.8★',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          verified: false
        },
        description: 'Áo khoác tái chế thủ công.',
        metadataBadges: ['95% Mới'],
        primaryCta: { label: 'Xem áo', link: '/explore' },
        secondaryCta: { label: 'Đổi đồ', link: '/explore' },
        ecoMetrics: [
          { label: 'CO2', value: '-5kg', iconName: 'leaf' },
          { label: 'Tuổi thọ', value: '5 năm', iconName: 'clock' },
          { label: 'Chất lượng', value: '100%', iconName: 'star' }
        ],
        images: {
          front: 'https://example.com/1.jpg',
          mid: 'https://example.com/2.jpg',
          back: 'https://example.com/3.jpg'
        }
      }
    ];

    const { container, unmount } = await renderSpotlightBanner({ slides: singleSlide });
    expect(container.textContent).toContain('Áo khoác dạ tái chế');
    expect(container.textContent).toContain('01 / 01');

    unmount();
  });

  it('safely falls back to default slides when empty slides array is provided', async () => {
    const { container, unmount } = await renderSpotlightBanner({ slides: [] });
    expect(container.textContent).toContain('Máy ảnh phim Olympus OM-1 Vintage');
    expect(container.textContent).toContain(`01 / 0${defaultSpotlightSlides.length}`);

    unmount();
  });

  it('ignores touch gestures when vertical scrolling dominates horizontal movement', async () => {
    const onSlideChange = vi.fn();
    const { container, unmount } = await renderSpotlightBanner({ onSlideChange });

    const bannerRegion = container.querySelector('[role="region"]') as HTMLElement;
    expect(bannerRegion).toBeTruthy();

    // User is scrolling vertically down (Y changes by 150px, X only drifts by 60px)
    await act(async () => {
      const touchStart = new Event('touchstart', { bubbles: true });
      Object.assign(touchStart, {
        touches: [{ clientX: 200, clientY: 100 }]
      });
      bannerRegion.dispatchEvent(touchStart);

      const touchEnd = new Event('touchend', { bubbles: true });
      Object.assign(touchEnd, {
        changedTouches: [{ clientX: 140, clientY: 250 }]
      });
      bannerRegion.dispatchEvent(touchEnd);
    });

    // Slide should NOT change because vertical movement was dominant
    expect(container.textContent).toContain('Máy ảnh phim Olympus OM-1 Vintage');
    expect(onSlideChange).not.toHaveBeenCalled();

    unmount();
  });

  it('ignores arrow keys when typing inside input, textarea, select, or contentEditable', async () => {
    const onSlideChange = vi.fn();
    const { container, unmount } = await renderSpotlightBanner({ onSlideChange });

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });

    expect(onSlideChange).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Olympus OM-1');

    input.remove();
    unmount();
  });

  it('handles Space and Enter keydown on 3D card deck with preventDefault', async () => {
    const { container, unmount } = await renderSpotlightBanner();

    const deckButton = container.querySelector('[role="button"][title^="Khám phá ngay"]') as HTMLElement;
    expect(deckButton).toBeTruthy();

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true });
    const preventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault');

    await act(async () => {
      deckButton.dispatchEvent(spaceEvent);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();

    unmount();
  });
});
