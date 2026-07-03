import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mockAdapter } from "@/lib/commerce/adapter";
import { COLLECTIONS } from "@/lib/commerce/fixtures";
import CollectionControls from "@/components/commerce/CollectionControls";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = await mockAdapter.getCollectionByHandle(handle);
  if (!collection) return { title: "Not found" };
  return { title: collection.title, description: collection.description };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await mockAdapter.getCollectionByHandle(handle);
  if (!collection) notFound();
  const products = await mockAdapter.getProductsByHandles(collection.productHandles);

  return (
    <div className="container-wide py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="type-micro mb-8 text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-ink">{collection.title}</span>
      </nav>

      <header className="mb-8 max-w-2xl">
        <h1 className="type-display-xl">{collection.title}</h1>
        <p className="type-body-lg mt-3 text-ink-2">{collection.strap}</p>
      </header>

      <CollectionControls products={products} />
    </div>
  );
}
