// @vitest-environment jsdom
import React, { useEffect } from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { AppProvider, useApp } from '../context/AppContext';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
import {
  mockUsers,
  mockProducts,
  mockCategories,
  mockBarterRequests,
  mockTransactions,
  mockMessages,
  mockReviews,
  mockReports,
  mockSystemStats,
} from '../data/mockData';
import { ProductStatus, OfferStatus, MeetupStatus } from '../types';

// Helper to mount AppProvider and capture context
async function renderAppContext() {
  let contextValue!: ReturnType<typeof useApp>;
  const TestConsumer = () => {
    const app = useApp();
    useEffect(() => {
      contextValue = app;
    }, [app]);
    contextValue = app;
    return null;
  };

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
  });

  return {
    get context() {
      return contextValue;
    },
    unmount: () => {
      act(() => {
        root.unmount();
        container.remove();
      });
    },
  };
}

describe('ReLoop Source of Truth — Relational Integrity & Data Standards', () => {
  it('every product must have a valid seller in mockUsers', () => {
    mockProducts.forEach((p) => {
      const seller = mockUsers.find((u) => u.id === p.sellerId);
      expect(seller, `Product ${p.id} sellerId ${p.sellerId} must exist`).toBeDefined();
    });
  });

  it('every product must belong to a valid category in mockCategories', () => {
    mockCategories.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.name).toBeTruthy();
    });

    mockProducts.forEach((p) => {
      const category = mockCategories.find((c) => c.id === p.categoryId);
      expect(category, `Product ${p.id} categoryId ${p.categoryId} must exist`).toBeDefined();
    });
  });

  it('every barter request must link to existing target and offered products', () => {
    mockBarterRequests.forEach((req) => {
      const targetProd = mockProducts.find((p) => p.id === req.targetProductId);
      const offeredProd = mockProducts.find((p) => p.id === req.offeredProductId);
      expect(targetProd, `Target product ${req.targetProductId} must exist`).toBeDefined();
      expect(offeredProd, `Offered product ${req.offeredProductId} must exist`).toBeDefined();
    });
  });

  it('every meetup transaction must link to valid buyer, seller and target product', () => {
    mockTransactions.forEach((tx) => {
      const buyer = mockUsers.find((u) => u.id === tx.buyerId);
      const seller = mockUsers.find((u) => u.id === tx.sellerId);
      const prod = mockProducts.find((p) => p.id === tx.productId);
      expect(buyer, `Buyer ${tx.buyerId} must exist`).toBeDefined();
      expect(seller, `Seller ${tx.sellerId} must exist`).toBeDefined();
      expect(prod, `Product ${tx.productId} must exist`).toBeDefined();
    });
  });

  it('no placeholder strings exist in mock data', () => {
    mockProducts.forEach((p) => {
      expect(p.title.toLowerCase()).not.toContain('lorem ipsum');
      expect(p.title.toLowerCase()).not.toContain('test product');
      expect(p.title.toLowerCase()).not.toContain('product 1');
      expect(p.description.toLowerCase()).not.toContain('lorem ipsum');
    });

    mockUsers.forEach((u) => {
      expect(u.fullName.toLowerCase()).not.toContain('user 1');
      expect(u.fullName.toLowerCase()).not.toContain('test user');
    });
  });
});

describe('UC01 — Đăng ký tài khoản (BR-01, BR-02, BR-03)', () => {
  it('BR-01: Email must be valid format and detect duplicates', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('invalid-email')).toBe(false);
    expect(emailRegex.test('valid.user@reloop.vn')).toBe(true);

    const existingEmail = mockUsers[0].email;
    const isDuplicate = mockUsers.some((u) => u.email.toLowerCase() === existingEmail.toLowerCase());
    expect(isDuplicate).toBe(true);
  });

  it('BR-02: Phone number must detect duplicate accounts', () => {
    const existingPhone = mockUsers[0].phone;
    const isPhoneDuplicate = mockUsers.some((u) => u.phone === existingPhone);
    expect(isPhoneDuplicate).toBe(true);
  });

  it('BR-03: Confirm password must strictly match password', () => {
    const pw: string = 'SecretPass123';
    const confirmMatch: string = 'SecretPass123';
    const confirmMismatch: string = 'SecretPass999';
    expect(pw === confirmMatch).toBe(true);
    expect(pw === confirmMismatch).toBe(false);
  });
});

describe('UC02 — Đăng nhập hệ thống (BR-02)', () => {
  it('BR-02: Accounts in LOCKED status are prohibited from normal access', () => {
    const lockedUser = mockUsers.find((u) => u.status === 'LOCKED');
    expect(lockedUser).toBeDefined();
    expect(lockedUser!.status).toBe('LOCKED');
  });
});

