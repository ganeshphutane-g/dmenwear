import Image from "next/image";
import type { ProductImage } from "@/lib/commerce/types";
import BrandGlyph from "@/components/brand/BrandGlyph";

/**
 * Renders product media with a fixed aspect-ratio box (CLS-safe).
 * When provenance is "placeholder" (no real photography yet) it shows an honest,
 * on-brand placeholder — NEVER AI/stock imagery (premortem content gate / anti-slop).
 */
export default function ProductMedia({
  image,
  ratio = "3/4",
  sizes,
  priority = false,
  className = "",
}: {
  image: ProductImage;
  ratio?: "3/4" | "1/1" | "4/5";
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  // Default guards against next/image fill downloading a 100vw asset for a thumbnail.
  const resolvedSizes = sizes ?? "(min-width: 1024px) 25vw, 50vw";
  const isPlaceholder = image.provenance === "placeholder" || !image.url;
  return (
    <div
      className={`relative overflow-hidden bg-seamless ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {isPlaceholder ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
          <BrandGlyph className="h-9 w-auto opacity-15" />
          <span className="type-micro text-muted">{image.altText}</span>
          <span className="type-label text-[0.625rem] text-muted">Visual pending</span>
        </div>
      ) : (
        <Image
          src={image.url}
          alt={image.altText}
          fill
          sizes={resolvedSizes}
          priority={priority}
          className="object-cover"
        />
      )}
    </div>
  );
}
