import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from '@/components/site/Icons';

export default function CtaBand({
  title = 'Kendinizi daha iyi hissetmeye doğru ilk adımı atın',
  description = 'Yüz yüze ya da online; size uygun bir zamanda tanışma görüşmesi planlayalım. Hangi desteğin size iyi geleceğini birlikte netleştirelim.',
  primary = { text: 'Randevu talebi oluştur', href: '/quote' },
  secondary = { text: 'Önce soru sormak istiyorum', href: '/contact' },
  image = '/images/hero-nefes.jpg',
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  primary?: { text: string; href: string };
  secondary?: { text: string; href: string } | null;
  image?: string | null;
}) {
  return (
    <section className="px-4 pb-4 md:px-6 md:pb-6">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2.25rem] bg-olive text-paper">
        <div aria-hidden className="drift absolute -left-16 -top-16 h-64 w-64 rounded-full bg-paper/10" />
        <div aria-hidden className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-forest/25" />
        <div className="relative grid items-center gap-12 px-8 py-16 md:px-16 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div data-reveal>
            <h2 className="h-section max-w-xl !text-paper" dangerouslySetInnerHTML={{ __html: title }} />
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper/85">{description}</p>
            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
              <Link href={primary.href} className="btn-light">
                {primary.text} <ArrowRight />
              </Link>
              {secondary && (
                <Link href={secondary.href} className="link-line !text-paper">
                  {secondary.text}
                </Link>
              )}
            </div>
          </div>
          {image && (
            <div data-reveal="image" className="relative mx-auto w-full max-w-[420px]">
              <div className="arch relative aspect-[4/5] border-[6px] border-paper/20 bg-forest">
                <Image src={image} alt="" fill unoptimized sizes="(max-width: 1024px) 80vw, 420px" className="object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
