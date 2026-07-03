"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product, ProductVariant } from "@/lib/commerce/types";
import { COLOR_SWATCHES, LOW_STOCK_THRESHOLD } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";
import { track } from "@/lib/analytics";
import { useDialog } from "@/lib/useDialog";
import Price from "./Price";
import SocialProof from "./SocialProof";
import AddToCartButton from "./AddToCartButton";
import PincodeCheck from "./PincodeCheck";

function findVariant(
  product: Product,
  color: string | null,
  size: string | null,
): ProductVariant | null {
  return (
    product.variants.find((v) =>
      v.selectedOptions.every((o) => {
        if (o.name === "Color") return color === null || o.value === color;
        if (o.name === "Size") return size === null || o.value === size;
        return true;
      }),
    ) ?? null
  );
}

export default function ProductBuyBox({ product }: { product: Product }) {
  const colorOption = product.options.find((o) => o.name === "Color");
  const sizeOption = product.options.find((o) => o.name === "Size");
  const hasColors = Boolean(colorOption);
  const isOneSize = !sizeOption || (sizeOption.values.length === 1 && sizeOption.values[0] === "One Size");

  const [color, setColor] = useState<string | null>(colorOption ? colorOption.values[0] : null);
  const [size, setSize] = useState<string | null>(isOneSize ? "One Size" : null);
  const [showGuide, setShowGuide] = useState(false);
  const [stuck, setStuck] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const guideRef = useDialog<HTMLDivElement>(showGuide, () => setShowGuide(false));

  // Model height: derive ft+in from total inches so rounding carries (no 5'12").
  const totalInches = Math.round(product.modelHeightCm / 2.54);
  const modelFt = Math.floor(totalInches / 12);
  const modelIn = totalInches % 12;

  // view_item once per product.
  useEffect(() => {
    track("view_item", { handle: product.handle, title: product.title });
  }, [product.handle, product.title]);

  // Mobile sticky bar appears once the inline CTA scrolls out of view.
  useEffect(() => {
    const node = ctaRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const selectedVariant = useMemo(() => {
    if (!isOneSize && !size) return null;
    return findVariant(product, color, isOneSize ? "One Size" : size);
  }, [product, color, size, isOneSize]);

  const sizeAvailability = useMemo(() => {
    const map = new Map<string, ProductVariant | null>();
    sizeOption?.values.forEach((s) => map.set(s, findVariant(product, color, s)));
    return map;
  }, [product, color, sizeOption]);

  const lowStock =
    selectedVariant && selectedVariant.availableForSale && selectedVariant.quantityAvailable <= LOW_STOCK_THRESHOLD
      ? selectedVariant.quantityAvailable
      : null;

  const needsSize = !isOneSize && !size;
  const soldOutVariant = Boolean(selectedVariant && !selectedVariant.availableForSale);
  const addDisabled = needsSize || soldOutVariant || !selectedVariant;
  const addLabel = needsSize
    ? "Select a Size"
    : soldOutVariant
      ? "Notify Me When It Drops"
      : "Add to Cart";

  function chooseColor(name: string) {
    setColor(name);
    track("swatch_changed", { handle: product.handle, color: name });
  }
  function chooseSize(s: string) {
    setSize(s);
    track("size_selected", { handle: product.handle, size: s });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="type-h3">{product.title}</h1>
        <p className="mt-1 text-ink-2">{product.brandStrap}</p>
      </div>

      <SocialProof reviews={product.reviews} />

      <Price
        price={selectedVariant?.price ?? product.priceRange.minVariantPrice}
        compareAtPrice={selectedVariant?.compareAtPrice ?? null}
        className="text-xl"
      />
      <p className="type-micro -mt-4 text-muted">Inclusive of all taxes</p>

      {hasColors && colorOption && (
        <div>
          <p className="type-label mb-2 text-ink-2">
            Colour: <span className="text-ink">{color}</span>
          </p>
          <div className="flex gap-2.5">
            {colorOption.values.map((name) => (
              <button
                key={name}
                type="button"
                aria-label={name}
                aria-pressed={color === name}
                onClick={() => chooseColor(name)}
                title={name}
                className={`relative h-9 w-9 rounded-full border transition-[box-shadow] ${
                  color === name ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-base" : "border-line"
                }`}
                style={{ backgroundColor: COLOR_SWATCHES[name] ?? "var(--color-line)" }}
              >
                {color === name && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red ring-1 ring-base" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isOneSize && sizeOption && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="type-label text-ink-2">Size</p>
            <button
              type="button"
              onClick={() => setShowGuide(true)}
              className="type-label text-ink-2 underline underline-offset-4 hover:text-red"
            >
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizeOption.values.map((s) => {
              const v = sizeAvailability.get(s);
              const available = Boolean(v?.availableForSale);
              const selected = size === s;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={!available}
                  aria-pressed={selected}
                  aria-label={`Size ${s}${available ? "" : ", sold out"}`}
                  onClick={() => chooseSize(s)}
                  className={`relative min-h-11 min-w-11 border px-3 type-label transition-colors ${
                    selected
                      ? "border-ink bg-ink text-white"
                      : available
                        ? "border-line text-ink hover:border-ink"
                        : "cursor-not-allowed border-line text-muted line-through"
                  }`}
                >
                  {s}
                  {selected && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-[3px] bg-seamless px-4 py-3">
        <p className="type-body-sm text-ink">
          Runs true to size · Built to move with you.{" "}
          <span className="text-ink-2">Between sizes? Size up.</span>
        </p>
        {product.fitType !== "One Size" && product.modelHeightCm > 0 && (
          <p className="type-micro mt-1 text-muted">
            Model {modelFt}&apos;{modelIn}&quot; · wears {product.modelSizeWorn} ·{" "}
            {product.fitType} fit
          </p>
        )}
      </div>

      {lowStock !== null && (
        <p className="type-label text-red">
          Only {lowStock} left{!isOneSize && size ? ` in ${size}` : ""}.
        </p>
      )}

      {/* Primary CTA — always full red, exempt from red budget */}
      <div ref={ctaRef} className="flex flex-col gap-3">
        <AddToCartButton
          variantId={addDisabled ? null : selectedVariant!.id}
          disabled={addDisabled}
          soldOutLabel={addLabel}
          label="Add to Cart"
          className="w-full"
        />
        <button
          type="button"
          className="type-label w-full border-[1.5px] border-ink py-4 text-ink transition-colors hover:bg-ink hover:text-white disabled:border-line disabled:text-muted"
          disabled={addDisabled}
        >
          Buy Now
        </button>
      </div>

      <PincodeCheck variantId={selectedVariant?.id ?? null} />
      <ul className="type-micro grid grid-cols-2 gap-2 text-ink-2">
        <li>✓ Cash on delivery available</li>
        <li>✓ Free 7-day returns</li>
        <li>✓ Secure payment</li>
        <li>✓ Delivered to your door</li>
      </ul>

      {/* Size guide modal */}
      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
          onClick={() => setShowGuide(false)}
        >
          <div
            ref={guideRef}
            role="dialog"
            aria-modal="true"
            aria-label="Size guide"
            tabIndex={-1}
            className="w-full max-w-md bg-surface p-6 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="type-h4">Size Guide</h2>
              <button type="button" onClick={() => setShowGuide(false)} aria-label="Close" className="text-ink-2 hover:text-ink">
                ✕
              </button>
            </div>
            <p className="type-body-sm text-ink-2">
              Measure a tee that fits you well, flat, and compare. Chest is measured
              pit-to-pit and doubled. Full per-size chart (in + cm) lands with the
              product shoot.
            </p>
            <p className="type-micro mt-4 text-muted">Fit: {product.specs.fit}</p>
          </div>
        </div>
      )}

      {/* Mobile sticky add-to-cart bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface px-4 py-3 transition-transform duration-300 ease-[var(--ease-in-out-soft)] md:hidden ${
          stuck ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 grow">
            <p className="truncate text-sm font-semibold text-ink">{product.title}</p>
            <p className="type-micro text-muted">
              {formatMoney(selectedVariant?.price ?? product.priceRange.minVariantPrice)}
              {size && !isOneSize ? ` · ${size}` : ""}
            </p>
          </div>
          <AddToCartButton
            variantId={addDisabled ? null : selectedVariant!.id}
            disabled={addDisabled}
            soldOutLabel={addLabel}
            label="Add to Cart"
            className="shrink-0 px-6 py-3"
          />
        </div>
      </div>
    </div>
  );
}
