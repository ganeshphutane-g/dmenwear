import type { Money } from "./types";

/**
 * Single source of truth for price formatting. en-IN, currency-aware,
 * no decimals for whole-rupee pricing. Never format money inline in components.
 */
const formatters = new Map<string, Intl.NumberFormat>();

function getFormatter(currencyCode: string): Intl.NumberFormat {
  let f = formatters.get(currencyCode);
  if (!f) {
    f = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    });
    formatters.set(currencyCode, f);
  }
  return f;
}

export function formatMoney(money: Money): string {
  return getFormatter(money.currencyCode).format(Number(money.amount));
}

/** Whole-number percent saved, or null when there is no genuine discount. */
export function savingsPercent(
  price: Money,
  compareAtPrice: Money | null,
): number | null {
  if (!compareAtPrice) return null;
  const p = Number(price.amount);
  const c = Number(compareAtPrice.amount);
  if (!(c > p)) return null;
  return Math.round(((c - p) / c) * 100);
}

export function addMoney(a: Money, b: Money): Money {
  return {
    amount: (Number(a.amount) + Number(b.amount)).toFixed(2),
    currencyCode: a.currencyCode,
  };
}

export function multiplyMoney(a: Money, qty: number): Money {
  return {
    amount: (Number(a.amount) * qty).toFixed(2),
    currencyCode: a.currencyCode,
  };
}

export const zeroMoney = (currencyCode: Money["currencyCode"]): Money => ({
  amount: "0.00",
  currencyCode,
});

/** Goal-gradient helper — keeps free-shipping math out of components. */
export function freeShipProgress(
  subtotal: Money,
  threshold: Money,
): { progress: number; remaining: Money } {
  const sub = Number(subtotal.amount);
  const thr = Number(threshold.amount);
  const remaining = Math.max(0, thr - sub);
  const progress = thr > 0 ? Math.min(1, sub / thr) : 1;
  return {
    progress,
    remaining: { amount: remaining.toFixed(2), currencyCode: subtotal.currencyCode },
  };
}
