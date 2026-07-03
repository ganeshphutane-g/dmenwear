import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mockAdapter } from "@/lib/commerce/adapter";
import { PRODUCTS } from "@/lib/commerce/fixtures";
import ProductMedia from "@/components/commerce/ProductMedia";
import ProductBuyBox from "@/components/commerce/ProductBuyBox";
import ProductReviews from "@/components/commerce/ProductReviews";
import ProductStory from "@/components/commerce/ProductStory";
import ProductCard from "@/components/commerce/ProductCard";
import Reveal from "@/components/motion/Reveal";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await mockAdapter.getProductByHandle(handle);
  if (!product) return { title: "Not found" };
  return { title: product.title, description: product.brandStrap };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await mockAdapter.getProductByHandle(handle);
  if (!product) notFound();

  const isAccessory = product.productType === "Accessory";
  const kitHandles = isAccessory
    ? ["relentless-tee", "hustle-joggers", "cutoff-tank"]
    : ["protein-shaker", "training-socks-3pack", "gym-towel"];
  const kit = (await mockAdapter.getProductsByHandles(kitHandles)).filter(
    (p) => p.handle !== product.handle,
  );

  const inStock = product.variants.some((v) => v.availableForSale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.title,
        description: product.brandStrap,
        brand: { "@type": "Brand", name: "DMEN" },
        category: product.productType,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice: product.priceRange.minVariantPrice.amount,
          highPrice: product.priceRange.maxVariantPrice.amount,
          availability: inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
        // aggregateRating only when genuine — never fabricated
        ...(product.reviews.count > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.reviews.average,
                reviewCount: product.reviews.count,
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://dmenwear.com/" },
          { "@type": "ListItem", position: 2, name: "Shop", item: "https://dmenwear.com/collections/all" },
          {
            "@type": "ListItem",
            position: 3,
            name: product.title,
            item: `https://dmenwear.com/products/${product.handle}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="container-wide pb-24 pt-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="type-micro mb-6 text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="px-1.5">/</span>
        <Link href="/collections/all" className="hover:text-ink">Shop</Link>
        <span className="px-1.5">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <ProductMedia
            image={product.images[0]}
            ratio="4/5"
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
          />
          <div className="mt-3 grid grid-cols-3 gap-3">
            {product.images.slice(1).map((img, i) => (
              <ProductMedia key={i} image={img} ratio="1/1" sizes="20vw" />
            ))}
          </div>
        </div>

        {/* Buy column (sticky on desktop) */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-20">
            <ProductBuyBox product={product} />
          </div>
        </div>
      </div>

      {/* Built For */}
      <section className="mt-16 grid gap-10 border-t border-line pt-12 md:grid-cols-2">
        <div>
          <h2 className="type-h2 mb-5">Built For</h2>
          <ul className="space-y-3">
            {product.builtFor.map((b) => (
              <li key={b} className="flex gap-3 text-ink-2">
                <span className="mt-1 text-red" aria-hidden="true">◆</span>
                <span className="text-ink">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="type-h2 mb-5">The Spec</h2>
          <dl className="divide-y divide-line">
            {[
              ["Fabric", product.specs.fabric],
              ["Weight", product.specs.gsm],
              ["Fit", product.specs.fit],
              ["Care", product.specs.care],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3">
                <dt className="type-label text-ink-2">{k}</dt>
                <dd className="text-right text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* A+-style story (apparel) + honest reviews */}
      {!isAccessory && (
        <Reveal>
          <ProductStory product={product} />
        </Reveal>
      )}
      <Reveal>
        <ProductReviews product={product} />
      </Reveal>

      {/* Complete the Kit */}
      {kit.length > 0 && (
        <section className="mt-16 border-t border-line pt-12">
          <h2 className="type-h2 mb-8">Complete the Kit</h2>
          <div className="dim-siblings grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {kit.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
