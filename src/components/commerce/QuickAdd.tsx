"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { useCart } from "@/lib/commerce/store";

/**
 * Card-level quick add. Single-variant products (accessories) add directly;
 * multi-variant products (apparel needs a size) route to the PDP — size choice
 * is never a dropdown and never guessed.
 */
export default function QuickAdd({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const purchasable = product.variants.filter((v) => v.availableForSale);
  const soldOut = purchasable.length === 0;
  const singleVariant = product.variants.length === 1;

  if (soldOut) {
    return (
      <span className="type-label block w-full bg-base/90 py-3 text-center text-muted">
        Sold Out
      </span>
    );
  }

  if (singleVariant) {
    const variant = purchasable[0];
    return (
      <button
        type="button"
        onClick={() => {
          setAdded(true);
          void addItem(variant.id, 1);
          window.setTimeout(() => setAdded(false), 1400);
        }}
        className="type-label block w-full bg-ink py-3 text-center text-white transition-colors hover:bg-red"
      >
        {added ? "Added ✓" : "Quick Add"}
      </button>
    );
  }

  return (
    <Link
      href={`/products/${product.handle}`}
      className="type-label block w-full bg-ink py-3 text-center text-white transition-colors hover:bg-red"
    >
      Select Size
    </Link>
  );
}
