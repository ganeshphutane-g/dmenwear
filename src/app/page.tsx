import Image from "next/image";
import Link from "next/link";
import { mockAdapter } from "@/lib/commerce/adapter";
import { formatMoney } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";
import BrandGlyph from "@/components/brand/BrandGlyph";
import Marquee from "@/components/layout/Marquee";
import Reveal from "@/components/motion/Reveal";
import HeroSlideshow, { type HeroSlide } from "@/components/home/HeroSlideshow";
import ProductMarquee, { type MarqueeItem } from "@/components/home/ProductMarquee";
import NewsletterForm from "@/components/layout/NewsletterForm";

/**
 * HOME — photo-editorial flagship, structured after the RAWBLOX streetwear
 * template (numbered slideshow hero · NEW DROPS · editorial split · manifesto ·
 * FEATURED marquee · featured product · red movement band · why-shop · category
 * split · newsletter), skinned in DMEN's light theme + logo red #BF2626 + Inter
 * + our dark-grit photography. Motion-heavy, transform/opacity only, guarded.
 * Imagery: Unsplash License (free, no watermark) — interim until the DMEN shoot.
 */

const HERO_SLIDES: HeroSlide[] = [
  {
    n: "01",
    index: "A Uniform for the Relentless",
    lines: ["A Uniform", "for the", <span key="r" className="text-red">Relentless.</span>],
    sub: "Built in silence. Forged in the fight. Worn by men on the way up.",
    img: "/images/home/hero.jpg",
    alt: "Man gripping a barbell in a dark gym, rim-lit",
    href: "/collections/all",
    cta: "Shop the Uniform",
  },
  {
    n: "02",
    index: "Built for the Grind",
    lines: ["Built", <span key="g" className="text-red">for the grind.</span>],
    sub: "240 GSM combed cotton. Holds its shape through 100 washes. Earns its place.",
    img: "/images/home/feat-band.jpg",
    alt: "Man resting between sets on a weight plate",
    href: "/collections/apparel",
    cta: "Shop Apparel",
  },
  {
    n: "03",
    index: "Men · Mindset · Hustle",
    lines: ["Discipline", <span key="d" className="text-red">you can wear.</span>],
    sub: "A uniform that reminds you who you're becoming, every single session.",
    img: "/images/home/pillar-mindset.jpg",
    alt: "Man in headphones locked in before a lift",
    href: "/pages/about",
    cta: "Our Mission",
  },
  {
    n: "04",
    index: "The Founders' Drop",
    lines: ["500", <span key="o" className="text-red">only.</span>],
    sub: "The first run of the uniform. Numbered, limited, gone when it's gone.",
    img: "/images/home/drop.jpg",
    alt: "Shirtless man at the bottom of a deadlift",
    href: "/collections/new",
    cta: "Shop the Drop",
  },
  {
    n: "05",
    index: "For Rising Men",
    lines: ["For", <span key="rm" className="text-red">rising men.</span>],
    sub: "Kit for the men doing the work nobody claps for. Join the relentless.",
    img: "/images/home/featured.jpg",
    alt: "Back double-biceps pose against black",
    href: "/collections/bestsellers",
    cta: "Shop Best Sellers",
  },
];

// handle → editorial photo for the home surfaces
const PHOTO: Record<string, { src: string; alt: string }> = {
  "relentless-tee": { src: "/images/home/rail-tee.jpg", alt: "Man in a plain black crew tee" },
  "cutoff-tank": { src: "/images/home/rail-tank.jpg", alt: "Man in a black training tank" },
  "hustle-joggers": { src: "/images/home/rail-joggers.jpg", alt: "Man in a black tracksuit" },
  "protein-shaker": { src: "/images/home/rail-shaker.jpg", alt: "Matte black shaker bottle" },
  "forge-long-sleeve": { src: "/images/home/new-hoodie.jpg", alt: "Man in a black hoodie" },
  "grind-shorts": { src: "/images/home/new-hoodie2.jpg", alt: "Man in dark streetwear" },
  "holdall-gym-bag": { src: "/images/home/new-hoodie3.jpg", alt: "Man in a black hoodie, studio" },
};

