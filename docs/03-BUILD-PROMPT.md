# DMEN — Detailed Build Prompt

> Recommended stack and remaining decisions at the end.

## ✅ Locked decisions (2026-06-25)

- **Commerce backend: Shopify Headless (Storefront API).** Committed.
- **Build approach: FRONT-END FIRST.** Build the complete Next.js front-end + design system now; connect Shopify later. Therefore:
  - Implement a **typed commerce interface** (`Product`, `Variant`, `Cart`, `CartLine`, `Collection`, `Checkout`) as the single boundary between UI and data. Shape these to mirror Shopify Storefront API objects so the later swap is non-breaking.
  - Ship a **mock/local data adapter** now (JSON fixtures for the 9 SKUs + a client-side cart store, e.g. Zustand/Context). The same interface is later re-implemented by a **Shopify Storefront adapter** — UI code does not change.
  - Cart + mini-cart + the 3-step checkout UI are built and fully interactive against the mock adapter; the final "Pay" step is a stub/placeholder until Shopify Checkout is wired.
  - Keep `next/image`, routing, SEO, and component contracts identical regardless of adapter.

---

# DMEN Ecommerce Build Prompt — "A Uniform for the Relentless"

You are building the production storefront for **DMEN** (dmenwear.com), a premium men's gym / activewear DTC brand. Build the complete, finished store described below. Do NOT ship a marketing site bolted to a placeholder shop — every CTA must lead to a real cart and a real checkout. Hand-crafted end to end. No generic AI-template feel.

---

## 1) Objective & Brand Context

**Brand:** DMEN — premium men's gym / activewear, men-only (drop the gender axis entirely).
**Domain:** dmenwear.com.
**Pillars:** `MEN | MINDSET | HUSTLE` — render as a pipe-separated condensed-caps motif everywhere, with a thin red underline under the active/hovered pillar.
**Tagline / ethos line (use ONE, repeat everywhere):** *A Uniform for the Relentless.*
**Audience tag / UGC handle:** *For Rising Men* (`#ForRisingMen`).
**Catalog (9 SKUs):** Apparel — T-Shirt, Full Sleeve T-Shirt, Tank Top, Joggers, Shorts. Accessories — Protein Shaker, Gym Towel, Gym Bag, Socks.

**Visual direction:** LIGHT theme — warm paper-white base + near-black structure + a single disciplined deep-crimson (`#BF2626`, NOT fire-engine red) as a ~10% surgical action accent. Bold confident condensed typography, generous whitespace, real gritty photography. Must read premium, masculine, motivational, hand-crafted — explicitly NOT AI slop. Fast (green Core Web Vitals), fully responsive (~75% of traffic is mobile — mobile is the PRIMARY surface).

**The three strategic bets (drive every decision):**
1. Ship a true, fast, conversion-engineered store: cart → checkout funnel with a closed-loop progress bar. No WhatsApp hand-off in the buy path.
2. Sell identity before fabric. Page order is always **identity → proof → product**. Each pillar (MEN/MINDSET/HUSTLE) is backed by a concrete reason-to-believe (GSM, fit, durability), never vibe-words alone.
3. Engineer fit-certainty and India trust as conversion machinery: button size tiles (never dropdowns), model height + size-worn on every garment, size-guide modal, seeded reviews with real customer photos, and quiet-premium India trust signals (COD, pincode delivery-by-date, explicit returns window).

**Voice rules:** Short, declarative, present-tense, active. Conviction backed by specifics ("240 GSM combed cotton, holds its shape through 100 washes" beats "premium quality"). Coach, not brochure. Identity framing ("Built for the 5am you"). One ethos line repeated, never a third tagline.
**Banned words (AI tells):** elevate, unleash, game-changer, next-level, crafted to perfection, "we get it," "in today's fast-paced world," emoji in body copy.

---

## 2) Recommended Tech Stack

**PRIMARY RECOMMENDATION: Next.js (App Router) + TypeScript + Tailwind CSS + Shopify Headless (Storefront API).**

