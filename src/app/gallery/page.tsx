import type { Metadata } from 'next';
import { getGalleryItems } from '@/app/actions/gallery';
import GalleryGrid from '@/components/GalleryGrid';
import { getPageHeader } from '@/app/actions/page-headers';
import CtaBand from '@/components/site/CtaBand';
import PageHero from '@/components/site/PageHero';

export const metadata: Metadata = {
  title: 'Klinik',
  description: 'Sakin, konforlu ve güvenli terapi ortamından kareler.',
};

export default async function Gallery() {
  const [response, headerRes] = await Promise.all([getGalleryItems(), getPageHeader('gallery')]);
  const items = response.success && response.data ? response.data : [];
  const header = headerRes.success && headerRes.data ? headerRes.data : null;

  return (
    <>
      <PageHero
        image="/images/klinik-salon.jpg"
        title={header?.title || 'Klinik & seans odası'}
        description={header?.description}
        crumbs={[{ label: 'Klinik' }]}
      />
      <section className="py-20 md:py-28 px-6 lg:px-10">
        <div className="max-w-[1320px] mx-auto">
          {items.length === 0 ? (
            <p className="text-muted">Galeriye henüz görsel eklenmedi.</p>
          ) : (
            <GalleryGrid items={items as any} />
          )}
        </div>
      </section>
      <CtaBand image="/images/hero-orman-yolu.jpg" />
    </>
  );
}
