# Shop Frontend

React + Vite single-page application for the Shop platform.

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- A running instance of the Shop backend API (see root `README.md` / `docker-compose.yml`)

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template and fill in values
cp .env.example .env

# 3. Start the development server
npm run dev
```

The app will be served at `http://localhost:5173` by default.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | `http://localhost:4000` | Base URL of the backend REST API. The Vite dev server proxies `/api/*` to this origin. |
| `VITE_APP_NAME` | No | `Shop` | Application name rendered in the UI. |
| `VITE_ENABLE_GUEST_CHECKOUT` | No | `true` | Feature flag — set to `false` to require login before checkout. |

All variables consumed by the browser must be prefixed with `VITE_`.

---

## Design Token Usage

Design tokens are defined in `src/config/tailwind.config.js` and are automatically
extended into Tailwind CSS through the root `tailwind.config.js`.

### Using tokens in JSX

```jsx
// Tailwind utility classes — preferred
<button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
  Add to cart
</button>

// Programmatic composition with clsx + tailwind-merge
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

<div className={cn('p-4', isActive && 'ring-2 ring-primary-500')} />
```

### Token categories

| Category | Example class |
|---|---|
| Primary brand colour | `bg-primary-600`, `text-primary-600` |
| Neutral / grey scale | `bg-neutral-100`, `text-neutral-700` |
| Semantic colours | `text-success-600`, `text-danger-600`, `text-warning-500` |
| Typography scale | `text-xs` → `text-4xl` (standard Tailwind) |
| Spacing scale | `p-1` → `p-16` (standard Tailwind) |
| Border radius | `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full` |

---

## Route Map

| Path | Component | Auth |
|---|---|---|
| `/` | `Home` | Public |
| `/products` | `ProductListing` | Public |
| `/categories/:categoryId` | `CategoryProductListing` | Public |
| `/categories/:categoryId/products` | `CategoryProductListing` | Public |
| `/search` | `SearchResults` | Public |
| `/products/:productId` | `ProductDetail` | Public |
| `/cart` | `Cart` | Public |
| `/checkout/address` | `CheckoutAddress` | Guest/Auth |
| `/checkout/review` | `CheckoutReview` | Guest/Auth |
| `/checkout/payment` | `CheckoutPayment` | Guest/Auth |
| `/checkout/confirmation` | `CheckoutConfirmation` | Guest/Auth |
| `/checkout/register` | `GuestPostCheckoutRegister` | Guest |
| `/login` | `Login` | Guest only |
| `/register` | `Register` | Guest only |
| `/forgot-password` | `ForgotPassword` | Guest only |
| `/reset-password` | `ResetPassword` | Guest only |
| `/account` | `AccountOverview` | Protected |
| `/account/profile` | `AccountProfile` | Protected |
| `/account/addresses` | `AccountAddresses` | Protected |
| `/account/addresses/new` | `AddressNew` | Protected |
| `/account/addresses/:addressId/edit` | `AddressEdit` | Protected |
| `/account/orders` | `OrderHistory` | Protected |
| `/account/orders/:orderId` | `OrderDetail` | Protected |
| `/account/orders/:orderId/return` | `ReturnRequest` | Protected |
| `/account/notifications` | `Notifications` | Protected |
| `/admin` | `AdminDashboard` | Admin |
| `/admin/reports` | `AdminReports` | Admin |
| `/admin/orders` | `AdminOrderList` | Admin |
| `/admin/orders/:orderId` | `AdminOrderDetail` | Admin |
| `/admin/products` | `AdminProductList` | Admin |
| `/admin/products/new` | `AdminProductNew` | Admin |
| `/admin/products/:productId/edit` | `AdminProductEdit` | Admin |
| `/admin/categories` | `AdminCategoryList` | Admin |
| `/admin/categories/new` | `AdminCategoryNew` | Admin |
| `/admin/categories/:categoryId/edit` | `AdminCategoryEdit` | Admin |
| `/admin/brands` | `AdminBrandList` | Admin |
| `/admin/brands/new` | `AdminBrandNew` | Admin |
| `/admin/brands/:brandId/edit` | `AdminBrandEdit` | Admin |
| `/admin/promotions` | `AdminPromotionList` | Admin |
| `/admin/promotions/new` | `AdminPromotionNew` | Admin |
| `/admin/promotions/:promoId/edit` | `AdminPromotionEdit` | Admin |
| `/admin/returns` | `AdminReturnList` | Admin |
| `/admin/returns/:returnRequestId` | `AdminReturnDetail` | Admin |
| `/admin/users` | `AdminUserList` | Admin |
| `/admin/users/:userId` | `AdminUserDetail` | Admin |
| `*` | `NotFound` | Public |

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build output to `dist/` |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Run ESLint across all JS/JSX files |
| `npm test` | Run Jest unit/component tests |
