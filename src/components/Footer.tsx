"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Brand from '@/components/site/Brand';

export default function Footer({ settings }: { settings?: any }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  let socialLinks: any[] = [];
  try {
    socialLinks = settings?.socialLinks
      ? typeof settings.socialLinks === 'string'
        ? JSON.parse(settings.socialLinks)
        : settings.socialLinks
      : [];
  } catch {}

  const link = 'text-paper/65 hover:text-paper transition-colors duration-300';

  return (
    <footer className="bg-forest text-paper">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 pt-16 pb-12 md:pt-20 md:pb-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="col-span-2 space-y-5 lg:col-span-1">
            <Brand logo={settings?.logoFooter} variant="light" />
            <p className="max-w-xs text-sm text-paper/60 leading-relaxed">
              İzmir Alsancak&apos;ta uzman klinik psikolog: kaygı, depresyon, ilişki sorunları ve travma sonrası süreçlerde yüz yüze ve online psikoterapi.
            </p>
          </div>

          <div>
            <h4 className="mb-5 font-sans text-sm text-paper/45">Sayfalar</h4>
            <ul className="space-y-2.5 text-[15px]">
              <li><Link href="/about" className={link}>Hakkımda</Link></li>
              <li><Link href="/services" className={link}>Hizmetler</Link></li>
              <li><Link href="/production" className={link}>Terapi süreci</Link></li>
              <li><Link href="/gallery" className={link}>Klinik</Link></li>
              <li><Link href="/blog" className={link}>Yazılar</Link></li>
              <li><Link href="/faq" className={link}>Sorular</Link></li>
              <li><Link href="/izmir-psikolog" className={link}>İzmir psikolog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-sans text-sm text-paper/45">İletişim</h4>
            <ul className="space-y-2.5 text-[15px] text-paper/65 break-words">
              {settings?.address && <li className="leading-relaxed"><address className="not-italic">{settings.address}</address></li>}
              {settings?.phone1 && (
                <li><a href={`tel:${settings.phone1.replace(/[^\d+]/g, '')}`} className={link}>{settings.phone1}</a></li>
              )}
              {settings?.email && (
                <li><a href={`mailto:${settings.email}`} className={link}>{settings.email}</a></li>
              )}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h4 className="mb-5 font-sans text-sm text-paper/45">Seans saatleri</h4>
            <dl className="space-y-2.5 text-[15px] text-paper/65">
              <div className="flex justify-between gap-6"><dt>Hafta içi</dt><dd>10:00–20:00</dd></div>
              <div className="flex justify-between gap-6"><dt>Cumartesi</dt><dd>10:00–16:00</dd></div>
              <div className="flex justify-between gap-6"><dt>Pazar</dt><dd>Kapalı</dd></div>
            </dl>
            {socialLinks.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
                {socialLinks.map((s: any, i: number) => (
                  <li key={i}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className={link}>
                      {s.name || s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-paper/15 py-8 text-sm text-paper/50 space-y-5">
          <p className="max-w-3xl leading-relaxed">
            Bu site acil destek sağlamaz. Kendinize ya da bir başkasına zarar verme riski varsa lütfen hemen 112&apos;yi arayın
            veya en yakın acil servise başvurun.
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>&copy; {new Date().getFullYear()} Uzm. Klinik Psikolog</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/privacy" className={link}>Gizlilik</Link>
              <Link href="/terms" className={link}>Kullanım koşulları</Link>
              <Link href="/kvkk" className={link}>KVKK</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
