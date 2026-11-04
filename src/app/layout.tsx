import type { Metadata, Viewport } from "next";
import { Newsreader, Hanken_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteLoader from "@/components/RouteLoader";
import "./globals.css";

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
  title: {
    default: "Uzm. Klinik Psikolog | Bireysel, Çift ve Online Terapi",
    template: "%s | Uzm. Klinik Psikolog",
  },
  description: "Kaygı, depresyon, ilişki sorunları ve kişisel gelişim alanlarında bilimsel ekoller (BDT, EMDR, Şema Terapi) ile yüz yüze ve online profesyonel psikolojik danışmanlık hizmeti.",
  keywords: [
    "psikolog",
    "klinik psikolog",
    "bireysel terapi",
    "çift terapisi",
    "online terapi",
    "emdr terapisi",
    "bilişsel davranışçı terapi",
    "şema terapi",
    "anksiyete tedavisi",
    "depresyon",
    "psikolojik danışmanlık"
  ],
  authors: [{ name: "Uzm. Klinik Psikolog" }],
  creator: "Uzm. Klinik Psikolog",
  publisher: "Uzm. Klinik Psikolog",
  openGraph: {
    title: "Uzm. Klinik Psikolog | Bireysel, Çift ve Online Terapi",
    description: "Bilimsel ekoller ve şefkatli yaklaşımla yüz yüze ve online terapi hizmetleri.",
    url: "https://psikolog.com",
    siteName: "Uzm. Klinik Psikolog",
    locale: "tr_TR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
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
        <RouteLoader logoUrl={contactSettings?.logo ?? undefined} />
        <Navbar settings={contactSettings} />
        {children}
        <Footer settings={contactSettings} />
      </body>
    </html>
  );
}
