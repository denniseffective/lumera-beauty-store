# Lumera Beauty Store

Lumera is a complete full-stack beauty and skincare e-commerce course project. Customers can discover products, create an account, manage a persistent cart, complete a simulated checkout, and review previous orders. Administrators can manage products, inventory, orders, and fulfillment status.

## Team contributions

### Product catalog and administration
- PostgreSQL categories and products
- Eight seeded skincare products
- Homepage, catalog, and product details
- Search, category filtering, and sorting
- Admin product creation, editing, deactivation, and inventory

### Accounts, cart, checkout, and orders
- Registration, login, logout, password hashing, and persistent sessions
- Customer and administrator roles enforced by Express
- PostgreSQL carts and cart items
- Add, update, and remove cart items
- Server-calculated checkout totals and inventory transactions
- Simulated payment and order confirmation
- Customer order history and private order details
- Admin order dashboard and status updates

## Technology

- Frontend: Next.js, React, TypeScript, CSS
- Backend: Node.js, Express, REST API
- Database: PostgreSQL
- Security: bcrypt password hashing, signed HTTP-only session cookies, Helmet, validation, parameterized SQL
- Testing: Node test runner and TypeScript compiler

## Architecture

`Next.js frontend → Express REST API → PostgreSQL`

Every major workflow is a vertical slice. For example, checkout begins in the React form, is validated by Express, recalculated and stored in a PostgreSQL transaction, updates inventory, clears the cart, and returns an order confirmation.

## Local installation

1. Install Node.js 20+, Docker Desktop, and Git.
2. Copy `.env.example` to `backend/.env`.
3. Copy the frontend lines from `.env.example` to `frontend/.env.local`.
4. Set a long random `JWT_SECRET` in `backend/.env`.
5. Start the database: `docker compose up -d`
6. Install root tooling: `npm install`
7. Install both applications: `npm run install:all`
8. Start the backend and frontend: `npm run dev`
9. Open `http://localhost:3000`.

Backend: `http://localhost:4000`  
Health check: `http://localhost:4000/api/health`

## Create an administrator

1. Register a normal account in the website.
2. From the project root run:

```bash
npm --prefix backend run make-admin -- your-email@example.com
```

3. Log out and sign in again to receive the administrator role in the new session.

## Main API routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | End session |
| GET | `/api/auth/me` | Current account |
| GET | `/api/products` | Search/filter/sort products |
| GET | `/api/products/:slug` | Product detail |
| GET | `/api/cart` | Customer cart |
| POST | `/api/cart/items` | Add product |
| PATCH | `/api/cart/items/:productId` | Change quantity |
| DELETE | `/api/cart/items/:productId` | Remove product |
| POST | `/api/orders` | Simulated checkout |
| GET | `/api/orders/my-orders` | Customer order history |
| GET | `/api/orders/my-orders/:id` | Private order detail |
| GET | `/api/admin/products` | Admin product list |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Deactivate product |
| GET | `/api/admin/orders` | Admin order dashboard |
| PATCH | `/api/admin/orders/:id/status` | Update order status |

## Testing

```bash
npm test
npm --prefix frontend exec tsc -- --noEmit
```

## Simulated payment

Checkout intentionally does not collect or store real card information. It creates a `simulated_paid` order for a safe classroom demonstration. A Stripe test-mode slice can be added later without changing the order model.

## Deployment

Deploy the Next.js frontend, Express backend, and PostgreSQL database separately. Configure `NEXT_PUBLIC_API_URL`, `FRONTEND_URL`, `DATABASE_URL`, `JWT_SECRET`, and `NODE_ENV=production`. Never commit `.env` files.

## Known limitations and future improvements

- Add Stripe test-mode payment and webhook processing
- Add password reset and email verification
- Add product reviews, wishlists, pagination, and image uploads
- Add integration and end-to-end tests
