"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

const defaultBrochureHighlights = [
  {
    title: "Lisans & Yüksek Lisans",
    desc: "Psikoloji Lisansı ve Klinik Psikoloji Tezli Yüksek Lisans derecesi."
  },
  {
    title: "Bilişsel Davranışçı Terapi (BDT)",
    desc: "Avrupa Davranış ve Bilişsel Terapiler Birliği (EABCT) onaylı teorik ve süpervizyon eğitimi."
  },
  {
    title: "EMDR Düzey I & II",
    desc: "EMDR Derneği onaylı travma ve ilişki odaklı psikoterapi sertifikasyonu."
  },
  {
    title: "Şema Terapi",
    desc: "ISST onaylı Şema Terapi uluslararası terapist sertifikasyon programı."
  }
];

const defaultPolicies = [
  {
    title: "Koşulsuz Gizlilik",
    desc: "Seans odasında paylaşılan tüm bilgiler etik kurallar ve danışan mahremiyeti çerçevesinde gizli tutulur."
  },
  {
    title: "Yargısız ve Güvenli Alan",
    desc: "Duygu ve düşüncelerinizin yargılanmadan, kabul ve empati ile dinlendiği güvenli bir ortam."
  },
  {
    title: "İş Birlikçi Hedefler",
    desc: "Terapi hedefleri danışan ve terapist tarafından birlikte belirlenir; süreç şeffaf biçimde yürütülür."
  }
];

const defaultAboutData = {
  id: 1,
  metaTitle: "Hakkımda | Uzm. Klinik Psikolog",
  metaDesc: "Eğitimim, benimsediğim terapi ekolleri (BDT, EMDR, Şema Terapi), etik değerler ve klinik yaklaşımım hakkında detaylı bilgi.",
  metaKeys: "uzman klinik psikolog hakkında, bdt terapisti, emdr terapisti, istanbul psikolog",

  storyImg: "/images/hakkimda-hikaye.jpg",
  storyTitle: "Kendinizi Anlama ve İyileşme Yolculuğunda Yanınızdayım",
  storyDesc1: "Lisans ve Klinik Psikoloji yüksek lisans eğitimlerimi tamamladıktan sonra bireysel psikoterapi, çift ve yetişkin danışmanlığı alanlarında seanslar yürütmekteyim. İnsan zihninin derinliklerini anlama arzusu ve danışanlarımın yaşam kalitesini artırma motivasyonuyla klinik pratiğimi sürdürüyorum.",
  storyDesc2: "Seanslarımda bilimsel ve kanıta dayalı psikoterapi ekollerini (Bilişsel Davranışçı Terapi, EMDR ve Şema Terapi) temel alıyorum. Her danışanın kendi biricik hikayesine saygı duyarak, yargısız, şefkatli ve güvenli bir terapötik bağ kurmayı en önemli önceliğim olarak kabul ediyorum.",

  visionTitle: "Terapi Yaklaşımım",
  visionText: "Bireyin kendi içsel kaynaklarını ve gücünü keşfetmesini sağlamak, semptomları yalnızca bastırmak değil kök nedenlerine inerek kalıcı duygusal dayanıklılık kazandırmak.",
  missionTitle: "Etik ve Gizlilik İlkem",
  missionText: "Türk Psikologlar Derneği (TPD) etik yönetmeliği çerçevesinde, danışan gizliliğini koşulsuz koruyarak, dürüst, profesyonel ve insani değerlere sadık bir danışmanlık hizmeti sunmak.",

  bridgeLabel: "Ekoller & Uzmanlıklar",
  bridgeTitle: "Bilimsel Yaklaşım,<br/>Şefkatli Dinleme",
  bridgeDesc1: "Uyguladığım yöntemler dünya çapında etkinliği klinik çalışmalarla kanıtlanmış Bilişsel Davranışçı Terapi (BDT), Travma odaklı EMDR Terapisi ve Şema Terapi ekollerinden oluşmaktadır.",
  bridgeDesc2: "Sürekli süpervizyon ve mesleki eğitimlerle güncel literatürü takip ediyor; yüz yüze ve online seanslarda aynı yüksek klinik standartları uyguluyorum.",
  bridgeImg: "/images/hakkimda-denge.jpg",

  brochureLabel: "Mesleki Yetkinlikler",
  brochureTitle: "Klinik Eğitimler ve Akreditasyonlar",
  brochureDesc: "Eğitim belgelerim, uluslararası psikoterapi sertifikalarım ve akademik geçmişim hakkında detaylı bilgi edinebilirsiniz.",
  brochureUrl: "#",
  brochureHighlights: JSON.stringify(defaultBrochureHighlights),
  materialsTitle: "Çalışma ve Uzmanlık Alanları",
  materials: "Depresyon, Kaygı Bozuklukları (Anksiyete), Panik Atak, Obsesif Kompulsif Bozukluk (OKB), Travma & TSSB, İlişki ve Evlilik Problemleri, Sosyal Fobi, Öfke Kontrolü, Yas Süreci, Tükenmişlik",

  policyTitle: "Danışan Hakları ve Terapi İlkeleri",
  policies: JSON.stringify(defaultPolicies)
};

export async function getDefaultAboutData() {
  return defaultAboutData;
}

export async function getAboutPage() {
  try {
    let page = await prisma.aboutPage.findFirst();

    if (!page) {
      page = await prisma.aboutPage.create({
        data: defaultAboutData
      });
    }

    return { success: true, data: page };
  } catch (error: any) {
    console.error("Prisma error in getAboutPage:", error);
    return { success: true, data: defaultAboutData };
  }
}

export async function updateAboutPage(id: number, data: any) {
  try {
    const updated = await prisma.aboutPage.update({
      where: { id },
      data
    });

    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("updateAboutPage error:", error);
    return { success: false, error: error.message };
  }
}
