import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import { COLOR_SWATCHES, LOW_STOCK_THRESHOLD } from "@/lib/commerce/config";
import ProductMedia from "./ProductMedia";
import Price from "./Price";
import SocialProof from "./SocialProof";
import QuickAdd from "./QuickAdd";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const href = `/products/${product.handle}`;
  const colors = product.options.find((o) => o.name === "Color")?.values ?? [];
  const totalAvailable = product.variants
    .filter((v) => v.availableForSale)
    .reduce((n, v) => n + v.quantityAvailable, 0);
  const sellingFast = totalAvailable > 0 && totalAvailable <= LOW_STOCK_THRESHOLD;
  const isNew = product.tags.includes("new");
  const isBest = product.tags.includes("bestseller");

  return (
    <article className="group dim-item flex flex-col">
      <div className="relative">
        <Link href={href} aria-label={product.title} className="block overflow-hidden">
          {/* Slow, subtle zoom on hover — transform only, clipped by the Link */}
          <ProductMedia
            image={product.featuredImage}
            sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw"
            priority={priority}
            className="transition-transform duration-500 ease-[var(--ease-out-decisive)] group-hover:scale-[1.04]"
          />
        </Link>

        {/* one badge max, top-left */}
        {(isNew || isBest) && (
          <span
            className={`type-label absolute left-3 top-3 rounded-[3px] px-2 py-1 text-[0.625rem] ${
              isNew ? "bg-ink text-white" : "border border-ink bg-base text-ink"
            }`}
          >
            {isNew ? "New" : "Bestseller"}
          </span>
        )}
        {sellingFast && (
          <span className="type-label absolute right-3 top-3 rounded-[3px] bg-red-tint px-2 py-1 text-[0.625rem] text-red">
            Selling fast
          </span>
        )}
      </div>

      <div className="flex grow flex-col gap-2 pt-4">
        <Link href={href} className="type-h4 leading-tight hover:text-red">
          {product.title}
        </Link>
        <Price price={product.priceRange.minVariantPrice} />
        <SocialProof reviews={product.reviews} />

        {colors.length > 0 && (
          <ul className="mt-1 flex items-center gap-1.5" aria-label="Available colours">
            {colors.map((name) => (
              <li key={name} title={name}>
                <span
                  className="block h-3.5 w-3.5 rounded-full border border-line"
                  style={{ backgroundColor: COLOR_SWATCHES[name] ?? "var(--color-line)" }}
                />
                <span className="sr-only">{name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop: QuickAdd rises in on hover/focus; touch: always visible.
          Opacity/transform only — the slot keeps its height (no layout shift). */}
      <div className="pt-3 transition-[opacity,transform] duration-200 ease-[var(--ease-out-decisive)] [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
        <QuickAdd product={product} />
      </div>
    </article>
  );
}
