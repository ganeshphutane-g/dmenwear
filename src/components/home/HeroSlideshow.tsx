"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BrandGlyph from "@/components/brand/BrandGlyph";

/**
 * Numbered slideshow hero (RAWBLOX-style, DMEN-skinned): a big rounded dark
 * media block with an overlaid 01–05 index; the active slide crossfades the
 * photo and re-plays a line-mask headline below. Auto-advances (~6s) with a
 * progress bar; click any number to jump. Reduced-motion / data-motion=off:
 * no auto-advance, instant swaps. transform/opacity only.
 */

export type HeroSlide = {
  n: string;
  index: string; // short label in the numbered index
  lines: React.ReactNode[]; // headline lines (line-mask)
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
    <section className="container-wide pt-6">
      {/* Media block */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] bg-ink sm:aspect-[16/9] lg:aspect-[2.35/1]">
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
              className="scale-[1.03] object-cover object-[center_30%]"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30" />

        {/* eyebrow */}
        <div className="absolute left-6 top-6 md:left-8 md:top-8">
          <span className="glass type-label inline-flex items-center gap-2 rounded-full px-4 py-2 text-white/90">
            <BrandGlyph className="h-3.5 w-auto" /> The Uniform
          </span>
        </div>

        {/* numbered index */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/15 pt-5 sm:grid-cols-3 lg:grid-cols-5">
            {slides.map((s, i) => (
              <button
                key={s.n}
                type="button"
                onClick={() => go(i)}
                className="group/idx text-left"
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
                {/* progress bar for the active item */}
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

      {/* Headline row (reflects active slide) */}
      <div className="mt-10 grid gap-8 md:mt-12 lg:grid-cols-12">
        <h1
          key={active}
          className="lines-load text-[clamp(2.25rem,6.5vw,5.5rem)] font-extrabold uppercase leading-[1.02] tracking-[0.02em] lg:col-span-8"
        >
          {cur.lines.map((line, i) => (
            <span key={i} className="mask-line">
              <span style={{ "--line-i": i } as React.CSSProperties}>{line}</span>
            </span>
          ))}
        </h1>
        <div className="flex flex-col justify-end gap-6 lg:col-span-4">
          <p className="type-body-lg max-w-sm text-ink-2">{cur.sub}</p>
          <Link
            href={cur.href}
            className="btn-morph type-label inline-flex w-fit items-center gap-2 bg-red px-8 py-4 text-white hover:bg-red-hover active:scale-[0.98]"
          >
            {cur.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
