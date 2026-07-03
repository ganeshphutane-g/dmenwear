# DMEN — Visual Design System

## Design Principles
## DMEN Design Principles

1. **Own the white canvas.** The entire premium gymwear category (Gymshark, Castore, ASRV, Alphalete) defaults to black/dark-cinematic. DMEN's signature move is a confident, bright LIGHT theme — paper-white base, near-black structure, surgical red. This inversion is the single most ownable, anti-copycat decision. White + bold type + grit = "loud premium in white."

2. **Restraint is the luxury signal.** ~60% white, ~30% black, ~10% red. Generous whitespace and oversized margins do the premium work; congestion reads cheap. Never fill space for the sake of it. One dominant element per section.

3. **One pop per screen (rationed red).** Red is the ONLY saturated color sitewide and is reserved for a single job: the primary action and a few key accents. Pre-attentively, the red thing the eye jumps to must always be the action you want. Squint-test every screen.

4. **Sell the identity before the fabric.** Order is identity → proof → product, never product-first. Lead with MEN | MINDSET | HUSTLE and the aspirational "risen man," then social proof, then the grid. Each garment is framed as a tool for the relentless self ("Built for the 5am you").

5. **One ownable line, repeated everywhere.** Treat "A Uniform for the Relentless" / "For Rising Men" the way Castore owns "Better Never Stops" — hero, PDP, packaging insert, footer, email. Repetition builds equity in the BRAND system, not a single founder's face.

6. **Earn the swagger with specifics.** Anchor every claim to something concrete (GSM, fabric blend, flatlock seams, real athletes, real reviews, a true origin story). Motivation must read as conviction, not slogan-as-decoration — this is the difference between premium and AI slop.

7. **Performance is a brand promise made literal.** "Relentless/fast" must be true in the build: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. CWV is treated as a revenue feature (15–30% conversion upside) and as proof the brand is as disciplined as its copy.

## Color System
## Color System (light theme, 60/30/10)

Deliberately NOT pure clinical white or pure #000 — softened for a premium print feel. Red is a deep crimson/garnet (authority register), NOT fire-engine #FF0000 (which reads cheap / AI-default).

