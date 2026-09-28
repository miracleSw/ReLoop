// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from '../context/AppContext';
import { ExplorePage } from '../pages/public/ExplorePage';
import { ProductDetailPage } from '../pages/public/ProductDetailPage';
import { WishlistPage } from '../pages/user/WishlistPage';
import { LoginPromptModal } from '../components/common/LoginPromptModal';
import { ToastContainer } from '../components/common/ToastContainer';
import { VIETNAM_LOCATIONS, mockProducts } from '../data/mockData';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Helper to trigger change on React controlled inputs
function fireInputChange(input: HTMLInputElement, value: string) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;
  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, value);
  } else {
    input.value = value;
  }
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

// Helper to render components inside AppProvider + MemoryRouter
async function renderWithApp(ui: React.ReactElement, initialRoute = '/') {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppProvider>
          {ui}
          <LoginPromptModal />
          <ToastContainer />
        </AppProvider>
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
    },
  };
}

describe('Group 3 — UC10 Explore / Search / Filter Specification Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('UC10: AVAILABLE-only default feed excludes non-AVAILABLE products', async () => {
    const { container, unmount } = await renderWithApp(<ExplorePage />, '/explore');

    // prod-7 is RESERVED, prod-8 is COMPLETED, prod-10 is LOCKED, prod-11 is HIDDEN
    // They MUST NOT appear in the AVAILABLE-only explore feed!
    expect(container.textContent).not.toContain('prod-10'); // Locked item
    expect(container.textContent).not.toContain('Bài đăng có dấu hiệu vi phạm');
    expect(container.textContent).not.toContain('Loa Bluetooth Marshall Emberton II Chính Hãng Ash & Brass (Âm thanh đa hướng)'); // prod-7 RESERVED
    expect(container.textContent).not.toContain('Cây Bàng Singapore nội thất cao 1.4m trồng chậu gốm mộc đất nung mộc'); // prod-8 COMPLETED

    // AVAILABLE products must be visible
    expect(container.textContent).toContain('Máy ảnh Mirrorless Fujifilm X-T20');
    expect(container.textContent).toContain('Bàn phím cơ không dây Keychron K2 V2');

    unmount();
  });

  it('UC10: Search case-insensitively by title, description, and category name', async () => {
    // Search by title keyword (lower/mixed case)
    const { container: titleContainer, unmount: unmount1 } = await renderWithApp(<ExplorePage />, '/explore?q=fujifilm');
    expect(titleContainer.textContent).toContain('Fujifilm X-T20');
    unmount1();

    // Search by description keyword
    const { container: descContainer, unmount: unmount2 } = await renderWithApp(<ExplorePage />, '/explore?q=gateron');
    expect(descContainer.textContent).toContain('Keychron K2 V2');
    unmount2();

    // Search by category name (e.g. "Thời trang" or "Nhà cửa")
    const { container: catContainer, unmount: unmount3 } = await renderWithApp(<ExplorePage />, '/explore?q=th%E1%BB%9Di%20trang');
    expect(catContainer.textContent).toContain('Áo khoác Blazer đũi Linen');
    unmount3();
  });

  it('UC10: Dependent District filter updates dynamically based on selected Province', async () => {
    const { container, unmount } = await renderWithApp(<ExplorePage />, '/explore?province=H%E1%BB%93%20Ch%C3%AD%20Minh');

    // Should show districts for Ho Chi Minh
    const districtSelect = container.querySelector('select:disabled') ? null : container.querySelectorAll('select')[1];
    expect(districtSelect).not.toBeNull();
    expect(districtSelect?.textContent).toContain('Quận 1');
    expect(districtSelect?.textContent).toContain('Quận Bình Thạnh');
    expect(districtSelect?.textContent).not.toContain('Quận Cầu Giấy'); // Hanoi district shouldn't appear

    unmount();
  });

  it('UC10: Custom price inputs with integer >= 0 and From <= To validation', async () => {
    const { container, unmount } = await renderWithApp(<ExplorePage />, '/explore');

    const minInput = container.querySelector('input[placeholder="0"]') as HTMLInputElement;
    const maxInput = container.querySelector('input[placeholder="Vô cực"]') as HTMLInputElement;

    expect(minInput).not.toBeNull();
    expect(maxInput).not.toBeNull();

    // Enter invalid range: From > To
    await act(async () => {
      fireInputChange(minInput, '5000000');
      fireInputChange(maxInput, '1000000');
    });

    expect(container.textContent).toContain('Giá "Từ" phải nhỏ hơn hoặc bằng giá "Đến"');

    unmount();
  });

  it('UC10: Empty state shows MSG 10_1 and 6 newest recommendations when no products match', async () => {
    const { container, unmount } = await renderWithApp(<ExplorePage />, '/explore?q=nonexistentkeywordxyz123456');

    // Exact message MSG 10_1
    expect(container.textContent).toContain('Không tìm thấy sản phẩm phù hợp. Hãy thử thay đổi từ khóa hoặc bộ lọc!');

    // Recommendation section with 6 newest products
    expect(container.textContent).toContain('Gợi ý cho bạn: 6 sản phẩm mới nhất trên ReLoop');

    unmount();
  });

  it('UC10: Pagination caps at 12 products per page with Previous/Next controls', async () => {
    const { container, unmount } = await renderWithApp(<ExplorePage />, '/explore');

    // We added products so total AVAILABLE is > 12
    expect(container.textContent).toContain('Hiển thị trang 1 / 2');
    expect(container.textContent).toContain('Trước');
    expect(container.textContent).toContain('Sau');

    unmount();
  });
});

