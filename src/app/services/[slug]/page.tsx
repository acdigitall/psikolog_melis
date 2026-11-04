import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import CtaBand from '@/components/site/CtaBand';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getServices } from '@/app/actions/services';
import { ArrowRight } from '@/components/site/Icons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getServiceBySlug(slug);
  const service = res.success && res.data ? res.data : null;
  if (!service) return { title: 'Hizmet bulunamadı' };
  return {
    title: service.metaTitle || service.title,
    description: service.metaDesc || service.desc,
    ...(service.metaKeys ? { keywords: service.metaKeys } : {}),
    openGraph: {
      title: service.metaTitle || service.title,
      description: service.metaDesc || service.desc,
      images: [{ url: service.img }],
    },
  };
}

export async function generateStaticParams() {
  const res = await getServices();
  return res.success && res.data ? res.data.map((s: any) => ({ slug: s.slug })) : [];
}

const split = (v?: string | null) => (v ? v.split(',').map((x) => x.trim()).filter(Boolean) : []);
const delay = (ms: number) => ({ ['--reveal-delay' as string]: `${ms}ms` });

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const res = await getServiceBySlug(slug);
  const service = res.success && res.data ? res.data : null;
  if (!service) notFound();

  const allRes = await getServices();
  const others = allRes.success && allRes.data ? allRes.data.filter((s: any) => s.slug !== service.slug).slice(0, 3) : [];
  const features = split(service.features);
  const steps = split(service.steps);
  const paragraphs = service.longDesc.split(/\n\s*\n/).filter(Boolean);
  const quoteHref = `/quote?service=${encodeURIComponent(service.title)}`;

  return (
    <>
      {/* Başlık */}
      <section className="relative overflow-hidden bg-sage-light/60 pb-14 md:pb-20">
      <div aria-hidden className="drift absolute -right-20 -top-24 h-72 w-72 rounded-full bg-paper/50" />
      <div className="relative mx-auto max-w-[1320px] px-6 pt-14 md:pt-20 lg:px-10">
        <nav aria-label="Sayfa yolu" className="mb-12 md:mb-16 text-sm text-muted">
          <Link href="/" className="hover:text-forest">Anasayfa</Link>
          <span className="mx-2 text-sage/60">/</span>
          <Link href="/services" className="hover:text-forest">Hizmetler</Link>
          <span className="mx-2 text-sage/60">/</span>
          <span className="text-ink/80">{service.title}</span>
        </nav>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
          <h1 className="intro display">{service.title}</h1>
          <div style={delay(120)} className="intro lg:pb-2">
            <p className="lead max-w-md">{service.desc}</p>
            <Link href={quoteHref} className="btn-primary mt-8">
              Randevu talebi <ArrowRight />
            </Link>
          </div>
        </div>
        <div className="intro-image relative mt-14 md:mt-16 aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[2rem] bg-sage-light shadow-[0_40px_80px_-40px_rgba(23,50,31,0.45)]">
          <Image src={service.img} alt={service.metaTitle || ''} fill unoptimized priority sizes="100vw" className="object-cover" />
        </div>
      </div>
      </section>

      {/* İçerik */}
      <section className="mx-auto max-w-[1320px] px-6 py-24 md:py-32 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
          <aside className="lg:sticky lg:top-28 lg:self-start order-last lg:order-first">
            <div data-reveal className="rounded-[1.75rem] bg-forest p-8 text-paper">
              <p className="font-serif text-[1.6rem] leading-snug text-paper">{service.title} için görüşme planlayalım</p>
              <p className="mt-4 text-[15px] text-paper/75 leading-relaxed">
                Yüz yüze ya da online seans için talebinizi iletin; size en kısa sürede uygun saatlerle dönüş yapayım.
              </p>
              <div className="mt-8 flex flex-col items-start gap-5">
                <Link href={quoteHref} className="btn-light">Randevu talebi <ArrowRight /></Link>
                <Link href="/faq" className="link-line !text-paper">Sıkça sorulan sorular</Link>
              </div>
            </div>
          </aside>

          <div>
            <div data-reveal className="max-w-2xl space-y-6 text-[1.12rem] leading-[1.8] text-ink/80">
              {paragraphs.map((p: string, i: number) => (
                <p key={i} className={i === 0 ? 'font-serif text-[1.55rem] leading-[1.5] text-forest' : ''}>{p}</p>
              ))}
            </div>

            {features.length > 0 && (
              <div className="mt-20">
                <h2 data-reveal className="h-sub">Birlikte çalışabileceğimiz konular</h2>
                <ul className="mt-8 flex flex-wrap gap-2.5">
                  {features.map((f, i) => (
                    <li key={f} data-reveal style={delay((i % 4) * 50)} className="rounded-full bg-sage-light/70 px-5 py-2.5 text-[15px] text-forest">{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {steps.length > 0 && (
              <div className="mt-20">
                <h2 data-reveal className="h-sub">Süreç nasıl ilerler?</h2>
                <ol className="mt-10 rounded-[1.75rem] bg-sand px-8 py-4">
                  {steps.map((s, i) => (
                    <li key={s} data-reveal style={delay(i * 60)} className="grid grid-cols-[3.5rem_1fr] items-baseline border-b border-line py-5 last:border-b-0">
                      <span className="font-serif text-lg italic text-olive">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-serif text-[1.3rem] leading-snug text-forest">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[1320px] px-6 py-24 lg:px-10">
            <h2 data-reveal className="h-sub mb-10">Diğer çalışma alanları</h2>
            <div className="grid gap-10 md:grid-cols-3">
              {others.map((item: any, i: number) => (
                <Link key={item.slug} href={`/services/${item.slug}`} data-reveal style={delay(i * 80)} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-sage-light">
                    <Image src={item.img} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]" />
                  </div>
                  <h3 className="mt-5 font-serif text-[1.45rem] leading-snug group-hover:text-olive transition-colors duration-500">{item.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand image="/images/hero-orman-yolu.jpg" />
    </>
  );
}
