"use client";

import { useEffect, useState } from "react";

/** Slim, dismissible. Single message; red only on the number/accent. */
export default function AnnouncementBar() {
  // Default visible so SSR reserves the bar's height (no top-of-page CLS).
  // Only the minority who already dismissed get a one-time hide after hydration.
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("dmen_promo_dismissed") === "1") setDismissed(true);
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative bg-ink text-white">
      <div className="container-wide flex min-h-9 items-center justify-center py-1.5 pr-8 text-center">
        <p className="type-label text-[0.6875rem] text-white/90">
          Join the Relentless — <span className="text-red">10%</span> off your first kit
        </p>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => {
            sessionStorage.setItem("dmen_promo_dismissed", "1");
            setDismissed(true);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
