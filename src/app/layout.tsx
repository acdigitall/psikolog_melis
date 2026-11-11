import type { Metadata, Viewport } from "next";
import { Newsreader, Hanken_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteLoader from "@/components/RouteLoader";
import "./globals.css";
import JsonLd from "@/components/site/JsonLd";
import { siteGraph } from "@/lib/schema";
import { SITE_URL, SITE_NAME, PSYCHOLOGIST_NAME, DEFAULT_DESCRIPTION, GEO } from "@/lib/site";

export const dynamic = "force-dynamic";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin", "latin-ext"],
});

export const viewport: Viewport = {
  themeColor: "#FBF8F0",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "İzmir Uzm. Klinik Psikolog melis Sağlam | Alsancak & Online Terapi",
    template: "%s | melis Sağlam",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "izmir psikolog",
    "psikolog izmir",
    "izmir klinik psikolog",
    "alsancak psikolog",
    "konak psikolog",
    "karşıyaka psikolog",
    "bornova psikolog",
    "izmir çift terapisi",
    "izmir emdr",
    "izmir online terapi",
    "izmir kaygı terapisi",
    "izmir panik atak tedavisi",
    "bilişsel davranışçı terapi izmir",
    "şema terapi izmir",
  ],
  authors: [{ name: PSYCHOLOGIST_NAME, url: "/about" }],
  creator: PSYCHOLOGIST_NAME,
  publisher: SITE_NAME,
  category: "health",
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    title: "İzmir Uzm. Klinik Psikolog melis Sağlam | Alsancak & Online Terapi",
    description: DEFAULT_DESCRIPTION,
    siteName: `${SITE_NAME} · İzmir`,
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "İzmir Uzm. Klinik Psikolog melis Sağlam",
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.YANDEX_VERIFICATION ? { yandex: process.env.YANDEX_VERIFICATION } : {}),
    ...(process.env.BING_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_VERIFICATION } } : {}),
  },
  other: {
    "geo.region": "TR-35",
    "geo.placename": "İzmir",
    "geo.position": `${GEO.lat};${GEO.lng}`,
    ICBM: `${GEO.lat}, ${GEO.lng}`,
  },
};

import { getContactSettings } from '@/app/actions/contact';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contactRes = await getContactSettings();
  const contactSettings = contactRes.success ? contactRes.data : null;

  return (
    <html lang="tr" className={`${newsreader.variable} ${hanken.variable}`}>
      <body className="bg-paper text-ink antialiased">
        <JsonLd data={siteGraph(contactSettings)} />
        <RouteLoader logoUrl={contactSettings?.logo ?? undefined} />
        <Navbar settings={contactSettings} />
        {children}
        <Footer settings={contactSettings} />
      </body>
    </html>
  );
}
