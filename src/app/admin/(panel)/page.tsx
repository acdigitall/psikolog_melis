import Link from 'next/link';
import { getDashboardStats } from '@/app/actions/dashboard';

const quoteBadge: Record<string, [string, string]> = {
  Yeni: ['Yeni', 'bg-amber-100 text-amber-800'],
  Yanıtlandı: ['Görüşüldü', 'bg-green-100 text-green-800'],
  Okundu: ['İncelendi', 'bg-stone-100 text-stone-600'],
};

function Badge({ text, tone }: { text: string; tone: string }) {
  return <span className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${tone}`}>{text}</span>;
}

function Panel({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-stone-200 rounded-lg">
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-stone-200">
        <h2 className="text-lg text-stone-900">{title}</h2>
        <Link href={href} className="text-sm text-amber-700 hover:underline">Tümü</Link>
      </div>
      {children}
    </section>
  );
}

export default async function AdminDashboard() {
  const data = await getDashboardStats();
  const s = data.stats;
  const recentQuotes = data.recentQuotes ?? [];
  const recentBlogs = data.recentBlogs ?? [];

  const stats = [
    { label: "Randevu talebi", value: s?.quotes ?? 0, note: s?.newQuotes ? `${s.newQuotes} yeni` : '', href: "/admin/quotes" },
    { label: "Yayındaki yazı", value: s?.blogs ?? 0, note: s?.drafts ? `${s.drafts} taslak` : '', href: "/admin/blog" },
    { label: "Hizmet", value: s?.services ?? 0, note: '', href: "/admin/services" },
    { label: "Galeri görseli", value: s?.gallery ?? 0, note: '', href: "/admin/gallery" },
  ];

  const secondary = "px-5 py-3 text-sm bg-white border border-stone-300 text-stone-700 rounded hover:border-amber-700 hover:text-amber-700 transition-colors";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-serif text-stone-900">Panel</h1>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/services" className={secondary}>Hizmetleri düzenle</Link>
          <Link href="/admin/gallery" className={secondary}>Galeriye görsel ekle</Link>
          <Link href="/admin/blog" className="px-5 py-3 text-sm bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors">Yeni blog yazısı</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href} className="bg-white border border-stone-200 rounded-lg p-6 hover:border-amber-700 transition-colors">
            <span className="block text-4xl font-serif text-stone-900">{stat.value}</span>
            <span className="block text-sm text-stone-600 mt-2">
              {stat.label}
              {stat.note && <span className="text-amber-700"> · {stat.note}</span>}
            </span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Son randevu talepleri" href="/admin/quotes">
          {recentQuotes.length > 0 ? (
            <ul className="divide-y divide-stone-100">
              {recentQuotes.map((q, i) => {
                const [label, tone] = quoteBadge[q.status] ?? [q.status, 'bg-stone-100 text-stone-600'];
                return (
                  <li key={i} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div className="min-w-0">
                      <p className="text-sm text-stone-900 truncate">{q.name}</p>
                      <p className="text-xs text-stone-500 mt-1 truncate">{q.service} · {q.time}</p>
                    </div>
                    <Badge text={label} tone={tone} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-6 py-12 text-center text-sm text-stone-500">Henüz randevu talebi yok.</p>
          )}
        </Panel>

        <Panel title="Son blog yazıları" href="/admin/blog">
          {recentBlogs.length > 0 ? (
            <ul className="divide-y divide-stone-100">
              {recentBlogs.map((b, i) => (
                <li key={i} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="text-sm text-stone-900 truncate">{b.title}</p>
                    <p className="text-xs text-stone-500 mt-1">{b.time}</p>
                  </div>
                  <Badge text={b.status} tone={b.status === 'Yayında' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-12 text-center text-sm text-stone-500">Henüz blog yazısı yok.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
