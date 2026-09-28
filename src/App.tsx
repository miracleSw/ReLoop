import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { ToastContainer } from './components/common/ToastContainer';

// Public pages
import { HomePage } from './pages/public/HomePage';
import { ExplorePage } from './pages/public/ExplorePage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { SellerProfilePage } from './pages/public/SellerProfilePage';
import { CategoriesPage } from './pages/public/CategoriesPage';
import { SafetyPage } from './pages/public/SafetyPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// User pages
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { MyInventoryPage } from './pages/user/MyInventoryPage';
import { CreateListingPage } from './pages/user/CreateListingPage';
import { EditListingPage } from './pages/user/EditListingPage';
import { ExchangeManagementPage } from './pages/user/ExchangeManagementPage';
import { TransactionsListPage } from './pages/user/TransactionsListPage';
import { TransactionDetailPage } from './pages/user/TransactionDetailPage';
import { ChatInboxPage } from './pages/user/ChatInboxPage';
import { WishlistPage } from './pages/user/WishlistPage';
import { NotificationCenterPage } from './pages/user/NotificationCenterPage';
import { ReviewsPage } from './pages/user/ReviewsPage';
import { SettingsProfilePage } from './pages/user/SettingsProfilePage';

// Admin pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminPostsPage } from './pages/admin/AdminPostsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';

// Public layout wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden w-full max-w-full relative">
      <Navbar />
      <main className="flex-1 w-full max-w-full">
        <Outlet />
      </main>
      <Footer />
      <RoleSwitcher />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* PUBLIC & USER ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/sellers/:id" element={<SellerProfilePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User Hub */}
        <Route path="/user/dashboard" element={<UserDashboardPage />} />
        <Route path="/user/products" element={<MyInventoryPage />} />
        <Route path="/user/create-listing" element={<CreateListingPage />} />
        <Route path="/user/edit-listing/:id" element={<EditListingPage />} />
        <Route path="/user/exchanges" element={<ExchangeManagementPage />} />
        <Route path="/user/transactions" element={<TransactionsListPage />} />
        <Route path="/user/transactions/:id" element={<TransactionDetailPage />} />
        <Route path="/user/messages" element={<ChatInboxPage />} />
        <Route path="/user/wishlist" element={<WishlistPage />} />
        <Route path="/user/notifications" element={<NotificationCenterPage />} />
        <Route path="/user/reviews" element={<ReviewsPage />} />
        <Route path="/user/profile" element={<SettingsProfilePage />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="posts" element={<AdminPostsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
      </Route>

      {/* 404 CATCH-ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
