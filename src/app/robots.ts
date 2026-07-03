import type { MetadataRoute } from "next";

// Emit as a static file under `output: export`.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout"],
    },
    sitemap: "https://dmenwear.com/sitemap.xml",
  };
}
