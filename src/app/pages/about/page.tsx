import Link from "next/link";
import type { Metadata } from "next";
import BrandGlyph from "@/components/brand/BrandGlyph";

export const metadata: Metadata = {
  title: "Our Mission",
  description:
    "DMEN makes the uniform for men on the way up — relentless, disciplined, rising. Built in silence. Forged in the fight.",
};

const PILLARS = [
  {
    word: "MEN",
    body: "Built for the male frame and the male fight. Athletic cuts, honest sizing, no unisex compromise. This is who it's for.",
  },
  {
    word: "MINDSET",
    body: "The work starts in your head. Discipline, focus, the decision to show up on the days you don't feel like it. This is why it exists.",
  },
  {
    word: "HUSTLE",
    body: "Effort you can measure. 240 GSM, flatlock seams, four-way stretch — kit that holds up to the grind. This is what it powers.",
  },
];

const TIMELINE = [
  { k: "The frustration", v: "Gym wear that looked the part and fell apart. Loud logos, thin fabric, shape gone by the third wash." },
  { k: "The standard", v: "One rule: every piece has to earn its place in the bag. Heavyweight, honest, built to be worn into the ground." },
  { k: "The uniform", v: "Five essentials and the kit around them. Not a wardrobe — a uniform you reach for without thinking." },
  { k: "The rise", v: "For the men putting in the work nobody sees. This is the kit for that. For Rising Men." },
];

export default function AboutPage() {
  return (
    <div>
      {/* Manifesto hero — asymmetric */}
      <section className="container-wide grid items-end gap-8 py-16 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="type-label mb-5 flex items-center gap-2 text-ink-2">
            <BrandGlyph className="h-3.5 w-auto" /> Our Mission
          </p>
          <h1 className="type-display-xxl">
            We make the uniform for men on the{" "}
            <span className="text-red">way up.</span>
          </h1>
        </div>
        <div className="lg:col-span-4">
          <p className="type-body-lg text-ink-2">
            Built in silence. Forged in the fight. DMEN is kit for the relentless —
            the men doing the work nobody claps for.
          </p>
        </div>
      </section>

      {/* Origin band */}
      <section className="border-y border-line bg-surface">
        <div className="container-wide grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="bg-seamless md:col-span-5">
            <div className="flex aspect-[4/5] flex-col items-center justify-center gap-3">
              <BrandGlyph className="h-14 w-auto opacity-10" />
              <span className="type-label text-[0.625rem] text-muted">Studio — pending shoot</span>
            </div>
          </div>
          <div className="flex flex-col justify-center md:col-span-6 md:col-start-7">
            <h2 className="type-h2">Born from frustration.</h2>
            <p className="type-body-lg mt-5 text-ink-2">
              DMEN started with a simple irritation: training gear that talked big
              and held up small. Logos louder than the fabric was good. Shape gone
              before the season was.
            </p>
            <p className="type-body-lg mt-4 text-ink-2">
              So we set one standard and refused to move off it — every piece earns
              its place in the bag, or it doesn&apos;t ship. Heavyweight. Honest.
              Built to be worn into the ground and come back for more.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars expanded */}
      <section className="container-wide py-16 md:py-24">
        <p className="type-label mb-8 text-ink-2">Men | Mindset | Hustle</p>
        <div className="grid gap-px md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div key={p.word} className={`flex flex-col gap-4 py-8 md:py-0 ${i > 0 ? "md:border-l md:border-line md:pl-10" : ""}`}>
              <h3 className="type-display-xl">
                {p.word}
                <span className="mt-3 block h-0.5 w-10 bg-red" />
              </h3>
              <p className="text-ink-2">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Making-of timeline */}
      <section className="border-t border-line bg-base">
        <div className="container-wide py-16 md:py-24">
          <h2 className="type-h2 mb-10">Making the uniform</h2>
          <ol className="grid gap-px md:grid-cols-2">
            {TIMELINE.map((t, i) => (
              <li key={t.k} className="flex gap-5 border-t border-line py-8 md:py-10">
                <span className="type-display-xl shrink-0 text-line">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="type-h4">{t.k}</h3>
                  <p className="mt-2 text-ink-2">{t.v}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-white">
        <div className="container-wide flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <p className="type-display-xl max-w-2xl">
            A Uniform for the <span className="text-red">Relentless.</span>
          </p>
          <Link
            href="/collections/all"
            className="type-label inline-flex shrink-0 items-center bg-red px-8 py-4 text-white transition-colors hover:bg-red-hover"
          >
            Shop the Uniform
          </Link>
        </div>
      </section>
    </div>
  );
}
