import type { Metadata } from 'next';
import { pageMeta } from '@/lib/site';
import Link from 'next/link';
import Image from 'next/image';
import CtaBand from '@/components/site/CtaBand';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getServices } from '@/app/actions/services';
import { ArrowRight, Plus } from '@/components/site/Icons';
import { serviceLocal } from '@/lib/service-local';
import { getBlogPosts } from '@/app/actions/blog';
import JsonLd from '@/components/site/JsonLd';
import { serviceSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getServiceBySlug(slug);
  const service = res.success && res.data ? res.data : null;
  if (!service) return { title: 'Hizmet bulunamadı' };
  return pageMeta({
    title: service.metaTitle || `İzmir ${service.title}`,
    description: service.metaDesc || service.desc,
    keywords: service.metaKeys,
    path: `/services/${service.slug}`,
    image: service.img,
  });
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
  const local = serviceLocal[service.slug];
  const postsRes = local ? await getBlogPosts(true) : null;
  const relatedPosts =
    local && postsRes?.success && postsRes.data
      ? local.relatedPosts.map((slug) => postsRes.data!.find((p: any) => p.slug === slug)).filter(Boolean)
      : [];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(service),
          breadcrumbSchema([{ name: 'Hizmetler', path: '/services' }, { name: service.title, path: `/services/${service.slug}` }]),
          ...(local?.faqs.length ? [faqSchema(local.faqs)] : []),
        ]}
      />
      {/* Başlık */}
      <section className="border-b border-line bg-sand/60 pb-14 md:pb-20">
      <div className="mx-auto max-w-[1240px] px-6 pt-12 md:pt-14 lg:px-10">
        <nav aria-label="Sayfa yolu" className="mb-12 md:mb-16 text-sm text-muted">
          <Link href="/" className="hover:text-forest">Anasayfa</Link>
          <span className="mx-2 text-sage/60">/</span>
          <Link href="/services" className="hover:text-forest">Hizmetler</Link>
          <span className="mx-2 text-sage/60">/</span>
          <span className="text-ink/80">{service.title}</span>
        </nav>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
          <h1 className="intro display">
            <span className="mb-5 flex items-center gap-3 font-sans text-[13px] font-medium tracking-[0.02em] text-olive before:h-px before:w-7 before:bg-current before:opacity-60">
              İzmir · Alsancak &amp; online
            </span>
            {service.title}
          </h1>
          <div style={delay(120)} className="intro lg:pb-2">
            <p className="lead max-w-md">{service.desc}</p>
            <Link href={quoteHref} className="btn-primary mt-8">
              Randevu talebi <ArrowRight />
            </Link>
          </div>
        </div>
        <div className="intro-image relative mt-14 md:mt-16 aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[1.5rem] bg-sage-light">
          <Image src={service.img} alt={`${service.title} · İzmir`} fill unoptimized priority sizes="100vw" className="object-cover" />
        </div>
      </div>
      </section>

      {/* İçerik */}
      <section className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-32 lg:px-10">
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

            {local && (
              <div data-reveal className="mt-20 border-t border-line pt-10">
                <h2 className="h-sub">{local.heading}</h2>
                <div className="mt-5 max-w-2xl space-y-5 leading-[1.8] text-ink/80">
                  {local.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                  <Link href="/izmir-psikolog" className="link-line">Klinik konumu ve ulaşım <ArrowRight /></Link>
                  {service.slug !== 'online-terapi' && (
                    <Link href="/services/online-terapi" className="link-line">Online terapi <ArrowRight /></Link>
                  )}
                </div>
              </div>
            )}

            {local && local.faqs.length > 0 && (
              <div data-reveal className="mt-20">
                <h2 className="h-sub">Sık sorulan sorular</h2>
                <div className="mt-6 border-t border-line">
                  {local.faqs.map((f) => (
                    <details key={f.q} className="group border-b border-line">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-6 font-serif text-[1.25rem] leading-snug text-forest">
                        {f.q}
                        <Plus className="mt-1 h-5 w-5 shrink-0 text-olive transition-transform duration-300 group-open:rotate-45" />
                      </summary>
                      <p className="-mt-1 pb-7 sm:pr-12 leading-relaxed text-ink/75">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div data-reveal className="mt-20">
                <h2 className="h-sub">Bu konuda yazılar</h2>
                <ul className="mt-6 border-t border-line">
                  {relatedPosts.map((p: any) => (
                    <li key={p.slug} className="border-b border-line">
                      <Link href={`/blog/${p.slug}`} className="group flex items-start justify-between gap-6 py-5">
                        <span className="font-serif text-[1.2rem] leading-snug text-forest transition-colors group-hover:text-olive">{p.title}</span>
                        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-olive transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[1240px] px-6 py-24 lg:px-10">
            <h2 data-reveal className="h-sub mb-10">Diğer çalışma alanları</h2>
            <div className="snap-row sm:grid sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
              {others.map((item: any, i: number) => (
                <Link key={item.slug} href={`/services/${item.slug}`} data-reveal style={delay(i * 80)} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-sage-light">
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