describe('Group 3 — UC11 Product Detail & Seller Profile Specification Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('UC11: RESERVED product displays warning banner and disables transaction actions', async () => {
    // prod-7 is RESERVED
    const { container, unmount } = await renderWithApp(
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>,
      '/products/prod-7'
    );

    // Warning banner check
    expect(container.textContent).toContain('Đang có hẹn giao dịch (RESERVED)');
    expect(container.textContent).toContain('Các chức năng gửi đề xuất mua hoặc đổi đồ đang tạm đóng');

    // Transaction buttons disabled
    const buyButton = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Đang có hẹn giao dịch')
    );
    expect(buyButton?.disabled).toBe(true);

    unmount();
  });

  it('UC11: COMPLETED product displays success banner and disables transaction actions', async () => {
    // prod-8 is COMPLETED, owned by user-1. Log in as user-2 to test visitor view
    const TestCompletedView = () => {
      const { loginAs } = useApp();
      React.useEffect(() => {
        loginAs('user-2');
      }, []);
      return (
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      );
    };

    const { container, unmount } = await renderWithApp(
      <TestCompletedView />,
      '/products/prod-8'
    );

    // Success banner check
    expect(container.textContent).toContain('Đã giao dịch thành công (COMPLETED)');

    // Transaction buttons disabled
    const button = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Đã giao dịch thành công')
    );
    expect(button?.disabled).toBe(true);

    unmount();
  });

  it('UC11: Nonexistent or LOCKED product triggers MSG 11_1 toast and redirects', async () => {
    // prod-10 is LOCKED
    const { container, unmount } = await renderWithApp(
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/" element={<div data-testid="home-page">Trang chủ ReLoop</div>} />
      </Routes>,
      '/products/prod-10'
    );

    // MSG 11_1 toast / text
    expect(container.textContent).toContain('Bài đăng không tồn tại hoặc đã bị gỡ bỏ!');

    unmount();
  });

  it('UC11: Displays proposedMeetupLocation prominently', async () => {
    const { container, unmount } = await renderWithApp(
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>,
      '/products/prod-1'
    );

    expect(container.textContent).toContain('Địa điểm công cộng đề xuất gặp mặt');
    expect(container.textContent).toContain('The Coffee House, 45 Lê Duẩn, Quận 1');

    unmount();
  });

  it('UC11: Product owner view hides contact/exchange/buy and shows Edit Post button', async () => {
    // user-1 is owner of prod-1
    const TestOwnerView = () => {
      const { loginAs } = useApp();
      React.useEffect(() => {
        loginAs('user-1');
      }, []);
      return (
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      );
    };

    const { container, unmount } = await renderWithApp(<TestOwnerView />, '/products/prod-1');

    expect(container.textContent).toContain('Bài đăng này thuộc quyền sở hữu của bạn');
    expect(container.textContent).toContain('Chỉnh sửa bài đăng');

    // Owner should not see Contact or Barter CTA
    expect(container.textContent).not.toContain('Liên hệ người bán (Bảo mật quyền riêng tư)');
    expect(container.textContent).not.toContain('Đề nghị đổi đồ (Chọn đồ kho của bạn)');

    unmount();
  });

  it('UC11: Privacy rule hides raw phone number on public detail page', async () => {
    // prod-1 is owned by user-1. Log in as user-2 to view as visitor
    const TestVisitorView = () => {
      const { loginAs } = useApp();
      React.useEffect(() => {
        loginAs('user-2');
      }, []);
      return (
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      );
    };

    const { container, unmount } = await renderWithApp(
      <TestVisitorView />,
      '/products/prod-1'
    );

    // Raw full phone number (0903124589) must not be plainly visible
    expect(container.textContent).not.toContain('0903124589');

    // Open contact modal
    const contactBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Liên hệ người bán')
    );
    await act(async () => {
      contactBtn?.click();
    });

    // Masked phone format (e.g. 090****589) and privacy notice
    expect(container.textContent).toContain('090****589');
    expect(container.textContent).toContain('Chính sách bảo mật quyền riêng tư');

    unmount();
  });
});

