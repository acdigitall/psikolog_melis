import type { Metadata } from 'next';

/**
 * Site genelinde SEO / yerel SEO (İzmir) / GEO için tek kaynak.
 * Gerçek bilgiler belli olduğunda yalnızca burayı (ve admin › İletişim'i) güncellemek yeterli.
 * NAP (isim–adres–telefon) Google İşletme Profili ile birebir aynı olmalı.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://psikolog.com').replace(/\/$/, '');

export const SITE_NAME = 'Uzm. Klinik Psikolog melis Sağlam';
/** Psikoloğun ad soyadı (Person şeması ve yazar bilgisi). */
export const PSYCHOLOGIST_NAME = 'melis Sağlam';
export const JOB_TITLE = 'Uzman Klinik Psikolog';

export const CITY = 'İzmir';
export const DISTRICT = 'Konak';
export const NEIGHBORHOOD = 'Alsancak';

/** Varsayılan adres (DB'de adres yoksa). */
export const DEFAULT_ADDRESS = {
  street: 'Kıbrıs Şehitleri Caddesi No: 00/0',
  neighborhood: NEIGHBORHOOD,
  district: DISTRICT,
  city: CITY,
  postalCode: '35220',
  region: 'TR-35',
  country: 'TR',
};

/** Klinik konumu (Alsancak). Gerçek adresin koordinatıyla değiştirin. */
export const GEO = { lat: 38.4371, lng: 27.1428 };

/** Yüz yüze seans için hizmet verilen İzmir ilçeleri. */
export const IZMIR_DISTRICTS = [
  'Konak',
  'Alsancak',
  'Karşıyaka',
  'Bornova',
  'Bayraklı',
  'Buca',
  'Karabağlar',
  'Balçova',
  'Narlıdere',
  'Gaziemir',
  'Çiğli',
  'Güzelbahçe',
  'Urla',
];

export const OPENING_HOURS = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '20:00' },
  { days: ['Saturday'], opens: '10:00', closes: '16:00' },
];

export const DEFAULT_DESCRIPTION =
  "İzmir Alsancak'ta uzman klinik psikolog: kaygı, panik atak, depresyon, ilişki sorunları ve travmada BDT, Şema Terapi ve EMDR ile yüz yüze ve online psikoterapi.";

export const abs = (path = '/') => (path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`);

export const ORG_ID = `${SITE_URL}/#klinik`;
export const PERSON_ID = `${SITE_URL}/#psikolog`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Sayfa metadatası: canonical, Open Graph ve Twitter alanlarını tek seferde üretir. */
export function pageMeta({
  title,
  description,
  path,
  image,
  keywords,
  type = 'website',
  publishedTime,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  keywords?: string | string[] | null;
  type?: 'website' | 'article';
  publishedTime?: string;
  absoluteTitle?: boolean;
}): Metadata {
  // Görseli olmayan sayfalar ortak paylaşım görselini kullanır (alt sayfada openGraph tanımlanınca kök görsel miras alınmaz).
  const img = image || '/opengraph-image.jpg';
  const images = [{ url: img, alt: title }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: `${SITE_NAME} · ${CITY}`,
      locale: 'tr_TR',
      type,
      ...(publishedTime ? { publishedTime } : {}),
      images,
    },
    twitter: { card: 'summary_large_image', title, description, images: [img] },
  };
}
