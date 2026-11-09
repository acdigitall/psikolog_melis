<?php
declare(strict_types=1);

/**
 * Site genelinde SEO / yerel SEO (İzmir) / GEO için tek kaynak.
 * NAP (isim–adres–telefon) Google İşletme Profili ile birebir aynı olmalı.
 */
const SITE_NAME = 'Uzm. Klinik Psikolog Melisa Sağlam';
const PSYCHOLOGIST_NAME = 'Melisa Sağlam';
const JOB_TITLE = 'Uzman Klinik Psikolog';
const CITY = 'İzmir';
const DISTRICT = 'Konak';
const NEIGHBORHOOD = 'Alsancak';
const DEFAULT_TITLE = 'İzmir Uzm. Klinik Psikolog Melisa Sağlam | Alsancak & Online Terapi';
const DEFAULT_DESCRIPTION = "İzmir Alsancak'ta uzman klinik psikolog: kaygı, panik atak, depresyon, ilişki sorunları ve travmada BDT, Şema Terapi ve EMDR ile yüz yüze ve online psikoterapi.";
const DEFAULT_KEYWORDS = 'izmir psikolog, psikolog izmir, izmir klinik psikolog, alsancak psikolog, konak psikolog, karşıyaka psikolog, bornova psikolog, izmir çift terapisi, izmir emdr, izmir online terapi, izmir kaygı terapisi, izmir panik atak tedavisi, bilişsel davranışçı terapi izmir, şema terapi izmir';

const DEFAULT_ADDRESS = [
    'street' => 'Kıbrıs Şehitleri Caddesi No: 00/0',
    'neighborhood' => NEIGHBORHOOD,
    'district' => DISTRICT,
    'city' => CITY,
    'postalCode' => '35220',
    'country' => 'TR',
];

/** Klinik konumu (Alsancak). Gerçek adresin koordinatıyla değiştirin. */
const GEO = ['lat' => 38.4371, 'lng' => 27.1428];

const IZMIR_DISTRICTS = ['Konak', 'Alsancak', 'Karşıyaka', 'Bornova', 'Bayraklı', 'Buca', 'Karabağlar', 'Balçova', 'Narlıdere', 'Gaziemir', 'Çiğli', 'Güzelbahçe', 'Urla'];

const OPENING_HOURS = [
    ['days' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 'opens' => '10:00', 'closes' => '20:00'],
    ['days' => ['Saturday'], 'opens' => '10:00', 'closes' => '16:00'],
];

const KNOWS_ABOUT = ['Psikoterapi', 'Bilişsel Davranışçı Terapi (BDT)', 'Şema Terapi', 'EMDR', 'Kaygı bozukluğu', 'Panik atak', 'Depresyon', 'Travma', 'Çift terapisi', 'Yas danışmanlığı', 'Online terapi'];

function site_url(): string
{
    $configured = env('SITE_URL') ?: env('NEXT_PUBLIC_SITE_URL');
    if ($configured !== '') {
        return rtrim($configured, '/');
    }
    return (is_https() ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'localhost');
}

function abs_url(string $path = '/'): string
{
    if (str_starts_with($path, 'http')) {
        return $path;
    }
    return site_url() . (str_starts_with($path, '/') ? '' : '/') . $path;
}

function org_id(): string
{
    return site_url() . '/#klinik';
}

function person_id(): string
{
    return site_url() . '/#psikolog';
}

/** Sayfa metadatası: canonical, Open Graph ve Twitter alanları layout'ta bundan üretilir. */
function page_meta(array $o): array
{
    return [
        'title' => $o['title'],
        'description' => $o['description'],
        'path' => $o['path'],
        'image' => ($o['image'] ?? null) ?: '/opengraph-image.jpg',
        'keywords' => ($o['keywords'] ?? null) ?: DEFAULT_KEYWORDS,
        'type' => $o['type'] ?? 'website',
        'publishedTime' => $o['publishedTime'] ?? null,
        'absoluteTitle' => $o['absoluteTitle'] ?? false,
    ];
}

function postal_address(): array
{
    return [
        '@type' => 'PostalAddress',
        'streetAddress' => DEFAULT_ADDRESS['street'] . ', ' . DEFAULT_ADDRESS['neighborhood'],
        'addressLocality' => DEFAULT_ADDRESS['district'],
        'addressRegion' => DEFAULT_ADDRESS['city'],
        'postalCode' => DEFAULT_ADDRESS['postalCode'],
        'addressCountry' => DEFAULT_ADDRESS['country'],
    ];
}

function social_urls(?array $settings): array
{
    $urls = array_map(fn ($l) => $l['url'] ?? null, parse_list($settings['socialLinks'] ?? null));
    return array_values(array_filter($urls, fn ($u) => is_string($u) && preg_match('#^https?://[^/]+/[^/\s]+#', $u)));
}

