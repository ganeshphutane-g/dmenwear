import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/commerce/store";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MiniCart from "@/components/commerce/MiniCart";

/* One family sitewide: Inter — clean neutral grotesk. Display styles use the
   heavy weights, UPPERCASE and tracked-out; body stays regular. (Owner
   decision 2026-07-02 — replaced the condensed Anton display.) */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dmenwear.com"),
  title: {
    default: "DMEN — A Uniform for the Relentless",
    template: "%s — DMEN",
  },
  description:
    "Premium gym wear for rising men. Built in silence. Forged in the fight. A Uniform for the Relentless.",
  applicationName: "DMEN",
  openGraph: {
    title: "DMEN — A Uniform for the Relentless",
    description: "Premium gym wear for rising men. For Rising Men.",
    siteName: "DMEN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fafaf8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const orgLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "DMEN",
        url: "https://dmenwear.com",
        slogan: "A Uniform for the Relentless",
        email: "contact@spheretree.in",
      },
      { "@type": "WebSite", name: "DMEN", url: "https://dmenwear.com" },
    ],
  };

  return (
    <html lang="en" className={inter.variable}>
      <body>
        {/* Save-Data visitors get final-state UI — same as reduced-motion */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(navigator.connection&&navigator.connection.saveData){document.documentElement.setAttribute('data-motion','off')}}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <CartProvider>
          <a
            href="#main"
            className="type-label sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <div className="flex min-h-dvh flex-col">
            <AnnouncementBar />
            <Header />
            <main id="main" className="grow">
              {children}
            </main>
            <Footer />
          </div>
          <MiniCart />
        </CartProvider>
      </body>
    </html>
  );
}
