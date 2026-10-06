import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/config/site";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CursorFollower } from "@/components/ui/CursorFollower";

const anton = localFont({
  src: "./fonts/Anton.woff2",
  variable: "--font-anton",
  display: "swap",
  weight: "400",
});
const inter = localFont({
  src: "./fonts/Inter.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});
const serif = localFont({
  src: [
    { path: "./fonts/InstrumentSerif.woff2", weight: "400", style: "normal" },
    { path: "./fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s — MOTZA" },
  description: site.description,
  applicationName: "MOTZA",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: "MOTZA",
    url: "/",
    title: site.title,
    description: site.description,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "MOTZA — Disciplina constrói liberdade." }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/images/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${inter.variable} ${serif.variable}`}>
      <body>
        <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
        <Providers>
          <Header />
          <main id="conteudo" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <CursorFollower />
        </Providers>
      </body>
    </html>
  );
}
