import Link from "next/link";
import type { Metadata } from "next";
import ContactForm from "@/components/layout/ContactForm";

/**
 * Temporary stub for static brand pages (About, Contact, Shipping/Returns,
 * Size Guide). Real content is authored in a later pass; this keeps footer
 * links honest (no 404s) without faking finished content.
 */

const TITLES: Record<string, { title: string; blurb: string }> = {
  contact: {
    title: "Contact",
    blurb:
      "Questions about an order or sizing? Email contact@spheretree.in and the team will get back to you.",
  },
  "shipping-returns": {
    title: "Shipping & Returns",
    blurb:
      "Pan-India shipping with cash on delivery. Easy returns within 7 days. Full policy is being finalised.",
  },
  "size-guide": {
    title: "Size Guide",
    blurb:
      "Per-garment size charts (inches + cm) and a how-to-measure guide land with the product shoot.",
  },
};

export function generateStaticParams() {
  return Object.keys(TITLES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: TITLES[slug]?.title ?? "DMEN" };
}

export default async function StaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = TITLES[slug] ?? { title: "DMEN", blurb: "Coming soon." };
  return (
    <div className="container-narrow py-20">
      <h1 className="type-display-xl">{page.title}</h1>
      <p className="type-body-lg mt-5 text-ink-2">{page.blurb}</p>
      {slug === "contact" ? (
        <div className="mt-10">
          <ContactForm />
        </div>
      ) : (
        <Link href="/collections/all" className="type-label mt-8 inline-flex text-ink hover:text-red">
          Shop the Uniform →
        </Link>
      )}
    </div>
  );
}
