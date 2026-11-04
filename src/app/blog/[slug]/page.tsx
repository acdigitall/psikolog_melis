import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CtaBand from '@/components/site/CtaBand';
import { getBlogPostBySlug } from '@/app/actions/blog';

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
  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt,
    ...(post.metaKeys ? { keywords: post.metaKeys } : {}),
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      images: post.image ? [{ url: post.image, alt: post.metaTitle || post.title }] : [],
    },
  };
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

  return (
    <>
      <article>
        <header className="mx-auto max-w-3xl px-6 pt-14 md:pt-20 text-center">
          <Link href="/blog" className="text-sm text-muted hover:text-forest transition-colors">← Tüm yazılar</Link>
          <p className="intro mt-12 text-sm text-muted">
            <span className="text-olive">{post.category}</span> · {date} · {minutes} dk okuma
          </p>
          <h1 className="intro mt-6 font-serif text-[clamp(2.2rem,1.5rem+2.8vw,3.75rem)] leading-[1.08] tracking-[-0.02em]">
            {post.title}
          </h1>
          <p className="intro lead mx-auto mt-8 max-w-2xl">{post.excerpt}</p>
        </header>

        {post.image && (
          <div className="intro-image mx-auto mt-14 md:mt-20 max-w-[1100px] px-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.25rem] bg-sage-light">
              <Image src={post.image} alt={post.metaTitle || ''} fill unoptimized priority sizes="(max-width: 1100px) 100vw, 1100px" className="object-cover" />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-[680px] px-6 py-16 md:py-24 text-[1.15rem] leading-[1.85] text-ink/85">
          {renderContent(post.content)}

          <p className="mt-16 border-t border-line pt-8 text-[15px] leading-relaxed text-muted">
            Bu yazı genel bilgilendirme amaçlıdır; bireysel bir değerlendirme ya da tedavinin yerini tutmaz.
          </p>
        </div>
      </article>
      <CtaBand image="/images/hero-nefes.jpg" />
    </>
  );
}
