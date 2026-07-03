import type { DeliveryEstimate, DeliveryEstimateProvider } from "./types";
import { inr } from "./config";

/**
 * Mock India delivery/serviceability provider (premortem #6).
 * - Optional & non-blocking on the PDP.
 * - NEVER returns a bare "not serviceable" as scary copy; always reassuring.
 * - Swap for a real Shiprocket/Delhivery/GoKwik adapter later (same interface).
 */

const PINCODE_RE = /^[1-9][0-9]{5}$/;

function formatEtaDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(d);
}

export const mockDeliveryProvider: DeliveryEstimateProvider = {
  async estimate({ pincode }): Promise<DeliveryEstimate> {
    await new Promise((r) => setTimeout(r, 220)); // simulate network

    if (!PINCODE_RE.test(pincode)) {
      return {
        pincode,
        serviceable: false,
        codEligible: false,
        codFee: null,
        prepaidEligible: true,
        etaText: "Enter a 6-digit pincode to see your delivery date.",
        etaDate: null,
      };
    }

    // Deterministic mock: metro-ish pincodes (1xxxxx–6xxxxx) are faster + COD;
    // remote ranges are prepaid-only but still fully serviceable.
    const lead = Number(pincode[0]);
    const codEligible = lead <= 6;
    const fastest = lead <= 4 ? 3 : 5;
    const slowest = fastest + 2;

    return {
      pincode,
      serviceable: true,
      codEligible,
      codFee: codEligible ? inr(49) : null,
      prepaidEligible: true,
      etaText: `Delivers ${formatEtaDate(fastest)} – ${formatEtaDate(slowest)}`,
      etaDate: formatEtaDate(slowest),
    };
  },
};
