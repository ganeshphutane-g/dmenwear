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

export default function githubPagesLoader({ src }: { src: string }): string {
  if (/^https?:\/\//.test(src)) return src;
  return `${basePath}${src}`;
}
