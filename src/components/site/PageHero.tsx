import Image from 'next/image';
import Link from 'next/link';
import Accent from '@/components/site/Accent';

interface Crumb {
  label: string;
  href?: string;
}

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  crumbs = [],
  accentWords = 1,
}: {
  eyebrow?: string;
  title: string;
  description?: string | null;
  image?: string | null;
  crumbs?: Crumb[];
  accentWords?: number;
}) {
  return (
    <section className="relative overflow-hidden bg-sage-light/60">
      <div aria-hidden className="drift absolute -right-20 -top-24 h-72 w-72 rounded-full bg-paper/50" />
      <div
        className={`relative mx-auto grid max-w-[1320px] items-center gap-12 px-6 pt-12 pb-16 md:pt-16 md:pb-20 lg:px-10 ${
          image ? 'lg:grid-cols-[1.3fr_1fr] lg:gap-20' : ''
        }`}
      >
        <div>
          {crumbs.length > 0 && (
            <nav aria-label="Sayfa yolu" className="intro mb-10 text-sm text-forest/60">
              <Link href="/" className="hover:text-forest transition-colors">Anasayfa</Link>
              {crumbs.map((c, i) => (
                <span key={i}>
                  <span className="mx-2 opacity-50">/</span>
                  {c.href ? (
                    <Link href={c.href} className="hover:text-forest transition-colors">{c.label}</Link>
                  ) : (
                    <span className="text-forest">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && <p className="intro kicker mb-6">{eyebrow}</p>}
          <h1 style={{ ['--reveal-delay' as string]: '60ms' }} className="intro display max-w-[16ch]">
            <Accent text={title} words={accentWords} />
          </h1>
          {description && (
            <p style={{ ['--reveal-delay' as string]: '160ms' }} className="intro lead mt-8 max-w-xl whitespace-pre-line">
              {description}
            </p>
          )}
        </div>

        {image && (
          <div className="relative mx-auto w-full max-w-[420px]">
            <div aria-hidden className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-olive/80" />
            <div className="intro-image arch relative aspect-[4/5] bg-sage">
              <Image src={image} alt="" fill unoptimized priority sizes="(max-width: 1024px) 90vw, 420px" className="object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
