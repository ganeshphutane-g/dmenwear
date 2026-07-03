"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
};

const DURATION_MS = 1200;

/** Decimal places implied by the passed value, so we never invent precision. */
function decimalsOf(n: number): number {
  if (Number.isInteger(n)) return 0;
  const s = String(n);
  const i = s.indexOf(".");
  return i === -1 ? 0 : s.length - i - 1;
}

function format(n: number, decimals: number): string {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Decisive ease-out so the count decelerates into its final number. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function StatStrip({ stats }: { stats: Stat[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  // Start at the final values; flip to 0 only once we know motion is allowed.
  const [current, setCurrent] = useState<number[]>(() => stats.map((s) => s.value));
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const reduce =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lite =
      typeof navigator !== "undefined" &&
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
        ?.saveData === true;

    // Reduced motion, Save-Data, or no IntersectionObserver: show final values.
    if (reduce || lite || typeof IntersectionObserver === "undefined") {
      setCurrent(stats.map((s) => s.value));
      return;
    }

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const targets = stats.map((s) => s.value);
      setCurrent(targets.map(() => 0));

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION_MS);
        const eased = easeOut(t);
        setCurrent(targets.map((v) => v * eased));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setCurrent(targets); // land exactly on the passed values
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [stats]);

  return (
    <section ref={sectionRef} aria-label="By the numbers" className="bg-base">
      <div className="container-wide py-16 md:py-24">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 md:gap-x-12">
          {stats.map((stat, i) => {
            const decimals = decimalsOf(stat.value);
            const shown = format(current[i] ?? stat.value, decimals);
            return (
              <div
                key={`${stat.label}-${i}`}
                className="flex flex-col items-start md:[&:nth-child(even)]:translate-y-6"
              >
                <dd className="type-display-xl tabular-nums text-ink">
                  {stat.prefix ? (
                    <span className="text-ink-2">{stat.prefix}</span>
                  ) : null}
                  <span>{shown}</span>
                  {stat.suffix ? (
                    <span className="text-red" aria-hidden="true">
                      {stat.suffix}
                    </span>
                  ) : null}
                </dd>
                <span className="mt-4 h-0.5 w-10 bg-ink" aria-hidden="true" />
                <dt className="type-label mt-4 text-ink-2">{stat.label}</dt>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
