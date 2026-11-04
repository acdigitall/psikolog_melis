import Link from 'next/link';
import { getDashboardStats } from '@/app/actions/dashboard';

export default async function AdminDashboard() {
  const data = await getDashboardStats();
  
  const stats = [
    { label: "Terapi Hizmetleri", value: data.stats?.services || "0", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { label: "Galeri Görselleri", value: data.stats?.gallery || "0", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Yayınlanan Bloglar", value: data.stats?.blogs || "0", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0012.586 3H12" },
    { label: "Randevu Talepleri", value: data.stats?.quotes || "0", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }
  ];

  const recentActivity = data.recentActivity || [];

  return (
    <div className="space-y-8">
      
      {/* Welcome Section */}
      <div className="bg-white p-8 border border-stone-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-stone-900 mb-2">Hoş Geldiniz, Yönetici 👋</h1>
          <p className="text-stone-500 text-sm">Psikolog web sitenizin tüm içeriklerini buradan kolayca yönetebilirsiniz.</p>
        </div>
        <div className="hidden md:block">
          <span className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold uppercase tracking-widest border border-stone-200">
            Versiyon 1.0.0
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 border border-stone-200 shadow-sm hover:border-amber-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-stone-100 text-stone-500 flex items-center justify-center rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                </svg>
              </div>
              <span className="text-3xl font-serif text-stone-900 font-bold">{stat.value}</span>
            </div>
            <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">{stat.label}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white border border-stone-200 shadow-sm">
          <div className="p-6 border-b border-stone-100">
            <h3 className="font-bold text-stone-900">Hızlı İşlemler</h3>
          </div>
          <div className="p-6 space-y-4">
            <Link href="/admin/services" className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-100 hover:border-amber-700 hover:text-amber-700 transition-colors">
              <span className="text-xl">+</span>
              <span className="font-medium text-sm">Hizmetleri Düzenle</span>
            </Link>
            <Link href="/admin/gallery" className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-100 hover:border-amber-700 hover:text-amber-700 transition-colors">
              <span className="text-xl">+</span>
              <span className="font-medium text-sm">Galeriye Görsel Yükle</span>
            </Link>
            <Link href="/admin/blog" className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-100 hover:border-amber-700 hover:text-amber-700 transition-colors">
              <span className="text-xl">+</span>
              <span className="font-medium text-sm">Yeni Blog Yazısı</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-stone-200 shadow-sm">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center">
            <h3 className="font-bold text-stone-900">Son Aktiviteler</h3>
            <span className="text-xs text-stone-500 cursor-pointer hover:text-stone-900">Tümünü Gör</span>
          </div>
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <ul className="space-y-6">
                {recentActivity.map((act: any, i: number) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className={`mt-1 w-2.5 h-2.5 rounded-full ${act.color.split(' ')[1]}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stone-900">{act.title}</p>
                      <p className="text-xs text-stone-500 mt-1">{act.type}</p>
                    </div>
                    <span className="text-xs text-stone-400">{act.time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-stone-500 text-sm">Henüz aktivite bulunmuyor.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
