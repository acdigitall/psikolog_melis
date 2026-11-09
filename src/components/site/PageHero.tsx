import Image from 'next/image';
import Link from 'next/link';
import JsonLd from '@/components/site/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

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
  imageAlt,
  background = 'bg-sand/60',
}: {
  eyebrow?: string;
  title: string;
  description?: string | null;
  image?: string | null;
  crumbs?: Crumb[];
  accentWords?: number;
  imageAlt?: string;
  background?: string;
}) {
  return (
    <section className={`border-b border-line ${background}`}>
      {crumbs.length > 0 && <JsonLd data={breadcrumbSchema(crumbs.map((c) => ({ name: c.label, path: c.href })))} />}
      <div
        className={`mx-auto grid max-w-[1240px] items-center gap-12 px-6 pt-12 pb-16 md:pt-14 md:pb-20 lg:px-10 ${
          image ? 'lg:grid-cols-[1.4fr_1fr] lg:gap-20' : ''
        }`}
      >
        <div>
          {crumbs.length > 0 && (
            <nav aria-label="Sayfa yolu" className="intro mb-10 text-sm text-muted">
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
            {title}
          </h1>
          {description && (
            <p style={{ ['--reveal-delay' as string]: '140ms' }} className="intro lead mt-7 max-w-xl whitespace-pre-line">
              {description}
            </p>
          )}
        </div>

        {image && (
          <div className="intro-image mx-auto hidden w-full max-w-[340px] lg:block">
            <div className="arch relative aspect-[4/5] bg-sage-light">
              <Image src={image} alt={imageAlt || ""} fill unoptimized priority sizes="340px" className="object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
