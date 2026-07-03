import Link from "next/link";
import Logo from "@/components/brand/Logo";
import NewsletterForm from "./NewsletterForm";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "T-Shirts", href: "/collections/t-shirts" },
      { label: "Full-Sleeve", href: "/collections/full-sleeve" },
      { label: "Tank Tops", href: "/collections/tank-tops" },
      { label: "Joggers", href: "/collections/joggers" },
      { label: "Shorts", href: "/collections/shorts" },
      { label: "Accessories", href: "/collections/accessories" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Size Guide", href: "/pages/size-guide" },
      { label: "Shipping", href: "/pages/shipping-returns" },
      { label: "Returns", href: "/pages/shipping-returns" },
      { label: "Contact", href: "/pages/contact" },
    ],
  },
  {
    title: "Brand",
    links: [
      { label: "Our Mission", href: "/pages/about" },
      { label: "The Drop", href: "/collections/new" },
      { label: "Journal", href: "/journal" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo variant="on-dark" className="h-7 w-auto" />
          <p className="type-body-sm mt-4 max-w-xs text-white/60">
            A Uniform for the Relentless. Built in silence. Forged in the fight.
          </p>
          <div className="mt-6">
            <p className="type-label mb-3 text-white/80">Join the Relentless</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="type-label mb-4 text-white/80">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label + l.href}>
                    <Link href={l.href} className="text-sm text-white/55 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col-reverse items-start gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="type-micro text-white/40">
            © {new Date().getFullYear()} DMEN. For Rising Men.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {["UPI", "COD", "Visa", "Mastercard", "RuPay"].map((p) => (
              <span
                key={p}
                className="type-micro rounded-[3px] border border-white/20 px-2 py-1 text-white/50"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Giant faded wordmark — bookends the page (RAWBLOX-style) */}
      <div className="overflow-hidden" aria-hidden="true">
        <p className="select-none text-center text-[24vw] font-extrabold uppercase leading-[0.8] tracking-[0.02em] text-white/[0.04]">
          DMEN
        </p>
      </div>
    </footer>
  );
}
