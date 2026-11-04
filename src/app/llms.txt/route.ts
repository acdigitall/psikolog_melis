import { getServices } from '@/app/actions/services';
import { getBlogPosts } from '@/app/actions/blog';
import { getContactSettings } from '@/app/actions/contact';
import { faqs } from '@/lib/faqs';
import { SITE_URL, SITE_NAME, JOB_TITLE, PSYCHOLOGIST_NAME, IZMIR_DISTRICTS, DEFAULT_DESCRIPTION } from '@/lib/site';

// Her istekte veritabanından üretilir: admin'den eklenen/güncellenen içerik yeniden derleme gerekmeden yer alır.
export const dynamic = 'force-dynamic';

/**
 * /llms.txt — yapay zekâ asistanları (ChatGPT, Claude, Perplexity, Gemini) için sitenin
 * özetini ve önemli sayfalarını sade Markdown olarak sunar (GEO).
 */
export async function GET() {
  const [servicesRes, postsRes, contactRes] = await Promise.all([getServices(), getBlogPosts(true), getContactSettings()]);
  const services = servicesRes.success && servicesRes.data ? servicesRes.data : [];
  const posts = postsRes.success && postsRes.data ? postsRes.data : [];
  const c: any = contactRes.success ? contactRes.data : null;

  const lines = [
    `# ${SITE_NAME} · İzmir`,
    '',
    `> ${DEFAULT_DESCRIPTION}`,
    '',
    `${PSYCHOLOGIST_NAME} (${JOB_TITLE}), İzmir'in Konak ilçesindeki Alsancak semtinde yetişkinlerle bireysel terapi ve çiftlerle ilişki terapisi yapar. Yüz yüze seansların yanı sıra Türkiye ve yurt dışından online (görüntülü) seanslar da sunulur. Kullanılan yöntemler: Bilişsel Davranışçı Terapi (BDT), Şema Terapi ve EMDR.`,
    '',
    '## Temel bilgiler',
    '',
    ...(c?.address ? [`- Adres: ${c.address}`] : []),
    ...(c?.phone1 ? [`- Telefon: ${c.phone1}`] : []),
    ...(c?.email ? [`- E-posta: ${c.email}`] : []),
    '- Seans saatleri: Pazartesi–Cuma 10:00–20:00, Cumartesi 10:00–16:00, Pazar kapalı',
    '- Seans süresi: bireysel 50 dakika, çift seansı 60–75 dakika',
    '- Seans biçimi: yüz yüze (Alsancak, İzmir) ve online',
    `- Yüz yüze hizmet verilen ilçeler: ${IZMIR_DISTRICTS.join(', ')}`,
    '- Ulaşım: Alsancak İZBAN istasyonu, Alsancak vapur iskelesi, Konak metro ve tramvay hattı',
    `- Randevu: ${SITE_URL}/quote`,
    '',
    '## Hizmetler',
    '',
    ...services.map((s: any) => `- [${s.title}](${SITE_URL}/services/${s.slug}): ${s.desc}`),
    '',
    '## Önemli sayfalar',
    '',
    `- [İzmir psikolog · konum ve ulaşım](${SITE_URL}/izmir-psikolog)`,
    `- [Hakkımda](${SITE_URL}/about)`,
    `- [Terapi süreci](${SITE_URL}/production)`,
    `- [Sıkça sorulan sorular](${SITE_URL}/faq)`,
    `- [İletişim](${SITE_URL}/contact)`,
    '',
    '## Sıkça sorulan sorular',
    '',
    ...faqs.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
    '## Yazılar',
    '',
    ...posts.map((p: any) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`),
    '',
    '## Not',
    '',
    'Acil durumlarda 112 aranmalıdır; bu site kriz hizmeti sunmaz.',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
