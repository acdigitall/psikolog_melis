"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getContactSettings } from '@/app/actions/contact';
import { logoutAction } from '@/app/actions/auth';

/** Yönetim paneli arayüzü. Oturum kontrolü sunucuda (panel layout'u, proxy ve aksiyonlar) yapılır. */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Site Settings / Logo State
  const [siteSettings, setSiteSettings] = useState<any>(null);

  // Mobile Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    getContactSettings().then(res => {
      if (res.success && res.data) {
        setSiteSettings(res.data);
      }
    });
  }, []);

  const adminLogo = siteSettings?.logoFooter || siteSettings?.logo || '';

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: "Ana Sayfa", href: "/admin/home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Hizmetler", href: "/admin/services", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { name: "Randevu Talepleri", href: "/admin/quotes", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: "Terapi Süreci", href: "/admin/production", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { name: "Klinik & Seans Odaları", href: "/admin/gallery", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: "Hakkımda", href: "/admin/about", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { name: "Açılış Slaytları", href: "/admin/slides", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM8 20h8M12 16v4" },
    { name: "Kategoriler", href: "/admin/categories", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
    { name: "Blog Yazıları", href: "/admin/blog", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0012.586 3H12" },
    { name: "İletişim Ayarları", href: "/admin/contact", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }
  ];

  // Show Yönetim paneli if authenticated
  return (
    <div className="admin-theme min-h-screen bg-stone-100 flex flex-col md:flex-row">

      {/* Mobile Top Header */}
      <header className="md:hidden bg-stone-900 text-white px-4 py-3 flex items-center justify-between z-30 shadow-md sticky top-0">
        <Link href="/admin" className="flex items-center gap-2">
          {adminLogo ? (
            <Image
              src={adminLogo}
              alt="Psikolog logosu"
              width={110}
              height={32}
              className="h-7 w-auto object-contain rounded-sm"
            />
          ) : (
            <span className="font-semibold text-sm tracking-wide">Melisa Sağlam</span>
          )}
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/" className="p-2 text-stone-400 hover:text-white" title="Siteye dön">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-stone-300 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Menü"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-stone-950/70 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop & Mobile Sidebar Drawer */}
      <aside className={`
        fixed md:sticky top-0 inset-y-0 left-0 z-50 w-72 md:h-screen bg-stone-900 text-stone-300 flex flex-col justify-between transition-transform duration-200 flex-shrink-0 overflow-y-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between shrink-0">
            <Link href="/admin" className="flex flex-col">
              {siteSettings?.logoFooter || siteSettings?.logo ? (
                <Image
                  src={siteSettings.logoFooter || siteSettings.logo}
                  alt="Psikolog logosu"
                  width={130}
                  height={40}
                  className="h-10 w-auto object-contain rounded-sm"
                />
              ) : (
                <div className="flex flex-col">
                  <span className="font-serif text-[1.4rem] leading-none text-white">Melisa Sağlam</span>
                  <span className="mt-1.5 text-[14px] text-amber-500">Yönetim paneli</span>
                </div>
              )}
            </Link>

            {/* Close Button on Mobile Drawer */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-2 text-stone-400 hover:text-white cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 flex-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors ${isActive
                    ? 'bg-amber-700 text-white'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-stone-800 space-y-1 shrink-0 bg-stone-900">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Siteye dön
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-left cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Çıkış yap
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Dynamic Page İçerik */}
        <div className="flex-1 overflow-x-hidden p-4 sm:p-6 md:p-10 relative">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
