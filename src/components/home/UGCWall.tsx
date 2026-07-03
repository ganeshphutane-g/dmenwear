import BrandGlyph from "@/components/brand/BrandGlyph";

/**
 * UGCWall — an honest community wall. There is no real UGC yet, so every tile
 * is a placeholder slot inviting customers to tag #ForRisingMen once they own
 * the kit. No fabricated faces, handles, or photos.
 */

const HANDLE_SLOTS = [
  "@yourhandle",
  "@nextrep",
  "@yourhandle",
  "@onthegrind",
  "@yourhandle",
  "@dayone",
  "@yourhandle",
  "@thiscouldbeyou",
] as const;

export default function UGCWall() {
  return (
    <section className="bg-base py-20 md:py-28">
      <div className="container-wide">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="type-label inline-flex items-center gap-2 text-ink-2">
              <BrandGlyph className="h-3.5 w-auto" />
              #ForRisingMen
            </span>
            <h2 className="type-h2 mt-4 max-w-xl text-ink">
              Worn by the <span className="text-red">relentless.</span>
            </h2>
          </div>
          <p className="type-body-lg max-w-sm text-muted md:col-span-5 md:justify-self-end md:text-right">
            No staged shots here yet. Own the kit, train in it, then tag
            #ForRisingMen — real reps make this wall.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-4">
          {HANDLE_SLOTS.map((handle, i) => (
            <li
              key={i}
              className="relative flex aspect-square items-center justify-center overflow-hidden border border-line bg-seamless"
            >
              <BrandGlyph className="h-16 w-auto opacity-10" />
              <span className="type-micro absolute bottom-3 left-3 text-muted">
                {handle}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
