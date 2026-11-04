"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  img: string;
  metaTitle?: string | null;
  createdAt: Date;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      
      if (e.key === 'Escape') {
        setActiveIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
      }
    };

    if (activeIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // lock background scroll
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeIndex, items.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
        {items.map((img, i) => (
          <figure key={img.id} data-reveal style={{ ['--reveal-delay' as string]: `${(i % 3) * 80}ms` }} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              className="group relative block w-full overflow-hidden rounded-[4px] bg-sage-light"
              aria-label={`${img.title} görselini büyüt`}
            >
              <Image
                src={img.img || "/images/klinik-oturma.jpg"}
                alt={img.metaTitle || img.title}
                width={960}
                height={i % 3 === 1 ? 1200 : 720}
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03] ${i % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}
              />
            </button>
            <figcaption className="mt-3 flex justify-between gap-4 text-sm">
              <span className="text-ink/80">{img.title}</span>
              <span className="text-muted">{img.category}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-forest-dark/95 p-4 md:p-8 select-none transition-opacity duration-300"
          onClick={() => setActiveIndex(null)}
        >
          {/* Lightbox Header Controls */}
          <div className="flex justify-between items-center text-white z-20">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              {activeIndex + 1} / {items.length}
            </span>
            <button 
              onClick={() => setActiveIndex(null)}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Core Lightbox Image & Arrow Controls */}
          <div className="relative flex-1 w-full flex items-center justify-center my-4">
            
            {/* Left Navigation Arrow */}
            <button 
              onClick={handlePrev}
              className="absolute left-2 md:left-4 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Önceki Görsel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Centered Image (Protects original ratio) */}
            <div 
              className="relative w-full h-full max-w-5xl max-h-[70vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // prevent close when clicking image
            >
              <Image 
                src={items[activeIndex].img || "/images/klinik-oturma.jpg"}
                alt={items[activeIndex].metaTitle || items[activeIndex].title}
                fill
                unoptimized
                className="object-contain"
                priority
              />
            </div>

            {/* Right Navigation Arrow */}
            <button 
              onClick={handleNext}
              className="absolute right-2 md:right-4 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Sonraki Görsel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

          </div>

          {/* Lightbox Footer Details */}
          <div className="text-center text-white z-20 mt-2">
            <span className="text-sage-light text-xs font-bold uppercase tracking-widest block mb-1">
              {items[activeIndex].category}
            </span>
            <h3 className="text-lg md:text-xl font-heading font-semibold">
              {items[activeIndex].title}
            </h3>
          </div>

        </div>
      )}
    </>
  );
}
