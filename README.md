# Lumera Beauty Store

A full-stack beauty and skincare catalog built as one complete vertical-slice half of the course e-commerce project.

## Two-person division

### Person 1 — Products, discovery, and admin (included here)
- PostgreSQL categories and products schema
- Eight seeded skincare products
- Express product/catalog API
- Homepage, product catalog, product details
- Search, category filtering, and sorting
- Responsive and accessible product UI
- Admin create, edit, deactivate, and inventory management
- Backend validation, error states, environment variables, tests

### Person 2 — Accounts, cart, checkout, and orders (handoff)
- Users, carts, cart_items, orders, and order_items tables
- Registration/login/logout and password hashing
- Customer/admin roles and JWT or secure cookie authentication
- Add-to-cart, update quantity, remove item, subtotal
- Checkout validation and server-calculated totals
- Order confirmation, history, and individual order details
- Admin order list and status updates
- Test-mode Stripe payment (after basic flow works)

Person 2 should preserve the existing product API and reference `products.id` from `cart_items` and `order_items`. Replace the temporary `x-admin-key` middleware with real role-based authentication once accounts exist.

## Architecture

`Next.js frontend → Express REST API → PostgreSQL`

## Run locally

1. Install Docker Desktop and Node.js 20+.
2. Copy `.env.example` to `backend/.env`.
3. Copy the frontend lines from `.env.example` to `frontend/.env.local`.
4. Make sure both admin-key values match during development.
5. Start PostgreSQL: `docker compose up -d`
6. Install root tooling: `npm install`
7. Install both applications: `npm run install:all`
8. Start both applications: `npm run dev`
9. Open `http://localhost:3000`.

Backend: `http://localhost:4000` · Health check: `http://localhost:4000/api/health`

## API

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/categories` | List categories |
| GET | `/api/products` | List active products |
| GET | `/api/products/:slug` | Product details |
| GET | `/api/admin/products` | List all products (admin) |
| POST | `/api/admin/products` | Create product (admin) |
| PUT | `/api/admin/products/:id` | Update product (admin) |
| DELETE | `/api/admin/products/:id` | Soft-delete product (admin) |

Catalog query parameters: `search`, `category`, `sort` (`newest`, `price-asc`, `price-desc`, `name`), and `featured=true`.

## Vertical-slice example

Product discovery begins in PostgreSQL (`categories`, `products`), is queried through `GET /api/products`, validated and filtered by Express, requested by the Next.js products page, then displayed with reusable product cards. The feature includes empty/error states, responsive layouts, searchable filters, a validation test, descriptive commits, and should be merged through a reviewed pull request.

## Suggested branches

- Person 1: `feature/product-catalog-admin`
- Person 2: `feature/accounts-cart-orders`

Each person should open a pull request, provide testing steps and screenshots, and review the other person’s work before merging.

## Security note

The admin API key is only a temporary boundary so this half can run independently. Do not deploy it as final authentication. Person 2 must replace it with password hashing, authenticated sessions/tokens, and backend-enforced administrator authorization.

## Tests

Run `npm test`. Current tests verify product validation. Add API integration tests using a separate test database as the project expands.
