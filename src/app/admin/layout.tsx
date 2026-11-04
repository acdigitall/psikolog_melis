"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getContactSettings } from '@/app/actions/contact';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Site Settings / Logo State
  const [siteSettings, setSiteSettings] = useState<any>(null);

  // Mobile Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check auth status on mount
    const authStatus = localStorage.getItem('tanzanyaAdminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    getContactSettings().then(res => {
      if (res.success && res.data) {
        setSiteSettings(res.data);
      }
    });
  }, []);

  const adminLogo = siteSettings?.logoFooter || siteSettings?.logo || '';
  const adminHeaderIcon = siteSettings?.logo || siteSettings?.logoFooter || '';

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'stardecortz@gmail.com' && password === '2026sD#') {
      localStorage.setItem('tanzanyaAdminAuth', 'true');
      setIsAuthenticated(true);
      router.push('/admin');
    } else {
      setError('Geçersiz e-posta veya şifre.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tanzanyaAdminAuth');
    setIsAuthenticated(false);
    router.push('/admin');
  };

  const menuItems = [
    { name: "Ana Sayfa", href: "/admin/home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Hizmetler", href: "/admin/services", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { name: "Randevu Talepleri", href: "/admin/quotes", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { name: "Terapi Süreci", href: "/admin/production", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { name: "Klinik & Seans Odaları", href: "/admin/gallery", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: "Hakkımda", href: "/admin/about", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Hero Slaytlar", href: "/admin/slides", icon: "M7 4v16M17 4v16M3 8h18M3 16h18" },
    { name: "Kategoriler", href: "/admin/categories", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
    { name: "Blog Yazıları", href: "/admin/blog", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0012.586 3H12" },
    { name: "İletişim Ayarları", href: "/admin/contact", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }
  ];

  // Prevent flash of content while checking auth
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-black flex items-center justify-center font-medium text-stone-400">Yükleniyor...</div>;
  }

  // Show Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-black border border-stone-800 shadow-2xl p-6 md:p-12 rounded">
          <div className="flex flex-col items-center mb-8">
            {siteSettings?.logoFooter || siteSettings?.logo ? (
              <Image
                src={siteSettings.logoFooter || siteSettings.logo}
                alt="Psikolog Logo"
                width={180}
                height={55}
                className="h-12 w-auto object-contain mb-3 rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center mb-4">
                <span className="text-xl font-serif font-bold text-white tracking-widest">UZM. KLİNİK PSİKOLOG</span>
                <span className="text-xs text-amber-500 tracking-[0.25em] uppercase mt-1">Yönetim Sistemi</span>
              </div>
            )}
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold">Yönetim Paneli Girişi</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-950/60 border border-red-800 text-red-300 text-sm font-medium text-center rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block">E-Posta Adresi</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-stone-900 border border-stone-800 px-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors rounded"
                placeholder="info@admin.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-stone-900 border border-stone-800 px-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors rounded"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-amber-700 text-white font-bold text-sm uppercase tracking-wider hover:bg-amber-600 transition-colors mt-4 rounded cursor-pointer"
            >
              Giriş Yap
            </button>

            <div className="text-center mt-6">
              <Link href="/" className="text-sm text-stone-400 hover:text-stone-200 transition-colors">
                ← Siteye Geri Dön
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Show Admin Dashboard if authenticated
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">

      {/* Mobile Top Header */}
      <header className="md:hidden bg-stone-900 text-white px-4 py-3 flex items-center justify-between z-30 shadow-md sticky top-0">
        <Link href="/admin" className="flex items-center gap-2">
          {adminLogo ? (
            <Image
              src={adminLogo}
              alt="Psikolog Logo"
              width={110}
              height={32}
              className="h-7 w-auto object-contain rounded-sm"
            />
          ) : (
            <span className="font-semibold text-sm tracking-wide">Uzm. Klinik Psikolog</span>
          )}
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/" className="p-2 text-stone-400 hover:text-white" title="Return to site">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-stone-300 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Menu"
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
          className="fixed inset-0 bg-stone-950/70 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop & Mobile Sidebar Drawer */}
      <aside className={`
        fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 md:h-screen bg-stone-900 text-stone-300 flex flex-col justify-between shadow-2xl md:shadow-xl transition-transform duration-300 ease-in-out flex-shrink-0 overflow-y-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between shrink-0">
            <Link href="/admin" className="flex flex-col">
              {siteSettings?.logoFooter || siteSettings?.logo ? (
                <Image
                  src={siteSettings.logoFooter || siteSettings.logo}
                  alt="Psikolog Logo"
                  width={130}
                  height={40}
                  className="h-8 w-auto object-contain rounded-sm"
                />
              ) : (
                <div className="flex flex-col">
                  <span className="text-sm font-serif font-bold text-white tracking-widest">KLİNİK PSİKOLOG</span>
                  <span className="text-[10px] text-amber-500 uppercase tracking-widest">Yönetim Paneli</span>
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
          <nav className="p-4 space-y-2 flex-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive
                    ? 'bg-amber-700 text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
                    }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls - Fixed at bottom of viewport */}
        <div className="p-4 border-t border-stone-800 space-y-2 shrink-0 bg-stone-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-stone-800 hover:text-red-300 transition-colors rounded text-left cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium text-sm">Çıkış Yap</span>
          </button>

          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-white transition-colors rounded hover:bg-stone-800">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium text-sm">Siteye Dön</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Desktop Top Header Bar with Quick Links */}
        <header className="hidden md:flex bg-white border-b border-stone-200 px-8 py-4 justify-between items-center z-10 shadow-sm sticky top-0">
          <h2 className="text-xl font-serif text-stone-900 font-bold">
            {menuItems.find(m => m.href === pathname)?.name || "Yönetim Paneli"}
          </h2>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-amber-700 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Siteye Dön
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log Out
            </button>

            <div className="w-9 h-9 rounded-full overflow-hidden border border-stone-200 shadow-sm flex items-center justify-center bg-stone-100" title="Admin Dashboard">
              {adminHeaderIcon ? (
                <Image
                  src={adminHeaderIcon}
                  alt="Admin Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-stone-600">UKP</span>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-x-hidden p-4 sm:p-6 md:p-8 relative">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
