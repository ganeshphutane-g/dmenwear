import Image from "next/image";
import Link from "next/link";
import { mockAdapter } from "@/lib/commerce/adapter";
import { PRODUCTS } from "@/lib/commerce/fixtures";
import { formatMoney } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";
import BrandGlyph from "@/components/brand/BrandGlyph";
import Marquee from "@/components/layout/Marquee";
import StatStrip from "@/components/home/StatStrip";
import Reveal from "@/components/motion/Reveal";

/**
 * HOME — photo-editorial flagship build ("high-key UI, dark-grit imagery").
 * Motion grammar per the Awwwards recon: line-mask text reveals, masked
 * parallax windows (CSS animation-timeline, progressive), glass chips over
 * imagery, morphing primary CTA, sibling-dim grids, marquee. All
 * transform/opacity; reduced-motion / Save-Data / no-JS guarded in globals.
 *
 * IMAGERY: Unsplash License (free commercial use, no watermark) — interim
 * editorial photography until the commissioned DMEN shoot replaces it.
 * IDs: 1605296867304 (hero) · 1782849206337 (drop) · 1742560326996 /
 * 1611672585731 / 1734668491122 (pillars) · 1601113329251 (featured) ·
 * 1734668485281 (editorial) · 1595886509089 / 1627063383848 / 1762575910569 /
 * 1602143407151 (rail) · culture ×6.
 */

const RAIL_IMAGES: Record<string, { src: string; alt: string }> = {
  "relentless-tee": {
    src: "/images/home/rail-tee.jpg",
    alt: "Man in a plain black crew-neck tee, editorial portrait",
  },
  "cutoff-tank": {
    src: "/images/home/rail-tank.jpg",
    alt: "Man in a black training tank, arm tattoo, gym light",
  },
  "hustle-joggers": {
    src: "/images/home/rail-joggers.jpg",
    alt: "Man in a black tracksuit and sneakers, street portrait",
  },
  "protein-shaker": {
    src: "/images/home/rail-shaker.jpg",
    alt: "Matte black shaker bottle on a gym floor",
  },
};

const CULTURE: { src: string; alt: string; span?: boolean }[] = [
  { src: "/images/home/culture-1.jpg", alt: "Boxer wrapping fists, grayscale" },
  { src: "/images/home/culture-2.jpg", alt: "Fighter driving a kick into the heavy bag" },
  { src: "/images/home/culture-6.jpg", alt: "Man pressing a dumbbell overhead in a dark gym", span: true },
  { src: "/images/home/culture-3.jpg", alt: "Chalk bursting off clapped hands" },
  { src: "/images/home/culture-4.jpg", alt: "Man flexing under gym light" },
  { src: "/images/home/culture-5.jpg", alt: "Athlete facing away in shadow" },
];

/** Line-mask block: each line clips + slides up (load or scroll triggered). */
function Lines({
  lines,
  className = "",
  startDelay = 0,
}: {
  lines: React.ReactNode[];
  className?: string;
  startDelay?: number;
}) {
  return (
    <span className={className} style={{ "--lines-delay": `${startDelay}ms` } as React.CSSProperties}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line">
          <span style={{ "--line-i": i } as React.CSSProperties}>{line}</span>
        </span>
      ))}
    </span>
  );
}

