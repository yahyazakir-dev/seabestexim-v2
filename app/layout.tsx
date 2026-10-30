import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/onest";
import "./globals.css";
import "./sections.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { JsonLd, organization } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Sea Best Exim | Frozen Seafood & Pre-Cooked Tuna Exporter, India",
    template: "%s | Sea Best Exim",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "pre-cooked tuna loins",
    "frozen seafood exporter India",
    "frozen tuna supplier",
    "yellowfin tuna exporter",
    "skipjack tuna loins",
    "tuna flakes vacuum packed",
    "pet food tuna",
    "frozen fish exporter Kerala",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GB",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Sea Best Exim, frozen and pre-cooked seafood from India" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon-32.png", sizes: "32x32" }], apple: "/apple-touch-icon.png" },
  formatDetection: { telephone: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#010f2b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Reveal />
        <JsonLd data={organization} />
      </body>
    </html>
  );
}
