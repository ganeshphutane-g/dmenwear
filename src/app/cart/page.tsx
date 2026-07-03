"use client";

import Link from "next/link";
import { useCart } from "@/lib/commerce/store";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/commerce/config";
import { formatMoney, freeShipProgress } from "@/lib/commerce/money";
import { track } from "@/lib/analytics";

export default function CartPage() {
  const { cart, updateLine, removeLine, lastError } = useCart();
  const lines = cart?.lines ?? [];
  const subtotal = cart ? Number(cart.cost.subtotalAmount.amount) : 0;
  const fs = cart ? freeShipProgress(cart.cost.subtotalAmount, FREE_SHIPPING_THRESHOLD) : null;

  return (
    <div className="container-wide py-10 md:py-16">
      <h1 className="type-display-xl mb-8">Your Cart</h1>

      {lines.length === 0 ? (
        <div className="flex flex-col items-start gap-5 py-10">
          <p className="type-h3">Your kit is empty. The work isn&apos;t.</p>
          <Link
            href="/collections/all"
            className="type-label bg-red px-7 py-4 text-white transition-colors hover:bg-red-hover"
          >
            Start with the Essentials
          </Link>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-12">
          <ul className="divide-y divide-line lg:col-span-8">
            {lines.map((line) => {
              const opts = line.merchandise.selectedOptions
                .filter((o) => o.value !== "One Size")
                .map((o) => o.value)
                .join(" / ");
              return (
                <li key={line.id} className="flex gap-5 py-6">
                  <div className="h-32 w-24 shrink-0 bg-seamless" aria-hidden="true" />
                  <div className="flex grow flex-col">
                    <div className="flex justify-between gap-4">
                      <Link
                        href={`/products/${line.merchandise.productHandle}`}
                        className="type-h4 hover:text-red"
                      >
                        {line.merchandise.productTitle}
                      </Link>
                      <span className="type-price">{formatMoney(line.cost.totalAmount)}</span>
                    </div>
                    {opts && <p className="type-body-sm mt-1 text-muted">{opts}</p>}
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="inline-flex items-center border border-line">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateLine(line.id, line.quantity - 1)}
                          className="px-3 py-1.5 text-ink-2 hover:text-ink"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center tabular-nums">{line.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateLine(line.id, line.quantity + 1)}
                          className="px-3 py-1.5 text-ink-2 hover:text-ink"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="type-micro text-muted hover:text-red hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="lg:col-span-4">
            <div className="border border-line p-6">
              <h2 className="type-label mb-4 text-ink-2">Order Summary</h2>
              <div className="flex justify-between border-b border-line pb-4">
                <span className="text-ink-2">Subtotal</span>
                <span className="type-price">{cart && formatMoney(cart.cost.subtotalAmount)}</span>
              </div>
              <p className="type-micro py-4 text-ink-2">
                {fs && Number(fs.remaining.amount) > 0
                  ? `You're ${formatMoney(fs.remaining)} away from free shipping.`
                  : "Free shipping unlocked."}
              </p>
              {lastError && <p className="type-micro mb-3 text-red">{lastError}</p>}
              {/* Bespoke flow ends here → branded handoff to Shopify hosted checkout */}
              <a
                href={cart?.checkoutUrl ?? "#"}
                onClick={() => track("begin_checkout", { value: subtotal })}
                className="type-label block w-full bg-red py-4 text-center text-white transition-colors hover:bg-red-hover"
              >
                Continue to Checkout
              </a>
              <p className="type-micro mt-3 text-muted">
                Secure checkout · COD, UPI &amp; cards. Shipping &amp; taxes shown before you pay.
              </p>
              <Link
                href="/collections/all"
                className="type-label mt-4 block text-center text-ink-2 hover:text-ink"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