/** Editorial product tile for the horizontal rail. */
function RailTile({ product, index }: { product: Product; index: number }) {
  const img = RAIL_IMAGES[product.handle];
  return (
    <Link
      href={`/products/${product.handle}`}
      className="dim-item group relative w-[76vw] shrink-0 snap-start overflow-hidden sm:w-[46vw] lg:w-[25.5rem]"
      aria-label={`${product.title} — ${formatMoney(product.priceRange.minVariantPrice)}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-ink">
        {img ? (
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 1024px) 26rem, (min-width: 640px) 46vw, 76vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-out-decisive)] group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 bg-seamless" />
        )}
        {/* index + glass info chip */}
        <span className="type-label absolute left-4 top-4 text-[0.625rem] text-white/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="glass-ink absolute inset-x-4 bottom-4 flex items-center justify-between px-4 py-3 text-white">
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{product.title}</span>
            <span className="type-micro text-white/70">
              {formatMoney(product.priceRange.minVariantPrice)}
            </span>
          </span>
          <span className="type-label text-[0.625rem] text-white/80 transition-transform duration-200 group-hover:translate-x-1">
            Shop →
          </span>
        </div>
      </div>
    </Link>
  );
}

const PILLARS = [
  {
    word: "MEN",
    line: "Built for your frame.",
    img: "/images/home/pillar-men.jpg",
    alt: "Man in black tee flexing against a black backdrop",
    pos: "object-[35%_center]",
  },
  {
    word: "MINDSET",
    line: "Discipline you can wear.",
    img: "/images/home/pillar-mindset.jpg",
    alt: "Man in headphones, head down, locked in before a lift",
    pos: "object-center",
  },
  {
    word: "HUSTLE",
    line: "Engineered for the grind.",
    img: "/images/home/pillar-hustle.jpg",
    alt: "Man setting up a deadlift in a dark gym",
    pos: "object-[70%_center]",
  },
];

function catalogStats() {
  const totalRatings = PRODUCTS.reduce((n, p) => n + p.reviews.count, 0);
  const weighted = PRODUCTS.reduce((n, p) => n + p.reviews.count * p.reviews.average, 0);
  const avg = totalRatings ? Number((weighted / totalRatings).toFixed(1)) : 0;
  return [
    { value: PRODUCTS.length, label: "Essentials in the line" },
    { value: totalRatings, label: "Verified ratings" },
    { value: avg, suffix: "★", label: "Average rating" },
    { value: 100, suffix: "+", label: "Washes, shape held" },
  ];
}

export default async function Home() {
  const rail = await mockAdapter.getProductsByHandles([
    "relentless-tee",
    "cutoff-tank",
    "hustle-joggers",
    "protein-shaker",
  ]);
  const tee = rail[0];
  const stats = catalogStats();

  return (
    <>
      {/* ============ HERO — fullscreen masked parallax ============ */}
      <section className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden bg-ink text-white">
        <div className="hero-photo absolute inset-0">
          <div className="parallax-exit absolute inset-0">
            <Image
              src="/images/home/hero.jpg"
              alt="Man gripping a barbell in a dark gym, rim-lit"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_35%]"
            />
          </div>
          {/* text-protection scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />
        </div>

        <div className="container-wide relative pb-14 pt-40 md:pb-20">
          <p className="hero-rise mb-6" style={{ animationDelay: "500ms" }}>
            <span className="glass type-label inline-flex items-center gap-2 rounded-full px-4 py-2 text-white/90">
              <BrandGlyph className="h-3.5 w-auto" /> For Rising Men
            </span>
          </p>

          <h1 className="lines-load max-w-5xl text-[clamp(2.75rem,8vw,6.75rem)] font-extrabold uppercase leading-[1.02] tracking-[0.03em]">
            <Lines
              startDelay={150}
              lines={[
                "A Uniform",
                "for the",
                <span key="r" className="text-red">
                  Relentless.
                </span>,
              ]}
            />
          </h1>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
            <p
              className="hero-rise type-body-lg max-w-sm text-white/75"
              style={{ animationDelay: "620ms" }}
            >
              Built in silence. Forged in the fight. Worn by men on the way up.
            </p>
            <div className="hero-rise flex flex-wrap items-center gap-4" style={{ animationDelay: "700ms" }}>
              <Link
                href="/collections/all"
                className="btn-morph type-label inline-flex items-center gap-2 bg-red px-8 py-4 text-white hover:bg-red-hover active:scale-[0.98]"
              >
                Shop the Uniform
              </Link>
              <Link
                href="/collections/new"
                className="glass type-label inline-flex items-center rounded-[3px] px-8 py-4 text-white transition-colors duration-200 hover:bg-white/20"
              >
                The Drop
              </Link>
            </div>
          </div>

          {/* hairline meta row — finishing detail */}
          <div
            className="hero-rise mt-10 flex items-center justify-between border-t border-white/15 pt-4"
            style={{ animationDelay: "800ms" }}
          >
            <span className="type-micro text-white/50">Scroll</span>
            <span className="type-micro hidden text-white/50 sm:block">
              Men | Mindset | Hustle
            </span>
            <span className="type-micro text-white/50">Est. for the relentless — India</span>
          </div>
        </div>
      </section>

      <Marquee />

      {/* ============ PILLARS — three photo tiles ============ */}
      <section className="container-wide py-20 md:py-28">
        <Reveal variant="lines">
          <p className="type-label mb-3 flex items-center gap-2 text-ink-2">
            <BrandGlyph className="h-3.5 w-auto" /> The System
          </p>
          <h2 className="type-display-xl mb-12">
            <Lines lines={["Built on", "three pillars."]} />
          </h2>
        </Reveal>

        <div className="dim-siblings grid gap-5 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.word} delay={i * 90}>
              <div className="dim-item group relative aspect-[3/4] overflow-hidden bg-ink">
                <div className="parallax-drift absolute inset-0">
                  <Image
                    src={p.img}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 768px) 32vw, 100vw"
                    className={`object-cover transition-transform duration-700 ease-[var(--ease-out-decisive)] group-hover:scale-[1.05] ${p.pos}`}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <span className="type-label absolute left-5 top-5 text-[0.625rem] text-white/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="glass-ink absolute inset-x-5 bottom-5 px-5 py-4 text-white transition-transform duration-300 ease-[var(--ease-out-decisive)] group-hover:-translate-y-1">
                  <p className="type-display-xl text-[1.375rem] leading-none">
                    {p.word}
                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red align-middle" />
                  </p>
                  <p className="type-body-sm mt-1.5 text-white/75">{p.line}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FEATURED — editorial split + glass product chip ============ */}
      <section className="border-y border-line bg-surface">
        <div className="container-wide grid items-stretch gap-10 py-20 md:py-28 lg:grid-cols-12">
          <Reveal className="relative lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden bg-ink">
              <div className="parallax-drift absolute inset-0">
                <Image
                  src="/images/home/featured.jpg"
                  alt="Back double-biceps pose against black"
                  fill
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                />
              </div>
              {tee && (
                <Link
                  href={`/products/${tee.handle}`}
                  className="glass-ink group absolute bottom-6 left-6 flex items-center gap-4 px-5 py-4 text-white"
                >
                  <span>
                    <span className="block text-sm font-semibold">{tee.title}</span>
                    <span className="type-micro text-white/70">
                      {formatMoney(tee.priceRange.minVariantPrice)} · 240 GSM
                    </span>
                  </span>
                  <span className="type-label text-[0.625rem] transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              )}
            </div>
          </Reveal>

          <div className="flex flex-col justify-center lg:col-span-5">
            <Reveal variant="lines">
              <p className="type-label mb-3 text-ink-2">The Standard</p>
              <h2 className="type-display-xl">
                <Lines lines={["Proof,", "not promises."]} />
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <ul className="mt-8 space-y-4">
                {[
                  "240 GSM combed cotton — holds shape through 100 washes",
                  "Athletic cut through chest and shoulders",
                  "Flatlock seams that sit flat under load",
                ].map((b) => (
                  <li key={b} className="flex gap-3 text-ink-2">
                    <BrandGlyph className="mt-1 h-3.5 w-auto shrink-0" />
                    <span className="text-ink">{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/products/relentless-tee"
                className="type-label link-wipe mt-9 inline-flex w-fit items-center text-ink"
              >
                Meet the Relentless Tee →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ BEST SELLERS — horizontal snap rail ============ */}
      <section className="overflow-hidden py-20 md:py-28">
        <div className="container-wide mb-10 flex items-end justify-between">
          <Reveal variant="lines">
            <p className="type-label mb-3 text-ink-2">Most Worn</p>
            <h2 className="type-display-xl">
              <Lines lines={["Best sellers."]} />
            </h2>
          </Reveal>
          <Link href="/collections/bestsellers" className="type-label link-wipe hidden text-ink-2 sm:inline-flex">
            View all
          </Link>
        </div>
        <Reveal>
          <div
            className="dim-siblings no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 md:px-10 xl:px-16"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 3%, black 97%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 3%, black 97%, transparent)",
            }}
          >
            {rail.map((p, i) => (
              <RailTile key={p.id} product={p} index={i} />
            ))}
            {/* end card → shop all */}
            <Link
              href="/collections/all"
              className="dim-item group flex w-[50vw] shrink-0 snap-start items-center justify-center border border-line bg-surface sm:w-[30vw] lg:w-[16rem]"
            >
              <span className="type-label link-wipe text-ink">Shop all →</span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ============ STATS ============ */}
      <StatStrip stats={stats} />

      {/* ============ EDITORIAL WINDOW — masked parallax break ============ */}
      <section className="relative flex min-h-[64svh] items-end overflow-hidden bg-ink text-white">
        <div className="parallax-drift absolute inset-0">
          <Image
            src="/images/home/editorial.jpg"
            alt="Man seated beside a barbell between sets, dark gym"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <div className="container-wide relative pb-14 pt-40">
          <Reveal variant="lines">
            <h2 className="max-w-3xl text-[clamp(1.875rem,4.5vw,3.5rem)] font-extrabold uppercase leading-[1.05] tracking-[0.04em]">
              <Lines
                lines={[
                  "You don't rise on motivation.",
                  <span key="l2">
                    You rise on the days you{" "}
                    <span className="text-red">didn't feel like it.</span>
                  </span>,
                ]}
              />
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="type-label mt-6 flex items-center gap-2 text-white/60">
              <BrandGlyph className="h-3.5 w-auto" /> Mindset · Hustle
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ THE DROP — full-bleed band ============ */}
      <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-ink text-white">
        <div className="parallax-drift absolute inset-0">
          <Image
            src="/images/home/drop.jpg"
            alt="Shirtless man at the bottom of a deadlift in a dark gym"
            fill
            sizes="100vw"
            className="object-cover object-[center_30%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-ink/10" />
        <div className="container-wide relative py-24">
          <Reveal variant="lines">
            <p className="type-label mb-4 text-white/60">The Drop · Founders&apos; Release</p>
            <h2 className="text-[clamp(3rem,10vw,8rem)] font-extrabold uppercase leading-[0.98] tracking-[0.02em]">
              <Lines
                lines={[
                  "500",
                  <span key="o" className="text-red">
                    Only.
                  </span>,
                ]}
              />
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-sm text-white/70">
              The first run of the uniform. Numbered, limited, gone when it&apos;s gone.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/collections/new"
                className="btn-morph type-label inline-flex items-center bg-red px-8 py-4 text-white hover:bg-red-hover active:scale-[0.98]"
              >
                Shop the Drop
              </Link>
              <span className="glass type-label rounded-full px-4 py-2 text-[0.625rem] text-white/80">
                Numbered · No restocks
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ CULTURE GRID ============ */}
      <section className="container-wide py-20 md:py-28">
        <Reveal variant="lines">
          <p className="type-label mb-3 flex items-center gap-2 text-ink-2">
            <BrandGlyph className="h-3.5 w-auto" /> #ForRisingMen
          </p>
          <h2 className="type-display-xl mb-4">
            <Lines lines={["The culture", "we train to."]} />
          </h2>
          <p className="type-body-lg mb-12 max-w-md text-ink-2">
            The standard behind the uniform. Own the kit? Tag{" "}
            <span className="font-semibold text-ink">#ForRisingMen</span> and take a slot.
          </p>
        </Reveal>
        <div className="dim-siblings grid grid-cols-2 gap-4 md:grid-cols-4">
          {CULTURE.map((c, i) => (
            <Reveal
              key={c.src}
              delay={(i % 4) * 60}
              className={c.span ? "row-span-2" : ""}
            >
              <div
                className={`dim-item group relative overflow-hidden bg-ink ${
                  c.span ? "h-full min-h-[24rem]" : "aspect-square"
                }`}
              >
                <Image
                  src={c.src}
                  alt={c.alt}
                  fill
                  sizes="(min-width: 768px) 24vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-decisive)] group-hover:scale-[1.06]"
                />
                <span className="absolute bottom-3 left-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <BrandGlyph className="h-4 w-auto" />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ MANIFESTO — outline-word texture ============ */}
      <section className="relative overflow-hidden border-t border-line py-28 md:py-40">
        <span
          aria-hidden="true"
          className="text-outline pointer-events-none absolute -top-4 left-0 whitespace-nowrap text-[22vw] font-extrabold uppercase leading-none tracking-[0.02em]"
        >
          Relentless
        </span>
        <div className="container-wide relative">
          <Reveal variant="lines">
            <p className="max-w-4xl text-[clamp(1.5rem,3.2vw,2.5rem)] font-extrabold uppercase leading-[1.15] tracking-[0.05em]">
              <Lines
                lines={[
                  "We don't sell clothes.",
                  "We make the kit for men",
                  <span key="m3">
                    building themselves —{" "}
                    <span className="text-red">one relentless day at a time.</span>
                  </span>,
                ]}
              />
            </p>
          </Reveal>
          <Reveal delay={200}>
            <Link
              href="/pages/about"
              className="type-label link-wipe mt-10 inline-flex items-center text-ink"
            >
              Read the mission →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
