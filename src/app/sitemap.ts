import type { MetadataRoute } from "next";
import { PRODUCTS, COLLECTIONS } from "@/lib/commerce/fixtures";

// Emit as a static file under `output: export`.
export const dynamic = "force-static";

const BASE = "https://dmenwear.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/journal",
    "/pages/about",
    "/pages/contact",
    "/pages/shipping-returns",
    "/pages/size-guide",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.6,
  }));

  const collectionRoutes = COLLECTIONS.map((c) => ({
    url: `${BASE}/collections/${c.handle}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productRoutes = PRODUCTS.map((p) => ({
    url: `${BASE}/products/${p.handle}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
