import type { Metadata } from 'next';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: "Kullanım Koşulları",
  description: "Web sitesi ve psikolojik danışmanlık hizmetlerinin kullanımını düzenleyen temel şartlar ve koşullar.",
  path: '/terms',
});

export default function Terms() {
  return (
    <div className="pt-16 md:pt-24 pb-28">
      <div className="max-w-[720px] mx-auto px-6">
        
        <div className="mb-12">
          <span className="kicker mb-6">Yasal Bilgilendirme</span>
          <h1 className="display !text-[clamp(2.2rem,1.6rem+2.4vw,3.6rem)]">Kullanım Koşulları</h1>
        </div>

        <div className="mt-12 space-y-6 text-ink/80 leading-[1.8] text-[1.05rem]">
          <p>
            Bu web sitesini ziyaret ederek veya web sitesinde yer alan formlar aracılığıyla randevu talebinde bulunarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız.
          </p>

          <h3 className="font-serif text-[1.6rem] text-forest !mt-12 mb-3">1. Bilgilendirme Amacı & Tıbbi Uyarı</h3>
          <p>
            Bu web sitesinde ve blog bölümünde yer alan tüm makaleler, içerikler ve yazılar yalnızca genel bilgilendirme ve farkındalık amacıyla hazırlanmıştır. Sitedeki içerikler hiçbir şekilde tıbbi bir teşhis, psikiyatrik tanı veya hekim tedavisinin yerine geçmez. Acil bir kriz durumunda lütfen en yakın sağlık kuruluşuna veya acil yardım hatlarına (112) başvurunuz.
          </p>

          <h3 className="font-serif text-[1.6rem] text-forest !mt-12 mb-3">2. Fikri Mülkiyet Hakları</h3>
          <p>
            Bu sitede yayımlanan tüm makaleler, metinler, grafikler, tasarım ögeleri ve içerikler <strong>Uzm. Klinik Psikolog melis Sağlam</strong>'un telif koruması altındadır. Kaynak gösterilmeksizin veya yazılı izin alınmaksızın kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.
          </p>

          <h3 className="font-serif text-[1.6rem] text-forest !mt-12 mb-3">3. Randevu ve İptal Koşulları</h3>
          <p>
            Planlanan seans saatlerine riayet edilmesi terapötik sürecin başarısı açısından esastır. Randevu saatinde değişiklik veya iptal talebinin en az 24 saat öncesinden bildirilmesi rica olunur.
          </p>

          <p className="pt-8 text-xs text-muted/80 border-t border-sage-light mt-8">
            Son Güncelleme: 2026 | Uzm. Klinik Psikolog melis Sağlam
          </p>
        </div>

      </div>
    </div>
  );
}
