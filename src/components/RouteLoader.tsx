"use client";

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/** Sayfa geçişlerinde üstte ince bir ilerleme çizgisi gösterir. */
function RouteLoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  useEffect(() => {
    setState((s) => (s === 'loading' ? 'done' : s));
    const t = setTimeout(() => setState('idle'), 450);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      const anchor = (event.target as HTMLElement).closest('a');
      const href = anchor?.getAttribute('href');
      if (
        anchor &&
        href &&
        href.startsWith('/') &&
        !href.startsWith('/#') &&
        anchor.getAttribute('target') !== '_blank' &&
        href.split('?')[0] !== pathname
      ) {
        setState('loading');
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div
        className="h-full origin-left bg-olive"
        style={{
          transform: `scaleX(${state === 'loading' ? 0.7 : state === 'done' ? 1 : 0})`,
          opacity: state === 'idle' ? 0 : 1,
          transition:
            state === 'loading'
              ? 'transform 6s cubic-bezier(.1,.6,.2,1), opacity .2s'
              : 'transform .3s ease-out, opacity .4s ease .2s',
        }}
      />
    </div>
  );
}

export default function RouteLoader(_props: { logoUrl?: string }) {
  return (
    <Suspense fallback={null}>
      <RouteLoaderInner />
    </Suspense>
  );
}