### Core tokens
| Token | HEX | Role |
|---|---|---|
| `--color-base` | `#FAFAF8` | Page background (warm paper-white, ~60% of UI) |
| `--color-surface` | `#FFFFFF` | Cards, modals, buy box (pure white to lift off base) |
| `--color-ink` | `#0E0E0E` | Primary text & structural black (~30% of UI, softer than #000) |
| `--color-ink-2` | `#3A3A3A` | Secondary text / labels |
| `--color-muted` | `#6B6B6B` | Tertiary text, captions, disabled labels |
| `--color-line` | `#E6E5E1` | Hairline borders, dividers, card outlines |
| `--color-line-strong` | `#0E0E0E` | Selected/active outlines (size tiles, swatches) |

### Signature red — exact DMEN logo red
**Sampled directly from the brand logo SVGs (`DMEN-Brand/`). This is THE red — do not substitute.**
| Token | HEX | Notes |
|---|---|---|
| `--color-red` | `#BF2626` | **The signature — exact logo red** (rgb 191,38,38). Contrast on `#FAFAF8` ≈ 5.8:1 (passes WCAG AA 4.5:1 for text & UI). |
| `--color-red-hover` | `#9D1F1F` | CTA hover / pressed (darker, not lighter) |
| `--color-red-tint` | `#F7E5E5` | Rare: low-stock pill bg, active-filter chip bg (use sparingly) |

### Neutrals for imagery framing
| Token | HEX | Role |
|---|---|---|
| `--color-seamless` | `#F1F0EC` | Studio-grey seamless behind product flat-lays |
| `--color-overlay` | `rgba(14,14,14,0.45)` | Scrim over hero video for white-text legibility |

### Feedback
| Token | HEX | Role |
|---|---|---|
| `--color-success` | `#1B7A43` | In-stock, order confirmed, free-ship-unlocked (green, kept low-sat so it never competes with red) |
| `--color-success-tint` | `#E8F3EC` | Success banner bg |
| `--color-error` | `#BF2626` | Reuses signature red (form errors) — acceptable because errors ARE high-intent |
| `--color-warning` | `#B26A00` | Amber for soft warnings only |
| `--color-star` | `#0E0E0E` | Review stars in ink; rating BAR fills use `--color-red` |

### EXACT usage rules (enforce in review)
- **Red is allowed ONLY on:** primary CTA fill (`ADD TO CART`, `SHOP`), CTA hover, active/selected size pill, active filter chip, cart-count bubble, sale price + "Save X%" tag, genuine low-stock count, rating-bar fills, and ONE highlighted word/underline per hero headline.
- **Red is FORBIDDEN on:** body text, large background fills/blocks, section dividers, decorative graphics, icons that aren't actions, more than one element competing in the same viewport.
- **Two reds max in one viewport** (e.g. CTA + sale price) — never a field of red.
- **Black does the structure:** secondary buttons, headlines, nav, footer, type. White/paper does the breathing room.
- **Discount framing:** struck MRP in `--color-muted`, sale price in `--color-ink`, "Save 25%" tag in `--color-red`.
- Run a per-screen **squint test**: the first saturated thing seen must be the intended action.

## Typography System
## Typography System (free / open-source only)

Two-tier: a CONDENSED grotesque display with real character (escaping the over-used Bebas Neue cliché) + a clean neutral grotesk body.

### Families
- **Display / headlines:** **Anton** (Google Fonts, OFL) — heavy, condensed, industrial, single weight 400 that reads as ultra-bold. More distinctive cut than Bebas. Use for H1/H2, MEN|MINDSET|HUSTLE pillars, wordmark lockup, marquee.
  - *Alt / richer character:* **Archivo** at weight 900 + width 100 condensed axis (variable, OFL) — more flexible if a true display family with multiple weights is needed.
- **Body / UI / product copy:** **Inter** (OFL) — neutral grotesk, excellent legibility at small sizes, full weight range, tabular numerals for prices.
- **Wordmark:** ideally a *lightly customized* Anton-based "DMEN" lockup (tighten tracking, custom M/E joins) so it's ownable rather than stock.

### Fallback stacks
```
--font-display: "Anton", "Arial Narrow", "Helvetica Neue Condensed", sans-serif;
--font-body: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
```
Self-host WOFF2 + `font-display: swap`; **preload** the display WOFF2 (it draws the LCP headline) and one Inter weight.

### Type scale (1.250 major-third on desktop; clamp() for fluid responsive)
| Token | Use | Size (desktop) | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| `display-xxl` | Hero headline | `clamp(56px, 9vw, 120px)` | Anton 400 | 0.92 | -0.01em | UPPERCASE |
| `display-xl` | Section / pillar headers | `clamp(40px, 6vw, 72px)` | Anton 400 | 0.95 | 0 | UPPERCASE |
| `h2` | Block titles | `clamp(28px, 4vw, 44px)` | Anton 400 | 1.0 | 0 | UPPERCASE |
| `h3` | Card group / module titles | 24px | Inter 700 | 1.15 | -0.005em | Sentence |
| `h4` | PDP product name | 22px | Inter 700 | 1.2 | 0 | Sentence |
| `body-lg` | Lead paragraph | 18px | Inter 400 | 1.6 | 0 | Sentence |
| `body` | Default copy | 16px | Inter 400 | 1.6 | 0 | Sentence |
| `body-sm` | Specs, captions | 14px | Inter 400 | 1.5 | 0 | Sentence |
| `label` | Nav, eyebrows, badges, buttons | 13px | Inter 600 | 1.0 | **0.12em** | UPPERCASE |
| `price` | Prices | 18–20px | Inter 700 (tabular-nums) | 1.0 | 0 | — |
| `micro` | Legal, microcopy | 12px | Inter 400 | 1.4 | 0.02em | Sentence |

### Rules
- **UPPERCASE only on display + labels.** Body and product descriptions stay sentence-case for legibility and accessibility.
- **Tight tracking on big display** (-0.01em), **wide tracking on small labels** (+0.12em) — the "Wide & Loud" pattern: oversized headline + tiny understated supporting line.
- Pillars rendered as `MEN | MINDSET | HUSTLE` in `display-xl`, pipe-separated, with the active/hovered pillar gaining a red underline-wipe.
- Mobile: cap `display-xxl` so it never overflows; min hero headline 40px.
- Always pair a giant headline with deliberately small supporting copy — never two competing large sizes.

## Spacing, Grid & Layout
## Spacing, Grid & Layout

### Spacing scale (4px base, named tokens)
| Token | px |
|---|---|
| `space-0` | 0 |
| `space-1` | 4 |
| `space-2` | 8 |
| `space-3` | 12 |
| `space-4` | 16 |
| `space-5` | 24 |
| `space-6` | 32 |
| `space-7` | 48 |
| `space-8` | 64 |
| `space-9` | 96 |
| `space-10` | 128 |
Section vertical padding: `space-9` (96px) desktop / `space-7` (48px) mobile. Generous by default — whitespace is the premium signal.

### Breakpoints (mobile-first; mobile is the primary surface, ~75% traffic)
| Name | min-width |
|---|---|
| `xs` | 0 (base) |
| `sm` | 480px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

### Containers
| Token | max-width | Use |
|---|---|---|
| `container-wide` | 1440px | Default page container |
| `container-content` | 1120px | Text/editorial modules |
| `container-narrow` | 720px | Long-form (manifesto, journal article) |
| Full-bleed | 100vw | Hero video, editorial image bands |
Gutters: 16px (xs), 24px (md), 40px (lg), 64px (xl).

### Grid
- **Base grid:** 12 columns, gutter = `space-5` (24px) desktop / `space-4` (16px) mobile.
- **Product grid:** 4 columns @ `xl`/`lg`, 3 @ `md`, **2 @ mobile** (denser than competitors' 2-up to show range). Gutter 24px desktop / 12px mobile. Cards equal-height.
- **Bento collection module:** 1 large lifestyle tile (spans 2×2) + standard product tiles around it, on the 12-col grid.
- **PDP:** desktop split — gallery (cols 1–7) + sticky buy column (cols 8–12). Mobile single column, sticky bottom add-to-cart bar.
- **Mega-nav:** full-width panel, category links left + featured imagery tile right.

### Vertical rhythm
- Baseline unit 8px; all section padding, card padding, and stack gaps snap to the spacing scale.
- Card internal padding: `space-4` (16px) mobile, `space-5` (24px) desktop.
- Headline→subcopy gap: `space-3`; subcopy→CTA gap: `space-5`.
- **Reserve fixed width/height on every image & video** (aspect-ratio boxes) to keep CLS ≤0.1.

## Component Library
## Component Library (states for each)

### Buttons
- **Primary** (`ADD TO CART`, `SHOP THE UNIFORM`): `--color-red` fill, white label, `label` type (uppercase, 0.12em), radius 4px, padding 16px 32px, full-width on PDP/mobile.
  - *Hover:* bg `--color-red-hover` + 2px lift (`translateY(-1px)`); *Active:* `translateY(0)` + slight scale 0.98 (tactile press); *Focus:* 2px ink outline + 2px offset; *Disabled:* `--color-line` bg, `--color-muted` label; *Loading:* label → inline spinner, width locked.
- **Secondary** (`BUY NOW`): black outline (1.5px `--color-ink`), ink label, transparent fill. Hover: ink fill + white label. Always quieter than primary — one obvious primary per screen.
- **Tertiary / text:** ink label with red underline-wipe on hover.
- Only **one** red (primary) button per viewport.

### Product card
- White surface, hairline `--color-line` border (or borderless on base), radius 4px.
- Image area `aspect-ratio: 3/4`, neutral seamless bg. **Hover:** crossfade to on-body/alt shot + `transform: scale(1.03)` (GPU only, no reflow); reveal `QUICK ADD` bar at bottom.
- Below image: product name (`body`, ink), price row (`price`; sale = struck MRP muted + sale ink + red "Save X%" tag), named color swatch dots (with text label on focus/hover — never unlabeled), optional corner badge.
- States: default / hover / focus-within (keyboard) / sold-out (greyscale image + "Sold out" pill).

### Size selector
- Square **button tiles** (44×44 min tap target), 1.5px `--color-line` border, `label` type — never a dropdown.
- States: default (line border) / hover (ink border) / **selected (ink fill, white text, small red dot top-right)** / disabled-but-visible (struck-through, `--color-muted`, not hidden) / error ("Select a size" in red below).
- Adjacent `Size Guide` text link → modal (in + cm, "how to measure", model height + size worn).

### Quantity stepper
- `[ − ] [ n ] [ + ]`, ink outline, 44px controls, tabular numeral. Disabled − at qty 1; max from stock. Inline edit allowed.

### Sticky add-to-cart
- **Desktop:** buy card stays pinned in right column as gallery scrolls (`position: sticky; top: 24px`).
- **Mobile:** slim bottom bar appears after hero scrolls past — product thumb + name + selected size + price + red `ADD TO CART`. No stacked badges inside. Honors safe-area inset.

### Mega-nav
- Lean header: wordmark left, nav center (Apparel, Accessories, Drops, Journal), utilities right (search, account, wishlist, cart). Transparent over hero → solid white on scroll (no layout shift).
- **Mega-panel** (Apparel): category links (Tee, Full Sleeve, Tank, Joggers, Shorts) + featured editorial tile with image. Keyboard-operable, ESC closes, focus-trapped.
- Sticky promo bar above nav: "Join the Relentless — 10% off your first kit" (red accent, dismissible).

### Mini-cart (slide-over)
- Right drawer, white surface, scrim overlay. Line items (thumb, name, size, qty stepper, price, remove). **Free-shipping progress bar** ("₹200 away from free shipping" — goal-gradient) with red fill. Subtotal, primary `CHECKOUT`, secondary `View Cart`. Empty state: bold line + "Shop the Uniform" CTA.

### Badges
- Small, `label` type, 4px radius. Variants: `NEW` (ink fill, white), `BESTSELLER` (ink outline), `SALE`/`-25%` (red fill, white), `LOW STOCK — 6 LEFT` (red-tint bg, red text — genuine inventory only). Max one badge per card corner.

### Accordions (PDP specs, FAQ)
- Full-width rows, hairline divider, `h4`/`label` trigger + chevron rotating 180° on open (200ms). One-at-a-time optional. Keyboard + `aria-expanded`. Content: `body`/`body-sm`.

### Review block
- Top summary: big numeric rating + stars (ink) + counts ("4.9 · 2,341 ratings, 198 reviews"), distribution **bars filled red**. Fit-feedback slider ("Runs small ▸ True to size ▸ Runs large"). Customer-photo grid (UGC, real gym context). Individual review: Verified Buyer tag, height/weight/size-bought context, helpful votes, sort (Most Helpful / Recent). Styled on white with thin dividers — editorial, never a plain table. Seed real reviews before surfacing (never show empty 0★).

### Marquee / ticker
- Full-bleed black band, white `display`/`label` text scrolling horizontally (CSS `@keyframes` transform translate). Content: pillar words / "FOR RISING MEN • A UNIFORM FOR THE RELENTLESS •". **Pauses on hover; disabled under `prefers-reduced-motion`.** One red diamond `◆` separator allowed.

### Footer
- Dark band (`--color-ink`) to bookend the light system — white text. Columns: Shop (Tees, Full Sleeve, Tanks, Joggers, Shorts, Accessories), Help (Size Guide, Shipping, Returns, FAQ, Contact), Brand (Our Mission, Journal, Drops), Newsletter signup (email field + red submit). Bottom row: payment marks (monochrome line icons), social, legal links, copyright. The brand line repeated once in `display`.

## Motion & Interaction
## Motion & Interaction Language

Restrained, physics-led, CSS-first. Motion serves function, never spectacle. Animate **transform & opacity only** (GPU, 60fps, no layout reflow).

### Durations & easing (tokens)
- `--dur-fast: 120ms` — button press, toggles, hover state changes.
- `--dur-base: 200ms` — hover image-swap, accordion, chevrons, dropdowns.
- `--dur-slow: 320ms` — section scroll-reveals, drawer/mini-cart slide, modal.
- `--dur-hero: 500ms` — large hero clip/fade (max; keep rare).
- `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` (default, decisive entrance).
- `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)` (drawers/modals).
- NN/g guidance: optimal 100–300ms; 500ms ceiling for complex moves only.

### Hover
- **Product card:** crossfade primary→alt image (200ms opacity) + `scale(1.03)`; QUICK ADD slides up (translateY) + fades in.
- **Buttons:** primary lifts 1px + darkens; tactile press scales to 0.98 on `:active`.
- **Pillars / text links:** red underline-wipe left→right (transform: scaleX 0→1, 200ms).
- **Nav items:** opacity/weight shift only.

### Scroll reveal
- Sections fade + translateY(16px → 0) on entry via IntersectionObserver (or native CSS `animation-timeline: scroll()`), 320ms, once. Stagger children ~60ms.
- **Stat numbers** count-up when in view (e.g. "2,341 reviews").
- Subtle hero parallax / z-depth (small translate on scroll) — capped, GPU only.
- **FORBIDDEN:** scroll-jacking, line-by-line text fade-in (delays reading per NN/g), heavy parallax, autoplay audio.

### Add-to-cart feedback
- On add: button micro-confirm (checkmark morph 200ms) → mini-cart slides in from right (320ms ease-in-out) → cart-count bubble pops (scale 1→1.2→1, red). Free-ship bar fills.

### Page / route transitions
- Lightweight fade (opacity 0→1, 200ms) on navigation; preserve scroll restoration. No full-screen wipes that delay content.

### Hero video
- Muted autoplay, static poster frame painted first (LCP), video lazy-attached after. Slow pan / sweat-and-fabric close-ups. Reduced-motion → poster still only.

### Accessibility
- Global `@media (prefers-reduced-motion: reduce)`: disable scroll-reveals, parallax, marquee, count-up, video autoplay; keep instant state changes. Required for WCAG + vestibular safety.
- Never let motion delay LCP/INP — defer all non-critical animation JS.

## Imagery & Art Direction
## Imagery & Art Direction

### Signature lane: "High-Key Grit"
DMEN's ownable look inverts the category's dark-cinematic reflex. Default mode = **bright high-key studio grit**: white / light-grey (`--color-seamless` #F1F0EC) seamless, **hard single-source directional light**, real male athletes mid-effort. Visible sweat, chalk, vascularity, muscle and skin texture, fabric weave. This pairs naturally with the white UI and is the single biggest defense against looking AI-generated.

### Shoot system
- **One cohesive shoot:** consistent crop, lighting, lens, grade across the whole catalog so product reads as a serious, coordinated "uniform."
- **Three asset types per product:**
  1. On-model action (mid-movement, not static posing) — primary card + hero.
  2. Multi-angle on-model (front/back/detail) for PDP gallery.
  3. Flat-lay on seamless (Represent-247 discipline) — "function documentation," reinforces "A Uniform for the Relentless."
- **Secondary moody set** (high-contrast, darker) reserved for occasional hero/editorial moments only — keep the light set as the signature so it stays ownable.
- **Fit context baked in:** every garment hero captioned with model height + size worn (e.g. "Model 6'1\", wearing M"). Athletic vs regular fit stated.

### Composition & layout
- Asymmetric editorial layouts, intentional whitespace, single product large in negative space.
- One red accent per editorial module max (a rule line, a highlighted word) — never red wash over photos.
- Full-bleed image bands alternate with text + whitespace for scroll rhythm.

### Brand graphic texture
- Thin red rule-lines, bold geometric marks, pipe-separated `MEN | MINDSET | HUSTLE` motif, a printed "manifesto" treatment. Cheap, hand-crafted designed texture — NOT decorative noise.

### Unboxing echoed online
- Preview the physical kit (black mailer + white/red tissue + manifesto insert + sticker) in the PDP gallery and on the order-confirmation page so the digital-first brand feels tactile.

### Format / performance
- Serve **AVIF + WebP**, responsive `srcset`, explicit width/height (CLS ≤0.1). Preload LCP hero poster, lazy-load below-fold + review photos. Hero video muted MP4 with poster.

### How to AVOID AI-generated-looking imagery (mandatory)
- **Commission real photography of real people** — do NOT AI-generate or use generic stock. Real sweat, real grit, real skin = the proof of hand-craft.
- Reject: plastic over-retouched skin, impossible anatomy, mangled hands/text on garments, uncanny "too-perfect" lighting, inconsistent shadows, watermark ghosts, gym equipment that doesn't physically work.
- Keep grade consistent across shots (AI sets drift in color/style between images).
- Include genuine imperfection: pores, veins, fabric wrinkles, chalk dust, motion blur on a real rep.
- Alt text descriptive and specific ("Black cotton crew tee, front view, model mid-press") for accessibility + intent.

## Anti-AI-Slop Checklist
## Anti-AI-Slop Checklist

### DO
- [ ] Commission **real, gritty, high-key studio photography** of real men training (sweat, texture, movement); one cohesive shoot, consistent grade.
- [ ] Use **Anton** (or a custom condensed wordmark) for display + **Inter** for body — escape the Bebas-Neue gym cliché.
- [ ] Keep red to ~10%, deep crimson **#BF2626**, reserved for action + key accents only; squint-test every screen.
- [ ] Commit to the **white-canvas grit** lane (invert the category's dark default).
- [ ] Lead with **identity → proof → product**; repeat ONE ownable line ("A Uniform for the Relentless") everywhere.
- [ ] Generous whitespace, oversized margins, one dominant element per section, asymmetric editorial layouts.
- [ ] Tight human, mission-driven copy with concrete specifics (GSM, blend, seams, real reviews, real origin story).
- [ ] Bold-condensed-caps headline paired with deliberately tiny supporting copy ("Wide & Loud").
- [ ] Real micro-interactions (red underline-wipe, tactile press, count-up) — restrained, transform/opacity only.
- [ ] Seed **real reviews** + UGC before surfacing ratings; verified-buyer tags, fit context.
- [ ] Hit Core Web Vitals (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1); preload LCP, lazy-load, AVIF/WebP.
- [ ] WCAG 2.1 AA: descriptive alt text, color variants named in text, keyboard-operable filters, real `<label>` per field, 4.5:1 contrast, `prefers-reduced-motion`.

### FORBIDDEN
- [ ] ❌ AI-generated / generic stock product photography, plastic skin, mangled hands, uncanny lighting.
- [ ] ❌ Bebas Neue as the display font.
- [ ] ❌ Fire-engine **#FF0000** or red used as large fills / section backgrounds / body text / decoration.
- [ ] ❌ Black-bg + neon-red-glow "gamer/energy-drink" aesthetic (DMEN is light-theme).
- [ ] ❌ More than one loud/primary CTA per viewport; never two co-equal saturated buttons (Amazon yellow+orange trap).
- [ ] ❌ Keyword-stuffed product titles or spec-dump copy that reads like SEO/AI filler.
- [ ] ❌ Size selection as a dropdown (use visible button tiles; show sold-out, don't hide).
- [ ] ❌ Returns/shipping buried in footer (must sit near the CTA).
- [ ] ❌ Empty 0★ rating slots, fake press logos, invented stats.
- [ ] ❌ Fake scarcity / reset-on-reload timers / "Only 2 left" on unlimited stock (FTC dark patterns; raise returns, kill trust).
- [ ] ❌ Always-on "50% off" anchor pricing that cheapens premium positioning.
- [ ] ❌ Generic Shopify-default grid spacing/typography, congested layouts, intrusive popups/cookie walls.
- [ ] ❌ Heavy WebGL/Three.js/Lottie/3D runtimes, scroll-jacking, line-by-line text fade, autoplay audio, parallax overload.
- [ ] ❌ Big loud logo plastering / shouty branding — stay quiet-confident.
- [ ] ❌ Marketplace clutter: sponsored rails, seller badges, comparison widgets, multi-currency selector stack, gender-split nav (DMEN is men-only).
- [ ] ❌ Copying a competitor's homepage wholesale — translate trends into DMEN's own language, never sameness.
