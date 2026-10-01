# GEMINI.md — Project Guide & Operational Context

## 1. Project Overview

**ReLoop Marketplace** (`reloop-marketplace`) is a modern C2C second-hand trading and barter web application designed for the Vietnamese market, emphasizing sustainability, community trust, and a circular economy (*"Nền Tảng Trao Đổi & Mua Bán Đồ Cũ Bền Vững"*).

### Key Features & Functional Modules
- **Dual Transaction Models:** Supports straight buying/selling (`SELL`), item-for-item exchange (`EXCHANGE`), or hybrid flexibility (`BOTH`) with optional monetary compensation adjustments.
- **Role Switcher & Authentication Simulation:** Easily switch between `GUEST`, `USER` (acting as buyer or seller), and `ADMIN` perspectives via the floating UI switcher.
- **Offline Meetup & Transaction Lifecycle:** Structured status workflow (`APPOINTED` -> `RESCHEDULED` -> `COMPLETED` / `CANCELLED` / `DISPUTED`) for in-person handoffs across Vietnamese locations (Hồ Chí Minh, Hà Nội, Đà Nẵng, Thừa Thiên Huế).
- **Direct Messaging / Chat:** Real-time conversational interface (`ChatInboxPage` / `MessagesPage`) tied to transaction contexts and user negotiations.
- **Trust & Reputation Engine:** 0–100 trust score calculations, user ratings (punctuality, courtesy, description accuracy), community reviews, and an appeal mechanism.
- **Safety & Moderation:** Prohibited keyword detection in listings, user blocking, dispute and post reporting modals, and complete admin review flows.
- **Comprehensive Admin Hub:** Dashboard metrics, user moderation (locking with durations and reasons), post curation, category ordering, and report resolutions.

---

## 2. Technology Stack

- **Core Framework:** React 18.3 (`react`, `react-dom`)
- **Language:** TypeScript 5.7 (Target: ES2020, module resolution: bundler)
- **Bundler & Build Tool:** Vite 6.0 (`@vitejs/plugin-react`)
- **Package Manager:** `pnpm` (lockfile version 9+, configured with `pnpm-workspace.yaml`)
- **Routing:** React Router v6 (`react-router-dom` 6.28)
- **Styling & Design System:**
  - Tailwind CSS 3.4 + PostCSS + Autoprefixer
  - Custom palettes: `eco` (emerald green primary), `clay` (warm terracotta accent), `sand` (warm neutral grays), `charcoal` (typography)
  - Typography: *Plus Jakarta Sans* (`font-sans`) and *Newsreader* (`font-editorial`)
  - Utilities: `clsx`, `tailwind-merge`
- **Icons:** Lucide React (`lucide-react`)
- **Testing:** Vitest 5.0 (`vitest`) + `jsdom`

---

## 3. Directory Structure

