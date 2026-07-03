import BrandGlyph from "@/components/brand/BrandGlyph";
import SocialProof from "@/components/commerce/SocialProof";
import type { Product } from "@/lib/commerce/types";

/**
 * Honest PDP reviews block (server component).
 *
 * NO fabrication: we never invent review text, authors, photos, stars, or a
 * rating distribution. We show only what we genuinely know — the verified
 * count + average (via SocialProof) and the product-known fitType, which drives
 * the 3-stop fit-confidence marker. Written reviews are gated to launch.
 *
 * The fit marker reads fitType honestly: Compression/Athletic lean "runs small",
 * Relaxed leans "runs large", everything else sits on "true to size".
 */

type FitStop = 0 | 1 | 2; // 0 = runs small, 1 = true to size, 2 = runs large

function fitStopFor(fitType: Product["fitType"]): FitStop {
  switch (fitType) {
    case "Compression":
      return 0; // compression genuinely runs small
    case "Relaxed":
      return 2;
    default:
      return 1; // Athletic/Regular/One Size read true to size (matches the buy box)
  }
}

const STOP_LABELS = ["Runs small", "True to size", "Runs large"] as const;

function FitConfidence({ fitType }: { fitType: Product["fitType"] }) {
  const active = fitStopFor(fitType);
  const activeLabel = STOP_LABELS[active];

  return (
    <div>
      <p className="type-label text-muted">Fit confidence</p>
      <p className="type-h4 mt-2 text-ink">
        Marked <span className="text-red">{activeLabel.toLowerCase()}</span>
      </p>
      <p className="type-body-sm mt-1 text-ink-2">
        Based on the {fitType} cut. Not a vote — this is how the pattern is built.
      </p>

      {/* Track */}
      <div
        className="relative mt-6 h-[3px] w-full bg-line"
        role="img"
        aria-label={`Fit runs from runs small to runs large. This product is marked ${activeLabel}.`}
      >
        <span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red ring-4 ring-base"
          style={{ left: active === 0 ? "0%" : active === 2 ? "100%" : "50%" }}
          aria-hidden="true"
        />
      </div>

      {/* Stops */}
      <ul className="mt-3 flex justify-between" aria-hidden="true">
        {STOP_LABELS.map((label, i) => (
          <li
            key={label}
            className={
              "type-micro " +
              (i === active ? "font-semibold text-ink" : "text-muted") +
              (i === 0 ? " text-left" : i === 2 ? " text-right" : " text-center")
            }
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProductReviews({ product }: { product: Product }) {
  const { reviews, fitType } = product;
  const hasReviews = reviews.count > 0;

  return (
    <section aria-labelledby="reviews-heading" className="container-wide py-16 md:py-24">
      <div className="flex items-end gap-3">
        <BrandGlyph className="h-5 w-auto" />
        <h2 id="reviews-heading" className="type-h2 text-ink">
          Reviews
        </h2>
      </div>

      <div className="mt-10 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
        {/* LEFT — what we honestly know */}
        <div>
          {hasReviews ? (
            <>
              <div className="flex items-end gap-5">
                <span className="type-display-xl leading-none text-ink">
                  {reviews.average.toFixed(1)}
                </span>
                <div className="pb-2">
                  <SocialProof reviews={reviews} />
                  <p className="type-body-sm mt-2 text-ink-2">
                    From {reviews.count}{" "}
                    {reviews.count === 1 ? "verified buyer" : "verified buyers"}.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-l-2 border-line pl-5">
                <p className="type-label text-muted">Straight with you</p>
                <p className="type-body-lg mt-2 max-w-[46ch] text-ink-2">
                  We publish the rating the moment it's real. Written reviews from
                  these buyers roll out as we open them at launch — no recycled
                  copy, no borrowed faces.
                </p>
              </div>
            </>
          ) : (
            <div className="border-l-2 border-red pl-5">
              <p className="type-label text-muted">Founders era</p>
              <h3 className="type-h3 mt-2 max-w-[20ch] text-ink">
                No reviews yet. Someone goes first.
              </h3>
              <p className="type-body-lg mt-3 max-w-[46ch] text-ink-2">
                This piece is new. We won't pad the page with invented praise —
                the first words here will be from a real buyer who trained in it.
                Make them yours.
              </p>
            </div>
          )}

          <div className="mt-8">
            <button
              type="button"
              className="type-label inline-flex min-h-[44px] items-center rounded-[3px] border border-ink px-6 text-ink transition-colors duration-200 ease-[var(--ease-out-decisive)] hover:bg-ink hover:text-base focus-visible:bg-ink focus-visible:text-base"
            >
              Write a review
            </button>
          </div>
        </div>

        {/* RIGHT — product-known fit confidence */}
        <div className="lg:border-l lg:border-line lg:pl-16">
          <FitConfidence fitType={fitType} />
        </div>
      </div>
    </section>
  );
}
