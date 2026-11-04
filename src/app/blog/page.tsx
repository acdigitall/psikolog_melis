import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/app/actions/blog';
import { getPageHeader } from '@/app/actions/page-headers';
import CtaBand from '@/components/site/CtaBand';
import PageHero from '@/components/site/PageHero';

export const metadata: Metadata = {
  title: 'Yazılar',
  description: 'Ruh sağlığı, kaygı, depresyon, ilişkiler ve psikoterapi yöntemleri üzerine yazılar.',
};

const fmt = (d: Date) => new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
const delay = (ms: number) => ({ ['--reveal-delay' as string]: `${ms}ms` });

export default async function Blog() {
  const [response, headerRes] = await Promise.all([getBlogPosts(true), getPageHeader('blog')]);
  const posts = response.success && response.data ? response.data : [];
  const header = headerRes.success && headerRes.data ? headerRes.data : null;
  const [first, ...rest] = posts;

  return (
    <>
      <PageHero
        image="/images/blog-gunluk.jpg" title={header?.title || 'Yazılar'} description={header?.description} crumbs={[{ label: 'Yazılar' }]} />

      <section className="mx-auto max-w-[1320px] px-6 py-20 md:py-28 lg:px-10">
        {!first ? (
          <p className="text-muted">Henüz yayınlanmış bir yazı yok.</p>
        ) : (
          <>
            <Link href={`/blog/${first.slug}`} className="group grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
              <div className="intro-image relative aspect-[16/10] overflow-hidden rounded-[4px] bg-sage-light">
                {first.image && (
                  <Image src={first.image} alt="" fill unoptimized priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]" />
                )}
              </div>
              <div className="intro" style={{ ['--reveal-delay' as string]: '120ms' }}>
                <p className="text-sm text-muted"><span className="text-olive">{first.category}</span> · {fmt(first.createdAt)}</p>
                <h2 className="h-section mt-4 transition-colors duration-500 group-hover:text-olive">{first.title}</h2>
                <p className="lead mt-6">{first.excerpt}</p>
                <span className="link-line mt-8">Yazıyı oku</span>
              </div>
            </Link>

            <div className="mt-24 grid gap-x-10 gap-y-16 border-t border-line pt-16 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <Link key={post.id} href={`/blog/${post.slug}`} data-reveal style={delay((i % 3) * 80)} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-sage-light">
                    {post.image && (
                      <Image src={post.image} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]" />
                    )}
                  </div>
                  <p className="mt-6 text-sm text-muted"><span className="text-olive">{post.category}</span> · {fmt(post.createdAt)}</p>
                  <h2 className="mt-3 font-serif text-[1.55rem] leading-snug transition-colors duration-500 group-hover:text-olive">{post.title}</h2>
                  <p className="mt-3 text-[15px] text-muted leading-relaxed line-clamp-3">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
      <CtaBand image="/images/hero-sakin-oda.jpg" />
    </>
  );
}