```text
D:\Project\DAPM\
├── index.html                   # HTML entry point with Google Fonts and eco styling defaults
├── package.json                 # Project dependencies, scripts, and metadata
├── pnpm-lock.yaml               # PNPM deterministic dependency lockfile
├── pnpm-workspace.yaml          # PNPM configuration
├── postcss.config.js            # PostCSS plugin pipeline (Tailwind, Autoprefixer)
├── tailwind.config.js           # Theme extensions, palettes, fonts, shadows, and animations
├── tsconfig.json                # TypeScript compiler configuration with @/* alias
├── tsconfig.node.json           # Node/bundler TypeScript configuration
├── vite.config.ts               # Vite configuration (port 3000, rollup vendor chunks, aliases)
│
└── src/
    ├── main.tsx                 # Root bootstrapping with BrowserRouter and AppProvider
    ├── App.tsx                  # Master route declarations (Public, User Hub, Admin Hub)
    ├── index.css                # Base Tailwind directives, scrollbar, and luminous glass classes
    │
    ├── components/
    │   └── common/              # Shared UI widgets
    │       ├── Footer.tsx               # Global footer with eco branding & navigation links
    │       ├── LoginPromptModal.tsx     # Guest prompt interceptor for auth-required actions
    │       ├── Navbar.tsx               # Main navigation bar with search, role badges, notifications
    │       ├── ProductCard.tsx          # Card view for listings (condition, location, price/exchange badge)
    │       ├── RatingStars.tsx          # Reusable star rating component
    │       ├── ReportModal.tsx          # Report creation modal for items/users
    │       ├── RoleSwitcher.tsx         # Quick role switching utility (Guest / User / Admin)
    │       ├── SpotlightBanner.tsx      # Hero carousel with interactive slide controls
    │       ├── StatusBadge.tsx          # Colored badges for transaction & listing statuses
    │       └── ToastContainer.tsx       # System feedback toast manager
    │
    ├── context/
    │   └── AppContext.tsx       # Central state management and domain actions
    │
    ├── data/
    │   └── mockData.ts          # Relational seed data, initial users, listings, Vietnam locations
    │
    ├── pages/
    │   ├── admin/               # Admin management portal
    │   │   ├── AdminLayout.tsx          # Admin shell with sidebar navigation and metrics
    │   │   ├── AdminDashboardPage.tsx   # System overview and analytics charts
    │   │   ├── AdminUsersPage.tsx       # User locking/unlocking and status management
    │   │   ├── AdminPostsPage.tsx       # Post moderation and prohibited keyword flags
    │   │   ├── AdminCategoriesPage.tsx  # Category visibility and order configuration
    │   │   ├── AdminReportsPage.tsx     # User & listing reports triage
    │   │   └── AdminReviewsPage.tsx     # Review appeals and dispute resolution
    │   │
    │   ├── public/              # Unauthenticated & public discovery pages
    │   │   ├── HomePage.tsx             # Hero spotlight, featured categories, latest listings
    │   │   ├── ExplorePage.tsx          # Filterable catalog (location, price, type, condition)
    │   │   ├── ProductDetailPage.tsx    # Listing details, seller badge, buy/barter actions
    │   │   ├── SellerProfilePage.tsx    # Seller profile, trust score, inventory, reviews
    │   │   ├── CategoriesPage.tsx       # Category catalog
    │   │   ├── SafetyPage.tsx           # Safety guidelines for offline meetups
    │   │   ├── LoginPage.tsx            # Login authentication screen
    │   │   └── RegisterPage.tsx         # Account registration screen
    │   │
    │   └── user/                # Authenticated user hub
    │       ├── UserDashboardPage.tsx    # Activity summary, ongoing trades, quick shortcuts
    │       ├── MyInventoryPage.tsx      # Seller's listed products and status controls
    │       ├── CreateListingPage.tsx    # New listing creation with moderation check
    │       ├── EditListingPage.tsx      # Listing edit form
    │       ├── ExchangeManagementPage.tsx# Incoming & outgoing barter offers
    │       ├── TransactionsListPage.tsx # Meetup transaction history
    │       ├── TransactionDetailPage.tsx# Specific meetup details, rescheduling, completion
    │       ├── ChatInboxPage.tsx        # Conversation center and direct messaging
    │       ├── MessagesPage.tsx         # Alias export for ChatInboxPage
    │       ├── WishlistPage.tsx         # Saved items list
    │       ├── NotificationCenterPage.tsx# In-app alerts and notifications
    │       ├── ReviewsPage.tsx          # Received reviews and appeal triggers
    │       └── SettingsProfilePage.tsx  # User profile edit & location settings
    │
    ├── tests/                   # Vitest unit and integration test suites
    │   ├── businessRules.test.tsx       # Relational integrity and business rule assertions
    │   ├── chatMessaging.test.tsx       # Chat UI, sending messages, scroll behaviors
    │   ├── group3.test.tsx              # Wishlist, filtering, and login prompt assertions
    │   └── spotlightBanner.test.tsx     # Spotlight carousel transitions and autoplay timers
    │
    └── types/
        └── index.ts             # Domain models, enums, and shared TypeScript interfaces
```

