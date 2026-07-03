"use client";

import { useState } from "react";
import { mockDeliveryProvider } from "@/lib/commerce/delivery";
import { track } from "@/lib/analytics";
import type { DeliveryEstimate } from "@/lib/commerce/types";

/**
 * Optional, non-blocking India delivery/COD check (premortem #6).
 * Default state is reassuring national-shipping copy; a date appears only on a
 * successful lookup; never a scary "not serviceable".
 */
export default function PincodeCheck({ variantId }: { variantId: string | null }) {
  const [pincode, setPincode] = useState("");
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    setLoading(true);
    try {
      const res = await mockDeliveryProvider.estimate({
        pincode,
        variantIds: variantId ? [variantId] : [],
      });
      setEstimate(res);
      track("pincode_checked", {
        pincode,
        serviceable: res.serviceable,
        codEligible: res.codEligible,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-t border-line pt-4">
      <div className="flex items-stretch gap-2">
        <label htmlFor="pincode" className="sr-only">
          Delivery pincode
        </label>
        <input
          id="pincode"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter pincode"
          className="w-36 border border-line bg-surface px-3 py-2 text-sm focus:border-ink focus:outline-none"
        />
        <button
          type="button"
          onClick={check}
          disabled={loading || pincode.length !== 6}
          className="type-label border border-ink px-4 py-2 text-ink transition-colors hover:bg-ink hover:text-white disabled:border-line disabled:text-muted"
        >
          {loading ? "…" : "Check"}
        </button>
      </div>
      <p className="type-micro mt-2 text-ink-2">
        {estimate && estimate.serviceable ? (
          <>
            {estimate.etaText}
            {estimate.codEligible ? " · Cash on delivery available" : " · Prepaid only"}
          </>
        ) : estimate && !estimate.serviceable ? (
          estimate.etaText
        ) : (
          "Delivers across India · Cash on delivery available"
        )}
      </p>
    </div>
  );
}