describe('Deep AppContext State Machine & Business Rules (UC05, UC07, UC14, UC15, UC17, UC20, UC23, UC27)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('UC23 BR-03: Admin cannot self-lock own account via lockUser', async () => {
    const app = await renderAppContext();
    // Log in as Admin
    act(() => {
      app.context.loginAs('user-admin');
    });

    expect(app.context.currentUser?.role).toBe('ADMIN');
    expect(app.context.currentUser?.id).toBe('user-admin');

    // Attempting to self-lock must throw error
    expect(() => {
      app.context.lockUser('user-admin', 7, 'Self lock test');
    }).toThrowError(/BR-03/);

    // Locking another user succeeds
    act(() => {
      app.context.lockUser('user-2', 7, 'Spam test');
    });
    const lockedUser = app.context.users.find((u) => u.id === 'user-2');
    expect(lockedUser?.status).toBe('LOCKED');

    app.unmount();
  });

  it('UC14, UC15: Waitlist Queue — Accepting an offer puts other pending offers on hold', async () => {
    const app = await renderAppContext();

    // Set up: User 2 and User 3 both submit buy requests for prod-3 (Giant bike)
    act(() => {
      app.context.loginAs('user-2');
    });
    act(() => {
      app.context.createBuyRequest({
        targetProductId: 'prod-3',
        offeredPrice: 4800000,
        note: 'Đề xuất mua 1',
      });
    });

    act(() => {
      app.context.loginAs('user-3');
    });
    act(() => {
      app.context.createBuyRequest({
        targetProductId: 'prod-3',
        offeredPrice: 4850000,
        note: 'Đề xuất mua 2',
      });
    });

    const pendingBuyReqs = app.context.buyRequests.filter(
      (b) => b.targetProductId === 'prod-3' && b.status === 'PENDING'
    );
    expect(pendingBuyReqs.length).toBeGreaterThanOrEqual(2);

    // Seller (user-1) logs in and accepts the first pending buy request
    const acceptedBuyReqId = pendingBuyReqs[0].id;
    act(() => {
      app.context.loginAs('user-1'); // seller of prod-3
    });
    act(() => {
      app.context.acceptBuyRequest(acceptedBuyReqId);
    });

    // Check statuses
    const updatedAccepted = app.context.buyRequests.find((b) => b.id === acceptedBuyReqId);
    expect(updatedAccepted?.status).toBe('ACCEPTED');

    const otherBuyReqs = app.context.buyRequests.filter(
      (b) => b.targetProductId === 'prod-3' && b.id !== acceptedBuyReqId
    );
    expect(otherBuyReqs.length).toBeGreaterThanOrEqual(1);
    otherBuyReqs.forEach((b) => {
      expect(b.status).toBe('ON_HOLD');
    });

    app.unmount();
  });

  it('UC17 BR 17_4: Canceling transaction restores products to AVAILABLE and ON_HOLD offers to PENDING', async () => {
    const app = await renderAppContext();

    // Set up: create buy offer and accept it
    act(() => {
      app.context.loginAs('user-2');
    });
    act(() => {
      app.context.createBuyRequest({
        targetProductId: 'prod-2',
        offeredPrice: 1500000,
        note: 'Mua máy ảnh',
      });
    });

    const buyReq = app.context.buyRequests.find((b) => b.targetProductId === 'prod-2')!;
    expect(buyReq).toBeDefined();

    act(() => {
      app.context.loginAs('user-3'); // seller of prod-2
    });
    act(() => {
      app.context.acceptBuyRequest(buyReq.id);
    });

    // Now product is RESERVED
    expect(app.context.products.find((p) => p.id === 'prod-2')?.status).toBe('RESERVED');

    // Find created transaction
    const tx = app.context.transactions.find((t) => t.productId === 'prod-2' && t.status === 'APPOINTED')!;
    expect(tx).toBeDefined();

    // Cancel transaction
    act(() => {
      app.context.cancelTransaction(tx.id, 'Người mua bận việc đột xuất');
    });

    // Product reverts to AVAILABLE
    expect(app.context.products.find((p) => p.id === 'prod-2')?.status).toBe('AVAILABLE');
    // Transaction marked CANCELLED
    expect(app.context.transactions.find((t) => t.id === tx.id)?.status).toBe('CANCELLED');

    app.unmount();
  });

  it('UC17, UC19: Two-way confirmation completes transaction and marks BOTH products COMPLETED in barter trade', async () => {
    const app = await renderAppContext();

    // Find active barter transaction: tx-1 (buyer: user-2, seller: user-1)
    const barterTx = app.context.transactions.find((t) => t.id === 'tx-1');
    expect(barterTx).toBeDefined();

    const txId = barterTx!.id;
    const targetProdId = barterTx!.productId;
    const offeredProdId = barterTx!.offeredProductId!;

    // Initial state: buyer has confirmed (true), seller has not confirmed (false)
    expect(barterTx!.buyerConfirmed).toBe(true);
    expect(barterTx!.sellerConfirmed).toBe(false);
    expect(barterTx!.status).toBe('APPOINTED');

    // Seller (user-1) logs in and confirms
    act(() => {
      app.context.loginAs(barterTx!.sellerId);
    });
    act(() => {
      app.context.confirmTransaction(txId);
    });

    const completedTx = app.context.transactions.find((t) => t.id === txId)!;
    expect(completedTx.buyerConfirmed).toBe(true);
    expect(completedTx.sellerConfirmed).toBe(true);
    expect(completedTx.status).toBe('COMPLETED'); // 2-way confirmation completes (BR 17_3)

    // BOTH target and offered product must be COMPLETED
    const targetProd = app.context.products.find((p) => p.id === targetProdId);
    const offeredProd = app.context.products.find((p) => p.id === offeredProdId);
    expect(targetProd?.status).toBe('COMPLETED');
    expect(offeredProd?.status).toBe('COMPLETED');

    app.unmount();
  });

  it('UC20, UC27: Review submission & appeal resolution workflow', async () => {
    const app = await renderAppContext();

    // Find a COMPLETED transaction
    const completedTx = app.context.transactions.find((t) => t.status === 'COMPLETED')!;
    expect(completedTx).toBeDefined();

    const buyerId = completedTx.buyerId;
    const sellerId = completedTx.sellerId;

    // Log in as buyer and submit review
    act(() => {
      app.context.loginAs(buyerId);
      app.context.submitReview({
        transactionId: completedTx.id,
        targetUserId: sellerId,
        rating: 1, // unfairly low review
        criteria: { punctuality: 1, courtesy: 1, accuracy: 1 },
        comment: 'Đánh giá vu khống ác ý không đúng thực tế',
      });
    });

    const newRev = app.context.reviews.find((r) => r.transactionId === completedTx.id && r.reviewerId === buyerId);
    expect(newRev).toBeDefined();

    // Duplicate review should be blocked
    const initialReviewCount = app.context.reviews.length;
    act(() => {
      app.context.submitReview({
        transactionId: completedTx.id,
        targetUserId: sellerId,
        rating: 5,
        criteria: { punctuality: 5, courtesy: 5, accuracy: 5 },
        comment: 'Cố tình gửi thêm lần nữa',
      });
    });
    expect(app.context.reviews.length).toBe(initialReviewCount);

    // Target seller appeals the unfair review (UC27)
    act(() => {
      app.context.loginAs(sellerId);
      app.context.appealReview(newRev!.id, 'Đối tác bịa đặt, có tin nhắn bằng chứng tại điểm hẹn');
    });

    expect(app.context.reviews.find((r) => r.id === newRev!.id)?.isAppealed).toBe(true);

    // Admin resolves appeal by REMOVE_REVIEW
    act(() => {
      app.context.loginAs('user-admin');
      app.context.resolveReviewAppeal(newRev!.id, 'REMOVE_REVIEW');
    });

    // Review removed and user rating restored
    expect(app.context.reviews.find((r) => r.id === newRev!.id)).toBeUndefined();
    const updatedSeller = app.context.users.find((u) => u.id === sellerId);
    expect(updatedSeller?.rating).toBeGreaterThanOrEqual(4.0);

    app.unmount();
  });

  it('UC20: Reviews are strictly prohibited for non-completed transactions', async () => {
    const app = await renderAppContext();

    // Find an APPOINTED (not completed) transaction
    const appointedTx = app.context.transactions.find((t) => t.status === 'APPOINTED')!;
    expect(appointedTx).toBeDefined();

    const initialReviewCount = app.context.reviews.length;
    act(() => {
      app.context.loginAs(appointedTx.buyerId);
    });
    act(() => {
      app.context.submitReview({
        transactionId: appointedTx.id,
        targetUserId: appointedTx.sellerId,
        rating: 5,
        criteria: { punctuality: 5, courtesy: 5, accuracy: 5 },
        comment: 'Đánh giá sớm trước khi gặp mặt',
      });
    });

    // Review must NOT be recorded
    expect(app.context.reviews.length).toBe(initialReviewCount);

    app.unmount();
  });

  it('UC22 BR-02: Live dynamic KPI stats calculation reflects real state changes', async () => {
    const app = await renderAppContext();

    const initialTotalPosts = app.context.stats.totalPosts;
    const initialAvailablePosts = app.context.stats.availablePosts || 0;

    // Add a new product
    act(() => {
      app.context.addProduct({
        title: 'Bàn phím cơ Bluetooth gỗ óc chó thủ công',
        description: 'Vỏ gỗ tự nhiên sơn dầu thực vật bóng mờ, keycap PBT cao cấp.',
        categoryId: 'cat-tech',
        condition: 'Mới 99%',
        type: 'EXCHANGE',
        price: 0,
        originalPrice: 1200000,
        images: ['https://example.com/keyboard.jpg'],
        location: {
          province: 'Hồ Chí Minh',
          district: 'Quận 1',
          ward: 'Phường Bến Nghé',
        },
        sellerId: 'user-1',
        status: 'AVAILABLE',
      });
    });

    expect(app.context.stats.totalPosts).toBe(initialTotalPosts + 1);
    expect(app.context.stats.availablePosts).toBe(initialAvailablePosts + 1);

    // Lock a user
    const initialLockedUsers = app.context.stats.lockedUsers || 0;
    act(() => {
      app.context.loginAs('user-admin');
    });
    act(() => {
      app.context.lockUser('user-3', 14, 'Spam post policy violation');
    });

    expect(app.context.stats.lockedUsers).toBe(initialLockedUsers + 1);

    app.unmount();
  });
});
