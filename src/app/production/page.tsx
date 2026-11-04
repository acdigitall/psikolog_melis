import type { Metadata } from 'next';
import Image from 'next/image';
import { getProductionInfo, getProductionSteps } from '@/app/actions/production';
import { getPageHeader } from '@/app/actions/page-headers';
import CtaBand from '@/components/site/CtaBand';
import PageHero from '@/components/site/PageHero';

export async function generateMetadata(): Promise<Metadata> {
  const infoRes = await getProductionInfo();
  const info = infoRes.success && infoRes.data ? infoRes.data : null;
  return {
    title: info?.metaTitle || 'Terapi Süreci',
    description: info?.metaDesc || info?.desc || 'İlk görüşmeden sonlandırmaya kadar adım adım terapi süreci.',
    ...(info?.metaKeys ? { keywords: info.metaKeys } : {}),
  };
}

const delay = (ms: number) => ({ ['--reveal-delay' as string]: `${ms}ms` });

export default async function Production() {
  const [infoRes, stepsRes, headerRes] = await Promise.all([getProductionInfo(), getProductionSteps(), getPageHeader('production')]);
  const info: any =
    infoRes.success && infoRes.data ? infoRes.data : { title: 'Terapi süreci nasıl ilerler?', desc: '', img: '/images/surec-yolculuk.jpg' };
  const header = headerRes.success && headerRes.data ? headerRes.data : null;
  const steps = stepsRes.success && stepsRes.data ? stepsRes.data : [];

  return (
    <>
      <PageHero
        image="/images/surec-yolculuk.jpg" title={header?.title || info.title} description={header?.description || info.desc} crumbs={[{ label: 'Terapi süreci' }]} />

      <section className="mx-auto max-w-[1320px] px-6 py-24 md:py-32 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div data-reveal="image" className="arch relative aspect-[4/5] max-w-[440px] bg-sage-light">
              <Image src="/images/hero-orman-yolu.jpg" alt="" fill unoptimized priority sizes="(max-width: 1024px) 90vw, 440px" className="object-cover" />
            </div>
          </div>

          <ol className="border-t border-line">
            {steps.map((step: any, i: number) => (
              <li key={step.id ?? i} data-reveal style={delay(i * 40)} className="grid gap-4 border-b border-line py-10 md:grid-cols-[5rem_1fr]">
                <span className="font-serif text-[2.4rem] leading-none italic text-sage">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="font-serif text-[clamp(1.5rem,1.2rem+0.9vw,2rem)] leading-tight">{step.title}</h2>
                  <p className="mt-4 max-w-xl text-ink/75 leading-[1.75]">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line">
        <dl className="mx-auto grid max-w-[1320px] gap-10 px-6 py-20 md:grid-cols-3 lg:px-10">
          {[
            ['50 dakika', 'Bireysel seans süresi. Çift seansları 60–75 dakika.'],
            ['Haftada bir', 'Başlangıçta önerilen sıklık; zamanla aralıklar açılır.'],
            ['Yüz yüze & online', 'Kadıköy kliniğinde ya da güvenli görüntülü görüşmeyle.'],
          ].map(([k, v], i) => (
            <div key={k} data-reveal style={delay(i * 80)}>
              <dt className="font-serif text-[2rem] leading-tight text-forest">{k}</dt>
              <dd className="mt-3 max-w-xs text-muted leading-relaxed">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      <CtaBand image="/images/hero-nefes.jpg" />
    </>
  );
}
