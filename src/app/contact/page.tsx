import type { Metadata } from 'next';
import { pageMeta } from '@/lib/site';
import Link from 'next/link';
import { getContactSettings } from '@/app/actions/contact';
import { getPageHeader } from '@/app/actions/page-headers';
import PageHero from '@/components/site/PageHero';
import { ArrowRight } from '@/components/site/Icons';

export const metadata: Metadata = pageMeta({
  title: 'İletişim ve Adres · Alsancak, Konak / İzmir',
  description: "İzmir Alsancak'taki klinik adresi, telefon, e-posta, seans saatleri ve ulaşım bilgileri. Yüz yüze ya da online randevu için ulaşın.",
  path: '/contact',
  image: '/images/klinik-detay.jpg',
});

function parseArr(v: unknown): any[] {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }
  return [];
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div data-reveal className="grid gap-2 border-b border-line py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
      <dt className="text-sm text-muted pt-1">{label}</dt>
      <dd className="font-serif text-[1.35rem] leading-snug text-forest">{children}</dd>
    </div>
  );
}

export default async function Contact() {
  const [contactRes, headerRes] = await Promise.all([getContactSettings(), getPageHeader('contact')]);
  const settings: any = contactRes.success ? contactRes.data : null;
  const header = headerRes.success && headerRes.data ? headerRes.data : null;

  const socialLinks = parseArr(settings?.socialLinks);
  let phones = parseArr(settings?.phones);
  if (phones.length === 0 && settings?.phone1) phones = [{ label: 'Telefon', value: settings.phone1 }];
  let emails = parseArr(settings?.emails);
  if (emails.length === 0 && settings?.email) emails = [{ label: 'E-posta', value: settings.email }];

  const tel = (v: string) => `tel:${String(v).replace(/[^\d+]/g, '')}`;

  return (
    <>
      <PageHero
        background="scene-cizim"
        image="/images/klinik-detay.jpg" title={header?.title || 'İletişim'} description={header?.description} crumbs={[{ label: 'İletişim' }]} />

      <section className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <div>
            <dl className="border-t border-line">
              {settings?.address && (
                <Row label="Adres">
                  <address className="not-italic">{settings.address}</address>
                </Row>
              )}
              <Row label="Ulaşım">
                <span className="block text-[1.1rem] leading-relaxed font-sans text-ink/75">
                  Alsancak İZBAN istasyonu, Alsancak vapur iskelesi ve Konak tramvay hattına yürüme mesafesinde.{' '}
                  <Link href="/izmir-psikolog" className="text-forest underline decoration-line underline-offset-4 hover:text-olive">
                    Ulaşım ve hizmet bölgeleri
                  </Link>
                </span>
              </Row>
              {phones.map((p, i) => (
                <Row key={i} label={p.label}>
                  <a href={tel(p.value)} className="hover:text-olive transition-colors">{p.value}</a>
                </Row>
              ))}
              {emails.map((e, i) => (
                <Row key={i} label={e.label}>
                  <a href={`mailto:${e.value}`} className="hover:text-olive transition-colors break-all">{e.value}</a>
                </Row>
              ))}
              <Row label="Seans saatleri">
                Hafta içi 10:00–20:00
                <br />
                Cumartesi 10:00–16:00
              </Row>
              {socialLinks.length > 0 && (
                <Row label="Sosyal medya">
                  <span className="flex flex-wrap gap-x-6 gap-y-1">
                    {socialLinks.map((s, i) => (
                      <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-olive transition-colors">
                        {s.name || s.platform}
                      </a>
                    ))}
                  </span>
                </Row>
              )}
            </dl>

            <div data-reveal className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
              <Link href="/quote" className="btn-primary">Randevu talebi oluştur <ArrowRight /></Link>
              <p className="text-sm text-muted">Mesajlara genellikle 1 iş günü içinde dönüş yapılır.</p>
            </div>
          </div>

          <div data-reveal="image" className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-mist lg:aspect-[4/5]">
              {settings?.mapIframe ? (
                <div
                  dangerouslySetInnerHTML={{ __html: settings.mapIframe }}
                  className="absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0 [&>iframe]:grayscale-[35%]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted">Harita eklenmedi</div>
              )}
            </div>
            <p className="mt-6 text-[15px] leading-relaxed text-muted">
              Acil bir durumdaysanız lütfen bu sayfayı kullanmak yerine hemen <span className="text-forest">112</span>&apos;yi arayın
              ya da en yakın acil servise başvurun.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
