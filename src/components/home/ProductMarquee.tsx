import Image from "next/image";
import Link from "next/link";

/**
 * Infinite horizontal product marquee (FEATURED DROPS). Pure CSS loop
 * (track rendered twice → -50% translate), pauses on hover, mask-faded edges,
 * disabled under reduced-motion / data-motion=off (globals.css). Compositor only.
 */

export type MarqueeItem = {
  name: string;
  price: string;
  img: string;
  alt: string;
  href: string;
};

function Tile({ item }: { item: MarqueeItem }) {
  return (
    <Link
      href={item.href}
      className="group relative block w-64 shrink-0 overflow-hidden rounded-2xl bg-ink sm:w-72"
      aria-label={`${item.name} — ${item.price}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={item.img}
          alt={item.alt}
          fill
          sizes="18rem"
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-decisive)] group-hover:scale-[1.06]"
        />
      </div>
      <div className="glass-ink absolute inset-x-3 bottom-3 flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm font-semibold">{item.name}</span>
        <span className="type-price text-sm">{item.price}</span>
      </div>
    </Link>
  );
}

export default function ProductMarquee({ items }: { items: MarqueeItem[] }) {
  const track = [...items, ...items];
  return (
    <div
      className="product-marquee relative w-full overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
      }}
    >
      <div className="product-marquee-track flex w-max gap-5">
        {track.map((item, i) => (
          <Tile key={`${item.name}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}
