import Link from "next/link";
import type { Metadata } from "next";
import BrandGlyph from "@/components/brand/BrandGlyph";

export const metadata: Metadata = {
  title: "The Journal",
  description: "MINDSET and HUSTLE — notes for rising men.",
};

export default function JournalPage() {
  return (
    <div className="container-wide flex min-h-[60svh] flex-col items-start justify-center py-20">
      <BrandGlyph className="mb-6 h-12 w-auto opacity-20" />
      <p className="type-label mb-3 text-ink-2">The Journal · MINDSET / HUSTLE</p>
      <h1 className="type-display-xl max-w-2xl">
        Notes for men <span className="text-red">on the way up.</span>
      </h1>
      <p className="type-body-lg mt-5 max-w-md text-ink-2">
        Training, discipline, and the work behind the uniform. First entries drop
        with the Founders&apos; Release.
      </p>
      <Link
        href="/collections/all"
        className="type-label mt-8 bg-red px-7 py-4 text-white transition-colors hover:bg-red-hover"
      >
        Shop the Uniform
      </Link>
    </div>
  );
}