Rationale:
- **Next.js App Router** gives Server Components + streaming + per-route code-splitting + `next/image` (AVIF/WebP, automatic responsive `srcset`, explicit dimensions → CLS protection) + `next/font` (self-host, preload, `font-display: swap`). This directly serves the LCP ≤2.5s / CLS ≤0.1 budget that is treated here as a revenue feature.
- **Shopify Headless (Storefront API)** is the fastest path to a *real* store in India: it handles cart, checkout, payments (incl. UPI/COD via Shopify Payments + India apps), inventory (drives genuine low-stock counts — no faking), orders, and order tracking. Use Shopify Checkout (or Hydrogen-style cart) so you inherit PCI-compliant, conversion-tuned checkout instead of hand-rolling it. The headless front end keeps the bespoke DMEN design fully under your control.
- **Tailwind** with the DMEN tokens below mapped into `tailwind.config` (or `@theme`) enforces the 60/30/10 discipline and the spacing scale at the utility level.

Supporting libs (keep lean — no heavy runtimes): IntersectionObserver (native) for scroll reveals; CSS `@keyframes`/transitions for all motion; a tiny review widget (Judge.me / Okendo on Shopify, or custom) seeded with real reviews; `next-seo` or native metadata API; Plausible/GA4 + Shopify analytics.