describe('Group 3 — UC11B Wishlist & Simulated Notifications Specification Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('UC11B: Guest clicking Wishlist heart triggers Login Prompt Modal with MSG 11B_1', async () => {
    const TestGuestDetail = () => {
      const { loginAs } = useApp();
      React.useEffect(() => {
        loginAs(null); // Guest mode
      }, []);
      return (
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      );
    };

    const { container, unmount } = await renderWithApp(<TestGuestDetail />, '/products/prod-1');

    // Find heart button
    const heartBtn = container.querySelector('button[aria-label="Lưu tin yêu thích"]') as HTMLButtonElement;
    expect(heartBtn).not.toBeNull();

    await act(async () => {
      heartBtn.click();
    });

    // Login prompt modal with MSG 11B_1
    expect(container.textContent).toContain('Yêu cầu đăng nhập');
    expect(container.textContent).toContain('Vui lòng đăng nhập để lưu sản phẩm vào danh sách yêu thích!');

    unmount();
  });

  it('UC11B: Guest accessing /user/wishlist is protected and prompted to login', async () => {
    const TestGuestWishlist = () => {
      const { loginAs } = useApp();
      React.useEffect(() => {
        loginAs(null);
      }, []);
      return <WishlistPage />;
    };

    const { container, unmount } = await renderWithApp(<TestGuestWishlist />, '/user/wishlist');

    expect(container.textContent).toContain('Yêu cầu đăng nhập để truy cập Wishlist');
    expect(container.textContent).toContain('Đăng nhập ngay');

    unmount();
  });

  it('UC11B: Authenticated user toggles wishlist with toast feedback (MSG 11B_2 / MSG 11B_3)', async () => {
    let capturedApp!: ReturnType<typeof useApp>;
    const TestConsumer = () => {
      const app = useApp();
      capturedApp = app;
      return null;
    };

    const { unmount } = await renderWithApp(<TestConsumer />);

    // Login as user-2
    await act(async () => {
      capturedApp.loginAs('user-2');
    });

    // Toggle prod-3 into wishlist (user-2 does not have prod-3 initially)
    await act(async () => {
      const added = capturedApp.toggleFavorite('prod-3');
      expect(added).toBe(true);
    });

    expect(capturedApp.favorites).toContain('prod-3');
    expect(capturedApp.toasts.some((t) => t.message.includes('Đã thêm vào danh sách yêu thích'))).toBe(true);

    // Toggle prod-3 out of wishlist
    await act(async () => {
      const removed = capturedApp.toggleFavorite('prod-3');
      expect(removed).toBe(false);
    });

    expect(capturedApp.favorites).not.toContain('prod-3');
    expect(capturedApp.toasts.some((t) => t.message.includes('Đã xóa khỏi danh sách yêu thích'))).toBe(true);

    unmount();
  });

  it('UC11B & Notifications: Simulated notification generated when watchlisted product price drops', async () => {
    let capturedApp!: ReturnType<typeof useApp>;
    const TestConsumer = () => {
      const app = useApp();
      capturedApp = app;
      return null;
    };

    const { unmount } = await renderWithApp(<TestConsumer />);

    // user-1 has prod-2 in mockWishlist
    // user-2 (owner of prod-2) lowers price of prod-2
    await act(async () => {
      capturedApp.loginAs('user-2');
      capturedApp.updateProduct('prod-2', { price: 1100000 });
    });

    // Check notifications for user-1
    const priceDropNotif = capturedApp.notifications.find(
      (n) => n.userId === 'user-1' && n.title.includes('Giảm giá sản phẩm trong Yêu thích!')
    );
    expect(priceDropNotif).toBeDefined();
    expect(priceDropNotif?.message).toContain('1.100.000₫');

    unmount();
  });

  it('UC11B & Notifications: Simulated notification generated when watchlisted product turns RESERVED or COMPLETED', async () => {
    let capturedApp!: ReturnType<typeof useApp>;
    const TestConsumer = () => {
      const app = useApp();
      capturedApp = app;
      return null;
    };

    const { unmount } = await renderWithApp(<TestConsumer />);

    // user-1 has prod-2 in wishlist. Owner user-2 changes status to RESERVED
    await act(async () => {
      capturedApp.loginAs('user-2');
      capturedApp.setProductStatus('prod-2', 'RESERVED');
    });

    const reservedNotif = capturedApp.notifications.find(
      (n) => n.userId === 'user-1' && n.title.includes('Sản phẩm yêu thích đang tạm giữ')
    );
    expect(reservedNotif).toBeDefined();

    // Owner changes status to COMPLETED
    await act(async () => {
      capturedApp.setProductStatus('prod-2', 'COMPLETED');
    });

    const completedNotif = capturedApp.notifications.find(
      (n) => n.userId === 'user-1' && n.title.includes('Sản phẩm yêu thích đã hoàn tất')
    );
    expect(completedNotif).toBeDefined();

    unmount();
  });

  it('UC11B: Wishlist displays status badges for all items including AVAILABLE (BR 11B_3)', async () => {
    // user-1 has items in wishlist (mockWishlist includes prod-2, prod-5, prod-7)
    const TestUserWishlist = () => {
      const { loginAs } = useApp();
      React.useEffect(() => {
        loginAs('user-1');
      }, []);
      return <WishlistPage />;
    };

    const { container, unmount } = await renderWithApp(<TestUserWishlist />, '/user/wishlist');

    // Should display status badges: AVAILABLE (Còn hàng), RESERVED (Đã hẹn gặp / Tạm giữ)
    expect(container.textContent).toContain('Còn hàng');
    expect(container.textContent).toContain('Đã hẹn gặp / Tạm giữ');

    // Quick remove button (Trash icon) is rendered for each card
    const trashButtons = container.querySelectorAll('button[aria-label="Xóa khỏi danh sách yêu thích"]');
    expect(trashButtons.length).toBeGreaterThan(0);

    unmount();
  });

  it('UC11B: Quick remove (Trash button) on Wishlist card removes item from user wishlist', async () => {
    const TestUserWishlist = () => {
      const { loginAs } = useApp();
      React.useEffect(() => {
        loginAs('user-1');
      }, []);
      return <WishlistPage />;
    };

    const { container, unmount } = await renderWithApp(<TestUserWishlist />, '/user/wishlist');

    const initialTrashButtons = container.querySelectorAll('button[aria-label="Xóa khỏi danh sách yêu thích"]');
    const initialCount = initialTrashButtons.length;
    expect(initialCount).toBeGreaterThan(0);

    // Click trash button on first item
    await act(async () => {
      (initialTrashButtons[0] as HTMLButtonElement).click();
    });

    // Check count decreased by 1
    const newTrashButtons = container.querySelectorAll('button[aria-label="Xóa khỏi danh sách yêu thích"]');
    expect(newTrashButtons.length).toBe(initialCount - 1);

    unmount();
  });

  it('UC11B: Wishlist empty state displays clean empty state message and exploration CTA', async () => {
    // user-5 has 0 saved items in mockWishlist
    const TestEmptyWishlist = () => {
      const { loginAs } = useApp();
      React.useEffect(() => {
        loginAs('user-5');
      }, []);
      return <WishlistPage />;
    };

    const { container, unmount } = await renderWithApp(<TestEmptyWishlist />, '/user/wishlist');

    expect(container.textContent).toContain('Chưa có món đồ nào được lưu');
    expect(container.textContent).toContain('Khám phá sản phẩm ngay');

    unmount();
  });

  it('Notifications: Multi-user notification isolation prevents cross-account notification leakage', async () => {
    let capturedApp!: ReturnType<typeof useApp>;
    const TestConsumer = () => {
      const app = useApp();
      capturedApp = app;
      return null;
    };

    const { unmount } = await renderWithApp(<TestConsumer />);

    // user-1 has prod-2 in wishlist. Owner user-2 lowers price
    await act(async () => {
      capturedApp.loginAs('user-2');
      capturedApp.updateProduct('prod-2', { price: 990000 });
    });

    // Notification is generated for user-1
    const notifForUser1 = capturedApp.notifications.filter((n) => n.userId === 'user-1');
    expect(notifForUser1.some((n) => n.message.includes('990.000₫'))).toBe(true);

    // user-2 should NOT have this notification assigned to them
    const notifForUser2 = capturedApp.notifications.filter((n) => n.userId === 'user-2');
    expect(notifForUser2.some((n) => n.message.includes('990.000₫'))).toBe(false);

    unmount();
  });
});

