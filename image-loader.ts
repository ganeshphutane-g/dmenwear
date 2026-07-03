/**
 * next/image custom loader for static export on GitHub Pages.
 *
 * The default `unoptimized` path does NOT apply `basePath` to local image URLs,
 * so they 404 when the site is served from https://<user>.github.io/<repo>/.
 * This loader prepends NEXT_PUBLIC_BASE_PATH to local paths and passes remote
 * URLs (e.g. the Shopify CDN) through untouched. Width/quality are ignored —
 * Pages has no image optimizer, so the source file is served as-is.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function githubPagesLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}): string {
  // Remote URLs (e.g. Shopify CDN) pass through untouched.
  if (/^https?:\/\//.test(src)) return src;
  // Local paths get the basePath. The `?w=` makes next/image emit a valid
  // srcset (silences the missing-width warning); static hosting ignores the
  // query and serves the single source file, so it's a harmless no-op resize.
  return `${basePath}${src}?w=${width}`;
}
