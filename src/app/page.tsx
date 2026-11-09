import Link from 'next/link';
import { pageMeta, DEFAULT_DESCRIPTION } from '@/lib/site';
import Image from 'next/image';
import type { Metadata } from 'next';
import CtaBand from '@/components/site/CtaBand';
import Accent from '@/components/site/Accent';
import { ArrowRight, Plus } from '@/components/site/Icons';
import { getServices } from '@/app/actions/services';
import { getHomePage } from '@/app/actions/home';
import { getSlides } from '@/app/actions/slides';
import { getAboutPage, getDefaultAboutData } from '@/app/actions/about';
import { getBlogPosts } from '@/app/actions/blog';
import { getProductionSteps } from '@/app/actions/production';
import { faqs } from '@/lib/faqs';

export async function generateMetadata(): Promise<Metadata> {
  const res = await getHomePage();
  const d = res.success && res.data ? res.data : null;
  return pageMeta({
    title: d?.metaTitle || 'İzmir Uzm. Klinik Psikolog Melisa Sağlam | Alsancak & Online Terapi',
    description: d?.metaDesc || DEFAULT_DESCRIPTION,
    keywords: d?.metaKeys || 'izmir psikolog, psikolog izmir, alsancak psikolog, izmir klinik psikolog, izmir online terapi',
    path: '/',
    absoluteTitle: true,
  });
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (!value) return fallback;
  if (typeof value !== 'string') return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

const delay = (ms: number) => ({ ['--reveal-delay' as string]: `${ms}ms` });

export default async function Home() {
  const [homeRes, servicesRes, slidesRes, aboutRes, blogRes, stepsRes] = await Promise.all([
    getHomePage(),
    getServices(),
    getSlides(),
    getAboutPage(),
    getBlogPosts(true),
    getProductionSteps(),
  ]);
  const defaultAbout = await getDefaultAboutData();

  const d = homeRes.success && homeRes.data ? homeRes.data : null;
  const about = aboutRes.success && aboutRes.data ? aboutRes.data : defaultAbout;
  const services = servicesRes.success && servicesRes.data ? servicesRes.data : [];
  const hero = slidesRes.success && slidesRes.data ? slidesRes.data[0] : null;
  const posts = blogRes.success && blogRes.data ? blogRes.data.slice(0, 3) : [];
  const steps = stepsRes.success && stepsRes.data ? stepsRes.data.slice(0, 4) : [];

  const featured = services.filter((s: any) => s.isFeatured);
  const shownServices = (featured.length > 0 ? featured : services).slice(0, 6);
  const approach = parseJson<{ title: string; desc: string }[]>(d?.whyUsItems, []);
  const concerns = (about.materials || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  return (
    <>
      {/* ——— Açılış ——— */}
      <section className="mx-auto grid max-w-[1240px] items-center gap-12 px-6 pt-10 pb-16 md:grid-cols-[1.25fr_1fr] md:gap-10 md:pt-14 md:pb-24 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:pb-28 lg:px-10">
        <div>
          <h1 className="intro kicker mb-7 font-sans">{hero?.subtitle || 'İzmir Psikolog · Uzm. Klinik Psikolog · Alsancak & Online'}</h1>
          <p style={delay(80)} className="intro display max-w-[15ch] [text-wrap:balance]">
            <Accent text={hero?.title || 'Pratik, şefkatli ve gerçekten işe yarayan bir terapi'} words={2} />
          </p>
          <p style={delay(160)} className="intro lead mt-7 max-w-xl">
            {hero?.desc ||
              'Kaygı, depresyon, ilişki sorunları ve travma sonrası süreçlerde kanıta dayalı yöntemlerle, size özel bir yol haritası oluşturuyoruz.'}
          </p>
          <div style={delay(240)} className="intro mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/quote" className="btn-primary">
              Randevu talebi oluştur <ArrowRight />
            </Link>
            <Link href="/contact" className="btn-ghost">Ön görüşme için arayın</Link>
          </div>
          <p style={delay(320)} className="intro mt-10 text-sm text-muted">
            <Link href="/izmir-psikolog" className="underline decoration-line underline-offset-4 hover:text-forest transition-colors">İzmir Alsancak&apos;taki klinikte</Link>{' '}yüz yüze · Türkiye&apos;nin her yerinden online
          </p>
        </div>

        <div className="intro-image mx-auto w-full max-w-[300px] sm:max-w-[380px] md:max-w-none lg:max-w-[480px]">
          <div className="arch relative aspect-[4/5] bg-sage-light">
            <Image
              src={hero?.bg || '/images/hero-sakin-oda.jpg'}
              alt={hero?.metaTitle || "İzmir Alsancak'ta sakin terapi odası"}
              fill
              unoptimized
              priority
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ——— Destek olabileceğim konular ——— */}
      {concerns.length > 0 && (
        <section className="scene-adacayi border-y border-line">
          <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
            <div data-reveal className="max-w-2xl">
              <h2 className="h-section">Şu durumlarda destek olabilirim</h2>
              <p className="lead mt-5">Aşağıdakilerden biri size tanıdık geliyorsa, bunu birlikte anlamlandırabiliriz.</p>
            </div>
            <ul data-reveal className="mt-12 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {concerns.map((c: string) => (
                <li key={c} className="flex items-baseline gap-3 text-[1.05rem] text-ink/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full bg-olive" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ——— Yalnız değilsiniz ——— */}
      <section className="mx-auto max-w-[1240px] px-6 pt-16 md:pt-24 lg:pt-28 lg:px-10">
        <div data-reveal className="flex flex-col gap-8 rounded-[1.75rem] bg-forest px-6 py-10 text-paper sm:px-10 sm:py-12 md:flex-row md:items-center md:justify-between md:px-14">
          <div className="max-w-xl">
            <h2 className="font-serif text-[clamp(1.7rem,1.3rem+1.2vw,2.4rem)] leading-tight !text-paper">
              Bu yolu tek başınıza yürümek zorunda değilsiniz.
            </h2>
            <p className="mt-3 text-paper/75">Kısa bir ön görüşmeyle sorularınızı yanıtlayalım, size uygun desteği birlikte belirleyelim.</p>
          </div>
          <Link href="/quote" className="btn-light shrink-0">
            Ön görüşme talep et <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ——— Tanışma ——— */}
      <section className="mx-auto grid max-w-[1240px] items-center gap-12 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-10 md:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:py-28 lg:px-10">
        <div data-reveal="image" className="mx-auto w-full max-w-[320px] sm:max-w-[380px] md:max-w-none lg:max-w-[440px]">
          <div className="arch relative aspect-[4/5] bg-sage-light">
            <Image src={about.storyImg || '/images/hakkimda-hikaye.jpg'} alt="İzmir'de uzman klinik psikolog ile terapi" fill unoptimized sizes="(max-width: 1024px) 90vw, 440px" className="object-cover" />
          </div>
        </div>
        <div data-reveal>
          <p className="kicker mb-6">Merhaba, tanışalım</p>
          <h2 className="h-section">{about.storyTitle}</h2>
          <div className="mt-7 max-w-xl space-y-5 leading-[1.75] text-ink/80">
            <p>{about.storyDesc1}</p>
            <p>{about.storyDesc2}</p>
          </div>
          <Link href="/about" className="link-line mt-9">
            Hakkımda daha fazlası <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ——— Yaklaşım ——— */}
      <section className="bg-sand/70">
        <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div data-reveal>
              <p className="kicker mb-6">Yaklaşımım</p>
              <h2 className="h-section">{d?.whyUsTitle || 'Kanıta dayalı, güçlü yanlarınızı merkeze alan bir terapi'}</h2>
              <div className="mt-10 grid max-w-md grid-cols-2 gap-4">
                <div className="arch relative aspect-[3/4] bg-sage-light">
                  <Image src={d?.whyUsImg || '/images/anasayfa-yaklasim.jpg'} alt="" fill unoptimized sizes="220px" className="object-cover" />
                </div>
                <div className="arch relative mt-10 aspect-[3/4] bg-sage-light">
                  <Image src="/images/hakkimda-denge.jpg" alt="" fill unoptimized sizes="220px" className="object-cover" />
                </div>
              </div>
            </div>
            <div data-reveal className="lg:pt-4">
              <dl className="divide-y divide-line border-y border-line">
                {approach.map((item, i) => (
                  <div key={i} className="py-7">
                    <dt className="font-serif text-[1.45rem] leading-tight text-forest">{item.title}</dt>
                    <dd className="mt-2 text-ink/70 leading-relaxed">{item.desc}</dd>
                  </div>
                ))}
              </dl>
              <blockquote className="mt-10 border-l-2 border-olive pl-6 font-serif text-[1.45rem] italic leading-snug text-forest">
                “Değişim, kendimize yargıyla değil merakla bakmaya başladığımızda mümkün olur.”
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Hizmetler ——— */}
      <section className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
        <div data-reveal className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="h-section max-w-2xl">{d?.servicesTitle || 'Size nasıl destek olabilirim?'}</h2>
          <Link href="/services" className="link-line shrink-0 self-start md:self-auto">Tüm hizmetler <ArrowRight /></Link>
        </div>
        <div className="snap-row sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3">
          {shownServices.map((s: any, i: number) => (
            <Link key={s.slug} href={`/services/${s.slug}`} data-reveal style={delay((i % 3) * 70)} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-sage-light">
                <Image
                  src={s.img || '/images/hizmet-bireysel.jpg'}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-6 font-serif text-[1.55rem] leading-snug transition-colors duration-300 group-hover:text-olive">{s.title}</h3>
              <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted">{s.desc}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-forest">
                Detaylı bilgi <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— Süreç ——— */}
      {steps.length > 0 && (
        <section className="scene-dalgalar border-t border-line">
          <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
            <div data-reveal className="mb-12 max-w-2xl">
              <h2 className="h-section">Terapi nasıl ilerler?</h2>
              <p className="lead mt-5">Her adımı birlikte ve sizin temponuzda atıyoruz.</p>
            </div>
            <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {steps.map((step: any, i: number) => (
                <li key={step.id ?? i} data-reveal style={delay(i * 70)} className="border-t border-forest/30 pt-6">
                  <span className="text-sm font-medium text-olive">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 font-serif text-[1.35rem] leading-snug">{step.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{step.desc}</p>
                </li>
              ))}
            </ol>
            <Link data-reveal href="/production" className="link-line mt-12">
              Sürecin tamamı <ArrowRight />
            </Link>
          </div>
        </section>
      )}

      {/* ——— Sorular ——— */}
      <section className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div data-reveal>
            <h2 className="h-section">Sıkça sorulan sorular</h2>
            <p className="lead mt-5 max-w-sm">Yanıtını bulamadığınız her şeyi bana doğrudan sorabilirsiniz.</p>
            <Link href="/faq" className="link-line mt-8">Tüm sorular <ArrowRight /></Link>
          </div>
          <div data-reveal className="border-t border-line">
            {faqs.slice(0, 5).map((f, i) => (
              <details key={i} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-6 font-serif text-[1.25rem] leading-snug text-forest">
                  {f.q}
                  <Plus className="mt-1 h-5 w-5 shrink-0 text-olive transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="-mt-1 pb-7 sm:pr-12 leading-relaxed text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Yazılar ——— */}
      {posts.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
            <div data-reveal className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2 className="h-section">{d?.projectsTitle || 'Son yazılar'}</h2>
              <Link href="/blog" className="link-line shrink-0 self-start md:self-auto">Tüm yazılar <ArrowRight /></Link>
            </div>
            <div className="snap-row sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3">
              {posts.map((post: any, i: number) => (
                <Link key={post.id} href={`/blog/${post.slug}`} data-reveal style={delay(i * 70)} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-[1.25rem] bg-sage-light">
                    {post.image && (
                      <Image src={post.image} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]" />
                    )}
                  </div>
                  <p className="mt-5 text-sm text-olive">{post.category}</p>
                  <h3 className="mt-2 font-serif text-[1.35rem] leading-snug transition-colors duration-300 group-hover:text-olive">{post.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title={d?.ctaTitle || undefined}
        description={d?.ctaDesc || undefined}
        primary={{ text: d?.ctaBtn1Text || 'Randevu talebi oluştur', href: d?.ctaBtn1Link || '/quote' }}
        secondary={{ text: d?.ctaBtn2Text || 'Önce soru sormak istiyorum', href: d?.ctaBtn2Link || '/contact' }}
      />
    </>
  );
}