describe('Group 3 — Advanced Edge Cases & Search Robustness Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('UC10: Vietnamese diacritics and multi-word token search matches correctly', async () => {
    // Search unaccented "ban phim" should match "Bàn phím cơ không dây Keychron"
    const { container: c1, unmount: u1 } = await renderWithApp(<ExplorePage />, '/explore?q=ban%20phim');
    expect(c1.textContent).toContain('Keychron K2 V2');
    u1();

    // Search multi-word "tai nghe sony" should match "Tai nghe chống ồn Sony WH-1000XM4"
    const { container: c2, unmount: u2 } = await renderWithApp(<ExplorePage />, '/explore?q=tai%20nghe%20sony');
    expect(c2.textContent).toContain('Sony WH-1000XM4');
    u2();
  });

  it('UC10: Price query parameters ?min=...&max=... populate filter inputs and filter feed', async () => {
    // Filter min=3000000 and max=4000000 (should include Sony WH-1000XM4 at 3,800,000₫)
    const { container, unmount } = await renderWithApp(<ExplorePage />, '/explore?min=3000000&max=4000000');

    expect(container.textContent).toContain('Sony WH-1000XM4');
    expect(container.textContent).not.toContain('Áo khoác Blazer đũi Linen'); // 380,000₫, should be excluded

    unmount();
  });

  it('UC11: Lightbox modal opens on click, supports backdrop click-to-close and Escape key', async () => {
    const { container, unmount } = await renderWithApp(
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>,
      '/products/prod-1'
    );

    // Initially lightbox is not open
    expect(container.querySelector('[role="dialog"][aria-modal="true"]')).toBeNull();

    // Click main image to open lightbox
    const mainImgContainer = container.querySelector('.cursor-zoom-in') as HTMLElement;
    expect(mainImgContainer).not.toBeNull();
    await act(async () => {
      mainImgContainer.click();
    });

    // Lightbox is now open
    const lightboxModal = container.querySelector('[role="dialog"][aria-modal="true"]') as HTMLElement;
    expect(lightboxModal).not.toBeNull();
    expect(lightboxModal.textContent).toContain('1 / 3');

    // Press Escape to close
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(container.querySelector('[role="dialog"][aria-modal="true"]')).toBeNull();

    // Reopen and test backdrop click to close
    await act(async () => {
      mainImgContainer.click();
    });
    const reopenedModal = container.querySelector('[role="dialog"][aria-modal="true"]') as HTMLElement;
    expect(reopenedModal).not.toBeNull();

    await act(async () => {
      reopenedModal.click();
    });
    expect(container.querySelector('[role="dialog"][aria-modal="true"]')).toBeNull();

    unmount();
  });

  it('UC11: Hidden product is inaccessible to non-owners and redirects with MSG 11_1 toast', async () => {
    // prod-11 is HIDDEN, owned by user-4. Log in as user-1 (non-owner)
    const TestNonOwnerView = () => {
      const { loginAs } = useApp();
      React.useEffect(() => {
        loginAs('user-1');
      }, []);
      return (
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/" element={<div>Trang chủ ReLoop</div>} />
        </Routes>
      );
    };

    const { container, unmount } = await renderWithApp(<TestNonOwnerView />, '/products/prod-11');

    expect(container.textContent).toContain('Bài đăng không tồn tại hoặc đã bị gỡ bỏ!');

    unmount();
  });

  it('UC11: Owner view hides report button on Product Detail page', async () => {
    // prod-1 is owned by user-1. Log in as user-1
    const TestOwnerView = () => {
      const { loginAs } = useApp();
      React.useEffect(() => {
        loginAs('user-1');
      }, []);
      return (
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      );
    };

    const { container, unmount } = await renderWithApp(<TestOwnerView />, '/products/prod-1');

    expect(container.textContent).toContain('Chỉnh sửa bài đăng');
    expect(container.textContent).not.toContain('Báo cáo bài đăng vi phạm');

    unmount();
  });
});

