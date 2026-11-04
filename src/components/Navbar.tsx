"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Brand from '@/components/site/Brand';
import { ArrowRight } from '@/components/site/Icons';

const navLinks = [
  { name: 'Hakkımda', href: '/about' },
  { name: 'Hizmetler', href: '/services' },
  { name: 'Süreç', href: '/production' },
  { name: 'Yazılar', href: '/blog' },
  { name: 'Sorular', href: '/faq' },
  { name: 'İletişim', href: '/contact' },
];

export default function Navbar({ settings }: { settings?: any }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (pathname.startsWith('/admin')) return null;

  const isActive = (href: string) => pathname.startsWith(href);
  const phone = settings?.phone1 as string | undefined;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[background-color,border-color] duration-500 border-b ${
        scrolled || open ? 'bg-paper/92 backdrop-blur-md border-line' : 'bg-paper border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between gap-8 px-6 lg:px-10">
        <Link href="/" className="shrink-0" aria-label="Anasayfa">
          <Brand logo={settings?.logo} />
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`relative py-2 text-[15px] transition-colors duration-300 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-forest after:transition-[width] after:duration-500 after:ease-[cubic-bezier(.22,1,.36,1)] ${
                  isActive(link.href) ? 'text-forest after:w-full' : 'text-ink/70 hover:text-forest after:w-0 hover:after:w-full'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <Link href="/quote" className="hidden sm:inline-flex btn-primary !h-11 !px-5">
            Randevu al
          </Link>
          <button
            className="lg:hidden -mr-2 flex h-11 w-11 items-center justify-center text-forest"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={open}
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-all duration-500 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-all duration-500 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobil menü */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[76px] bottom-0 bg-paper transition-[opacity,visibility] duration-500 ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="flex h-full flex-col justify-between px-6 pb-10 pt-8 overflow-y-auto">
          <ul className="space-y-1">
            {[{ name: 'Anasayfa', href: '/' }, ...navLinks].map((link, i) => (
              <li
                key={link.href}
                className={`transition-all duration-700 ${open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : '0ms' }}
              >
                <Link href={link.href} className="block py-2 font-serif text-[2.1rem] leading-tight text-forest">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-5 border-t border-line pt-6">
            {phone && (
              <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="block text-muted">
                {phone}
              </a>
            )}
            <Link href="/quote" className="btn-primary w-full">
              Randevu al <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
