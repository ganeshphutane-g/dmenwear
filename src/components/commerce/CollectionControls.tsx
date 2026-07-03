"use client";

import { useId, useMemo, useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { COLOR_SWATCHES } from "@/lib/commerce/config";
import ProductCard from "./ProductCard";

/**
 * PLP controls: derives size/colour facets from the product set, owns the
 * filter + sort state, and renders the resulting grid. Filters are AND across
 * facet types, OR within a facet; empty selection matches everything. On small
 * screens the facet bar collapses behind a keyboard-operable "Filters" toggle.
 */

type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
];

const SIZE_ORDER = ["S", "M", "L", "XL", "XXL", "One Size"];

function optionValues(products: Product[], optionName: string): string[] {
  const seen = new Set<string>();
  for (const p of products) {
    const opt = p.options.find((o) => o.name === optionName);
    for (const v of opt?.values ?? []) seen.add(v);
  }
  return [...seen];
}

function priceOf(p: Product): number {
  return Number(p.priceRange.minVariantPrice.amount);
}

export default function CollectionControls({ products }: { products: Product[] }) {
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [colours, setColours] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortKey>("featured");
  const [open, setOpen] = useState(false);

  const sortId = useId();
  const panelId = useId();

  const sizeOptions = useMemo(() => {
    const vals = optionValues(products, "Size");
    return vals.sort((a, b) => {
      const ia = SIZE_ORDER.indexOf(a);
      const ib = SIZE_ORDER.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [products]);

  const colourOptions = useMemo(() => optionValues(products, "Color"), [products]);

  const visible = useMemo(() => {
    const matched = products.filter((p) =>
      p.variants.some((v) => {
        const size = v.selectedOptions.find((o) => o.name === "Size")?.value;
        const colour = v.selectedOptions.find((o) => o.name === "Color")?.value;
        const sizeOk = sizes.size === 0 || (size !== undefined && sizes.has(size));
        const colourOk = colours.size === 0 || (colour !== undefined && colours.has(colour));
        return sizeOk && colourOk;
      }),
    );

    const sorted = [...matched];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => Number(b.tags.includes("new")) - Number(a.tags.includes("new")));
        break;
      case "price-asc":
        sorted.sort((a, b) => priceOf(a) - priceOf(b));
        break;
      case "price-desc":
        sorted.sort((a, b) => priceOf(b) - priceOf(a));
        break;
      default:
        break;
    }
    return sorted;
  }, [products, sizes, colours, sort]);

  function toggle(set: Set<string>, value: string, apply: (next: Set<string>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    apply(next);
  }

  const activeCount = sizes.size + colours.size;

  return (
    <div>
      {/* Control bar */}
      <div className="border-b border-line pb-6">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile filters toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            className="type-label inline-flex min-h-[44px] items-center gap-2 border border-ink px-4 text-ink md:hidden"
          >
            Filters
            {activeCount > 0 && (
              <span className="type-micro rounded-full bg-ink px-1.5 py-0.5 text-white">
                {activeCount}
              </span>
            )}
          </button>

          {/* Sort — always visible */}
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor={sortId} className="type-label text-muted">
              Sort
            </label>
            <select
              id={sortId}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="type-body-sm min-h-[44px] border border-line bg-surface px-3 text-ink focus-visible:border-ink"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Facet chips — collapsible on mobile, always shown md+ */}
        <div
          id={panelId}
          className={`${open ? "block" : "hidden"} mt-6 flex flex-col gap-6 md:mt-6 md:flex md:flex-row md:flex-wrap md:items-start md:gap-x-12 md:gap-y-6`}
        >
          {sizeOptions.length > 0 && (
            <fieldset>
              <legend className="type-label mb-3 text-muted">Size</legend>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((value) => {
                  const on = sizes.has(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(sizes, value, setSizes)}
                      className={`type-label inline-flex min-h-[44px] min-w-[44px] items-center justify-center border px-3 transition-colors ${
                        on ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink hover:border-ink"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {colourOptions.length > 0 && (
            <fieldset>
              <legend className="type-label mb-3 text-muted">Colour</legend>
              <div className="flex flex-wrap gap-2">
                {colourOptions.map((value) => {
                  const on = colours.has(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(colours, value, setColours)}
                      className={`type-label inline-flex min-h-[44px] items-center gap-2 border px-3 transition-colors ${
                        on ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink hover:border-ink"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="block h-4 w-4 rounded-full border border-line"
                        style={{ backgroundColor: COLOR_SWATCHES[value] ?? "#CCCCCC" }}
                      />
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
        </div>
      </div>

      {/* Result count */}
      <p className="type-body-sm mt-6 text-muted" aria-live="polite">
        {visible.length} {visible.length === 1 ? "piece" : "pieces"}
      </p>

      {/* Grid — keyed by the filter/sort signature so each result set
          remounts with a brief 200ms rise (feels instant but composed) */}
      {visible.length > 0 ? (
        <div
          key={`${[...sizes].sort().join(",")}|${[...colours].sort().join(",")}|${sort}`}
          className="plp-swap dim-siblings mt-6 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
        >
          {visible.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="mt-12 max-w-[28rem]">
          <p className="type-h3 text-ink">Nothing here yet.</p>
          <p className="type-body-lg mt-2 text-muted">
            The relentless don&rsquo;t stop &mdash; try another size or colour.
          </p>
        </div>
      )}
    </div>
  );
}
