"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/commerce/store";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/commerce/config";
import { formatMoney, freeShipProgress } from "@/lib/commerce/money";
import { useDialog } from "@/lib/useDialog";
import type { CartLine, Money } from "@/lib/commerce/types";

function FreeShipBar({ subtotal }: { subtotal: Money }) {
  const { progress, remaining } = freeShipProgress(subtotal, FREE_SHIPPING_THRESHOLD);
  const unlocked = Number(remaining.amount) <= 0;
  return (
    <div className="px-5 py-4">
      <p className="type-micro mb-2 text-ink-2">
        {!unlocked ? (
          <>
            You&apos;re{" "}
            <span className="font-semibold text-ink">{formatMoney(remaining)}</span> away
            from free shipping. Almost there.
          </>
        ) : (
          <span className="text-success">Free shipping unlocked.</span>
        )}
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full origin-left rounded-full bg-red transition-transform duration-300 ease-[var(--ease-out-decisive)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}

function LineRow({ line }: { line: CartLine }) {
  const { updateLine, removeLine } = useCart();
  const opts = line.merchandise.selectedOptions
    .filter((o) => o.value !== "One Size")
    .map((o) => o.value)
    .join(" / ");
  return (
    <li className="flex gap-3 py-4">
      <div className="h-20 w-16 shrink-0 bg-seamless" aria-hidden="true" />
      <div className="flex grow flex-col">
        <div className="flex justify-between gap-2">
          <Link href={`/products/${line.merchandise.productHandle}`} className="text-[0.9375rem] font-semibold leading-tight hover:text-red">
            {line.merchandise.productTitle}
          </Link>
          <span className="type-price text-sm">{formatMoney(line.cost.totalAmount)}</span>
        </div>
        {opts && <p className="type-micro mt-0.5 text-muted">{opts}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="inline-flex items-center border border-line">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => updateLine(line.id, line.quantity - 1)}
              className="px-2.5 py-1 text-ink-2 hover:text-ink"
            >
              −
            </button>
            <span className="min-w-7 text-center text-sm tabular-nums">{line.quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => updateLine(line.id, line.quantity + 1)}
              className="px-2.5 py-1 text-ink-2 hover:text-ink"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeLine(line.id)}
            className="type-micro text-muted underline-offset-2 hover:text-red hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export default function MiniCart() {
  const { cart, isOpen, closeCart, totalQuantity, lastError } = useCart();
  const drawerRef = useDialog<HTMLDivElement>(isOpen, closeCart);

  // Body scroll lock while open (focus/ESC handled by useDialog).
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const lines = cart?.lines ?? [];

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-overlay transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        role="dialog"
        aria-label="Your cart"
        aria-modal="true"
        tabIndex={-1}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-[28rem] flex-col bg-surface shadow-2xl transition-transform duration-300 ease-[var(--ease-in-out-soft)] focus:outline-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Content fades in as ONE group, 100ms after the panel starts moving */}
        <div
          className={`flex h-full min-h-0 flex-col transition-opacity duration-200 ${
            isOpen ? "opacity-100 delay-100" : "opacity-0"
          }`}
        >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="type-label">Your Cart ({totalQuantity})</h2>
          <button type="button" onClick={closeCart} aria-label="Close cart" className="p-1 text-ink-2 hover:text-ink">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {!cart || lines.length === 0 ? (
          <div className="flex grow flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="type-h3">Your kit is empty.</p>
            <p className="text-ink-2">The work isn&apos;t.</p>
            <Link
              href="/collections/all"
              onClick={closeCart}
              className="type-label bg-red px-7 py-3.5 text-white transition-colors hover:bg-red-hover"
            >
              Start with the Essentials
            </Link>
          </div>
        ) : (
          <>
            <FreeShipBar subtotal={cart.cost.subtotalAmount} />
            <ul className="grow divide-y divide-line overflow-y-auto px-5">
              {lines.map((line) => (
                <LineRow key={line.id} line={line} />
              ))}
            </ul>
            <div className="border-t border-line px-5 py-4">
              {lastError && <p className="type-micro mb-2 text-red">{lastError}</p>}
              <div className="mb-3 flex items-center justify-between">
                <span className="type-label text-ink-2">Subtotal</span>
                <span className="type-price text-lg">{formatMoney(cart.cost.subtotalAmount)}</span>
              </div>
              <p className="type-micro mb-3 text-muted">Shipping &amp; taxes calculated at checkout.</p>
              <Link
                href="/cart"
                onClick={closeCart}
                className="type-label block w-full bg-red py-4 text-center text-white transition-colors hover:bg-red-hover"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="type-label mt-2 block w-full py-2 text-center text-ink-2 hover:text-ink"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
        </div>
      </aside>
    </>
  );
}
