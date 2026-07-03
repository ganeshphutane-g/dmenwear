import type { Money } from "./types";

export const CURRENCY = "INR" as const;

export const inr = (n: number): Money => ({
  amount: n.toFixed(2),
  currencyCode: CURRENCY,
});

/**
 * Store-wide constants. Several are OWNER-CONFIRMED launch values (premortem):
 * model the free-shipping threshold against the ₹699 single-SKU floor so a
 * one-item order isn't framed as "incomplete". Placeholder until confirmed.
 */
export const FREE_SHIPPING_THRESHOLD = inr(1499); // TODO(owner): confirm vs real AOV
export const LOW_STOCK_THRESHOLD = 8; // show "Only N left" at/below this

/** Named colors → swatch hex. Swatches always carry the NAME in text too (a11y). */
export const COLOR_SWATCHES: Record<string, string> = {
  Blackout: "#0E0E0E",
  Bone: "#EDEAE3",
  "Blood Red": "#BF2626",
  Steel: "#6B7177",
};
