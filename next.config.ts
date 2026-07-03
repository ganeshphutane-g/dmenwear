import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 * - `output: "export"` emits a fully static site to `out/` (Pages serves files).
 * - `basePath`/`assetPrefix` come from NEXT_PUBLIC_BASE_PATH (set by the Pages
 *   workflow to "/<repo>"); empty locally so `pnpm dev`/`pnpm build` stay clean.
 * - `images.unoptimized` is required by static export (no server image optimizer).
 * - `trailingSlash` makes every route a folder/index.html so Pages routes cleanly.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  basePath,
  images: {
    // Custom loader applies basePath to local images (unoptimized skips it) and
    // passes remote URLs through. Required for correct images on GitHub Pages.
    loader: "custom",
    loaderFile: "./image-loader.ts",
  },
};

export default nextConfig;