const FEATURES = [
  { t: "Cash on Delivery", d: "Pay when it lands. COD available across India.", icon: "truck" },
  { t: "Secure Payment", d: "Encrypted UPI, cards and wallets. Shop with confidence.", icon: "lock" },
  { t: "7-Day Returns", d: "Not the right fit? Easy returns or exchange, no fuss.", icon: "return" },
  { t: "Built to Last", d: "240 GSM, flatlock seams — kit that survives the grind.", icon: "shield" },
];

function FeatureIcon({ name }: { name: string }) {
  const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "truck")
    return (<svg {...common}><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></svg>);
  if (name === "lock")
    return (<svg {...common}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>);
  if (name === "return")
    return (<svg {...common}><path d="M3 8a9 9 0 1 1-1 4" /><path d="M3 4v4h4" /></svg>);
  return (<svg {...common}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /></svg>);
}

function priceOf(p?: Product) {
  return p ? formatMoney(p.priceRange.minVariantPrice) : "";
}

export default async function Home() {
  const all = await mockAdapter.getAllProducts();
  const byHandle = Object.fromEntries(all.map((p) => [p.handle, p])) as Record<string, Product>;

  const newDrops = ["relentless-tee", "cutoff-tank", "hustle-joggers"];
  const marqueeItems: MarqueeItem[] = [
    "relentless-tee", "cutoff-tank", "hustle-joggers", "protein-shaker",
    "forge-long-sleeve", "grind-shorts", "holdall-gym-bag",
  ].map((h) => ({
    name: byHandle[h].title,
    price: priceOf(byHandle[h]),
    img: PHOTO[h]?.src ?? "/images/home/rail-tee.jpg",
    alt: PHOTO[h]?.alt ?? byHandle[h].title,
    href: `/products/${h}`,
  }));
  const featured = byHandle["relentless-tee"];

  return (
    <>
      <HeroSlideshow slides={HERO_SLIDES} />

      <div className="mt-14 md:mt-20">
        <Marquee />
      </div>

      {/* ============ NEW DROPS ============ */}
      <section className="container-wide py-20 md:py-28">
        <Reveal variant="lines" className="mb-12 max-w-xl">
          <p className="type-label mb-3 flex items-center gap-2 text-ink-2">
            <BrandGlyph className="h-3.5 w-auto" /> Just Dropped
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold uppercase leading-[1.02] tracking-[0.02em]">
            <span className="mask-line"><span style={{ "--line-i": 0 } as React.CSSProperties}>New drops.</span></span>
          </h2>
          <p className="type-body-lg mt-4 text-ink-2">
            Small-batch essentials — heavyweight fabric, athletic cut, built to be worn into the
            ground. Once a drop&apos;s gone, it&apos;s gone.
          </p>
        </Reveal>

        <div className="dim-siblings grid gap-6 md:grid-cols-3">
          {newDrops.map((h, i) => {
            const p = byHandle[h];
            return (
              <Reveal key={h} delay={i * 90}>
                <Link href={`/products/${h}`} className="dim-item group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink">
                    <Image
                      src={PHOTO[h].src}
                      alt={PHOTO[h].alt}
                      fill
                      sizes="(min-width:768px) 32vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out-decisive)] group-hover:scale-[1.05]"
                    />
                    <span className="type-label absolute left-4 top-4 rounded-full bg-ink px-3 py-1.5 text-[0.625rem] text-white">
                      New
                    </span>
                  </div>
                  <h3 className="type-display-xl mt-5 text-[1.375rem] leading-none transition-colors group-hover:text-red">
                    {p.title}
                  </h3>
                  <p className="type-body-sm mt-2 max-w-xs text-ink-2">{p.brandStrap}</p>
                  <p className="type-price mt-2 text-lg">{priceOf(p)}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ EDITORIAL SPLIT ============ */}
      <section className="border-y border-line bg-surface">
        <div className="container-wide grid items-stretch gap-6 py-16 md:py-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink lg:aspect-[16/11]">
              <div className="parallax-drift absolute inset-0">
                <Image
                  src="/images/home/pillar-hustle.jpg"
                  alt="Man setting up a deadlift in a dark gym"
                  fill
                  sizes="(min-width:1024px) 64vw, 100vw"
                  className="object-cover object-[center_35%]"
                />
              </div>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-4">
            <div className="flex h-full flex-col justify-center rounded-2xl bg-ink p-8 text-white md:p-10">
              <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold uppercase leading-[1.05] tracking-[0.02em]">
                Built in silence.<br />
                <span className="text-red">Made for the relentless.</span>
              </h2>
              <p className="type-body-lg mt-5 text-white/70">
                From the 5am you to the last set nobody sees — our story is the men doing the work.
                Join the movement.
              </p>
              <Link
                href="/pages/about"
                className="btn-morph mt-8 inline-flex w-fit items-center gap-3 bg-white px-6 py-3.5 text-ink"
              >
                <span className="type-label">Read our story</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-red text-white">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ MANIFESTO ============ */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <span aria-hidden className="text-outline pointer-events-none absolute -top-6 left-0 whitespace-nowrap text-[22vw] font-extrabold uppercase leading-none tracking-[0.02em]">
          Relentless
        </span>
        <div className="container-wide relative">
          <Reveal variant="lines">
            <p className="type-label mb-5 text-ink-2">Streetwear with a spine</p>
            <p className="max-w-4xl text-[clamp(1.75rem,4vw,3rem)] font-extrabold uppercase leading-[1.1] tracking-[0.03em]">
              <span className="mask-line"><span style={{ "--line-i": 0 } as React.CSSProperties}>Wear the will.</span></span>
              <span className="mask-line"><span style={{ "--line-i": 1 } as React.CSSProperties}>Break the limit.</span></span>
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p className="type-body-lg mt-6 max-w-xl text-ink-2">
              Born from discipline, not hype. Every stitch, every gram, every drop is a reflection of
              the work — wear your standard, break your limit, define your own path.
            </p>
            <Link href="/collections/all" className="btn-morph mt-8 inline-flex items-center bg-red px-8 py-4 type-label text-white hover:bg-red-hover">
              Get it now
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ FEATURED DROPS MARQUEE ============ */}
      <section className="overflow-hidden bg-ink py-20 text-white md:py-28">
        <div className="container-wide mb-10">
          <Reveal variant="lines">
            <p className="type-label mb-3 text-white/60">Featured Drops</p>
            <h2 className="max-w-2xl text-[clamp(1.75rem,4vw,3rem)] font-extrabold uppercase leading-[1.05] tracking-[0.02em]">
              <span className="mask-line"><span style={{ "--line-i": 0 } as React.CSSProperties}>Stand out.</span></span>
              <span className="mask-line"><span style={{ "--line-i": 1 } as React.CSSProperties}>Stay ahead.</span></span>
            </h2>
          </Reveal>
        </div>
        <ProductMarquee items={marqueeItems} />
      </section>

      {/* ============ FEATURED PRODUCT BAND ============ */}
      <section className="bg-ink text-white">
        <div className="container-wide grid items-center gap-10 py-16 md:py-24 lg:grid-cols-12">
          <Reveal variant="lines" className="lg:col-span-5">
            <p className="type-label mb-4 text-white/60">The everyday armour</p>
            <h2 className="text-[clamp(2.5rem,7vw,5rem)] font-extrabold uppercase leading-[0.98] tracking-[0.01em]">
              <span className="mask-line"><span style={{ "--line-i": 0 } as React.CSSProperties}>Relentless</span></span>
              <span className="mask-line"><span style={{ "--line-i": 1 } as React.CSSProperties}><span className="text-red">Tee.</span></span></span>
            </h2>
            <p className="type-body-lg mt-6 max-w-sm text-white/70">
              240 GSM combed cotton. Athletic cut. Flatlock seams that sit flat under load. The one
              you reach for on the 5am days.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <span className="type-price text-2xl">{priceOf(featured)}</span>
              <Link href="/products/relentless-tee" className="btn-morph inline-flex items-center bg-red px-8 py-4 type-label text-white hover:bg-red-hover">
                Shop now
              </Link>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7 lg:col-start-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[#161616]">
              <div className="parallax-drift absolute inset-0">
                <Image src="/images/home/feat-band.jpg" alt="Man resting between sets, dark gym" fill sizes="(min-width:1024px) 56vw, 100vw" className="object-cover" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ JOIN THE RELENTLESS (red band) ============ */}
      <section className="container-wide py-8">
        <Reveal>
          <div className="relative flex min-h-[70svh] items-center overflow-hidden rounded-[1.75rem] bg-red text-white">
            <div className="parallax-drift absolute inset-0">
              <Image src="/images/home/drop.jpg" alt="Athlete in a dark gym" fill sizes="100vw" className="object-cover object-[center_25%]" />
            </div>
            {/* red duotone tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-red via-red-hover to-ink opacity-90 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />
            <div className="relative w-full p-8 md:p-16">
              <h2 className="max-w-3xl text-[clamp(2.5rem,8vw,7rem)] font-extrabold uppercase leading-[0.96] tracking-[0.01em]">
                <span className="mask-line"><span style={{ "--line-i": 0 } as React.CSSProperties}>Join the</span></span>
                <span className="mask-line"><span style={{ "--line-i": 1 } as React.CSSProperties}>relentless.</span></span>
                <span className="mask-line"><span style={{ "--line-i": 2 } as React.CSSProperties}>Wear the will.</span></span>
              </h2>
              <p className="mt-6 max-w-md text-white/80">
                Kit for men who break the mould. Limited drops, honest fabric, no shortcuts.
              </p>
              <Link href="/collections/all" className="btn-morph mt-8 inline-flex items-center bg-white px-8 py-4 type-label text-ink hover:bg-white/90">
                Shop now
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ WHY SHOP WITH US ============ */}
      <section className="container-wide py-20 md:py-28">
        <Reveal variant="lines" className="mb-12">
          <p className="type-label mb-3 text-ink-2">Why shop with DMEN</p>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold uppercase leading-[1.05] tracking-[0.02em]">
            <span className="mask-line"><span style={{ "--line-i": 0 } as React.CSSProperties}>Covered, end to end.</span></span>
          </h2>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.t} delay={i * 70}>
              <div className="flex h-full flex-col gap-4 bg-surface p-7">
                <span className="text-red"><FeatureIcon name={f.icon} /></span>
                <h3 className="type-h4">{f.t}</h3>
                <p className="type-body-sm text-ink-2">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CATEGORY SPLIT ============ */}
      <section className="container-wide pb-20 md:pb-28">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { word: "Apparel", href: "/collections/apparel", img: "/images/home/new-hoodie3.jpg", alt: "Man in black apparel" },
            { word: "Accessories", href: "/collections/accessories", img: "/images/home/rail-shaker.jpg", alt: "Black shaker bottle" },
          ].map((c, i) => (
            <Reveal key={c.word} delay={i * 90}>
              <Link href={c.href} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-ink sm:aspect-[16/12]">
                <Image src={c.img} alt={c.alt} fill sizes="(min-width:768px) 48vw, 100vw" className="object-cover opacity-90 transition-transform duration-700 ease-[var(--ease-out-decisive)] group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
                  <span className="text-[clamp(2.5rem,7vw,5rem)] font-extrabold uppercase leading-none tracking-[0.01em] text-white">
                    {c.word}
                  </span>
                  <span className="type-label mb-2 flex items-center gap-2 text-white/80">
                    Shop <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="bg-ink text-white">
        <div className="container-wide grid gap-8 py-16 md:py-20 lg:grid-cols-12 lg:items-center">
          <Reveal variant="lines" className="lg:col-span-7">
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold uppercase leading-[1.05] tracking-[0.02em]">
              <span className="mask-line"><span style={{ "--line-i": 0 } as React.CSSProperties}>Join the relentless.</span></span>
            </h2>
            <p className="type-body-lg mt-4 max-w-md text-white/60">
              Early access to drops, 10% off your first kit, and the occasional note worth reading. No spam.
            </p>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <NewsletterForm />
            <p className="type-micro mt-3 text-white/40">Weekly at most. Unsubscribe anytime.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
