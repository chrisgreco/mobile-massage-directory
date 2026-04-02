import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Find Mobile Massage Therapists Near You`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Find licensed mobile massage therapists near you. Compare prices, read reviews, and get free quotes from verified therapists across 200+ US cities.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mobilemassage.com"),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream/10 bg-spa-900/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Logo />
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/deep-tissue-massage-near-me"
            className="text-sm font-medium text-cream/60 hover:text-cream"
          >
            Deep Tissue
          </Link>
          <Link
            href="/swedish-massage-near-me"
            className="text-sm font-medium text-cream/60 hover:text-cream"
          >
            Swedish
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-cream/60 hover:text-cream"
          >
            Guides
          </Link>
          <Link href="/add-listing" className="btn-primary py-2 text-sm">
            List Your Practice
          </Link>
        </div>
        <Link
          href="/add-listing"
          className="btn-primary py-2 text-sm md:hidden"
        >
          List Your Practice
        </Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-spa-900">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4">
              <Logo size="small" />
            </div>
            <p className="text-sm text-cream/50">
              The most comprehensive directory of licensed mobile massage
              therapists in the USA. Find, compare, and book in-home massage
              services.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/40">
              Modalities
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/deep-tissue-massage-near-me" className="text-cream/60 hover:text-cream">
                  Deep Tissue
                </Link>
              </li>
              <li>
                <Link href="/swedish-massage-near-me" className="text-cream/60 hover:text-cream">
                  Swedish
                </Link>
              </li>
              <li>
                <Link href="/sports-massage-near-me" className="text-cream/60 hover:text-cream">
                  Sports Massage
                </Link>
              </li>
              <li>
                <Link href="/prenatal-massage-near-me" className="text-cream/60 hover:text-cream">
                  Prenatal
                </Link>
              </li>
              <li>
                <Link href="/couples-massage-near-me" className="text-cream/60 hover:text-cream">
                  Couples
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/40">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog/how-much-does-mobile-massage-cost" className="text-cream/60 hover:text-cream">
                  Massage Cost Guide
                </Link>
              </li>
              <li>
                <Link href="/blog/deep-tissue-vs-swedish-massage" className="text-cream/60 hover:text-cream">
                  Deep Tissue vs Swedish
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-cream/60 hover:text-cream">
                  All Guides
                </Link>
              </li>
              <li>
                <Link href="/add-listing" className="text-cream/60 hover:text-cream">
                  List Your Practice
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/40">
              Top Cities
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mobile-massage-new-york-ny" className="text-cream/60 hover:text-cream">
                  New York, NY
                </Link>
              </li>
              <li>
                <Link href="/mobile-massage-los-angeles-ca" className="text-cream/60 hover:text-cream">
                  Los Angeles, CA
                </Link>
              </li>
              <li>
                <Link href="/mobile-massage-miami-fl" className="text-cream/60 hover:text-cream">
                  Miami, FL
                </Link>
              </li>
              <li>
                <Link href="/mobile-massage-chicago-il" className="text-cream/60 hover:text-cream">
                  Chicago, IL
                </Link>
              </li>
              <li>
                <Link href="/mobile-massage-houston-tx" className="text-cream/60 hover:text-cream">
                  Houston, TX
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-cream/10 pt-6 text-center text-xs text-cream/30">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
