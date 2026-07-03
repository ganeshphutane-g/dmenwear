import type { NextConfig } from "next";

/**
 * Native Next.js (hosted on Vercel) — full SSR/ISR + built-in image
 * optimization, no basePath. (The earlier GitHub-Pages static-export config
 * was removed when hosting moved to Vercel so the repo can stay private.)
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Ready for the Shopify CDN when real photography replaces placeholders.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

export default nextConfig;
