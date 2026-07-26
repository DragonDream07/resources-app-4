# E-Commerce Backend

A production-ready REST API built with **Express**, **Knex**, and **PostgreSQL**.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Variables](#environment-variables)
4. [Database Migrations & Seeds](#database-migrations--seeds)
5. [Running Tests](#running-tests)
6. [Project Structure](#project-structure)
7. [Module Dependency Direction ADR](#module-dependency-direction-adr)

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 18 |
| npm | >= 9 |
| PostgreSQL | >= 14 |
| Elasticsearch | >= 8 |
| Docker (optional) | >= 24 |

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd ecommerce-backend

# 2. Install dependencies
npm install

# 3. Copy and configure environment variables
cp .env.example .env
# Edit .env with your local values

# 4. Start dependent services (PostgreSQL + Elasticsearch) via Docker
docker-compose up -d

# 5. Run database migrations
npm run migrate

# 6. Seed initial data
npm run seed

# 7. Start the development server
npm run dev
```

The API will be available at `http://localhost:3000`.

---

## Environment Variables

Copy `.env.example` to `.env` and set each value before starting the server.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Runtime environment (`development`, `test`, `production`) |
| `PORT` | No | `3000` | HTTP server port |
| `DB_HOST` | Yes | `127.0.0.1` | PostgreSQL host |
| `DB_PORT` | No | `5432` | PostgreSQL port |
| `DB_NAME` | Yes | `ecommerce_dev` | PostgreSQL database name |
| `DB_USER` | Yes | `postgres` | PostgreSQL user |
| `DB_PASSWORD` | Yes | — | PostgreSQL password |
| `TEST_DB_HOST` | No | `127.0.0.1` | Test database host |
| `TEST_DB_PORT` | No | `5432` | Test database port |
| `TEST_DB_NAME` | No | `ecommerce_test` | Test database name |
| `TEST_DB_USER` | No | `postgres` | Test database user |
| `TEST_DB_PASSWORD` | No | — | Test database password |
| `JWT_SECRET` | Yes | — | Access token signing secret |
| `JWT_EXPIRES_IN` | No | `15m` | Access token lifespan |
| `JWT_REFRESH_SECRET` | Yes | — | Refresh token signing secret |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token lifespan |
| `BCRYPT_ROUNDS` | No | `10` | bcrypt salt rounds |
| `ELASTICSEARCH_NODE` | Yes | `http://localhost:9200` | Elasticsearch connection URL |
| `ELASTICSEARCH_API_KEY` | No | — | Elasticsearch cloud API key |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate-limit window in ms |
| `RATE_LIMIT_MAX` | No | `100` | Max requests per window per IP |
| `CORS_ORIGIN` | No | `http://localhost:3001` | Allowed CORS origins (comma-separated) |
| `LOG_LEVEL` | No | `info` | Winston log level |
| `LOG_DIR` | No | `logs` | Directory for log files |

---

## Database Migrations & Seeds

```bash
# Run all pending migrations
npm run migrate

# Rollback the last batch of migrations
npm run migrate:rollback

# Create a new migration file
npm run migrate:make -- <migration_name>

# Run all seed files
npm run seed
```

### Migration files (in execution order)

| File | Purpose |
|------|---------|
| `001_create_roles` | Roles lookup table |
| `002_create_users` | Core users table |
| `003_create_user_roles` | User ↔ role pivot |
| `004_create_addresses` | Shipping/billing addresses |
| `005_create_serviceable_pin_codes` | Pin-code serviceability table |
| `006_create_categories` | Product categories (self-referential) |
| `007_create_brands` | Product brands |
| `008_create_products` | Products |
| `009_create_product_images` | Product image gallery |
| `010_create_skus` | SKUs with stock |
| `011_create_promo_codes` | Promotional codes |
| `012_create_carts` | Shopping carts |
| `013_create_cart_items` | Cart line items |
| `014_create_orders` | Orders |
| `015_create_order_items` | Order line items |
| `016_create_order_status_history` | Order status audit log |
| `017_create_stock_reservations` | Inventory reservations |
| `018_create_payment_attempts` | Payment attempt records |
| `019_create_refunds` | Refund records |
| `020_create_return_requests` | Return/RMA requests |
| `021_create_order_tracking` | Shipment tracking events |
| `022_create_notifications` | In-app notifications |

---

## Running Tests

```bash
# Run all tests (serial, force-exit)
npm test

# Run tests with coverage report
npm run test:coverage
```

Coverage thresholds (configured in `jest.config.js`):

- Branches: 60 %
- Functions: 60 %
- Lines: 60 %
- Statements: 60 %

---

## Project Structure

```
src/
  app.js                  Express application factory
  server.js               HTTP server entry point
  config/                 Environment-based configuration objects
  db/
    client.js             Knex instance singleton
    migrations/           Knex migration files
    seeds/                Knex seed files
    repositories/         Data-access objects (one per table)
  middleware/             Express middleware (auth, error handling, etc.)
  modules/                Feature modules (routes, controller, service, validator)
    auth/
    users/
    addresses/
    catalogue/
    search/
    cart/
    promotions/
    checkout/
    payments/
    orders/
    returns/
    notifications/
    admin/
    roles/
  utils/                  Shared utility helpers
```

---

## Module Dependency Direction ADR

### Decision

All inter-layer dependencies must flow **strictly downward** through the following layers:

```
Routes / Controllers
       ↓
   Services
       ↓
  Repositories
       ↓
   DB Client
```

### Rules

1. **Routes/Controllers** may import from *Services* and *Middleware* only.
2. **Services** may import from *Repositories*, *Config*, and *Utils* only.
3. **Repositories** may import from *DB Client*, *Config*, and *Utils* only.
4. **Config**, **Utils**, and **DB Client** must not import from *Modules*, *Middleware*, or each other in a circular manner.
5. **No layer may import upward** — repositories must never import from services, services must never import from controllers, etc.
6. **Cross-module imports** (e.g., `orders.service` importing `notifications.service`) are allowed only at the *Service* level and must be acyclic. ESLint `import/no-cycle` enforces this at build time.

### Rationale

- Prevents circular dependencies that cause hard-to-debug runtime failures.
- Makes each layer independently testable via straightforward mocking.
- Enables future extraction of modules into separate microservices without architectural rework.