**Alternatives (call out, don't default to):**
- **Medusa.js + Next.js** — if the team wants a fully open-source/self-hosted commerce backend and is willing to own payments/checkout integration (Razorpay/Cashfree for India COD+UPI). More control, more build cost.
- **Next.js static/showcase-first (no live commerce)** — only if the immediate goal is a brand showcase with "notify me" capture, with commerce added later. Architect cart/PDP components now so swapping in Shopify later is non-breaking.

**FORBIDDEN:** WebGL/Three.js/Lottie 3D runtimes, scroll-jacking libraries, Bebas Neue as display font, anything that risks INP >200ms or a generic Shopify-default theme look.

---

## 3) Design Tokens (use exactly)

### Color (light theme, 60% paper / 30% ink / 10% red)
```
--color-base:        #FAFAF8;  /* page bg, warm paper-white, ~60% */
--color-surface:     #FFFFFF;  /* cards, modals, buy box */
--color-ink:         #0E0E0E;  /* primary text + structural black, ~30% */
--color-ink-2:       #3A3A3A;  /* secondary text/labels */
--color-muted:       #6B6B6B;  /* tertiary text, captions, struck MRP, disabled */
--color-line:        #E6E5E1;  /* hairline borders/dividers */
--color-line-strong: #0E0E0E;  /* selected/active outlines */
--color-red:         #BF2626;  /* THE signature "Blood Red", ~5.8:1 on base, AA pass */
--color-red-hover:   #9D1F1F;  /* CTA hover/pressed — DARKER not lighter */
--color-red-tint:    #F7E5E5;  /* rare: low-stock pill bg, active-filter chip bg */
--color-seamless:    #F1F0EC;  /* studio-grey behind flat-lays */
--color-overlay:     rgba(14,14,14,0.45); /* hero video scrim */
--color-success:     #1B7A43;  /* in-stock, confirmed, free-ship unlocked (low-sat) */
--color-success-tint:#E8F3EC;
--color-error:       #BF2626;  /* reuses red — errors are high-intent */
--color-warning:     #B26A00;
--color-star:        #0E0E0E;  /* stars in ink; rating BAR fills use --color-red */
```
**Red usage — ENFORCE in review.** Red is allowed ONLY on: primary CTA fill + hover, active/selected size tile, active filter chip, active swatch dot, cart-count bubble, real sale price + "Save X%" tag, genuine low-stock count, rating-bar fills, and ONE highlighted word/underline per hero headline. **Max two reds per viewport.** FORBIDDEN on body text, large fills, dividers, decorative graphics, non-action icons. Squint-test every screen: the first saturated thing the eye lands on must be the intended action. Never `#FF0000`.

### Typography (free/OFL only; self-host WOFF2)
- **Display:** **Anton** (single weight, ultra-bold condensed). Use for H1/H2, pillar motif, wordmark, marquee. *Alt for more weights:* Archivo @ 900/condensed.
- **Body/UI:** **Inter** (tabular-nums for prices).
```
--font-display: "Anton", "Arial Narrow", "Helvetica Neue Condensed", sans-serif;
--font-body:    "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
```
Preload the display WOFF2 (draws LCP headline) + one Inter weight. `font-display: swap`.

| Token | Use | Size (desktop) | Weight | LH | Tracking | Case |
|---|---|---|---|---|---|---|
| display-xxl | Hero H1 | clamp(56px,9vw,120px) | Anton 400 | 0.92 | -0.01em | UPPER |
| display-xl | Section/pillar | clamp(40px,6vw,72px) | Anton 400 | 0.95 | 0 | UPPER |
| h2 | Block titles | clamp(28px,4vw,44px) | Anton 400 | 1.0 | 0 | UPPER |
| h3 | Module titles | 24px | Inter 700 | 1.15 | -0.005em | Sentence |
| h4 | PDP product name | 22px | Inter 700 | 1.2 | 0 | Sentence |
| body-lg | Lead | 18px | Inter 400 | 1.6 | 0 | Sentence |
| body | Default | 16px | Inter 400 | 1.6 | 0 | Sentence |
| body-sm | Specs/captions | 14px | Inter 400 | 1.5 | 0 | Sentence |
| label | Nav/eyebrow/badge/button | 13px | Inter 600 | 1.0 | 0.12em | UPPER |
| price | Prices | 18–20px | Inter 700 tab-nums | 1.0 | 0 | — |
| micro | Legal/microcopy | 12px | Inter 400 | 1.4 | 0.02em | Sentence |

Rules: UPPERCASE only on display + labels; body stays sentence-case. Tight tracking on big display, wide on small labels ("Wide & Loud"). Mobile min hero headline 40px, cap so it never overflows. Never two competing large sizes in one block.

### Spacing (4px base) & layout
```
space-1..10 = 4,8,12,16,24,32,48,64,96,128 px
```
Section vertical padding: 96px desktop / 48px mobile. Card padding: 24px desktop / 16px mobile. Headline→subcopy gap 12px; subcopy→CTA gap 24px.
**Breakpoints (mobile-first):** xs 0, sm 480, md 768, lg 1024, xl 1280, 2xl 1536.
**Containers:** wide 1440 (default), content 1120 (editorial), narrow 720 (long-form), full-bleed 100vw (hero/bands). Gutters 16/24/40/64 (xs/md/lg/xl).
**Grid:** 12-col, gutter 24px desktop / 16px mobile. Product grid 4-up (lg/xl) → 3-up (md) → 2-up (mobile), equal-height cards. PDP desktop: gallery cols 1–7 + sticky buy column cols 8–12; mobile single column + sticky bottom add-to-cart bar. Reserve aspect-ratio boxes on every image/video.

---

## 4) Global Components & Layout

Build these as reusable, fully-stated components. Every interactive element keyboard-operable, focus-visible, `aria-*` correct.

- **Announcement bar** (~36px, dismissible): single rotating message (first-order offer / free-ship threshold / active drop). Red only on the number.
- **Header / mega-nav:** wordmark left; center nav `APPAREL ▾ ACCESSORIES ▾ THE DROP JOURNAL` (≤5 items, Hick's Law); utilities right (search, account, cart with red count badge). Transparent over hero → solid white on scroll with NO layout shift. Mega-panels: APPAREL = product-type links + one editorial image tile + quick links (New, Best Sellers, Shop All, Complete the Kit); ACCESSORIES = 4 accessory links + "Build Your Kit" tile. ESC closes, focus-trapped.
- **Buttons:** Primary = red fill, white label, radius 4px, 16px 32px pad, full-width on PDP/mobile; hover → `--color-red-hover` + translateY(-1px); active → scale .98; focus → 2px ink outline + 2px offset; disabled → line bg/muted label; loading → label→spinner, width locked. Secondary (BUY NOW) = 1.5px ink outline, transparent, hover → ink fill/white label. Tertiary = ink label + red underline-wipe on hover. **One red button per viewport.**
- **Product card:** white surface, hairline border, radius 4px, image `aspect-ratio:3/4` on seamless; hover → crossfade to alt/action shot + `scale(1.03)` (GPU only) + QUICK ADD bar slides up revealing inline size tiles; below image = name, price row (struck MRP muted + sale ink + red "Save X%" only when real), NAMED color swatches (label on hover/focus — never unlabeled dots), optional single corner badge. States: default/hover/focus-within/sold-out (greyscale + "Sold out" pill).
- **Size selector:** square button tiles ≥44px, 1.5px line border, label type — NEVER a dropdown. selected = ink fill + white text + small red dot top-right; sold-out = struck + muted but VISIBLE; error = "Select a size" red below. Adjacent `Size Guide` link → modal (in + cm, how to measure, model height + size worn).
- **Quantity stepper:** `[−][n][+]`, 44px controls, tabular numeral, disabled − at qty 1, max from stock.
- **Mini-cart (right slide-over drawer, no reload):** scrim, line items (thumb/name/size/qty/price/remove), **free-shipping progress bar** with red fill ("₹200 away from free shipping"), one "Complete the Kit" upsell row, subtotal, red CHECKOUT + quiet "View Cart". Empty state: "Your kit is empty. The work isn't. — START WITH THE ESSENTIALS".
- **Badges:** small, label type, radius 4px. NEW (ink fill), BESTSELLER (ink outline), SALE/-25% (red fill), LOW STOCK — 6 LEFT (red-tint bg, red text, genuine inventory only). Max one per card.
- **Accordion** (PDP specs/FAQ): hairline rows, chevron rotate 180° on open (200ms), `aria-expanded`.
- **Review block:** big numeric rating + ink stars + counts, distribution bars filled red, fit slider (Runs small ▸ True to size ▸ Runs large), customer-photo grid (real gym context), per-review verified-buyer tag + height/weight/size-bought + helpful votes + sort. Editorial on white. **Seed real reviews — never an empty 0★ slot.**
- **Marquee/ticker:** full-bleed black band, white display text scrolling via CSS keyframes; "FOR RISING MEN ◆ A UNIFORM FOR THE RELENTLESS ◆"; pauses on hover; disabled under reduced-motion.
- **Footer:** dark band (`--color-ink`, white text) to bookend the light system. Columns: Shop / Help / Brand / Newsletter (email + red submit). Bottom: monochrome payment marks (incl. UPI/COD), social, legal, copyright. Brand line repeated once in display type.

---

## 5) Page-by-Page Build Spec (exact element order)

### HOME — identity → proof → product
1. Announcement bar. 2. Sticky nav (transparent over hero). 3. **Hero (~100vh, full-bleed):** muted-autoplay video of a man training, high-key white/grey seamless, hard directional light, real sweat — WITH static poster frame painted first for LCP + `prefers-reduced-motion` still fallback. One oversized H1 `A UNIFORM FOR THE RELENTLESS` ("RELENTLESS" = single red accent word), sub-line `Built in silence. Forged in the fight. Worn by men on the way up.`, ONE red CTA `SHOP THE UNIFORM` (Z-pattern: logo TL, CTA TR + repeated bottom-right). Low visual complexity, high prototypicality. 4. **MEN | MINDSET | HUSTLE pillar block** — three editorial columns, image + one-word header + concrete reason-to-believe, red underline on active. 5. **Best Sellers rail** (4-up, star rating + count surfaced). 6. **The Drop / New Arrivals band** (editorial full-width, genuine scarcity framing e.g. "Founders' Drop — 500 units"). 7. **Stat strip** — count-up real numbers only ("X Rising Men", "4.9★", units shipped); no fake logos. 8. **Manifesto band** (lifestyle imagery + "For Rising Men" copy). 9. **#ForRisingMen UGC wall** (real customers). 10. **Complete the Kit** (one curated bundle module, not a carousel). 11. **Newsletter** ("JOIN THE RELENTLESS — 10% off your first kit. No spam. Just the work."). 12. Footer.

### COLLECTION / PLP
1. Breadcrumb (Home › Apparel › T-Shirts). 2. **Editorial header** — title + one-line pillar-tied strap (e.g. T-Shirts → "Your everyday armour."), optional banner. 3. **Top-bar filter + sort** (drawer on mobile): Size (visual chips), Color (named swatch chips), Type, Price; Sort = Featured/Newest/Best Selling/Price↑/Price↓; all keyboard-operable. 4. **Product grid** 4/3/2-up, hover-flip cards + Quick Add. 5. **Lazy-load or numbered pagination** (no heavy infinite scroll). Never ship an empty/placeholder collection. Empty-search copy: "Nothing here yet. The relentless don't stop — try another size or colour."

### PRODUCT / PDP (exact stacked order; desktop = scroll gallery left + sticky buy column right; mobile = single column + slim sticky bottom bar with price + selected size + red ADD TO CART)
1. Breadcrumb. 2. **Image gallery** — multi-angle on-model + flat-lay + fabric detail, AVIF/WebP, explicit width/height, hover-zoom, lightbox; hero caption = **model height + size worn**. 3. **Title block** — short bold name + one-line brand strap (e.g. "Relentless Tee — the everyday armour. 240 GSM. Holds its shape. Earns its place."). 4. **Rating + review count** (links to reviews; seeded, never 0★). 5. **Price block** — bold selling price; struck MRP (muted) + red "Save X%" only when real; "inclusive of all taxes" microcopy. 6. **Color variants** — named fabric-chip swatches (Blackout/Bone/Blood Red), selected = ink ring + small red dot. 7. **Size selector** — square tiles S–XXL, sold-out shown-disabled, inline Size Guide link → modal. 8. **Fit cue bar** at/above size — "Runs true to size · Built for movement. Between sizes? Size up." 9. **Primary CTA** full-width red ADD TO CART (the single saturated pop) + quieter outlined BUY NOW below + minimal wishlist heart (guest-allowed); sold-out variant → "NOTIFY ME WHEN IT DROPS". 10. **Trust strip near CTA (not footer)** — COD available · pincode delivery-by-date input · free 7-day returns · secure payment; quiet monochrome line-icons + thin red. 11. **"Built For" benefit bullets** (athletic fit, four-way stretch, sweat-wicking, flatlock seams). 12. **Spec strip** — Fabric, GSM, Fit, Care (designed block, not a marketplace table). 13. **A+-style brand modules** — full-bleed editorial shots + MINDSET/HUSTLE manifesto + "making of the uniform" note, one red rule per module. 14. **Reviews** (full block per §4, with real customer gym photos). 15. **ONE "Complete the Kit" cross-sell** (≤4 curated items, NOT "also viewed"). Mobile above-the-fold must carry image + title + price + size + CTA; defer reviews/cross-sell JS.

### CART (/cart)
Full cart = mini-cart contents + qty editing, applied offers (ONE understated "Offers" line — no bank-offer ladder), trust row (COD/returns/secure), free-shipping progress bar, cross-sell.

### CHECKOUT (replaces WhatsApp hand-off)
3 steps: **Cart → Details → Pay.** Visible progress bar starting ~25% (endowed progress) with "Step 2 of 3" label. Mobile-first, minimal fields, **persistent visible `<label>` on every field** (no placeholder-only). Show all-in cost early (shipping + tax before final step). One-tap wallets (Shop Pay / Apple Pay / Google Pay / UPI) + **COD**. Trust badges + one review snippet at Pay step. Confirmation: "Welcome to the Rising. Your uniform is on its way." (echo physical unboxing imagery).

### ABOUT (/pages/about)
Origin arc + scroll-storytelling timeline ("the making of the uniform"), MEN|MINDSET|HUSTLE expanded as philosophy, manifesto block, real photography, ends in Shop / The Drop CTA. Brand-led, not founder-face-dependent.

### CONTACT (/pages/contact)
Lean form (real `<label>` per field), support email **contact@spheretree.in**, WhatsApp as a SUPPORT channel only (not buy path), shipping/returns links, hours. Calm plain copy.

---

## 6) Interaction & Motion Spec

Animate **transform & opacity only** (GPU, 60fps, no reflow). Tokens:
```
--dur-fast: 120ms (press/toggle/hover)
--dur-base: 200ms (image-swap/accordion/chevron/dropdown)
--dur-slow: 320ms (scroll-reveal/drawer/modal)
--dur-hero: 500ms (rare large hero move, ceiling)
--ease-out:    cubic-bezier(0.22,1,0.36,1)   (default entrance)
--ease-in-out: cubic-bezier(0.65,0,0.35,1)   (drawers/modals)
```
- Product card: crossfade primary→alt (200ms) + scale(1.03); QUICK ADD slides up + fades.
- Buttons: lift 1px + darken on hover; scale .98 on `:active`.
- Pillars/text links: red underline-wipe (scaleX 0→1, 200ms).
- Scroll reveal: fade + translateY(16→0), 320ms, once, via IntersectionObserver (or native `animation-timeline: scroll()`), stagger children ~60ms.
- Stat numbers count-up in view.
- Add-to-cart: button checkmark morph (200ms) → mini-cart slides in from right (320ms) → cart-count bubble pops (scale 1→1.2→1) → free-ship bar fills.
- Route transitions: light opacity fade 200ms; preserve scroll restoration.
- Hero video: poster painted first (LCP), video lazy-attached after.
- **FORBIDDEN:** scroll-jacking, line-by-line text fade-in, heavy parallax, autoplay audio, any motion that delays LCP/INP.

---

## 7) Imagery / Content Rules + Anti-AI-Slop Checklist

**Signature lane — "High-Key Grit":** bright high-key studio, `--color-seamless` #F1F0EC bg, hard single-source directional light, real male athletes mid-effort (visible sweat, chalk, fabric weave). One cohesive shoot, consistent grade. Three asset types per product: on-model action, multi-angle on-model, flat-lay on seamless. Every garment hero captioned with model height + size worn + fit type. One red accent per editorial module max (never red wash over photos). Preview physical unboxing (black mailer + white/red tissue + manifesto insert + sticker) in PDP gallery + confirmation page. Serve AVIF + WebP, responsive srcset, explicit width/height, preload LCP poster, lazy-load below-fold + review photos.

**DO:** real gritty high-key photography of real men; Anton + Inter; red ≤10% / #BF2626 / action-only; white-canvas grit lane; identity→proof→product; one ethos line repeated; generous whitespace + asymmetric editorial layouts; concrete specifics (GSM/blend/seams/real reviews/real origin); "Wide & Loud" headline + tiny support copy; restrained micro-interactions; seeded real reviews + UGC; green CWV; WCAG 2.1 AA.

**FORBIDDEN:** AI-generated/generic stock photos, plastic skin, mangled hands, uncanny lighting; Bebas Neue display; #FF0000 or red fills/backgrounds/body text/decoration; black-bg neon-red "gamer" look; >1 loud CTA per viewport; keyword-stuffed titles or spec-dump copy; size dropdowns; returns/shipping buried in footer; empty 0★ slots / fake logos / invented stats; fake scarcity / reset-on-reload timers; always-on "50% off" anchor; generic Shopify-default grid/type; heavy WebGL/Lottie/3D, scroll-jacking, autoplay audio; shouty oversized logo; marketplace clutter (sponsored rails, seller badges, comparison widgets, multi-currency stack, gender-split nav).

---

## 8) Performance Budget & Core Web Vitals

**Targets (treat as revenue features, enforce in CI via Lighthouse/PSI):** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. JS on initial route kept minimal; defer all non-critical animation/review/cross-sell JS.
Techniques:
- **Images:** AVIF→WebP fallback, `next/image` with explicit width/height + responsive `sizes`/`srcset`; aspect-ratio boxes everywhere (no CLS); lazy-load below-fold; preload only the LCP hero poster.
- **Hero video:** muted MP4 + poster painted first; video attached after load; reduced-motion → poster only.
- **Fonts:** self-host WOFF2, `font-display: swap`, preload one display + one body weight only; subset if possible.
- **Code-splitting:** Server Components by default; client components only where interactive (cart, gallery, filters, accordions); dynamic-import the review widget, lightbox, and checkout extras.
- **Motion:** CSS/IntersectionObserver only — never a runtime that inflates INP.
- **Caching/ISR** for collection/PDP pages; edge-render the shell.

---

## 9) Responsive & Accessibility

- Mobile-first; mobile is the primary surface. Breakpoints xs/sm/md/lg/xl/2xl per §3. Product grid 2-up mobile; PDP single column + sticky bottom add-to-cart bar honoring safe-area inset.
- **WCAG 2.1 AA:** 4.5:1 text/UI contrast (red verified ~5.8:1 on base); descriptive alt text ("Black cotton crew tee, front view, model mid-press"); color variants named in TEXT not only dots; real `<label>` per form field (no placeholder-only); visible focus rings (2px ink + offset); ≥44px tap targets; keyboard-operable filters, mega-nav (ESC + focus-trap), size tiles, accordions, modals, drawer.
- **`prefers-reduced-motion: reduce`** globally: disable scroll-reveals, parallax, marquee, count-up, video autoplay; keep instant state changes.

---

## 10) SEO & Analytics

- Shopify-style human-readable URLs: `/collections/*`, `/products/[handle]`, lowercase-hyphenated. Breadcrumbs on every PLP/PDP.
- Per-page `<title>`/meta + Open Graph/Twitter cards; semantic headings (one H1/page); `Product`, `BreadcrumbList`, `AggregateRating`/`Review`, and `Organization` JSON-LD structured data.
- Sitemap.xml + robots.txt; canonical tags; INR primary currency via geolocation (NO loud multi-currency selector).
- Analytics: GA4 or Plausible + Shopify analytics; track view_item, add_to_cart, begin_checkout, purchase, and funnel step completion; newsletter + notify-me capture events.

---

## 11) Definition of Done

- [ ] Real cart → 3-step checkout funnel works end to end (no WhatsApp in buy path); COD + UPI + wallets live.
- [ ] All 9 SKUs merchandised with real photography + seeded real reviews; no empty/placeholder collections; no 0★ slots.
- [ ] Home order = identity → proof → product; MEN|MINDSET|HUSTLE pillars each backed by a concrete spec.
- [ ] PDP follows the exact 15-step order; size = button tiles (no dropdown); model height + size-worn on every garment; size-guide modal; fit cue; trust strip near CTA.
- [ ] Squint test passes on every screen: ≤2 reds per viewport, one red action; red is #BF2626, never #FF0000, never on body/fills.
- [ ] Mini-cart drawer + free-shipping progress bar + checkout endowed-progress bar all function.
- [ ] Anton (display) + Inter (body) self-hosted, preloaded; no Bebas Neue.
- [ ] LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 on mobile (verified in Lighthouse/PSI on real pages).
- [ ] WCAG AA: contrast, alt text, named colors, real labels, keyboard nav, focus rings, reduced-motion all verified.
- [ ] Imagery is real commissioned high-key grit (no AI/generic stock); consistent grade; unboxing previewed on PDP + confirmation.
- [ ] One ethos line ("A Uniform for the Relentless") repeated across hero, PDP, footer, confirmation; no banned AI-tell words anywhere.
- [ ] Structured data, sitemap, canonical, analytics events all wired.
- [ ] Fully responsive on any device; mobile PDP above-the-fold carries image + title + price + size + CTA.

---

## Recommended Stack (summary)
Next.js (App Router) + TypeScript + Tailwind CSS as the front end, with Shopify Headless (Storefront API) as the commerce backend so the team inherits a real, PCI-compliant cart/checkout with India-ready COD + UPI + wallets instead of hand-rolling it. Next.js delivers the LCP/CLS/INP budget via Server Components, next/image (AVIF/WebP) and next/font; all motion is CSS + IntersectionObserver only — no heavy 3D/animation runtimes. Alternatives: Medusa.js + Next.js if a fully self-hosted open-source backend is preferred (then pair with Razorpay/Cashfree for India payments), or a Next.js static showcase-first build if commerce is phase 2 — but architect cart/PDP components now so Shopify drops in without rework.

## Open Decisions to confirm before build
- Real store now vs showcase-first: confirm DMEN wants a live transacting store at launch (recommended) or a brand showcase with notify-me capture, with commerce in phase 2.
- Commerce backend: confirm Shopify Headless (Storefront API) vs self-hosted Medusa.js — this drives checkout, payments, and ongoing cost/ownership.
- India payment provider + methods: confirm provider (Shopify Payments vs Razorpay/Cashfree) and that COD, UPI, and one-tap wallets are all required at launch.
- Shipping & returns operations: confirm the returns/exchange window (spec assumes 7 days), free-shipping threshold value (used in cart progress bar), and the pincode delivery-date data source/courier integration.
- Reviews & UGC: confirm review platform (Judge.me/Okendo vs custom) and that real seeded reviews + #ForRisingMen customer photos will be available before launch (no empty 0-star slots).
- Photography: confirm a real commissioned high-key grit photoshoot is budgeted (mandatory anti-AI-slop requirement) and that model height + size-worn data will be captured per garment.
- Account model: confirm guest checkout is default with optional login, and whether order tracking is native (Shopify) or a /pages/track-order integration.
- The Drop mechanics: confirm whether limited drops use genuine capped inventory (e.g. Founders' Drop 500 units) and any real sale-end timestamps for countdowns.
