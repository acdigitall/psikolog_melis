import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PageHero from '@/components/site/PageHero';
import CtaBand from '@/components/site/CtaBand';
import { ArrowRight, Plus } from '@/components/site/Icons';
import { getServices } from '@/app/actions/services';
import { getContactSettings } from '@/app/actions/contact';
import { faqs } from '@/lib/faqs';
import { pageMeta, IZMIR_DISTRICTS, OPENING_HOURS } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: "İzmir Psikolog · Alsancak'ta Yüz Yüze ve Online Terapi",
  description:
    "İzmir'de psikolog arıyorsanız: Alsancak'taki klinikte uzman klinik psikolog ile kaygı, panik atak, depresyon, ilişki ve travma için yüz yüze ya da online terapi. Ulaşım, ilçeler ve randevu bilgisi.",
  keywords:
    'izmir psikolog, psikolog izmir, alsancak psikolog, konak psikolog, karşıyaka psikolog, bornova psikolog, bayraklı psikolog, buca psikolog, izmir terapist, izmir uzman klinik psikolog',
  path: '/izmir-psikolog',
  image: '/images/klinik-salon.jpg',
});

const transport = [
  ['İZBAN', 'Alsancak istasyonu; Karşıyaka, Bayraklı, Çiğli ve Gaziemir yönünden doğrudan bağlantı.'],
  ['Metro & tramvay', 'Konak metro istasyonu ve Konak–Alsancak tramvay hattı; Bornova, Buca ve Karabağlar yönünden aktarmayla.'],
  ['Vapur', 'Alsancak iskelesi; Karşıyaka ve Bayraklı’dan körfezi geçerek birkaç dakikalık yürüyüşle.'],
  ['Otomobil', 'Çevrede ücretli otoparklar bulunur; seans saatinden birkaç dakika önce gelmeniz yeterlidir.'],
];

const districtGuides = [
  ['Alsancak ve Konak', "Alsancak'ta psikolog arıyorsanız klinik yürüme mesafesinde; Konak'ta psikolog arayanlar için de tramvayla birkaç durak uzaklıkta."],
  ['Karşıyaka', "Karşıyaka'dan psikolog desteği almak isteyenler İZBAN ile Alsancak istasyonuna ya da vapurla Alsancak iskelesine geçebilir; körfezin karşısı en kısa yoldan buraya bağlanır."],
  ['Bayraklı', "Bayraklı'da psikolog arayan danışanlar İZBAN ile ya da vapurla Alsancak'a birkaç dakikada ulaşır; Bayraklı'daki iş merkezlerinden öğle arası seanslar da planlanabilir."],
  ['Bornova', "Bornova'dan gelenler metroyla Basmane ya da Çankaya istasyonuna gelip kısa bir yürüyüşle kliniğe ulaşabilir. Bornova'da psikolog arayan öğrenciler ve çalışanlar için akşam saatleri de açık."],
  ['Buca', "Buca'da psikolog arayanlar Şirinyer İZBAN istasyonundan doğrudan Alsancak'a gelebilir; otobüsle Konak üzerinden de ulaşım kolaydır."],
  ['Karabağlar, Balçova ve Narlıdere', "Bu ilçelerden metroyla Konak istasyonuna, oradan tramvayla Alsancak'a gelinir. Ulaşım zor olan haftalarda seanslar online sürdürülebilir."],
];

const dayTr: Record<string, string> = {
  Monday: 'Pazartesi',
  Friday: 'Cuma',
  Saturday: 'Cumartesi',
};

