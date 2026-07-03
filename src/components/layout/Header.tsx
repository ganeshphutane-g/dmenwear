"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import Logo from "@/components/brand/Logo";
import { useCart } from "@/lib/commerce/store";

type NavLink = { label: string; href: string };

const SHOP_LINKS: NavLink[] = [
  { label: "T-Shirts", href: "/collections/t-shirts" },
  { label: "Full-Sleeve Tees", href: "/collections/full-sleeve" },
  { label: "Tank Tops", href: "/collections/tank-tops" },
  { label: "Joggers", href: "/collections/joggers" },
  { label: "Shorts", href: "/collections/shorts" },
  { label: "Shop All", href: "/collections/all" },
];

const ACCESSORY_LINKS: NavLink[] = [
  { label: "Steel Shaker", href: "/products/protein-shaker" },
  { label: "Grind Towel", href: "/products/gym-towel" },
  { label: "Holdall Gym Bag", href: "/products/holdall-gym-bag" },
  { label: "Training Socks", href: "/products/training-socks-3pack" },
  { label: "All Accessories", href: "/collections/accessories" },
];

function CartButton() {
  const { totalQuantity, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      className="type-label relative inline-flex items-center gap-1.5"
      aria-label={`Open cart, ${totalQuantity} items`}
    >
      Cart
      {/* key remount replays the pop whenever the count changes */}
      <span
        key={totalQuantity}
        className="badge-pop inline-flex min-w-5 items-center justify-center rounded-full bg-red px-1.5 text-[0.6875rem] leading-5 text-white tabular-nums"
      >
        {totalQuantity}
      </span>
    </button>
  );
}

/** Controlled disclosure: opens on hover (60ms intent) / click / focus,
    closes on ESC, outside click, selection, or 150ms mouse-leave grace. */
function Dropdown({ label, links }: { label: string; links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (openTimer.current !== null) window.clearTimeout(openTimer.current);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  };
  const hoverOpen = () => {
    clearTimers();
    openTimer.current = window.setTimeout(() => setOpen(true), 60);
  };
  const hoverClose = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  };
  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={hoverOpen}
      onMouseLeave={hoverClose}
      onFocus={() => {
        clearTimers();
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="type-label link-wipe text-ink-2 transition-colors hover:text-ink"
      >
        {label}
      </button>
      <div
        id={panelId}
        className={`absolute left-1/2 top-full z-40 pt-4 transition-[opacity,transform] duration-200 ease-[var(--ease-out-decisive)] ${
          open
            ? "visible -translate-x-1/2 translate-y-0 opacity-100"
            : "invisible -translate-x-1/2 translate-y-1 opacity-0"
        }`}
      >
        <ul className="min-w-52 border border-line bg-surface p-2 shadow-[0_12px_40px_rgba(14,14,14,0.08)]">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-[0.9375rem] text-ink-2 transition-colors hover:bg-base hover:text-red"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileNavId = useId();

  // Transparent over the hero, solid once the page scrolls. Cheap threshold flip.
  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 8;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        solid
          ? "border-b border-line bg-base/95 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <button
            type="button"
            className="md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={mobileNavId}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            <Dropdown label="Shop" links={SHOP_LINKS} />
            <Dropdown label="Accessories" links={ACCESSORY_LINKS} />
            <Link href="/collections/new" className="type-label link-wipe text-ink-2 transition-colors hover:text-ink">
              The Drop
            </Link>
            <Link href="/journal" className="type-label link-wipe text-ink-2 transition-colors hover:text-ink">
              Journal
            </Link>
          </nav>
        </div>

        <Link href="/" aria-label="DMEN home" className="absolute left-1/2 -translate-x-1/2">
          <Logo variant="on-light" className="h-6 w-auto sm:h-7" />
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/collections/all" aria-label="Search" className="hidden text-ink sm:block">
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </Link>
          <CartButton />
        </div>
      </div>

      {menuOpen && (
        <nav id={mobileNavId} className="border-t border-line bg-base md:hidden" aria-label="Mobile">
          <ul className="container-wide flex flex-col py-2">
            {[
              ...SHOP_LINKS,
              { label: "All Accessories", href: "/collections/accessories" },
              { label: "The Drop", href: "/collections/new" },
              { label: "Journal", href: "/journal" },
            ].map((l) => (
              <li key={l.href + l.label}>
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="type-label block py-3 text-ink-2"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
