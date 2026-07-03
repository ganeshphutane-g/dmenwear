"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal wrapper: fades + rises content on first viewport entry.
 * - IO-driven, once-only; children stay server-rendered (passed through).
 * - `delay` staggers siblings (ms), applied via --reveal-delay.
 * - variant="lines": no block motion — instead triggers the .mask-line
 *   children's line-up slide (Awwwards line-mask reveal).
 * - Reduced-motion / no-JS users always see content (guards in globals.css).
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "block",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: "block" | "lines";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    // Already inside the initial viewport → show immediately (no
    // flash-then-animate on above-fold content after hydration).
    if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const base = variant === "lines" ? "reveal-lines" : "reveal";
  return (
    <div
      ref={ref}
      className={`${base} ${inView ? "is-in" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
