/**
 * Thin, swappable analytics shim. Pushes a typed event to window.dataLayer
 * (GA4 / GTM-ready) and logs in dev. Replace the body with a real provider
 * (GA4, Plausible, Shopify analytics) without touching call sites.
 */

export type AnalyticsEvent =
  | "view_item"
  | "size_selected"
  | "swatch_changed"
  | "pincode_checked"
  | "add_to_cart"
  | "begin_checkout"
  | "newsletter_signup"
  | "notify_me";

export function track(
  event: AnalyticsEvent,
  props: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  const payload = { event, ...props };
  const w = window as unknown as { dataLayer?: unknown[] };
  if (!Array.isArray(w.dataLayer)) w.dataLayer = [];
  w.dataLayer.push(payload);
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, props);
  }
}