---

## 4. Key Development Commands

All commands should be executed with `pnpm` from the workspace root:

| Command | Purpose | Notes |
| :--- | :--- | :--- |
| `pnpm dev` | Start development server | Runs Vite dev server at `http://localhost:3000` |
| `pnpm build` | Type-check and production build | Runs `tsc && vite build` (outputs to `dist/`) |
| `pnpm preview` | Preview production build | Runs Vite preview on `dist/` |
| `pnpm test` | Run test suite | Executes Vitest once across all test suites |

---

## 5. Architecture & State Management

### Central State (`AppContext.tsx`)
The application currently operates with a client-side reactive state pattern powered by React Context:
- **State Store:** Houses collections of `users`, `products`, `categories`, `barterRequests`, `buyRequests`, `transactions`, `messages`, `reviews`, `reports`, `notifications`, `wishlist`, `stats`, and `toasts`.
- **Role & Auth State:** `currentUser` and `currentRole` (`GUEST` | `USER` | `ADMIN`), toggled via `loginAs(userId | null)`.
- **Action Handlers:** Encapsulates business logic such as creating barter offers, accepting/rejecting requests, auto-creating meetup transactions, modifying product status (`AVAILABLE`, `RESERVED`, `COMPLETED`, `LOCKED`, etc.), sending messages, locking users, and triggering toast notifications.

### Path Aliases
The alias `@/` maps directly to `src/` as configured in `tsconfig.json` and `vite.config.ts`.
```typescript
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';
```

### Relational Integrity Guidelines
When adding mock items or seeding features:
1. Every `Product.sellerId` must resolve to an existing `User.id` in `mockUsers`.
2. Every `Product.categoryId` must resolve to an existing `Category.id` in `mockCategories`.
3. Every `BarterRequest` must reference existing `targetProductId` and `offeredProductId`.
4. Every `MeetupTransaction` must link valid `buyerId`, `sellerId`, and `productId`.

---

## 6. Coding & Styling Standards

### Styling & Theme Tokens
- Use Tailwind utility classes matching the project's natural, clean eco-palette:
  - **Eco Primary:** `bg-eco-600`, `text-eco-700`, `hover:bg-eco-700`, `bg-eco-50`
  - **Clay Accent:** `bg-clay-500`, `text-clay-600`, `border-clay-200`
  - **Neutrals:** `bg-sand-50`, `border-sand-200`, `text-charcoal-900`, `text-charcoal-600`
- **Typography:**
  - General interface text uses `font-sans` (*Plus Jakarta Sans*).
  - Editorial headings or brand flourishes use `font-editorial` (*Newsreader*).
- **Utility Classes:**
  - Glass effects: `.glass-card`
  - Ambient glows: `.ambient-glow-emerald`, `.ambient-glow-coral`
  - Long text in messages: `.chat-bubble-content`

### TypeScript Conventions
- Avoid `any`. Leverage defined domain models in `src/types/index.ts`.
- Prefer union literals for states (e.g., `ProductStatus = 'AVAILABLE' | 'RESERVED' | 'COMPLETED' | 'HIDDEN' | 'LOCKED' | 'REMOVED'`).
- Ensure all component props are explicitly typed via interfaces.

---

## 7. Testing Practices

- Test runner is **Vitest** configured with the `jsdom` environment.
- Any test file using DOM rendering must include:
  ```typescript
  // @vitest-environment jsdom
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  ```
- Use React 18 `createRoot` inside `act()` when testing component mounts and user interactions, wrapping components in `AppProvider` and `MemoryRouter` as necessary.
- Ensure that tests cleaning up timers call `vi.useFakeTimers()` / `vi.restoreAllMocks()` properly.
- Run `pnpm test` and `pnpm build` before completing modifications to guarantee zero type errors and zero test regressions.
