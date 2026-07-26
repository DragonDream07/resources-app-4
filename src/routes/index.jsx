import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import GuestRoute from './GuestRoute';

// Lazy-loaded page components
import { lazy, Suspense } from 'react';

const withSuspense = (Component) => (
  <Suspense fallback={<div className="page-loader" />}>
    <Component />
  </Suspense>
);

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// Public pages
const HomePage = lazy(() => import('@/pages/home/HomePage'));
const SearchPage = lazy(() => import('@/pages/search/SearchPage'));
const ProductDetailPage = lazy(() => import('@/pages/catalogue/ProductDetailPage'));
const CategoryPage = lazy(() => import('@/pages/catalogue/CategoryPage'));
const NotFoundPage = lazy(() => import('@/pages/error/NotFoundPage'));
const ForbiddenPage = lazy(() => import('@/pages/error/ForbiddenPage'));

// Protected user pages
const CartPage = lazy(() => import('@/pages/cart/CartPage'));
const CheckoutReviewPage = lazy(() => import('@/pages/checkout/CheckoutReviewPage'));
const CheckoutAddressPage = lazy(() => import('@/pages/checkout/CheckoutAddressPage'));
const CheckoutPlaceOrderPage = lazy(() => import('@/pages/checkout/CheckoutPlaceOrderPage'));
const PaymentPage = lazy(() => import('@/pages/payments/PaymentPage'));
const OrderListPage = lazy(() => import('@/pages/orders/OrderListPage'));
const OrderDetailPage = lazy(() => import('@/pages/orders/OrderDetailPage'));
const ProfilePage = lazy(() => import('@/pages/users/ProfilePage'));
const AddressListPage = lazy(() => import('@/pages/users/AddressListPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));
const ReturnRequestPage = lazy(() => import('@/pages/returns/ReturnRequestPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/products/AdminProductsPage'));
const AdminProductFormPage = lazy(() => import('@/pages/admin/products/AdminProductFormPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/categories/AdminCategoriesPage'));
const AdminBrandsPage = lazy(() => import('@/pages/admin/brands/AdminBrandsPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/orders/AdminOrdersPage'));
const AdminOrderDetailPage = lazy(() => import('@/pages/admin/orders/AdminOrderDetailPage'));
const AdminReturnRequestsPage = lazy(() => import('@/pages/admin/returns/AdminReturnRequestsPage'));
const AdminReturnRequestDetailPage = lazy(() => import('@/pages/admin/returns/AdminReturnRequestDetailPage'));
const AdminPromoCodesPage = lazy(() => import('@/pages/admin/promos/AdminPromoCodesPage'));
const AdminReportsPage = lazy(() => import('@/pages/admin/reports/AdminReportsPage'));

const router = createBrowserRouter([
  // Guest-only routes (redirect authenticated users away)
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: withSuspense(LoginPage) },
      { path: '/register', element: withSuspense(RegisterPage) },
      { path: '/forgot-password', element: withSuspense(ForgotPasswordPage) },
      { path: '/reset-password', element: withSuspense(ResetPasswordPage) },
    ],
  },

  // Public routes
  { path: '/', element: withSuspense(HomePage) },
  { path: '/search', element: withSuspense(SearchPage) },
  { path: '/products/:productId', element: withSuspense(ProductDetailPage) },
  { path: '/categories/:categoryId', element: withSuspense(CategoryPage) },

  // Protected user routes
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/cart', element: withSuspense(CartPage) },
      { path: '/checkout/review', element: withSuspense(CheckoutReviewPage) },
      { path: '/checkout/address', element: withSuspense(CheckoutAddressPage) },
      { path: '/checkout/place-order', element: withSuspense(CheckoutPlaceOrderPage) },
      { path: '/payments', element: withSuspense(PaymentPage) },
      { path: '/orders', element: withSuspense(OrderListPage) },
      { path: '/orders/:orderId', element: withSuspense(OrderDetailPage) },
      { path: '/orders/:orderId/return', element: withSuspense(ReturnRequestPage) },
      { path: '/profile', element: withSuspense(ProfilePage) },
      { path: '/addresses', element: withSuspense(AddressListPage) },
      { path: '/notifications', element: withSuspense(NotificationsPage) },
    ],
  },

  // Admin routes
  {
    element: <AdminRoute />,
    children: [
      { path: '/admin', element: withSuspense(AdminDashboardPage) },
      { path: '/admin/products', element: withSuspense(AdminProductsPage) },
      { path: '/admin/products/new', element: withSuspense(AdminProductFormPage) },
      { path: '/admin/products/:productId/edit', element: withSuspense(AdminProductFormPage) },
      { path: '/admin/categories', element: withSuspense(AdminCategoriesPage) },
      { path: '/admin/brands', element: withSuspense(AdminBrandsPage) },
      { path: '/admin/orders', element: withSuspense(AdminOrdersPage) },
      { path: '/admin/orders/:orderId', element: withSuspense(AdminOrderDetailPage) },
      { path: '/admin/return-requests', element: withSuspense(AdminReturnRequestsPage) },
      { path: '/admin/return-requests/:returnRequestId', element: withSuspense(AdminReturnRequestDetailPage) },
      { path: '/admin/promo-codes', element: withSuspense(AdminPromoCodesPage) },
      { path: '/admin/reports', element: withSuspense(AdminReportsPage) },
    ],
  },

  // Error pages
  { path: '/403', element: withSuspense(ForbiddenPage) },
  { path: '*', element: withSuspense(NotFoundPage) },
]);

export default router;
