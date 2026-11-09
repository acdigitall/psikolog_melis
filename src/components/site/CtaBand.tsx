import Link from 'next/link';
import { ArrowRight } from '@/components/site/Icons';

export default function CtaBand({
  title = 'Kendinizi daha iyi hissetmeye doğru ilk adımı atın',
  description = 'Yüz yüze ya da online; size uygun bir zamanda tanışma görüşmesi planlayalım. Hangi desteğin size iyi geleceğini birlikte netleştirelim.',
  primary = { text: 'Randevu talebi oluştur', href: '/quote' },
  secondary = { text: 'Önce soru sormak istiyorum', href: '/contact' },
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  primary?: { text: string; href: string };
  secondary?: { text: string; href: string } | null;
  image?: string | null;
}) {
  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-16 md:pb-24 lg:pb-28 lg:px-10">
      <div data-reveal className="scene-tepeler overflow-hidden rounded-[1.75rem] bg-forest px-6 py-14 text-center text-paper sm:px-10 md:px-16 md:py-20">
        <h2 className="h-section mx-auto max-w-2xl !text-paper" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-paper/90 sm:text-lg">{description}</p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link href={primary.href} className="btn-light">
            {primary.text} <ArrowRight />
          </Link>
          {secondary && (
            <Link href={secondary.href} className="btn-outline-light">
              {secondary.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
