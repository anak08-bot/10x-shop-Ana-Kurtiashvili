# 10X Shop

A single-page online store built for the 10X Front-end graduation project. Browse a catalog, open product pages, fill a cart, log in (or sign up) and place a simulated order. The look is elegant and calm: a cream/ivory light theme and a true-black dark theme (product photos always sit on a light tile, so they stay easy to see), a serif display font (Playfair Display), the red star of the logo shading into burgundy, champagne gold and deep navy accents.

**Live demo:** `<add your Vercel / Netlify link here>`
**Test account:** username `emilys`, password `emilyspass` (any username works with a password of 6+ characters; there is no real authentication).

## Features

### CORE
- **Routing:** `/`, `/login`, `/products/:id`, `/cart`, `/checkout` and a `*` 404 page, all inside one shared Layout (Header, page, Footer). No full reloads.
- **Login:** controlled form, required-field validation, `AuthContext` login/logout. Guests who open `/checkout` are sent to `/login` and come back after logging in.
- **Catalog:** `GET /products` with loading, error and empty states; `ProductCard` + `ProductGrid` rendered with `map()` and stable keys; responsive grid (1 / 2 / 3 / 4 columns).
- **Product details:** `useParams` + `GET /products/:id`, photo gallery, quantity stepper, stock states, Add to cart. Invalid or unknown ids show the 404 page.
- **Cart:** `CartContext` (immutable updates), quantity change, remove, subtotal/total, header badge, empty state.
- **Checkout:** controlled form (full name, email, address, city), validation, simulated order confirmation, cart cleared afterwards.
- **Quality:** responsive from 375px, hover/focus/disabled states, Error Boundary, TypeScript strict mode with zero errors.

### FULL (selected)
- **Sign up page** (`/register`) with Formik + Yup; **Login** also uses Formik + Yup.
- **Catalog:** debounced search, category filter, sorting, pagination, and all of it stored in the URL (`?q=&category=&sort=&page=`).
- **Product:** reviews (local, persisted), related products.
- **Cart:** promo code `10X10` (10% off), free shipping over $100.
- **Orders** (`/orders`, `/orders/:id`) with a simulated status (Processing → Shipped → Delivered) and Reorder.
- **Profile** (`/profile`): edit details, theme switch, clear local data, log out.
- **Extras:** dark mode, toasts, route-level lazy loading, `@theme` design tokens (crimson/burgundy, gold, navy, cream) and a custom `eyebrow` `@utility`, generics, type guards, OOP classes (`ApiClient`, `ApiError`, `Cart`, `StorageService<T>`).

## Tech stack
Vite, React 19, TypeScript (strict), React Router, Tailwind CSS v4 (`@tailwindcss/vite`), Formik + Yup, DummyJSON API.

## Architecture
```
src/
  api/         ApiClient (generic fetch wrapper), ApiError, shared `api` instance
  types/       all domain types in one place (product, cart, order, user, api, ...)
  models/      Cart (totals), StorageService<T> (typed localStorage), storage instances
  context/     Auth, Cart (+ pure reducer), Orders, Theme, Toast
  hooks/       useFetch<T>, useDebounce, useLocalStorage<T>, useNow, useAddToCart
  components/  ui/ layout/ product/ cart/  (reusable pieces)
  pages/       one file per route (lazy-loaded)
  routes/      AppRoutes, ProtectedRoute
  utils/       format, url, validation, schemas (Yup), guards, sort, orders
```
**Data flow:** user action → event handler → context function / `setState` → new immutable state → React re-renders. API requests start in `useEffect` (inside `useFetch`), are cancelled with `AbortController` when the URL changes, and loading / error / empty states are shown by conditional rendering. The catalog reads `q`, `category`, `sort` and `page` from the URL, so refresh, Back/Forward and shared links all work.

## How to run
```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run lint
npm run build
npm run preview
```
Deploy: `vercel.json` and `public/_redirects` rewrite every path to `index.html`, so refreshing `/products/5` works on Vercel and Netlify.

## Local storage keys
`shop_cart`, `shop_orders`, `shop_reviews`, `shop_theme`, `shop_user` (session: username + profile, never a password), `shop_accounts` (registered profiles, no passwords). Everything read from storage is validated by a type guard.

## Limitations
- Login, sign up and checkout are **simulations**: no server, no real credentials, no payment. A registered account is restored by username only.
- Data lives in one browser's localStorage.
- Product data comes from the public DummyJSON API, so stock and reviews are test data.

## Credits
Product data: [DummyJSON](https://dummyjson.com). Built with the help of an AI assistant (Claude) for scaffolding; design, scope decisions and testing are my own. See `REPORT.md`.
