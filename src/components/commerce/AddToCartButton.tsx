"use client";

import { useState } from "react";
import { useCart } from "@/lib/commerce/store";

/**
 * Primary commerce action. Per the amended red rule, this CTA is ALWAYS full red
 * and is exempt from the per-viewport red budget. Optimistic: shows a checkmark
 * within ~50ms; the cart badge + drawer update via the store.
 */
export default function AddToCartButton({
  variantId,
  disabled = false,
  label = "Add to Cart",
  soldOutLabel = "Notify Me When It Drops",
  quantity = 1,
  className = "",
}: {
  variantId: string | null;
  disabled?: boolean;
  label?: string;
  soldOutLabel?: string;
  quantity?: number;
  className?: string;
}) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  if (disabled || !variantId) {
    return (
      <button
        type="button"
        disabled
        className={`type-label inline-flex items-center justify-center border-[1.5px] border-line px-8 py-4 text-muted ${className}`}
      >
        {soldOutLabel}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setJustAdded(true);
        void addItem(variantId, quantity);
        window.setTimeout(() => setJustAdded(false), 1400);
      }}
      aria-label={label}
      className={`type-label inline-flex items-center justify-center gap-2 bg-red px-8 py-4 text-white transition-[background-color,transform] duration-150 ease-[var(--ease-out-decisive)] hover:bg-red-hover active:scale-[0.98] ${className}`}
    >
      {justAdded ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none">
            <path
              d="M2 7.5L5.5 11L12 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Added
        </>
      ) : (
        label
      )}
    </button>
  );
}
