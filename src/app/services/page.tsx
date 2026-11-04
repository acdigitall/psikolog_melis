import type { Metadata } from 'next';
import { pageMeta } from '@/lib/site';
import Link from 'next/link';
import Image from 'next/image';
import { getServices } from '@/app/actions/services';
import { getPageHeader } from '@/app/actions/page-headers';
import CtaBand from '@/components/site/CtaBand';
import PageHero from '@/components/site/PageHero';
import { ArrowRight } from '@/components/site/Icons';

export const metadata: Metadata = pageMeta({
  title: "İzmir Psikoterapi Hizmetleri · Bireysel, Çift, EMDR",
  description:
    "İzmir Alsancak'ta ve online: bireysel terapi, çift ve ilişki terapisi, EMDR travma terapisi, kaygı-panik atak ve depresyon-yas için uzman klinik psikolog desteği.",
  keywords: 'izmir bireysel terapi, izmir çift terapisi, izmir emdr, izmir panik atak, izmir depresyon terapisi, izmir online terapi',
  path: '/services',
  image: '/images/hero-nefes.jpg',
});

export default async function Services() {
  const [res, headerRes] = await Promise.all([getServices(), getPageHeader('services')]);
  const services = res.success && res.data ? res.data : [];
  const header = headerRes.success && headerRes.data ? headerRes.data : null;

  return (
    <>
      <PageHero
        image="/images/hero-nefes.jpg"
        title={header?.title || 'Size nasıl destek olabilirim?'}
        description={header?.description}
        crumbs={[{ label: 'Hizmetler' }]}
      />

      <section className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
        <div className="space-y-24 md:space-y-32">
          {services.map((s: any, i: number) => {
            const features = s.features ? s.features.split(',').map((f: string) => f.trim()).filter(Boolean).slice(0, 5) : [];
            const flip = i % 2 === 1;
            return (
              <article key={s.slug} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                <Link
                  href={`/services/${s.slug}`}
                  data-reveal="image"
                  className={`group relative block aspect-[5/4] overflow-hidden rounded-[1.25rem] bg-sage-light ${flip ? 'lg:order-2' : ''}`}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Image
                    src={s.img || '/images/hizmet-bireysel.jpg'}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
                  />
                </Link>
                <div data-reveal>
                  <h2 className="h-section">
                    <Link href={`/services/${s.slug}`} className="hover:text-olive transition-colors duration-500">{s.title}</Link>
                  </h2>
                  <p className="lead mt-6 max-w-lg">{s.desc}</p>
                  {features.length > 0 && (
                    <ul className="mt-8 max-w-lg border-t border-line">
                      {features.map((f: string) => (
                        <li key={f} className="border-b border-line py-3 text-[15px] text-ink/80">{f}</li>
                      ))}
                    </ul>
                  )}
                  <Link href={`/services/${s.slug}`} className="link-line mt-10">
                    Detaylı bilgi <ArrowRight />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <CtaBand image="/images/hizmet-kaygi.jpg" />
    </>
  );
}
