import {
  SITE_URL,
  SITE_NAME,
  PSYCHOLOGIST_NAME,
  JOB_TITLE,
  DEFAULT_ADDRESS,
  GEO,
  IZMIR_DISTRICTS,
  OPENING_HOURS,
  DEFAULT_DESCRIPTION,
  ORG_ID,
  PERSON_ID,
  WEBSITE_ID,
  CITY,
  abs,
} from '@/lib/site';

type Settings = {
  phone1?: string | null;
  email?: string | null;
  logo?: string | null;
  socialLinks?: unknown;
} | null | undefined;

function socialUrls(settings: Settings): string[] {
  let links: any[] = [];
  const raw = settings?.socialLinks;
  if (Array.isArray(raw)) links = raw;
  else if (typeof raw === 'string') {
    try {
      links = JSON.parse(raw);
    } catch {
      links = [];
    }
  }
  // Yalnızca gerçek profil adreslerini al (ör. https://instagram.com/kullanici); çıplak alan adlarını atla.
  return links
    .map((l) => l?.url as string)
    .filter((u) => typeof u === 'string' && /^https?:\/\/[^/]+\/[^/\s]+/.test(u));
}

export const postalAddress = () => ({
  '@type': 'PostalAddress',
  streetAddress: `${DEFAULT_ADDRESS.street}, ${DEFAULT_ADDRESS.neighborhood}`,
  addressLocality: DEFAULT_ADDRESS.district,
  addressRegion: DEFAULT_ADDRESS.city,
  postalCode: DEFAULT_ADDRESS.postalCode,
  addressCountry: DEFAULT_ADDRESS.country,
});

const KNOWS_ABOUT = [
  'Psikoterapi',
  'Bilişsel Davranışçı Terapi (BDT)',
  'Şema Terapi',
  'EMDR',
  'Kaygı bozukluğu',
  'Panik atak',
  'Depresyon',
  'Travma',
  'Çift terapisi',
  'Yas danışmanlığı',
  'Online terapi',
];

/** Tüm sayfalarda yer alan varlık grafiği: web sitesi + klinik (yerel işletme) + psikolog. */
export function siteGraph(settings: Settings) {
  const sameAs = socialUrls(settings);
  const phone = settings?.phone1 || undefined;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: `${SITE_NAME} · ${CITY}`,
        inLanguage: 'tr-TR',
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': ['MedicalBusiness', 'ProfessionalService'],
        '@id': ORG_ID,
        name: `${SITE_NAME} · ${CITY} Psikoterapi`,
        description: DEFAULT_DESCRIPTION,
        url: SITE_URL,
        image: abs('/opengraph-image.jpg'),
        logo: settings?.logo ? abs(settings.logo) : abs('/apple-icon.png'),
        ...(phone ? { telephone: phone } : {}),
        ...(settings?.email ? { email: settings.email } : {}),
        address: postalAddress(),
        geo: { '@type': 'GeoCoordinates', latitude: GEO.lat, longitude: GEO.lng },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${GEO.lat},${GEO.lng}`,
        openingHoursSpecification: OPENING_HOURS.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        })),
        medicalSpecialty: 'Psychiatric',
        areaServed: [
          { '@type': 'City', name: CITY },
          ...IZMIR_DISTRICTS.map((d) => ({ '@type': 'Place', name: `${d}, ${CITY}` })),
          { '@type': 'Country', name: 'Türkiye' },
        ],
        availableLanguage: ['tr'],
        knowsAbout: KNOWS_ABOUT,
        founder: { '@id': PERSON_ID },
        employee: { '@id': PERSON_ID },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: PSYCHOLOGIST_NAME,
        jobTitle: JOB_TITLE,
        url: abs('/about'),
        worksFor: { '@id': ORG_ID },
        workLocation: { '@id': ORG_ID },
        knowsAbout: KNOWS_ABOUT,
        knowsLanguage: 'tr',
        ...(sameAs.length ? { sameAs } : {}),
      },
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path?: string }[]) {
  const all = [{ name: 'Anasayfa', path: '/' }, ...items];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: abs(c.path) } : {}),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceSchema(s: { slug: string; title: string; desc: string; img?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': abs(`/services/${s.slug}#hizmet`),
    name: `${s.title} · ${CITY}`,
    serviceType: s.title,
    description: s.desc,
    url: abs(`/services/${s.slug}`),
    ...(s.img ? { image: abs(s.img) } : {}),
    provider: { '@id': ORG_ID },
    areaServed: [{ '@type': 'City', name: CITY }, { '@type': 'Country', name: 'Türkiye' }],
    availableChannel: [
      {
        '@type': 'ServiceChannel',
        name: 'Yüz yüze seans',
        serviceLocation: { '@type': 'Place', address: postalAddress() },
      },
      { '@type': 'ServiceChannel', name: 'Online görüntülü seans', serviceUrl: abs('/services/online-terapi') },
    ],
  };
}

export function articleSchema(p: {
  slug: string;
  title: string;
  excerpt: string;
  image?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  category?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': abs(`/blog/${p.slug}#yazi`),
    mainEntityOfPage: abs(`/blog/${p.slug}`),
    headline: p.title,
    description: p.excerpt,
    ...(p.image ? { image: [abs(p.image)] } : {}),
    datePublished: new Date(p.createdAt).toISOString(),
    dateModified: new Date(p.updatedAt || p.createdAt).toISOString(),
    inLanguage: 'tr-TR',
    ...(p.category ? { articleSection: p.category } : {}),
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
  };
}
