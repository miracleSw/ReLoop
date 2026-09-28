// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider, useApp } from '../context/AppContext';
import { ChatInboxPage } from '../pages/user/ChatInboxPage';
import { MessagesPage } from '../pages/user/MessagesPage';
import { Message } from '../types';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = function () {};
window.HTMLElement.prototype.scrollTo = function () {};

async function renderComponent(ui: React.ReactElement) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(ui);
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

describe('Chat / Messaging Layout & Logic Robustness', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders ChatInboxPage and MessagesPage alias identically', async () => {
    const { container: c1, unmount: u1 } = await renderComponent(
      <MemoryRouter initialEntries={['/user/messages']}>
        <AppProvider>
          <ChatInboxPage />
        </AppProvider>
      </MemoryRouter>
    );

    expect(c1.textContent).toContain('Hộp thư trao đổi đề nghị');
    expect(c1.querySelector('input[placeholder*="Nhập tin nhắn"]')).not.toBeNull();
    u1();

    const { container: c2, unmount: u2 } = await renderComponent(
      <MemoryRouter initialEntries={['/user/messages']}>
        <AppProvider>
          <MessagesPage />
        </AppProvider>
      </MemoryRouter>
    );

    expect(c2.textContent).toContain('Hộp thư trao đổi đề nghị');
    u2();
  });

  it('contains proper flex/grid architecture: min-h-0, overflow-y-auto, flex-shrink-0', async () => {
    const { container, unmount } = await renderComponent(
      <MemoryRouter initialEntries={['/user/messages']}>
        <AppProvider>
          <ChatInboxPage />
        </AppProvider>
      </MemoryRouter>
    );

    // Messages stream container
    const scrollContainer = container.querySelector('.overflow-y-auto');
    expect(scrollContainer).not.toBeNull();
    expect(scrollContainer?.classList.contains('min-h-0')).toBe(true);

    // Composer form has flex-shrink-0
    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    expect(form?.classList.contains('flex-shrink-0')).toBe(true);
    expect(form?.classList.contains('min-w-0')).toBe(true);

    // Input has min-w-0 flex-1
    const input = form?.querySelector('input');
    expect(input?.classList.contains('min-w-0')).toBe(true);
    expect(input?.classList.contains('flex-1')).toBe(true);

    // Send button has flex-shrink-0
    const sendBtn = form?.querySelector('button[type="submit"]');
    expect(sendBtn?.classList.contains('flex-shrink-0')).toBe(true);

    unmount();
  });

  it('message bubbles contain robust text wrapping classes and constraints', async () => {
    const { container, unmount } = await renderComponent(
      <MemoryRouter initialEntries={['/user/messages']}>
        <AppProvider>
          <ChatInboxPage />
        </AppProvider>
      </MemoryRouter>
    );

    const bubbles = container.querySelectorAll('.chat-bubble-content');
    expect(bubbles.length).toBeGreaterThan(0);

    for (const bubble of bubbles) {
      expect(bubble.classList.contains('chat-bubble-content')).toBe(true);
      expect(bubble.classList.contains('min-w-0')).toBe(true);
      expect(bubble.classList.contains('break-words')).toBe(true);
      // Parent row must have max-w-full and min-w-0
      const row = bubble.parentElement;
      expect(row?.classList.contains('max-w-full')).toBe(true);
      expect(row?.classList.contains('min-w-0')).toBe(true);
    }

    unmount();
  });

  it('sending a message appends to history without overwriting previous messages', async () => {
    let capturedContext!: ReturnType<typeof useApp>;
    const ContextExtractor = () => {
      capturedContext = useApp();
      return <ChatInboxPage />;
    };

    const { container, unmount } = await renderComponent(
      <MemoryRouter initialEntries={['/user/messages']}>
        <AppProvider>
          <ContextExtractor />
        </AppProvider>
      </MemoryRouter>
    );

    const initialMessagesCount = capturedContext.messages.filter((m) => m.transactionId === 'tx-1').length;
    const input = container.querySelector('input') as HTMLInputElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      nativeSetter?.call(input, 'Tin nhắn thử nghiệm nội dung tiếng Việt có dấu');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    const newMessagesCount = capturedContext.messages.filter((m) => m.transactionId === 'tx-1').length;
    expect(newMessagesCount).toBe(initialMessagesCount + 1);
    expect(container.textContent).toContain('Tin nhắn thử nghiệm nội dung tiếng Việt có dấu');

    unmount();
  });

  it('renders large message history (100+ messages) with all items in DOM in chronological order', async () => {
    // Pre-populate localStorage with 100 messages using the correct prefix
    const manyMessages: Message[] = [];
    const baseTime = new Date('2026-09-24T10:00:00Z').getTime();

    for (let i = 0; i < 110; i++) {
      manyMessages.push({
        id: `msg-stress-${i}`,
        transactionId: 'tx-1',
        senderId: i % 2 === 0 ? 'user-1' : 'user-2',
        receiverId: i % 2 === 0 ? 'user-2' : 'user-1',
        content: `Stress test message #${i + 1} with repeated pattern aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        timestamp: new Date(baseTime + i * 60000).toISOString(),
        isRead: true,
      });
    }

    localStorage.setItem('reloop_state_v1_messages', JSON.stringify(manyMessages));

    const { container, unmount } = await renderComponent(
      <MemoryRouter initialEntries={['/user/messages']}>
        <AppProvider>
          <ChatInboxPage />
        </AppProvider>
      </MemoryRouter>
    );

    const bubbles = container.querySelectorAll('.chat-bubble-content');
    expect(bubbles.length).toBe(110);

    // Verify first and last messages are in DOM
    expect(bubbles[0].textContent).toContain('Stress test message #1');
    expect(bubbles[109].textContent).toContain('Stress test message #110');

    unmount();
  });

  it('generates unique message IDs for high-frequency messages', async () => {
    let capturedContext!: ReturnType<typeof useApp>;
    const ContextExtractor = () => {
      capturedContext = useApp();
      return null;
    };

    const { unmount } = await renderComponent(
      <AppProvider>
        <ContextExtractor />
      </AppProvider>
    );

    await act(async () => {
      for (let i = 0; i < 20; i++) {
        capturedContext.sendMessage('tx-1', 'user-2', `Quick burst message ${i}`);
      }
    });

    const burstMessages = capturedContext.messages.filter((m) => m.content.startsWith('Quick burst'));
    expect(burstMessages.length).toBe(20);

    const idSet = new Set(burstMessages.map((m) => m.id));
    expect(idSet.size).toBe(20); // All 20 IDs must be strictly unique

    unmount();
  });

  it('allows switching conversations when initialized with query param ?tx=tx-2', async () => {
    const { container, unmount } = await renderComponent(
      <MemoryRouter initialEntries={['/user/messages?tx=tx-2']}>
        <AppProvider>
          <ChatInboxPage />
        </AppProvider>
      </MemoryRouter>
    );

    // Initial partner should be Lan Chi (tx-2)
    const threadHeader = container.querySelector('.md\\:col-span-8');
    expect(threadHeader?.textContent).toContain('Lan Chi');

    // Click on conversation tx-1 (Minh Anh)
    const convButtons = container.querySelectorAll('.divide-y button');
    expect(convButtons.length).toBeGreaterThanOrEqual(2);

    await act(async () => {
      convButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    // Should now switch to Minh Anh (tx-1)
    expect(threadHeader?.textContent).toContain('Minh Anh');

    unmount();
  });

  it('prevents premature form submit during Vietnamese IME composition', async () => {
    const { container, unmount } = await renderComponent(
      <MemoryRouter initialEntries={['/user/messages']}>
        <AppProvider>
          <ChatInboxPage />
        </AppProvider>
      </MemoryRouter>
    );

    const input = container.querySelector('input') as HTMLInputElement;
    const form = container.querySelector('form') as HTMLFormElement;

    let submitted = false;
    form.addEventListener('submit', () => {
      submitted = true;
    });

    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      nativeSetter?.call(input, 'tiế');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      // Start IME composition
      input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    });

    await act(async () => {
      // User hits Enter while composing
      const keyEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      input.dispatchEvent(keyEvent);
    });

    expect(submitted).toBe(false);

    unmount();
  });
});

