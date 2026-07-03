"use client";

import Link from "next/link";
import { useCart } from "@/lib/commerce/store";
import { formatMoney } from "@/lib/commerce/money";
import BrandGlyph from "@/components/brand/BrandGlyph";

/**
 * Branded handoff boundary. The bespoke flow ends at the cart; real Shopify
 * supplies cart.checkoutUrl → hosted checkout (UPI · COD · cards). Until the
 * Storefront adapter is wired, this page honestly represents that handoff
 * instead of faking a payment step (premortem #1).
 */
export default function CheckoutPage() {
  const { cart } = useCart();
  const lines = cart?.lines ?? [];

  return (
    <div className="container-narrow py-16 md:py-24">
      <div className="flex flex-col items-start">
        <BrandGlyph className="mb-6 h-10 w-auto" />
        <p className="type-label mb-3 text-ink-2">Secure Checkout</p>
        <h1 className="type-display-xl">
          One step from <span className="text-red">the work.</span>
        </h1>

        {lines.length > 0 && cart ? (
          <div className="mt-8 w-full border border-line">
            <ul className="divide-y divide-line">
              {lines.map((line) => (
                <li key={line.id} className="flex justify-between gap-4 px-5 py-4">
                  <span className="text-ink">
                    {line.merchandise.productTitle}
                    <span className="text-muted">
                      {" "}
                      ×{line.quantity}
                    </span>
                  </span>
                  <span className="type-price text-sm">{formatMoney(line.cost.totalAmount)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-line px-5 py-4">
              <span className="type-label text-ink-2">Subtotal</span>
              <span className="type-price">{formatMoney(cart.cost.subtotalAmount)}</span>
            </div>
          </div>
        ) : (
          <p className="type-body-lg mt-6 text-ink-2">Your cart is empty.</p>
        )}

        <div className="mt-8 w-full rounded-[3px] bg-seamless px-5 py-4">
          <p className="type-body-sm text-ink-2">
            Payment connects via secure Shopify checkout — UPI, cash on delivery,
            and cards — once the Storefront backend is linked. No card details are
            handled here.
          </p>
        </div>

        <Link
          href="/cart"
          className="type-label mt-8 inline-flex text-ink hover:text-red"
        >
          ← Back to cart
        </Link>
      </div>
    </div>
  );
}
