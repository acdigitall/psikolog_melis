import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import CtaBand from '@/components/site/CtaBand';
import Marquee from '@/components/site/Marquee';
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
  return {
    title: d?.metaTitle || 'Uzm. Klinik Psikolog | Bireysel, Çift ve Online Terapi',
    description:
      d?.metaDesc ||
      'Kaygı, depresyon, ilişki sorunları ve travma alanlarında kanıta dayalı yöntemlerle yüz yüze ve online psikoterapi.',
    keywords: d?.metaKeys || 'psikolog, klinik psikolog, bireysel terapi, çift terapisi, online terapi, emdr',
  };
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
const STEP_TONES = ['bg-sage-light', 'bg-sand', 'bg-mist', 'bg-[#E4E9D8]'];

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
  const slides = slidesRes.success && slidesRes.data ? slidesRes.data : [];
  const hero = slides[0] || null;
  const posts = blogRes.success && blogRes.data ? blogRes.data.slice(0, 3) : [];
  const steps = stepsRes.success && stepsRes.data ? stepsRes.data.slice(0, 4) : [];

  const featured = services.filter((s: any) => s.isFeatured);
  const shownServices = (featured.length > 0 ? featured : services).slice(0, 6);
  const approach = parseJson<{ title: string; desc: string }[]>(d?.whyUsItems, []);
  const concerns = (about.materials || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  const heroTitle = hero?.title || 'Pratik, şefkatli ve gerçekten işe yarayan bir terapi';
  const heroImg = hero?.bg || '/images/hero-sakin-oda.jpg';
  const heroImg2 = slides[1]?.bg || '/images/hero-nefes.jpg';

  return (
    <>
      {/* ——— Açılış ——— */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-y-0 right-0 hidden w-[42%] rounded-bl-[10rem] bg-sage-light/70 lg:block" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-14 px-6 pt-10 pb-20 md:pt-16 md:pb-28 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-10">
          <div>
            <p className="intro kicker mb-8">{hero?.subtitle || 'Uzm. Klinik Psikolog · Kadıköy & Online'}</p>
            <h1 style={delay(80)} className="intro display max-w-[15ch]">
              <Accent text={heroTitle} words={2} />
            </h1>
            <p style={delay(180)} className="intro lead mt-8 max-w-xl">
              {hero?.desc ||
                'Kaygı, depresyon, ilişki sorunları ve travma sonrası süreçlerde kanıta dayalı yöntemlerle, size özel bir yol haritası oluşturuyoruz.'}
            </p>
            <div style={delay(260)} className="intro mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
              <Link href="/quote" className="btn-primary">
                Randevu talebi oluştur <ArrowRight />
              </Link>
              <Link href="/services" className="link-line">Nasıl yardımcı olabilirim?</Link>
            </div>
            <ul style={delay(340)} className="intro mt-14 flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-ink/70">
              {['Yüz yüze & online', '50 dakikalık seanslar', 'BDT · Şema Terapi · EMDR'].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Görsel kompozisyon */}
          <div className="relative mx-auto w-full max-w-[560px] pb-16 pl-10 sm:pl-16">
            <div aria-hidden className="drift absolute -top-6 right-2 h-28 w-28 rounded-full bg-olive/85 sm:h-36 sm:w-36" />
            <div className="intro-image arch relative aspect-[4/5] bg-sage-light shadow-[0_40px_80px_-40px_rgba(23,50,31,0.45)]">
              <Image src={heroImg} alt={hero?.metaTitle || ''} fill unoptimized priority sizes="(max-width: 1024px) 90vw, 480px" className="object-cover" />
            </div>
            <div
              style={delay(300)}
              className="intro-image absolute bottom-0 left-0 w-[46%] overflow-hidden rounded-[1.25rem] border-[6px] border-paper bg-sage-light shadow-[0_30px_60px_-30px_rgba(23,50,31,0.5)]"
            >
              <div className="relative aspect-[4/5]">
                <Image src={heroImg2} alt="" fill unoptimized priority sizes="240px" className="object-cover" />
              </div>
            </div>
            <p
              style={delay(450)}
              className="intro absolute bottom-6 right-0 max-w-[13rem] text-right font-serif text-lg italic leading-snug text-forest"
            >
              “Tempoyu siz belirlersiniz.”
            </p>
          </div>
        </div>
      </section>

      {/* ——— Konular şeridi ——— */}
      <Marquee items={concerns.length ? concerns : ['Kaygı', 'Depresyon', 'İlişkiler', 'Travma', 'Yas']} className="bg-forest text-paper" />

      {/* ——— Hangi konularda ——— */}
      <section className="mx-auto max-w-[1320px] px-6 py-24 md:py-32 lg:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
          <div data-reveal className="relative">
            <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] bg-sage-light">
              <Image src="/images/klinik-oturma.jpg" alt="" fill unoptimized sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-4 max-w-[18rem] rounded-[1.5rem] bg-olive p-7 text-paper sm:-right-8">
              <p className="font-serif text-[1.55rem] leading-snug">Bu yolu tek başınıza yürümek zorunda değilsiniz.</p>
            </div>
          </div>
          <div data-reveal>
            <h2 className="h-section">
              Şunlarla mücadele ediyorsanız <em className="italic text-olive">destek olabilirim</em>
            </h2>
            <p className="lead mt-6 max-w-lg">
              Bazen zorluklar adını koyamadığımız bir ağırlık gibi hissettirir. Aşağıdakilerden biri tanıdık geliyorsa, bunu
              birlikte anlamlandırabiliriz.
            </p>
            <ul className="mt-10 flex flex-wrap gap-2.5">
              {concerns.map((c: string) => (
                <li key={c} className="rounded-full border border-forest/20 bg-white/70 px-5 py-2.5 text-[15px] text-forest transition-colors duration-300 hover:border-olive hover:bg-olive hover:text-paper">
                  {c}
                </li>
              ))}
            </ul>
            <Link href="/quote" className="btn-primary mt-12">
              Ön görüşme talep et <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ——— Tanışma ——— */}
      <section className="bg-sand">
        <div className="mx-auto grid max-w-[1320px] items-center gap-16 px-6 py-24 md:py-32 lg:grid-cols-[1.1fr_1fr] lg:gap-24 lg:px-10">
          <div data-reveal className="order-2 lg:order-1">
            <p className="kicker mb-6">Merhaba, tanışalım</p>
            <h2 className="h-section">
              <Accent text={about.storyTitle} words={1} />
            </h2>
            <div className="mt-8 max-w-xl space-y-5 leading-[1.75] text-ink/80">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[4.4rem] first-letter:leading-[0.8] first-letter:text-olive">
                {about.storyDesc1}
              </p>
              <p>{about.storyDesc2}</p>
            </div>
            <p className="mt-8 font-serif text-xl italic text-forest">— Uzm. Klinik Psikolog</p>
            <Link href="/about" className="btn-ghost mt-10">
              Hakkımda daha fazlası <ArrowRight />
            </Link>
          </div>
          <div data-reveal="image" className="relative order-1 mx-auto w-full max-w-[520px] lg:order-2">
            <div aria-hidden className="absolute -left-6 top-10 h-[78%] w-[70%] rounded-[2rem] bg-sage-light" />
            <div className="arch relative ml-auto aspect-[3/4] w-[82%] bg-sage-light">
              <Image src={about.storyImg || '/images/hakkimda-hikaye.jpg'} alt="" fill unoptimized sizes="(max-width: 1024px) 80vw, 420px" className="object-cover" />
            </div>
            <div className="absolute -bottom-8 left-0 w-[44%] overflow-hidden rounded-[1.25rem] border-[6px] border-sand">
              <div className="relative aspect-square">
                <Image src="/images/klinik-cay.jpg" alt="" fill unoptimized sizes="220px" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Hizmetler ——— */}
      <section className="mx-auto max-w-[1320px] px-6 py-24 md:py-32 lg:px-10">
        <div data-reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker mb-5">Hizmetler</p>
            <h2 className="h-section max-w-2xl">
              <Accent text={d?.servicesTitle || 'Size nasıl destek olabilirim?'} words={2} />
            </h2>
          </div>
          <Link href="/services" className="link-line shrink-0">Tüm hizmetler <ArrowRight /></Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shownServices.map((s: any, i: number) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              data-reveal
              style={delay((i % 3) * 90)}
              className={`group relative block overflow-hidden rounded-[1.75rem] bg-forest ${i % 3 === 1 ? 'lg:translate-y-10' : ''}`}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={s.img || '/images/hizmet-bireysel.jpg'}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                />
                <div className="photo-fade absolute inset-0" />
                <span className="absolute left-6 top-6 rounded-full bg-paper/90 px-3.5 py-1.5 text-xs font-medium text-forest">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="font-serif text-[1.9rem] leading-tight !text-paper">{s.title}</h3>
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                    <p className="overflow-hidden text-[15px] leading-relaxed text-paper/80">
                      <span className="block pt-3">{s.desc}</span>
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sage-light">
                    Detaylı bilgi <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— Fotoğraf bandı ——— */}
      <section className="relative mt-10 h-[70vh] min-h-[460px] max-h-[760px] overflow-hidden">
        <Image src="/images/hero-orman-yolu.jpg" alt="" fill unoptimized sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-forest-dark/45" />
        <div className="relative mx-auto flex h-full max-w-[1320px] items-end px-6 pb-16 md:pb-24 lg:px-10">
          <blockquote data-reveal className="max-w-3xl">
            <p className="font-serif text-[clamp(2rem,1.3rem+3vw,4rem)] italic leading-[1.1] text-paper">
              “Değişim, kendimize yargıyla değil merakla bakmaya başladığımızda mümkün olur.”
            </p>
          </blockquote>
        </div>
      </section>

      {/* ——— Yaklaşım ——— */}
      <section className="bg-forest text-paper">
        <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-32 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
            <div data-reveal className="lg:sticky lg:top-32 lg:self-start">
              <p className="kicker mb-6 !text-sage-light">Yaklaşımım</p>
              <h2 className="h-section !text-paper">
                <Accent text={d?.whyUsTitle || 'Kanıta dayalı, güçlü yanlarınızı merkeze alan bir terapi'} words={2} className="italic text-sage-light" />
              </h2>
              <div className="mt-12 relative aspect-[4/3] max-w-md overflow-hidden rounded-[1.5rem]">
                <Image src={d?.whyUsImg || '/images/anasayfa-yaklasim.jpg'} alt="" fill unoptimized sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {approach.map((item, i) => (
                <div
                  key={i}
                  data-reveal
                  style={delay((i % 2) * 100)}
                  className={`rounded-[1.5rem] p-8 ${i === 1 || i === 2 ? 'bg-paper/[0.07]' : 'bg-forest-light'} ${i % 2 === 1 ? 'sm:translate-y-12' : ''}`}
                >
                  <span className="font-serif text-5xl italic leading-none text-olive">{['i.', 'ii.', 'iii.', 'iv.'][i] ?? `${i + 1}.`}</span>
                  <h3 className="mt-6 font-serif text-[1.65rem] leading-tight !text-paper">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-paper/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Süreç ——— */}
      {steps.length > 0 && (
        <section className="mx-auto max-w-[1320px] px-6 py-24 md:py-32 lg:px-10">
          <div data-reveal className="mb-14 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className="kicker mb-5">Süreç</p>
              <h2 className="h-section">Terapi <em className="italic text-olive">nasıl ilerler?</em></h2>
            </div>
            <p className="lead max-w-md">Her adımı birlikte ve sizin temponuzda atıyoruz. Hiçbir şeyi anlatmaya hazır olmak zorunda değilsiniz.</p>
          </div>
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step: any, i: number) => (
              <li key={step.id ?? i} data-reveal style={delay(i * 90)} className={`flex flex-col rounded-[1.75rem] p-8 ${STEP_TONES[i % STEP_TONES.length]}`}>
                <span className="font-serif text-[4.5rem] italic leading-none text-forest/25">{i + 1}</span>
                <h3 className="mt-8 font-serif text-[1.5rem] leading-snug">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{step.desc}</p>
              </li>
            ))}
          </ol>
          <Link data-reveal href="/production" className="link-line mt-12">
            Sürecin tamamı <ArrowRight />
          </Link>
        </section>
      )}

      {/* ——— Yazılar ——— */}
      {posts.length > 0 && (
        <section className="bg-sage-light/60">
          <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-32 lg:px-10">
            <div data-reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="kicker mb-5">Yazılar</p>
                <h2 className="h-section">
                  <Accent text={d?.projectsTitle || 'Son yazılar'} words={1} />
                </h2>
              </div>
              <Link href="/blog" className="link-line shrink-0">Tüm yazılar <ArrowRight /></Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {posts.map((post: any, i: number) => (
                <Link key={post.id} href={`/blog/${post.slug}`} data-reveal style={delay(i * 90)} className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-paper">
                  <div className="relative aspect-[4/3] overflow-hidden bg-sage-light">
                    {post.image && (
                      <Image src={post.image} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]" />
                    )}
                    <span className="absolute left-5 top-5 rounded-full bg-paper/90 px-3.5 py-1.5 text-xs font-medium text-forest">{post.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-serif text-[1.5rem] leading-snug transition-colors duration-500 group-hover:text-olive">{post.title}</h3>
                    <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
                    <span className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-medium text-forest">
                      Yazıyı oku <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— Sorular ——— */}
      <section className="mx-auto max-w-[1320px] px-6 py-24 md:py-32 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div data-reveal>
            <p className="kicker mb-5">Sorular</p>
            <h2 className="h-section">Aklınızdaki <em className="italic text-olive">sorular</em></h2>
            <p className="lead mt-6 max-w-sm">Burada yanıtını bulamadığınız her şeyi bana doğrudan sorabilirsiniz.</p>
            <div className="mt-10 relative hidden aspect-[4/3] max-w-sm overflow-hidden rounded-[1.5rem] lg:block">
              <Image src="/images/klinik-masa.jpg" alt="" fill unoptimized sizes="380px" className="object-cover" />
            </div>
            <Link href="/faq" className="link-line mt-10">Tüm sorular <ArrowRight /></Link>
          </div>
          <div data-reveal style={delay(100)} className="space-y-3">
            {faqs.slice(0, 6).map((f, i) => (
              <details key={i} className="group rounded-[1.25rem] bg-white/70 px-7 transition-colors duration-300 open:bg-sage-light/70" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-6 font-serif text-[1.3rem] leading-snug text-forest">
                  {f.q}
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-paper transition-transform duration-500 group-open:rotate-45">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="-mt-1 pb-7 pr-12 leading-relaxed text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={d?.ctaTitle || undefined}
        description={d?.ctaDesc || undefined}
        primary={{ text: d?.ctaBtn1Text || 'Randevu talebi oluştur', href: d?.ctaBtn1Link || '/quote' }}
        secondary={{ text: d?.ctaBtn2Text || 'Önce soru sormak istiyorum', href: d?.ctaBtn2Link || '/contact' }}
      />
    </>
  );
}
