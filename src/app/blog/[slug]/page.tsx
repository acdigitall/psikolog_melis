import type { Metadata } from 'next';
import { pageMeta } from '@/lib/site';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CtaBand from '@/components/site/CtaBand';
import { getBlogPostBySlug, getBlogPosts } from '@/app/actions/blog';
import { getServiceBySlug } from '@/app/actions/services';
import { serviceLocal, categoryService } from '@/lib/service-local';
import { ArrowRight } from '@/components/site/Icons';
import JsonLd from '@/components/site/JsonLd';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';
import { PSYCHOLOGIST_NAME, JOB_TITLE } from '@/lib/site';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const response = await getBlogPostBySlug(slug);
  if (!response.success || !response.data) {
    return { title: 'Yazı bulunamadı', description: 'Aradığınız yazı bulunamadı.' };
  }
  const post = response.data;
  return pageMeta({
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt,
    keywords: post.metaKeys,
    path: `/blog/${post.slug}`,
    image: post.image,
    type: 'article',
    publishedTime: new Date(post.createdAt).toISOString(),
  });
}

/** Düz metin içeriği paragraf, liste ve ara başlıklara ayırır. */
function renderContent(content: string): React.ReactNode[] {
  const blocks = content.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block, i) => {
    const lines = block.split('\n');
    const isList = lines.every((l) => /^(\d+\.|-|•)\s/.test(l.trim()));
    if (isList) {
      const ordered = /^\d+\./.test(lines[0].trim());
      const Tag = ordered ? 'ol' : 'ul';
      return (
        <Tag key={i} className="my-8 space-y-4 border-l border-line pl-6">
          {lines.map((l, j) => (
            <li key={j}>{l.replace(/^(\d+\.|-|•)\s*/, '')}</li>
          ))}
        </Tag>
      );
    }
    const [firstLine, ...restLines] = lines;
    const looksLikeHeading =
      firstLine.length < 70 && !/[.!]$/.test(firstLine) && (restLines.length > 0 || /[?:]$/.test(firstLine));
    if (looksLikeHeading) {
      return (
        <div key={i}>
          <h2 className="mt-14 mb-5 font-serif text-[1.85rem] leading-tight">{firstLine.replace(/:$/, '')}</h2>
          {restLines.length > 0 && renderContent(restLines.join('\n'))}
        </div>
      );
    }
    if (/^Kısa yanıt:/.test(block)) {
      return (
        <p key={i} className="mb-10 rounded-[1.25rem] border-l-2 border-olive bg-sand/70 px-6 py-5 text-[1.08rem] leading-[1.75] text-ink/85">
          <strong className="font-medium text-forest">Kısa yanıt:</strong>
          {block.replace(/^Kısa yanıt:/, '')}
        </p>
      );
    }
    return <p key={i} className="mb-6">{block}</p>;
  });
}

export default async function BlogPostDetail({ params }: Props) {
  const { slug } = await params;
  const response = await getBlogPostBySlug(slug);
  if (!response.success || !response.data) notFound();

  const post = response.data;
  const date = new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const minutes = Math.max(2, Math.round(post.content.split(/\s+/).length / 200));
  const serviceSlug =
    Object.entries(serviceLocal).find(([, v]) => v.relatedPosts.includes(post.slug))?.[0] || categoryService[post.category];
  const [serviceRes, allPostsRes] = await Promise.all([
    serviceSlug ? getServiceBySlug(serviceSlug) : Promise.resolve(null),
    getBlogPosts(true),
  ]);
  const relatedService = serviceRes && serviceRes.success ? serviceRes.data : null;
  const allPosts = allPostsRes.success && allPostsRes.data ? allPostsRes.data : [];
  const morePosts = [
    ...allPosts.filter((p: any) => p.slug !== post.slug && p.category === post.category),
    ...allPosts.filter((p: any) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          articleSchema(post),
          breadcrumbSchema([{ name: 'Yazılar', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]),
        ]}
      />
      <article>
        <header className="mx-auto max-w-3xl px-6 pt-14 md:pt-20 text-center">
          <Link href="/blog" className="text-sm text-muted hover:text-forest transition-colors">← Tüm yazılar</Link>
          <p className="intro mt-12 text-sm text-muted">
            <span className="text-olive">{post.category}</span> · <time dateTime={new Date(post.createdAt).toISOString()}>{date}</time> · {minutes} dk okuma
          </p>
          <h1 className="intro mt-6 font-serif text-[clamp(2.2rem,1.5rem+2.8vw,3.75rem)] leading-[1.08] tracking-[-0.02em]">
            {post.title}
          </h1>
          <p className="intro lead mx-auto mt-8 max-w-2xl">{post.excerpt}</p>
        </header>

        {post.image && (
          <div className="intro-image mx-auto mt-14 md:mt-20 max-w-[1100px] px-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.25rem] bg-sage-light">
              <Image src={post.image} alt={post.title} fill unoptimized priority sizes="(max-width: 1100px) 100vw, 1100px" className="object-cover" />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-[680px] px-6 py-16 md:py-24 text-[1.15rem] leading-[1.85] text-ink/85">
          {renderContent(post.content)}

          {relatedService && (
            <aside className="mt-16 rounded-[1.5rem] bg-sand px-7 py-8">
              <p className="text-sm text-olive">İzmir&apos;de ve online destek</p>
              <p className="mt-2 font-serif text-[1.5rem] leading-snug text-forest">{relatedService.title}</p>
              <p className="mt-3 text-[1rem] leading-relaxed text-ink/75">{relatedService.desc}</p>
              <Link href={`/services/${relatedService.slug}`} className="link-line mt-5 text-[1rem]">
                Hizmet hakkında bilgi <ArrowRight />
              </Link>
            </aside>
          )}

          <p className="mt-16 border-t border-line pt-8 text-[15px] leading-relaxed text-muted">
            <span className="block font-serif text-lg text-forest">
              Yazar: <Link href="/about" rel="author" className="underline decoration-line underline-offset-4 hover:text-olive">{PSYCHOLOGIST_NAME}</Link>
            </span>
            <span className="mt-1 block">{JOB_TITLE} · Alsancak, İzmir</span>
            <span className="mt-4 block">
              Bu yazı genel bilgilendirme amaçlıdır; bireysel bir değerlendirme ya da tedavinin yerini tutmaz.
            </span>
          </p>
        </div>
      </article>
      {morePosts.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-20 lg:px-10">
            <h2 className="h-sub">Diğer yazılar</h2>
            <ul className="mt-8 grid gap-x-10 border-t border-line md:grid-cols-3 md:border-t-0">
              {morePosts.map((p: any) => (
                <li key={p.slug} className="border-b border-line md:border-b-0 md:border-t">
                  <Link href={`/blog/${p.slug}`} className="group block py-6">
                    <span className="text-sm text-olive">{p.category}</span>
                    <span className="mt-2 block font-serif text-[1.25rem] leading-snug text-forest transition-colors group-hover:text-olive">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <CtaBand image="/images/hero-nefes.jpg" />
    </>
  );
}
