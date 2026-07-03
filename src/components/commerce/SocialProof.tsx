import type { ReviewSummary } from "@/lib/commerce/types";

/** Inline star row filled to `value` (0–5). Stars in ink; never fabricated. */
function Stars({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className="relative inline-block leading-none"
      style={{ fontSize: "0.875rem", letterSpacing: "0.05em" }}
      aria-hidden="true"
    >
      <span className="text-line">★★★★★</span>
      <span
        className="absolute inset-0 overflow-hidden text-ink"
        style={{ width: `${pct}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}

/**
 * Honest social proof. With reviews → stars + average + count.
 * With ZERO reviews → a first-class "founders-era" state, never a fake 0★ slot
 * and never invented reviews (premortem #12).
 */
export default function SocialProof({
  reviews,
  className = "",
}: {
  reviews: ReviewSummary;
  className?: string;
}) {
  if (reviews.count === 0) {
    return (
      <span className={`type-micro inline-flex items-center gap-1.5 text-muted ${className}`}>
        <span className="text-red" aria-hidden="true">
          ◆
        </span>
        Among the first to wear it
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Stars value={reviews.average} />
      <span className="type-micro text-ink-2">
        {reviews.average.toFixed(1)}
        <span className="text-muted"> · {reviews.count} reviews</span>
      </span>
    </span>
  );
}
