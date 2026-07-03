# DMEN — Build Progress & Resume Checkpoint

_Last updated: 2026-06-25. Read this first to resume. Full context in 00–04 docs._

## How to resume (environment)

- Project root: `/Volumes/Ganesh (Extended)/Coding/DMEN`
- Stack: **Next.js 15.5 (App Router) + React 19 + TypeScript + Tailwind v4**. Deps already installed (`pnpm`). Path alias `@/*` → `src/*`.
- Run dev: preview server config `.claude/launch.json` name **`dmen-dev`** (port 3000), or `pnpm dev`.
- Verify build anytime: `pnpm build` (last run: ✅ clean, ~102 kB First Load JS, static prerender).
- Brand assets: `DMEN-Brand/` (source SVGs) + `public/brand/dmen-logo-on-{light,dark}.svg`.
- **Exact brand red = `#BF2626`** (sampled from logo). Single token `--color-red`. Never `#FF0000`.

## ✅ DONE (built & verified on localhost:3000)

- `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore` — project config.
- `src/app/globals.css` — full design-token system (Tailwind v4 `@theme`): colors (incl. `--color-red #BF2626`, `--color-warning` fixed to `#9A5A00`), type scale (`.type-*` classes, rem-anchored clamps so the 44px mobile floor holds), breakpoints (sm 480), containers, motion easings, global focus ring, `prefers-reduced-motion` guard.
- `src/app/layout.tsx` — Anton (display) + Inter (body) via `next/font`, metadata, viewport themeColor.
- `src/components/brand/Logo.tsx` — inline SVG wordmark. Mark always `#BF2626`; wordmark `currentColor`. Variants `on-light` / `on-dark`. (Satisfies premortem: logo is SVG, NEVER Anton rendering "DMEN".)
- `src/app/page.tsx` — **real Home** (hero + MEN|MINDSET|HUSTLE pillars + best-sellers rail + The Drop band + manifesto; asymmetric).
- `src/lib/commerce/types.ts` — Shopify-Storefront-shaped types (Money, GID ids, option-matrix variants w/ availableForSale, async `CommerceAdapter`, `DeliveryEstimateProvider` port, `imageProvenance`, required fit fields).
- `src/lib/commerce/money.ts` — `formatMoney` (en-IN), `savingsPercent`, money math.
- `src/lib/commerce/config.ts` — `inr()`, `FREE_SHIPPING_THRESHOLD` (TODO confirm), `LOW_STOCK_THRESHOLD`, `COLOR_SWATCHES`.
- `src/lib/commerce/delivery.ts` — mock `DeliveryEstimateProvider` (non-blocking, reassuring defaults, COD eligibility).
- `src/lib/commerce/fixtures.ts` — `PRODUCTS` (9 SKUs) + `COLLECTIONS` (10); honest stock (some sold-out/low), honest reviews (some 0), no fake discounts, `imageProvenance:"placeholder"`.
- `src/lib/commerce/adapter.ts` — async mock `CommerceAdapter`; **cart totals owned here**; `userErrors`; `checkoutUrl` placeholder.
- `src/lib/commerce/store.tsx` — `CartProvider` (optimistic ≤50ms add, mini-cart state) + `useCart`.
- `src/components/brand/`: `Logo`, `BrandGlyph` (red D-swoosh signature).
- `src/components/commerce/`: `Price`, `SocialProof` (honest 0-review state), `ProductMedia` (honest placeholder, no AI imagery), `ProductCard`, `QuickAdd`, `AddToCartButton` (optimistic), `ProductBuyBox` (colour swatches + square size tiles + fit cue + size-guide modal), `PincodeCheck`, `MiniCart` (free-ship goal-gradient via `transform:scaleX`).
- `src/components/layout/`: `AnnouncementBar`, `Header` (mega-nav + live cart badge), `Footer` (on-dark logo), `NewsletterForm`. Shell wired into `layout.tsx` (CartProvider + bar + header + footer + MiniCart).
- Routes: `/` · `/collections/[handle]` (PLP) · `/products/[handle]` (PDP: gallery, buy block, Built-For, spec strip, Complete-the-Kit) · `/cart` · `/checkout` (branded handoff stub) · `/journal` (stub) · `/pages/[slug]` (about/contact/shipping-returns/size-guide stubs).
- **VERIFIED**: 30 routes build static & clean; no console errors; add-to-cart → mini-cart funnel works end-to-end; mobile + desktop checked.
- Docs: `00`–`04` + this file.

## ✅ DEPTH LAYER DONE (this session — built, integrated, verified)

- **Home**: `Marquee` (CSS ticker), `StatStrip` (honest count-up from fixtures: 9 / 106 / 4.7★ / 100+), `CompleteTheKit`, `UGCWall` (honest placeholders).
- **PLP**: `CollectionControls` — Size + Colour chip filters + Sort (verified filtering: Blood Red → 1 piece).
- **PDP**: `ProductStory` (A+ asymmetric bands, apparel-only) + `ProductReviews` (honest, fit-confidence marker; Athletic reconciled to "true to size").
- **Contact**: `ContactForm` wired into `/pages/contact`.

## ✅ FINISHING PASS DONE (built, reviewed, verified)

