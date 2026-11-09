import type { Metadata } from 'next';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: "Gizlilik Politikası",
  description: "Kişisel verilerinizin ve danışan bilgilerinizin etik ilkeler doğrultusunda korunması hakkında gizlilik politikası.",
  path: '/privacy',
});

export default function Privacy() {
  return (
    <div className="pt-16 md:pt-24 pb-28">
      <div className="max-w-[720px] mx-auto px-6">
        
        <div className="mb-12">
          <span className="kicker mb-6">Yasal Bilgilendirme</span>
          <h1 className="display !text-[clamp(2.2rem,1.6rem+2.4vw,3.6rem)]">Gizlilik Politikası & Danışan Mahremiyeti</h1>
        </div>

        <div className="mt-12 space-y-6 text-ink/80 leading-[1.8] text-[1.05rem]">
          <p>
            <strong>Uzm. Klinik Psikolog Melisa Sağlam</strong> olarak web sitemizi ziyaret eden kullanıcılarımızın ve danışanlarımızın kişisel verilerinin ve seans mahremiyetinin korunmasını en temel etik ve mesleki sorumluluğumuz olarak kabul ediyoruz. Bu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde veya randevu/danışmanlık talebinde bulunduğunuzda verilerinizin nasıl korunduğunu açıklamaktadır.
          </p>

          <h3 className="font-serif text-[1.6rem] text-forest !mt-12 mb-3">1. Seans Gizliliği ve Mesleki Etik</h3>
          <p>
            Türk Psikologlar Derneği (TPD) Etik Yönetmeliği uyarınca; seans odasında veya online danışmanlık esnasında paylaşılan her türlü duygu, düşünce, yaşantı ve bilgi koşulsuz olarak gizli tutulur. Danışanın açık yazılı onayı olmaksızın hiçbir bilgi üçüncü kişilerle, aile bireyleriyle veya kurumlarla paylaşılamaz. (Yalnızca danışanın veya bir başkasının can güvenliğini tehdit eden yasal acil durumlar istisnadır).
          </p>

          <h3 className="font-serif text-[1.6rem] text-forest !mt-12 mb-3">2. Toplanan İletişim Bilgileri</h3>
          <p>
            Web sitemizdeki randevu formunu doldurduğunuzda, yalnızca sizinle seans gün ve saatlerini organize etmek amacıyla ad, soyad, e-posta adresi, telefon numarası ve seans tercihi bilgileri alınır. Bu bilgiler reklam veya pazarlama amacıyla üçüncü şahıslara verilmez, satılmaz veya aktarılmaz.
          </p>

          <h3 className="font-serif text-[1.6rem] text-forest !mt-12 mb-3">3. Çerezler ve Teknik Veriler</h3>
          <p>
            Sitemizin teknik performansını ve kullanıcı deneyimini artırmak amacıyla standart analitik çerezler kullanılabilir. Tarayıcı ayarlarınız üzerinden çerez kullanımını dilediğiniz zaman kısıtlayabilirsiniz.
          </p>

          <h3 className="font-serif text-[1.6rem] text-forest !mt-12 mb-3">4. Haklarınız ve İletişim</h3>
          <p>
            KVKK kapsamında dilediğiniz zaman tarafımıza kayıtlı iletişim bilgilerinizin güncellenmesini veya silinmesini talep edebilirsiniz. Sorularınız için <strong>bilgi@psikolog.com</strong> adresi üzerinden bizimle iletişime geçebilirsiniz.
          </p>
          
          <p className="pt-8 text-xs text-muted/80 border-t border-sage-light mt-8">
            Son Güncelleme: 2026 | Uzm. Klinik Psikolog Melisa Sağlam
          </p>
        </div>

      </div>
    </div>
  );
}