export default async function IzmirPsikolog() {
  const [servicesRes, contactRes] = await Promise.all([getServices(), getContactSettings()]);
  const services = servicesRes.success && servicesRes.data ? servicesRes.data : [];
  const settings: any = contactRes.success ? contactRes.data : null;
  const localFaqs = faqs.filter((f) => /İzmir|Randevu/.test(f.q));

  return (
    <>
      <PageHero
        image="/images/klinik-salon.jpg"
        imageAlt="İzmir Alsancak'taki kliniğin aydınlık bekleme alanı"
        eyebrow="Alsancak · Konak / İzmir"
        title="İzmir'de psikolog desteği"
        description="Alsancak'taki klinikte yüz yüze, İzmir'in ve Türkiye'nin her yerinden online; kanıta dayalı yöntemlerle, size özel bir terapi süreci."
        crumbs={[{ label: 'İzmir Psikolog' }]}
      />

      {/* Kısa özet: arama motorları ve yapay zekâ yanıtları için doğrudan bilgi */}
      <section className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div data-reveal className="max-w-2xl space-y-6 text-[1.12rem] leading-[1.8] text-ink/80">
            <p className="font-serif text-[1.55rem] leading-[1.5] text-forest">
              İzmir&apos;de uzman klinik psikolog olarak Alsancak&apos;taki kliniğimde yetişkinlerle bireysel terapi ve
              çiftlerle ilişki terapisi yapıyorum.
            </p>
            <p>
              En sık çalıştığım konular kaygı ve panik atak, depresyon, ilişki ve evlilik sorunları, travma, yas ve
              tükenmişlik. Seanslarda Bilişsel Davranışçı Terapi (BDT), Şema Terapi ve EMDR gibi etkinliği araştırmalarla
              desteklenen yöntemleri, sizin ihtiyacınıza göre bir araya getiriyorum.
            </p>
            <p>
              Bireysel seanslar 50 dakika, çift seansları 60–75 dakika sürer. Yüz yüze gelemediğiniz haftalarda aynı süreci
              güvenli görüntülü görüşmeyle online olarak sürdürebiliriz.
            </p>
          </div>

          <dl data-reveal className="self-start rounded-[1.75rem] bg-sand px-8 py-4">
            {settings?.address && (
              <div className="border-b border-line py-5">
                <dt className="text-sm text-muted">Adres</dt>
                <dd className="mt-1 font-serif text-[1.2rem] leading-snug text-forest">
                  <address className="not-italic">{settings.address}</address>
                </dd>
              </div>
            )}
            <div className="border-b border-line py-5">
              <dt className="text-sm text-muted">Seans saatleri</dt>
              <dd className="mt-1 font-serif text-[1.2rem] leading-snug text-forest">
                {OPENING_HOURS.map((h) => (
                  <span key={h.days[0]} className="block">
                    {h.days.length > 1 ? `${dayTr[h.days[0]]}–${dayTr[h.days[h.days.length - 1]]}` : dayTr[h.days[0]]} {h.opens}–{h.closes}
                  </span>
                ))}
              </dd>
            </div>
            {settings?.phone1 && (
              <div className="border-b border-line py-5">
                <dt className="text-sm text-muted">Telefon</dt>
                <dd className="mt-1 font-serif text-[1.2rem] text-forest">
                  <a href={`tel:${settings.phone1.replace(/[^\d+]/g, '')}`} className="hover:text-olive">{settings.phone1}</a>
                </dd>
              </div>
            )}
            <div className="py-5">
              <dt className="text-sm text-muted">Seans biçimi</dt>
              <dd className="mt-1 font-serif text-[1.2rem] text-forest">Yüz yüze (Alsancak) · Online</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Ulaşım */}
      <section className="border-y border-line bg-white/60">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:px-10">
          <div data-reveal>
            <h2 className="h-section">Kliniğe nasıl ulaşırım?</h2>
            <p className="lead mt-5 max-w-md">
              Alsancak, İzmir&apos;in toplu taşımayla en kolay ulaşılan semtlerinden biri.
            </p>
            <div className="arch relative mt-10 hidden aspect-[4/5] max-w-[300px] bg-sage-light lg:block">
              <Image src="/images/klinik-pencere.jpg" alt="Alsancak'taki kliniğin pencere kenarı" fill unoptimized sizes="300px" className="object-cover" />
            </div>
          </div>
          <dl data-reveal className="divide-y divide-line border-y border-line self-start">
            {transport.map(([t, d]) => (
              <div key={t} className="grid gap-2 py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <dt className="font-serif text-[1.35rem] leading-tight text-forest">{t}</dt>
                <dd className="leading-relaxed text-ink/75">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* İlçeler */}
      <section className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:px-10">
        <div data-reveal className="max-w-2xl">
          <h2 className="h-section">İzmir&apos;in hangi ilçelerinden geliniyor?</h2>
          <p className="lead mt-5">
            Danışanlarım çoğunlukla aşağıdaki ilçelerden yüz yüze seanslara geliyor; daha uzak ilçelerden ve şehir dışından
            online görüşüyoruz.
          </p>
        </div>
        <ul data-reveal className="mt-10 flex flex-wrap gap-2.5">
          {IZMIR_DISTRICTS.map((d) => (
            <li key={d} className="rounded-full bg-sage-light/70 px-5 py-2.5 text-[15px] text-forest">
              {d}
            </li>
          ))}
        </ul>
      </section>

      {/* Semtlere göre */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:px-10">
          <h2 data-reveal className="h-section max-w-2xl">Semtinize göre kliniğe ulaşım</h2>
          <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {districtGuides.map(([d, t]) => (
              <div key={d} data-reveal className="border-t border-forest/30 pt-6">
                <h3 className="font-serif text-[1.4rem] leading-snug">{d}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hizmetler */}
      {services.length > 0 && (
        <section className="border-t border-line bg-sand/60">
          <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:px-10">
            <h2 data-reveal className="h-section max-w-2xl">İzmir&apos;de hangi konularda destek alabilirsiniz?</h2>
            <ul className="mt-12 grid gap-x-10 border-t border-line md:grid-cols-2">
              {services.map((s: any) => (
                <li key={s.slug} data-reveal className="border-b border-line">
                  <Link href={`/services/${s.slug}`} className="group flex items-start justify-between gap-6 py-7">
                    <span>
                      <span className="block font-serif text-[1.45rem] leading-snug text-forest transition-colors group-hover:text-olive">
                        {s.title}
                      </span>
                      <span className="mt-2 block text-[15px] leading-relaxed text-muted line-clamp-2">{s.desc}</span>
                    </span>
                    <ArrowRight className="mt-2 h-5 w-5 shrink-0 text-olive transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Yerel sorular */}
      {localFaqs.length > 0 && (
        <section className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div data-reveal>
              <h2 className="h-section">İzmir&apos;de terapi hakkında sorular</h2>
              <Link href="/faq" className="link-line mt-8">Tüm sorular <ArrowRight /></Link>
            </div>
            <div data-reveal className="border-t border-line">
              {localFaqs.map((f) => (
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
        </section>
      )}

      <CtaBand
        title="İzmir'de ilk görüşmenizi planlayalım"
        description="Alsancak'taki klinikte ya da online; size uygun bir zamanda kısa bir tanışma görüşmesiyle başlayalım."
      />
    </>
  );
}
