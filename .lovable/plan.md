# Major Redesign Plan

This is a large set of changes touching theme, navigation, homepage, shop, story, footer, and assets. Let me confirm direction before implementing.

## 1. Site-wide

- **New base color**: shift background from near-black to deep wine-red palette (`--background` → dark wine, with subtle warm gradient). Keep gold accents and cream foreground.
- **Logo**: generate a `Maison Noir` monogram/wordmark logo (gold on transparent), use in Navbar (replacing text) and Footer.
- **Reduce body↔footer space**: remove bottom padding from page sections, tighten footer top padding.
- **Remove "Journal"** from navbar; delete `/blog` link from nav (keep route accessible but unlinked).

## 2. Navbar
- Replace `Maison Noir` text with logo image.
- Nav items: Home · Shop · Story · Visit · Contact.

## 3. Homepage (`/`)

- **Categories strip**: each card gets a faint background bottle image specific to its type (red, white, sparkling, rosé) with dark overlay so text/icon stays legible.
- **Tighten spacing**: reduce `py-20` between Categories and Featured Wines to `pt-6 pb-12`.
- **Featured Wines product cards**: replace static bottle image with autoplaying, muted, looped MP4 of a wine-bottle animation. Different video per category (red / white / sparkling / rosé). Falls back to image if video fails.
- **Add 3 more featured products** — mark 3 existing products as `featured=true` via migration so 7+ show.
- **Visit the Estate section**: full-bleed estate video background (muted, looped, autoplay) with dark gradient overlay, gold CTA on top.
- **Tighten "In Praise" → footer** gap.

## 4. Shop page (`/shop`)
- Remove inline filter chips/dropdowns under the search bar.
- Add a single **Filters** button next to the search input → opens a Sheet/Drawer with category, region, vintage, price, sort. Apply button commits filters.
- Product cards use the same animated bottle video as homepage.

## 5. Story page (`/story`)
- Replace the **Philosophy** section with a **"Notes from the Cellar — The Journal"** section: lists latest blog posts (cards with cover, title, excerpt, link to `/blog/$slug`).
- Add a **Testimonials** section at the bottom (reuse the homepage testimonial styling).

## 6. Footer
- Reduce vertical padding (e.g. `py-20` → `pt-10 pb-6`), trim newsletter card spacing, smaller logo block.

## 7. Assets needed (generated)
- `logo-maison-noir.png` (transparent, gold wordmark)
- 4 category bottle backgrounds: red / white / sparkling / rosé (dark, moody)
- 4 wine-bottle animation videos (5s loops): red / white / sparkling / rosé
- 1 estate ambience video (vines/cellar, 10s loop)

## Technical notes

- Videos generated via `videogen--generate_video` at 1080p, stored in `src/assets/videos/`.
- `ProductCard` gains a `videoUrl?: string` prop; resolver picks per category.
- New `<BottleMedia>` component: `<video>` with `autoplay muted loop playsinline` + `<img>` poster fallback.
- Color shift done in `src/styles.css` only — semantic tokens remain, no component color rewrites.
- Filters drawer: shadcn `Sheet` + existing search params (`category`, `sort`, plus new `region`, `vintageMin`, `vintageMax`, `priceMax`).
- Migration: `UPDATE products SET featured = true WHERE slug IN (...3 slugs...);` (no schema change).
- Journal section on Story: reuses `blog_posts` query already wired in `/blog`.

## Out of scope / assumptions
- Keep `/blog` route reachable via direct URL and footer "From the Journal" card; only nav link removed.
- "Wine bottle animation video" interpreted as a short looping MP4 of a rotating/pouring bottle, generated per wine type.
- New background = a deep wine-red (`oklch(0.18 0.05 18)`) — not bright red. Confirm if you want lighter.

Reply **go** to proceed, or call out anything to adjust (color shade, which 3 wines to feature, video style, etc.).