- **Header polish**: transparent-over-hero → solid-on-scroll (passive listener); keyboard/focus-openable dropdowns + `aria-controls`; mobile menu linked.
- **Mobile sticky add-to-cart bar** on PDP (IO-driven, safe-area, bottom clearance).
- **Analytics** shim (`src/lib/analytics.ts` → `dataLayer`) wired across view_item / swatch_changed / size_selected / add_to_cart / pincode_checked / begin_checkout / newsletter_signup.
- **Real About page** (`/pages/about`): origin arc + pillars + timeline + CTA.
- **SEO**: Product + Breadcrumb JSON-LD (PDP), Organization + WebSite (layout), `sitemap.ts`, `robots.ts`; skip link + `<main>` landmark.
- **Adversarial 5-lens review run + fixes applied**: shared `useDialog` hook (ESC + focus-trap + restore) on MiniCart & size-guide; cm→ft/in bug fixed; AnnouncementBar SSR (no CLS); AA contrast on placeholder labels; StatStrip red-discipline + Save-Data guard; consistent active-chip colour; `<s>` + sr-only on struck price; size-tile sold-out a11y; `freeShipProgress` helper; adapter drops unknown variants; `cdn.shopify.com` remotePattern; ProductMedia default `sizes`.
- **Deliberately skipped** (low value / over-scope): `noUncheckedIndexedAccess`, CollectionControls server-render, Marquee keyframes→globals dedup, findVariant rewrite (current usage correct).

## ▶️ REMAINING — only USER action items (external accounts / assets)

The front-end is feature-complete against the mock adapter. To go live:
1. **Hero media**: commissioned video deferred per perf rules; mobile low-byte AVIF poster as only-preloaded image. (Blocked on the photoshoot.)
2. **USER action items** below (Shopify dev store + codegen, payments, courier API, photoshoot, seeded reviews, ops constants).

## 🔑 Premortem rules to honor while building (see 04-PREMORTEM.md)

- **No in-app "Pay" step / no fake 3-step endowed bar.** Bespoke flow ends at cart → branded handoff to Shopify hosted checkout (`cart.checkoutUrl`).
- **Red rule amended:** primary commerce action (sticky add-to-cart / checkout CTA) is **exempt** from the per-viewport red budget — always full red. Budget governs only non-action red. Add the recurring brand glyph so no viewport scrolls brand-anonymous.
- **Mobile sticky-layer budget:** reserve `scroll-padding-bottom`; collapse bottom CTA on input focus (visualViewport); no sticky CTA on `/checkout`; use `100svh/dvh`, never raw `vh`.
- **INP:** optimistic ≤50ms; defer heavy work to next frame; animate via `transform`/`opacity` only.
- **Content gate:** `imageProvenance` must not be `placeholder` at launch; `modelHeightCm`/`modelSizeWorn`/`fitType` required; honest low-review-count component, never fake reviews/UGC.
- **Layout distinctiveness:** ≥60% asymmetric sections; forbid symmetric centered default-padding stacks; site must be "distinguishable with logos removed".
- **A11y:** WCAG AA contrast (red on base = ~5.7:1 ✓), named color swatches in text, real `<label>`s, one shared focus-trap primitive, reduced-motion source of truth.

## 📋 USER ACTION ITEMS (cannot be done in-code — needed before launch)

- Shopify dev store (9 SKUs, India market INR/tax-inclusive, inventory tracking) + run `@shopify/graphql-codegen` to replace hand-written types.
- Payment provider config: Shopify Payments (or Razorpay/GoKwik) with **UPI + COD + one wallet**; complete one real ₹1 end-to-end purchase on a mid-range Android over 4G (gate-zero).
- India courier/serviceability API (Shiprocket/Delhivery/GoKwik) for the real DeliveryEstimateProvider.
- **Commissioned high-key "grit" photoshoot** (real athletes; single grade LUT; capture model height + size worn per garment) — longest lead, blocks launch.
- Pre-launch gifting program → real seeded reviews + consented `#ForRisingMen` UGC photos.
- Ops constants: free-shipping threshold (model vs ₹699 single-SKU), returns/exchange window (10–15 days + reverse pickup), COD policy.
- Per-SKU tech-pack data: size charts (in+cm), GSM, blend, fit, care.

## ✅ TYPOGRAPHY + MOTION PASS (2026-07-02, owner-directed)

- **Font**: Anton removed entirely. Display = **Inter 800, UPPERCASE, tracked-out** (xxl +0.035em / xl +0.05em / h2 +0.07em, sizes rebalanced for Inter's width). Body Inter regular. One family sitewide.
- **21st.dev research** (workflow parsed real install counts across ~900 components + fetched component source): adopted marquee physics (mask-edge fade, translate3d), hover-intent dropdown pattern, focus-grid sibling dim, card hover choreography, reserved-space form feedback principles; **skipped** Aurora/Sparkles/Spline/Rainbow-button/Text-Rotate/scroll-jack patterns (runtime-heavy, red-discipline or motion-law violations).
- **Motion system** (globals.css + `src/components/motion/Reveal.tsx` + `src/app/template.tsx`): token ladder `--dur-1..4`, IO scroll-reveals with stagger + above-fold no-flash sync, hero 4-beat entrance (media 480ms scale-settle → text beats 120/220/300ms), link-wipe underlines, badge pop, route fade, PLP results-swap rise, sibling-dim grids, MiniCart content-group fade, pillar hover wash/nudge/bar-grow, QuickAdd hover-rise (desktop) — all transform/opacity, guarded by reduced-motion + Save-Data (`html[data-motion=off]`) + no-JS.
- Verified live: build clean (32 routes), zero console errors, add-to-cart funnel intact, PLP filter swap animates, mobile + desktop checked.
