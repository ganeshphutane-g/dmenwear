import type { Money } from "@/lib/commerce/types";
import { formatMoney, savingsPercent } from "@/lib/commerce/money";

/**
 * Price block. Red "Save X%" tag appears ONLY for a genuine discount.
 * Struck MRP in muted, selling price in ink.
 */
export default function Price({
  price,
  compareAtPrice = null,
  className = "",
}: {
  price: Money;
  compareAtPrice?: Money | null;
  className?: string;
}) {
  const saved = savingsPercent(price, compareAtPrice);
  return (
    <span className={`type-price inline-flex items-baseline gap-2 ${className}`}>
      <span className="text-ink">{formatMoney(price)}</span>
      {saved !== null && compareAtPrice && (
        <>
          <s className="text-muted">
            <span className="sr-only">Original price </span>
            {formatMoney(compareAtPrice)}
          </s>
          <span className="type-label rounded-[3px] bg-red px-1.5 py-0.5 text-[0.6875rem] text-white">
            Save {saved}%
          </span>
        </>
      )}
    </span>
  );
}
