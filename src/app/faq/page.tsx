import type { Metadata } from 'next';
import { pageMeta } from '@/lib/site';
import Link from 'next/link';
import CtaBand from '@/components/site/CtaBand';
import PageHero from '@/components/site/PageHero';
import { Plus, ArrowRight } from '@/components/site/Icons';
import { faqs } from '@/lib/faqs';
import JsonLd from '@/components/site/JsonLd';
import { faqSchema } from '@/lib/schema';

export const metadata: Metadata = pageMeta({
  title: "İzmir'de Psikolog ve Terapi Hakkında Sık Sorulan Sorular",
  description: "İzmir'de psikoloğa gitmek, seans süresi ve sıklığı, online terapi, gizlilik ve ilk görüşme hakkında merak edilen soruların yanıtları.",
  path: '/faq',
});

export default function FAQ() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <PageHero
        image="/images/klinik-cay.jpg"
        title="Sıkça sorulan sorular"
        description="Terapiye başlamadan önce en çok merak edilenler. Yanıtını bulamadığınız bir soru olursa bana doğrudan yazabilirsiniz."
        crumbs={[{ label: 'Sorular' }]}
      />

      <section className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_2fr] lg:gap-24">
          <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-muted leading-relaxed max-w-xs">Başka bir sorunuz mu var?</p>
            <Link href="/contact" className="link-line mt-4">Bana yazın <ArrowRight /></Link>
          </div>
          <div className="border-t border-line">
            {faqs.map((f, i) => (
              <details key={i} data-reveal className="group border-b border-line" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-7 font-serif text-[clamp(1.3rem,1.15rem+0.5vw,1.6rem)] leading-snug text-forest">
                  {f.q}
                  <Plus className="mt-1.5 h-5 w-5 shrink-0 text-olive transition-transform duration-500 group-open:rotate-45" />
                </summary>
                <p className="-mt-1 max-w-2xl pb-8 sm:pr-12 text-ink/75 leading-[1.75]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <CtaBand image="/images/hero-sakin-oda.jpg" />
    </>
  );
}