/** Tüm sayfalarda yer alan varlık grafiği: web sitesi + klinik (yerel işletme) + psikolog. */
function site_graph(?array $settings): array
{
    $sameAs = social_urls($settings);
    $extraSameAs = $sameAs ? ['sameAs' => $sameAs] : [];
    $url = site_url();
    return [
        '@context' => 'https://schema.org',
        '@graph' => [
            [
                '@type' => 'WebSite',
                '@id' => $url . '/#website',
                'url' => $url,
                'name' => SITE_NAME . ' · ' . CITY,
                'inLanguage' => 'tr-TR',
                'publisher' => ['@id' => org_id()],
            ],
            [
                '@type' => ['MedicalBusiness', 'ProfessionalService'],
                '@id' => org_id(),
                'name' => SITE_NAME . ' · ' . CITY . ' Psikoterapi',
                'description' => DEFAULT_DESCRIPTION,
                'url' => $url,
                'image' => abs_url('/opengraph-image.jpg'),
                'logo' => !empty($settings['logo']) ? abs_url($settings['logo']) : abs_url('/apple-icon.png'),
                ...(!empty($settings['phone1']) ? ['telephone' => $settings['phone1']] : []),
                ...(!empty($settings['email']) ? ['email' => $settings['email']] : []),
                'address' => postal_address(),
                'geo' => ['@type' => 'GeoCoordinates', 'latitude' => GEO['lat'], 'longitude' => GEO['lng']],
                'hasMap' => 'https://www.google.com/maps/search/?api=1&query=' . GEO['lat'] . ',' . GEO['lng'],
                'openingHoursSpecification' => array_map(fn ($h) => [
                    '@type' => 'OpeningHoursSpecification',
                    'dayOfWeek' => $h['days'],
                    'opens' => $h['opens'],
                    'closes' => $h['closes'],
                ], OPENING_HOURS),
                'medicalSpecialty' => 'Psychiatric',
                'areaServed' => [
                    ['@type' => 'City', 'name' => CITY],
                    ...array_map(fn ($d) => ['@type' => 'Place', 'name' => $d . ', ' . CITY], IZMIR_DISTRICTS),
                    ['@type' => 'Country', 'name' => 'Türkiye'],
                ],
                'availableLanguage' => ['tr'],
                'knowsAbout' => KNOWS_ABOUT,
                'founder' => ['@id' => person_id()],
                'employee' => ['@id' => person_id()],
                ...$extraSameAs,
            ],
            [
                '@type' => 'Person',
                '@id' => person_id(),
                'name' => PSYCHOLOGIST_NAME,
                'jobTitle' => JOB_TITLE,
                'url' => abs_url('/about'),
                'worksFor' => ['@id' => org_id()],
                'workLocation' => ['@id' => org_id()],
                'knowsAbout' => KNOWS_ABOUT,
                'knowsLanguage' => 'tr',
                ...$extraSameAs,
            ],
        ],
    ];
}

function breadcrumb_schema(array $items): array
{
    $all = [['name' => 'Anasayfa', 'path' => '/'], ...$items];
    $list = [];
    foreach ($all as $i => $c) {
        $list[] = [
            '@type' => 'ListItem',
            'position' => $i + 1,
            'name' => $c['name'],
            ...(!empty($c['path']) ? ['item' => abs_url($c['path'])] : []),
        ];
    }
    return ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => $list];
}

function faq_schema(array $items): array
{
    return [
        '@context' => 'https://schema.org',
        '@type' => 'FAQPage',
        'mainEntity' => array_map(fn ($f) => [
            '@type' => 'Question',
            'name' => $f['q'],
            'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f['a']],
        ], $items),
    ];
}

function service_schema(array $s): array
{
    return [
        '@context' => 'https://schema.org',
        '@type' => 'Service',
        '@id' => abs_url('/services/' . $s['slug'] . '#hizmet'),
        'name' => $s['title'] . ' · ' . CITY,
        'serviceType' => $s['title'],
        'description' => $s['desc'],
        'url' => abs_url('/services/' . $s['slug']),
        ...(!empty($s['img']) ? ['image' => abs_url($s['img'])] : []),
        'provider' => ['@id' => org_id()],
        'areaServed' => [['@type' => 'City', 'name' => CITY], ['@type' => 'Country', 'name' => 'Türkiye']],
        'availableChannel' => [
            ['@type' => 'ServiceChannel', 'name' => 'Yüz yüze seans', 'serviceLocation' => ['@type' => 'Place', 'address' => postal_address()]],
            ['@type' => 'ServiceChannel', 'name' => 'Online görüntülü seans', 'serviceUrl' => abs_url('/services/online-terapi')],
        ],
    ];
}

function article_schema(array $p): array
{
    return [
        '@context' => 'https://schema.org',
        '@type' => 'BlogPosting',
        '@id' => abs_url('/blog/' . $p['slug'] . '#yazi'),
        'mainEntityOfPage' => abs_url('/blog/' . $p['slug']),
        'headline' => $p['title'],
        'description' => $p['excerpt'],
        ...(!empty($p['image']) ? ['image' => [abs_url($p['image'])]] : []),
        'datePublished' => iso_date($p['createdAt']),
        'dateModified' => iso_date($p['createdAt']),
        'inLanguage' => 'tr-TR',
        ...(!empty($p['category']) ? ['articleSection' => $p['category']] : []),
        'author' => ['@id' => person_id()],
        'publisher' => ['@id' => org_id()],
    ];
}
