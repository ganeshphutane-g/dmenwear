"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BrandGlyph from "@/components/brand/BrandGlyph";

/**
 * Numbered slideshow hero (RAWBLOX-style, DMEN-skinned): ONE tall, full-height
 * dark media block that fills the viewport down to the marquee. The active
 * slide crossfades the photo; the eyebrow sits top-left; the line-mask headline,
 * sub-copy + CTA, and the 01–05 index (with progress bar) are overlaid at the
 * bottom. Auto-advances (~6s); click any number to jump. Reduced-motion /
 * data-motion=off: no auto-advance, instant swaps. transform/opacity only.
 */

export type HeroSlide = {
  n: string;
  index: string;
  lines: React.ReactNode[];
  sub: string;
  img: string;
  alt: string;
  href: string;
  cta: string;
};

const INTERVAL = 6000;

export default function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const off =
      document.documentElement.getAttribute("data-motion") === "off" ||
      (typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReduced(off);
    if (off) return;
    timer.current = window.setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      INTERVAL,
    );
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, [slides.length]);

  function go(i: number) {
    setActive(i);
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      if (!reduced) {
        timer.current = window.setInterval(
          () => setActive((a) => (a + 1) % slides.length),
          INTERVAL,
        );
      }
    }
  }

  const cur = slides[active];

  return (
    <section className="container-wide pt-4">
      <div className="relative min-h-[82svh] w-full overflow-hidden rounded-[1.75rem] bg-ink text-white sm:min-h-[86svh] lg:min-h-[88svh]">
        {/* crossfading photos */}
        {slides.map((s, i) => (
          <div
            key={s.n}
            className="absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out-decisive)]"
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          >
            <Image
              src={s.img}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="scale-[1.03] object-cover object-[center_28%]"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />

        {/* content — eyebrow top, everything else bottom */}
        <div className="relative z-10 flex min-h-[82svh] flex-col justify-between p-6 sm:min-h-[86svh] md:p-9 lg:min-h-[88svh] lg:p-12">
          <div>
            <span className="glass type-label inline-flex items-center gap-2 rounded-full px-4 py-2 text-white/90">
              <BrandGlyph className="h-3.5 w-auto" /> The Uniform
            </span>
          </div>

          <div>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <h1
                key={active}
                className="lines-load text-[clamp(2.5rem,7vw,6rem)] font-extrabold uppercase leading-[0.98] tracking-[0.01em] lg:col-span-8"
              >
                {cur.lines.map((line, i) => (
                  <span key={i} className="mask-line">
                    <span style={{ "--line-i": i } as React.CSSProperties}>{line}</span>
                  </span>
                ))}
              </h1>
              <div className="flex flex-col gap-5 lg:col-span-4 lg:pb-3">
                <p className="type-body-lg max-w-sm text-white/75">{cur.sub}</p>
                <Link
                  href={cur.href}
                  className="btn-morph type-label inline-flex w-fit items-center gap-2 bg-red px-8 py-4 text-white hover:bg-red-hover active:scale-[0.98]"
                >
                  {cur.cta}
                </Link>
              </div>
            </div>

            {/* numbered index */}
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/15 pt-5 sm:grid-cols-3 lg:mt-10 lg:grid-cols-5">
              {slides.map((s, i) => (
                <button
                  key={s.n}
                  type="button"
                  onClick={() => go(i)}
                  className="text-left"
                  aria-label={`Slide ${s.n}: ${s.index}`}
                  aria-current={i === active}
                >
                  <span
                    className={`type-display-xl block text-[1.5rem] leading-none transition-colors duration-300 ${
                      i === active ? "text-white" : "text-white/35"
                    }`}
                  >
                    {s.n}
                  </span>
                  <span
                    className={`type-micro mt-2 block transition-colors duration-300 ${
                      i === active ? "text-white/80" : "text-white/35"
                    }`}
                  >
                    {s.index}
                  </span>
                  <span className="mt-2 block h-0.5 w-full overflow-hidden rounded-full bg-white/15">
                    {i === active && (
                      <span
                        key={active}
                        className="block h-full origin-left rounded-full bg-red"
                        style={{
                          animation: reduced
                            ? "none"
                            : `hero-progress ${INTERVAL}ms linear forwards`,
                          transform: reduced ? "scaleX(1)" : undefined,
                        }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
