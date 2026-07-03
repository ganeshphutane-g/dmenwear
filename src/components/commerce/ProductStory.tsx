import BrandGlyph from "@/components/brand/BrandGlyph";
import ProductMedia from "@/components/commerce/ProductMedia";
import type { Product, ProductImage } from "@/lib/commerce/types";

/**
 * ProductStory — A+-content-style editorial brand modules for the PDP.
 *
 * Two alternating bands pair an honest ProductMedia placeholder with a text block,
 * image side flipping per band (asymmetric, hand-built — not a centered template).
 *  - Band 1 "Built for the grind": builtFor proof + concrete specs (gsm, fabric).
 *  - Band 2 manifesto moment ("A Uniform for the Relentless") + a making-of note.
 *
 * Server component. Red is disciplined: one thin rule OR one accent word per band,
 * never a fill. Honest placeholders only — no fabricated imagery (anti-slop gate).
 */
export default function ProductStory({ product }: { product: Product }) {
  // Up to two honest proof points; fall back to nothing rather than inventing copy.
  const builtForPoints = product.builtFor.slice(0, 2);

  // Reuse real product images where present; otherwise an honest labelled placeholder.
  const gridImage: ProductImage =
    product.images[1] ??
    product.featuredImage ?? {
      url: "",
      altText: `${product.title} on the floor — detail`,
      width: 1200,
      height: 1500,
      provenance: "placeholder",
    };

  const makingImage: ProductImage =
    product.images[2] ??
    product.featuredImage ?? {
      url: "",
      altText: `${product.title} construction — flatlock seams`,
      width: 1200,
      height: 1200,
      provenance: "placeholder",
    };

  return (
    <section
      aria-label={`${product.title} — the story`}
      className="container-wide py-20 sm:py-28"
    >
      {/* Band 1 — Built for the grind. Image LEFT, text RIGHT (off-center). */}
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6 xl:col-span-5">
          <ProductMedia
            image={gridImage}
            ratio="4/5"
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="border border-line"
          />
        </div>

        <div className="lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
          <span className="type-label text-muted">Built for the grind</span>
          <div className="mt-4 h-0.5 w-10 bg-red" aria-hidden="true" />
          <h2 className="type-display-xl mt-5 text-ink">
            Proof, not promises.
          </h2>

          {builtForPoints.length > 0 && (
            <ul className="mt-6 space-y-3">
              {builtForPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <BrandGlyph className="mt-1 h-4 w-auto shrink-0" />
                  <span className="type-body-lg text-ink-2">{point}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Concrete spec proof — the numbers do the convincing. */}
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line">
            <div className="bg-surface p-5">
              <dt className="type-label text-muted">Weight</dt>
              <dd className="type-h3 mt-1 text-ink">{product.specs.gsm}</dd>
            </div>
            <div className="bg-surface p-5">
              <dt className="type-label text-muted">Fabric</dt>
              <dd className="type-h4 mt-1 text-ink">{product.specs.fabric}</dd>
            </div>
            <div className="bg-surface p-5">
              <dt className="type-label text-muted">Fit</dt>
              <dd className="type-h4 mt-1 text-ink">{product.specs.fit}</dd>
            </div>
            <div className="bg-surface p-5">
              <dt className="type-label text-muted">Worn by model</dt>
              <dd className="type-h4 mt-1 text-ink">
                {product.modelSizeWorn} · {product.modelHeightCm}cm
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Band 2 — Manifesto. Image RIGHT, text LEFT (mirror the asymmetry). */}
      <div className="mt-24 grid items-center gap-10 sm:mt-32 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6 xl:col-span-6 lg:order-2 lg:col-start-7">
          <ProductMedia
            image={makingImage}
            ratio="1/1"
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="border border-line"
          />
        </div>

        <div className="lg:order-1 lg:col-span-6 xl:col-span-5">
          <span className="type-label text-muted">Mindset · Hustle</span>
          <h2 className="type-display-xl mt-4 text-ink">
            A uniform for the <span className="text-red">relentless</span>.
          </h2>
          <p className="type-body-lg mt-6 max-w-prose text-ink-2">
            You do not rise on motivation. You rise on the days you did not feel
            like it. This is the kit you reach for then — the same weight, the
            same fit, every session. It asks nothing of you but the work.
          </p>

          {/* Making-of note — concrete, present-tense, no vibe-words. */}
          <div className="mt-8 border-l-2 border-line pl-5">
            <span className="type-label text-muted">Making the uniform</span>
            <p className="type-body-sm mt-2 max-w-prose text-ink-2">
              Cut from {product.specs.gsm} {product.specs.fabric}. Seams run
              flatlock so they sit flat under load and do not chafe through a
              heavy set. {product.specs.care} — built to hold its shape past the
              hundredth wash.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
