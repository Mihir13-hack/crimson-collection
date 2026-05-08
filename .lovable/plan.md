# Luxury Winery — Full-Stack Build Plan

A premium dark-themed winery site (wine red `#4B0F1A` + gold `#D4AF37` on near-black `#0E0E0E`, Playfair Display + Poppins) built on the project's actual stack: **TanStack Start (React + Vite) + Tailwind + Framer Motion + Lovable Cloud** (Postgres, Auth, Storage, server functions). Express/MongoDB are not used — Lovable Cloud replaces them with the same capabilities, no separate server to host.

Payments are intentionally out of scope for this pass (per your choice). Catalog content and bottle imagery will be AI-generated placeholders you can swap later.

---

## 1. Foundation

- Enable **Lovable Cloud** (Postgres + Auth + Storage + server functions).
- Update `src/styles.css` design tokens to the luxury palette in `oklch` (wine, gold, obsidian, cream), add gradients, glass surfaces, gold shadow.
- Load Playfair Display (headings) + Poppins (body) via `<link>` in `__root.tsx` head.
- Add Framer Motion, react-hook-form, zod, date-fns, recharts (admin), embla (carousel already in shadcn).
- Global layout in `__root.tsx`: animated sticky navbar (scroll-shrink, gold underline on hover), mobile hamburger sheet, premium footer with newsletter.

## 2. Database schema (Lovable Cloud / Postgres)

Tables (all with RLS):
- `profiles` (id→auth.users, full_name, avatar_url, phone)
- `user_roles` (user_id, role enum: `admin` | `customer`) + `has_role()` security-definer fn
- `categories` (slug, name) — Red, White, Sparkling, Rosé
- `products` (name, slug, category_id, price, vintage, region, varietal, abv, stock, rating, description, tasting_notes, food_pairing, image_url, gallery jsonb, featured)
- `reviews` (product_id, user_id, rating, title, body)
- `wishlists` (user_id, product_id)
- `cart_items` (user_id, product_id, quantity)
- `orders` (user_id, status, subtotal, discount, total, shipping jsonb, coupon_code)
- `order_items` (order_id, product_id, name, price, quantity)
- `coupons` (code, percent_off, active, expires_at)
- `bookings` (user_id, type: `tasting`|`tour`, date, time, guests, notes, status)
- `blog_posts` (slug, title, excerpt, body, cover_url, author_id, published_at, tags)
- `newsletter_subscribers` (email)
- `recently_viewed` (user_id, product_id, viewed_at)
- Storage bucket `wine-images` (public read, admin write).

RLS: customers read public catalog/blog; own their cart/wishlist/orders/reviews/bookings. Admins (via `has_role`) full write.

## 3. Customer site (routes under `src/routes/`)

- `/` Home — cinematic hero (video/image, parallax), featured wines carousel, story strip, awards row, tasting CTA, testimonials, newsletter, footer. Scroll-reveal via Framer Motion.
- `/shop` — grid + sidebar filters (category, price slider, vintage, rating), search, sort, pagination, skeletons.
- `/wine/$slug` — gallery with zoom-on-hover, tasting notes, food pairing, rating + reviews, add to cart, wishlist, similar wines.
- `/story`, `/awards`, `/contact` (form + map embed + socials), `/blog`, `/blog/$slug`.
- `/booking` — tasting / vineyard tour reservation: type, date picker, time slot, guest count, confirmation toast + email-style summary.
- `/cart`, `/checkout` (shipping + coupon + order summary; creates order with `status='pending_payment'`, no live charge).
- `/auth` (login/register/forgot-password) using Lovable Cloud auth (email+password and Google).
- `/account` — profile, orders, bookings, wishlist, recently viewed.
- `/recommendations` — AI wine recommendation form ("tell us your taste") via Lovable AI Gateway → returns 3 wines from catalog with rationale.

## 4. Admin dashboard (`/admin/*`, role-guarded)

- `_authenticated/_admin` layout with `has_role('admin')` check.
- Sidebar (shadcn) + topbar.
- Pages: Overview (KPIs + revenue line chart + orders bar chart via recharts), Products (CRUD + image upload to Storage), Categories, Orders (status updates), Bookings (approve/cancel), Users + roles, Blog (markdown editor), Coupons, Inventory (stock edits).

## 5. Server functions (`createServerFn`)

Grouped in `src/lib/*.functions.ts`: products, cart, orders, bookings, reviews, wishlist, blog, admin-analytics, ai-recommend, newsletter. Auth-protected with `requireSupabaseAuth`; admin actions additionally check role server-side.

## 6. UX polish

Framer Motion page transitions, hover-scale product cards, gold underline links, glassmorphism cards (`backdrop-blur` + translucent surface), sonner toasts, skeleton loaders, lazy-loaded images, per-route `head()` SEO metadata + JSON-LD on product pages, fully responsive (mobile hamburger, tablet 2-col, desktop 3–4 col grid).

## 7. Placeholder content

Seed ~12 wines across the 4 categories with AI-generated bottle photography, 3 blog posts, 4 testimonials, 2 booking time-slot templates, 1 sample coupon (`CELLAR10`).

---

## Technical notes

- Stack: TanStack Start v1, React 19, Tailwind v4, Framer Motion, Lovable Cloud (Supabase under the hood).
- Roles via separate `user_roles` table + `has_role()` SECURITY DEFINER fn (never on profiles).
- All DB writes through `createServerFn` with Zod validation; admin client only inside verified server code.
- AI recommendations via Lovable AI Gateway (no extra key needed).
- Images uploaded through admin go to the `wine-images` Storage bucket; public URLs stored on `products`.

## Out of scope this pass

Live payments (Stripe/Razorpay), real invoice PDF generation, real email sending (Resend can be added later), Google Maps API key (use a simple embed iframe).

## Build order (large — will land in stages within this single implementation)

1. Cloud + schema + seed + design tokens + layout/nav/footer.
2. Home + Shop + Product detail + cart + wishlist.
3. Auth + account + checkout (no payment) + bookings + blog + contact + AI recs.
4. Admin dashboard (analytics, products, orders, bookings, blog, users, coupons).

Approve to start with step 1.
