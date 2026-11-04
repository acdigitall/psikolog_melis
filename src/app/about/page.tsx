import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAboutPage, getDefaultAboutData } from '@/app/actions/about';
import { getPageHeader } from '@/app/actions/page-headers';
import CtaBand from '@/components/site/CtaBand';
import PageHero from '@/components/site/PageHero';
import { ArrowRight } from '@/components/site/Icons';

export async function generateMetadata(): Promise<Metadata> {
  const res = await getAboutPage();
  const defaultData = await getDefaultAboutData();
  const data = res.success && res.data ? res.data : defaultData;
  return {
    title: data.metaTitle || 'Hakkımda',
    description: data.metaDesc || 'Eğitimim, terapi yaklaşımım ve çalışma alanlarım.',
    keywords: data.metaKeys || 'psikolog hakkında, klinik psikolog, bdt, emdr, şema terapi',
  };
}

function parseList(value: unknown, fallback: string): { title: string; desc: string }[] {
  const tryParse = (v: unknown) => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') {
      try {
        const p = JSON.parse(v);
        return Array.isArray(p) ? p : null;
      } catch {
        return null;
      }
    }
    return null;
  };
  return tryParse(value) || tryParse(fallback) || [];
}

const delay = (ms: number) => ({ ['--reveal-delay' as string]: `${ms}ms` });

export default async function About() {
  const [res, defaultData, headerRes] = await Promise.all([getAboutPage(), getDefaultAboutData(), getPageHeader('about')]);
  const raw: any = res.success && res.data ? res.data : defaultData;
  const d: any = Object.fromEntries(
    Object.entries({ ...defaultData, ...raw }).map(([k, v]) => [k, v || (defaultData as any)[k]])
  );
  const header = headerRes.success && headerRes.data ? headerRes.data : null;

  const highlights = parseList(raw.brochureHighlights, defaultData.brochureHighlights);
  const policies = parseList(raw.policies, defaultData.policies);
  const areas = (d.materials || '').split(',').map((s: string) => s.trim()).filter(Boolean);

  return (
    <>
      <PageHero
        image="/images/klinik-pencere.jpg" title={header?.title || 'Hakkımda'} description={header?.description} crumbs={[{ label: 'Hakkımda' }]} />

      {/* Hikaye */}
      <section className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-32 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
          <div data-reveal="image" className="lg:sticky lg:top-28 lg:self-start">
            <div className="arch relative aspect-[4/5] max-w-[480px] bg-sage-light">
              <Image src={d.storyImg} alt="" fill unoptimized priority sizes="(max-width: 1024px) 90vw, 480px" className="object-cover" />
            </div>
          </div>
          <div data-reveal className="lg:pt-10">
            <h2 className="h-section">{d.storyTitle}</h2>
            <div className="mt-10 max-w-xl space-y-6 text-[1.08rem] leading-[1.8] text-ink/80">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[4.4rem] first-letter:leading-[0.8] first-letter:text-forest">
                {d.storyDesc1}
              </p>
              <p>{d.storyDesc2}</p>
            </div>

            <div className="mt-16 grid gap-10 border-t border-line pt-10 sm:grid-cols-2">
              {[
                { title: d.visionTitle, text: d.visionText },
                { title: d.missionTitle, text: d.missionText },
              ].map((b, i) => (
                <div key={i} data-reveal style={delay(i * 100)}>
                  <h3 className="font-serif text-[1.5rem] leading-tight">{b.title}</h3>
                  <p className="mt-3 text-[15px] text-muted leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Yöntemler */}
      <section className="bg-forest text-paper">
        <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-6 py-16 md:py-24 lg:py-32 lg:grid-cols-[1.1fr_1fr] lg:gap-24 lg:px-10">
          <div data-reveal>
            <p className="kicker mb-6 !text-sage-light">{d.bridgeLabel}</p>
            <h2 className="h-section !text-paper" dangerouslySetInnerHTML={{ __html: d.bridgeTitle }} />
            <p className="mt-8 max-w-xl text-[1.08rem] leading-[1.75] text-paper/80">{d.bridgeDesc1}</p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-paper/60">{d.bridgeDesc2}</p>
          </div>
          <div data-reveal="image" className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-forest-dark">
            <Image src={d.bridgeImg} alt="" fill unoptimized sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Eğitimler & alanlar */}
      <section className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-32 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
          <div data-reveal>
            <h2 className="h-section">{d.brochureTitle}</h2>
            <p className="lead mt-6 max-w-sm">{d.brochureDesc}</p>
          </div>
          <dl className="border-t border-line">
            {highlights.map((item, i) => (
              <div key={i} data-reveal style={delay(i * 60)} className="grid gap-2 border-b border-line py-7 md:grid-cols-[1fr_1.3fr] md:gap-10">
                <dt className="font-serif text-[1.4rem] leading-snug text-forest">{item.title}</dt>
                <dd className="text-muted leading-relaxed">{item.desc}</dd>
              </div>
            ))}
          </dl>
        </div>

        {areas.length > 0 && (
          <div data-reveal className="mt-24 md:mt-32 rounded-[2rem] bg-sage-light/70 p-8 md:p-14">
            <h3 className="h-sub">{d.materialsTitle}</h3>
            <ul className="mt-8 flex flex-wrap gap-3">
              {areas.map((a: string) => (
                <li key={a} className="rounded-full bg-paper px-5 py-2.5 font-serif text-[1.15rem] text-forest">{a}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* İlkeler */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-32 lg:px-10">
          <h2 data-reveal className="h-section max-w-2xl">{d.policyTitle}</h2>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {policies.map((p, i) => (
              <div key={i} data-reveal style={delay(i * 90)} className={`rounded-[1.75rem] p-8 ${["bg-sand", "bg-mist", "bg-sage-light/70"][i % 3]}`}>
                <h3 className="font-serif text-[1.5rem] leading-tight">{p.title}</h3>
                <p className="mt-3 text-muted leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <Link data-reveal href="/services" className="link-line mt-16">
            Çalışma alanlarım <ArrowRight />
          </Link>
        </div>
      </section>
      <CtaBand image="/images/hakkimda-denge.jpg" />
    </>
  );
}
