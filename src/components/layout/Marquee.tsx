/**
 * Marquee — a full-bleed black ticker that keeps the brand voice moving across
 * the page. Pure CSS scroll (no client JS): the track holds the items twice and
 * translates -50% so the loop is seamless. Pauses on hover; global CSS halts it
 * under prefers-reduced-motion. Decorative band — the phrases also read inline.
 */

type MarqueeProps = {
  items?: string[];
};

const DEFAULT_ITEMS = ["For Rising Men", "A Uniform for the Relentless"];

export default function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  // Duplicate the run so the -50% translate lands exactly on the loop seam.
  const track = [...items, ...items];

  return (
    <div
      className="group relative flex h-12 w-full items-center overflow-hidden whitespace-nowrap bg-ink text-base select-none"
      style={{
        // Soft edge fade that works over any background (mask, not gradient divs)
        maskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <style>{`
        @keyframes dmen-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .dmen-marquee-track {
          animation: dmen-marquee 32s linear infinite;
          backface-visibility: hidden;
        }
        .group:hover .dmen-marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="dmen-marquee-track flex w-max shrink-0 items-center"
        aria-hidden="true"
      >
        {track.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="type-label px-6 text-base">{item}</span>
            <span className="text-red" aria-hidden="true">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
