/**
 * DMEN wordmark + mark, inlined from DMEN-Brand/*.svg.
 * - The mark (icon) always renders the EXACT brand red (#BF2626 via --color-red).
 * - The "MEN" wordmark uses currentColor so it adapts to the surface:
 *     on-light  → ink (#0E0E0E)
 *     on-dark   → white (#FFFFFF)
 * viewBox is cropped to the artwork bounds (original art sits inside a 1000×1000 box).
 */

type LogoProps = {
  variant?: "on-light" | "on-dark";
  className?: string;
  title?: string;
};

const WORDMARK_PATHS = [
  "M525.69,579.01l21.65-114.68-53.89,114.68h-37.54l-9.9-114.68-21.65,114.68h-43.75l29.94-158.87h64.71l8.29,109.79,49.74-109.79h66.32l-29.94,158.87h-43.98Z",
  "M590.4,579.01l29.94-158.87h99.48l-6.68,35.12h-55.5l-5.07,26.98h50.89l-6.22,33.26h-50.89l-5.3,27.91h60.33l-6.68,35.59h-104.32Z",
  "M809.62,579.01l-37.77-91.65-17.27,91.65h-43.98l29.94-158.87h44.44l38.46,94.21,17.73-94.21h43.98l-29.94,158.87h-45.6Z",
];

const MARK_PATHS = [
  "M268.82,486.42c5.04,7.49,10.45,14.74,15.37,22.31l-10.13,30.33,19.37-30.97-25.74-23.77c-.27.27.88,1.74,1.13,2.11Z",
  "M177.61,537.09c.83,1.23,1.38,3.06,2.19,4.22.28.4.31.74.94.63l2.5-7.83c-.84.53-5.55,2.35-5.63,2.98Z",
  "M377.27,472.93c-1.63-45.86-27.05-80.6-72.41-90.98-16.92-3.87-33.68-3.34-50.9-3.77l-88.3.29c-16.26,80.87-35.71,161.05-50.82,242.17,1.28.19,2.53-.21,3.75-.25,43.2-1.42,86.57,1.54,129.78.27,73.62-2.17,126.62-69.42,128.89-139.94.08-2.5.09-5.27,0-7.77ZM283.56,574.25c-.28.25-.56.5-.84.74-1.05.72-2.13,1.39-3.24,2.02-2.75,1.58-5.64,2.95-8.54,4.22-.27.11-.54.21-.81.31l-3.15-13.87-19.09-18.78-29.79,3.03-25.57,13.12-22.98-11.59-6.44-21.82,30.25-39.96.04-.66c-.52-.96-3.3-3.88-3.01-4.79.11-.36,4.39-4.61,5.19-5.6,4.23-5.24,7.85-11.16,11.56-16.77l-24.18-7.95-13.25-48.66,26.44,34.02,27.21.74,24.39-5.22-12.72,17.32,32.86-31.3-44.15-34.97.53-.15,76.2,28.42-17.18,29.38,42.37,9.06,15.34,21.34s10.45,51.29-57.46,98.36Z",
];

const POLYGON_POINTS = "219.88 494.55 221.08 494.42 230.51 480.21 206.32 492.05 219.88 494.55";

export default function Logo({
  variant = "on-light",
  className,
  title = "DMEN",
}: LogoProps) {
  const wordmarkColor = variant === "on-dark" ? "#ffffff" : "currentColor";
  return (
    <svg
      viewBox="92 372 806 256"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g fill={wordmarkColor}>
        {WORDMARK_PATHS.map((d, i) => (
          <path key={`w-${i}`} d={d} />
        ))}
      </g>
      <g fill="var(--color-red, #BF2626)">
        {MARK_PATHS.map((d, i) => (
          <path key={`m-${i}`} d={d} />
        ))}
        <polygon points={POLYGON_POINTS} />
      </g>
    </svg>
  );
}
