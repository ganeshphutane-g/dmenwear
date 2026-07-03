import Link from "next/link";
import BrandGlyph from "@/components/brand/BrandGlyph";
import ProductMedia from "@/components/commerce/ProductMedia";
import Price from "@/components/commerce/Price";
import { addMoney, formatMoney } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";

/**
 * "Build the Kit" editorial module. Curates up to 3 passed products into one
 * coordinated set. Asymmetric layout: a standing intro column on the left, one
 * dominant lead item, then two supporting items. Kit total is an honest sum of
 * each product's minimum variant price — no fabricated bundle discount.
 */
export default function CompleteTheKit({ products }: { products: Product[] }) {
  const kit = products.slice(0, 3);
  if (kit.length === 0) return null;

  const kitTotal = kit
    .slice(1)
    .reduce(
      (sum, p) => addMoney(sum, p.priceRange.minVariantPrice),
      kit[0].priceRange.minVariantPrice,
    );

  const [lead, ...rest] = kit;

  return (
    <section
      aria-labelledby="kit-heading"
      className="border-t border-line bg-base"
    >
      <div className="container-wide grid gap-y-12 py-20 lg:grid-cols-12 lg:gap-x-12 lg:py-28">
        {/* Intro column — left, narrow, standing copy */}
        <div className="lg:col-span-4 lg:pr-6">
          <p className="type-label flex items-center gap-2 text-muted">
            <BrandGlyph className="h-4 w-auto" />
            The Kit
          </p>
          <h2 id="kit-heading" className="type-h2 mt-5 text-ink">
            Build the <span className="text-red">kit</span>
          </h2>
          <p className="type-body-lg mt-5 max-w-sm text-ink-2">
            Three pieces that train together. Same fit logic, same fabric
            discipline, nothing to second-guess on the floor.
          </p>

          <dl className="mt-10 border-t border-line pt-6">
            <dt className="type-label text-muted">Kit total</dt>
            <dd className="type-display-xl mt-2 text-ink">
              {formatMoney(kitTotal)}
            </dd>
            <p className="type-micro mt-3 text-muted">
              Sum of {kit.length} pieces at their starting price. No bundle
              markup, no padded compare-at.
            </p>
          </dl>

          <Link
            href="/collections/all"
            className="type-label ease-[var(--ease-out-decisive)] mt-8 inline-flex min-h-[44px] items-center justify-center bg-red px-7 text-white transition-colors duration-200 hover:bg-red-hover"
          >
            Build the Kit
          </Link>
        </div>

        {/* Items column — right, dominant lead + two supporting */}
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:col-span-8 lg:gap-y-14">
          {/* Lead item spans full width and reads larger */}
          <KitItem
            product={lead}
            index={1}
            className="sm:col-span-2"
            ratioSizes="(min-width: 1024px) 56vw, (min-width: 640px) 90vw, 100vw"
          />
          {rest.map((product, i) => (
            <KitItem
              key={product.id}
              product={product}
              index={i + 2}
              ratioSizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function KitItem({
  product,
  index,
  ratioSizes,
  className = "",
}: {
  product: Product;
  index: number;
  ratioSizes: string;
  className?: string;
}) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className={`group block focus:outline-none ${className}`}
    >
      <div className="relative">
        <ProductMedia
          image={product.featuredImage}
          ratio="3/4"
          sizes={ratioSizes}
          className="ease-[var(--ease-out-decisive)] transition-opacity duration-200 group-hover:opacity-90"
        />
        <span className="type-label absolute left-3 top-3 bg-ink px-2 py-1 text-[0.625rem] text-white">
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <h3 className="type-h4 ease-[var(--ease-out-decisive)] mt-4 text-ink transition-colors duration-120 group-hover:text-red">
        {product.title}
      </h3>
      {product.brandStrap && (
        <p className="type-body-sm mt-1 text-muted">{product.brandStrap}</p>
      )}
      <Price price={product.priceRange.minVariantPrice} className="mt-2" />
    </Link>
  );
}
