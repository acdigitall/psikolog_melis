/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * İzmir yerel SEO içerikleri — yalnızca SEO alanlarını ve konum bilgisini günceller,
 * blog yazıları gibi admin'den girilen içeriklere dokunmaz.
 * Çalıştırma: node prisma/seo-izmir.js   (seed.js sonunda da otomatik çalışır)
 */
const ADDRESS = 'Kıbrıs Şehitleri Caddesi No: 00/0, Alsancak, 35220 Konak / İzmir';
const MAP =
  '<iframe src="https://www.google.com/maps?q=Alsancak%2C%20Konak%2C%20%C4%B0zmir&output=embed" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Klinik konumu – Alsancak, İzmir"></iframe>';

const SERVICES = {
  'bireysel-yetiskin-terapisi': {
    metaTitle: 'İzmir Bireysel Terapi · Yetişkin Psikoterapisi',
    metaDesc:
      "İzmir'de bireysel terapi: Alsancak'ta ve online yetişkin psikoterapisi; kaygı, depresyon, özgüven ve duygu düzenleme güçlüklerinde BDT ve Şema Terapi temelli psikoterapi.",
    metaKeys: 'izmir bireysel terapi, izmir psikoterapi, alsancak psikolog, izmir yetişkin terapisi, izmir şema terapi, izmir bdt',
  },
  'cift-ve-iliski-terapisi': {
    metaTitle: 'İzmir Çift Terapisi · İlişki ve Evlilik Terapisi',
    metaDesc:
      "İzmir'de çift terapisi ve evlilik terapisi: iletişim sorunları, güven kaybı, aldatma sonrası onarım ve duygusal uzaklaşma için Alsancak'ta ve online ilişki terapisi.",
    metaKeys: 'izmir çift terapisi, izmir evlilik terapisi, izmir ilişki terapisi, izmir aile danışmanlığı, alsancak çift terapisi',
  },
  'online-terapi': {
    metaTitle: "Online Terapi · İzmir'den ve Her Yerden Psikolog",
    metaDesc:
      "İzmir'den online terapi: uzman klinik psikologla güvenli görüntülü görüşme; Türkiye'nin her yerinden ve yurt dışından kaygı, depresyon ve ilişki sorunları için.",
    metaKeys: 'online psikolog, online terapi, izmir online psikolog, görüntülü terapi, yurt dışı türk psikolog',
  },
  'emdr-ve-travma-terapisi': {
    metaTitle: 'İzmir EMDR Terapisi · Travma Terapisi',
    metaDesc:
      "İzmir'de EMDR terapisi ve travma terapisi: kayıp, kaza, deprem sonrası travma, çocukluk dönemi zorlayıcı yaşantılar ve fobilerde EMDR ile psikoterapi.",
    metaKeys: 'izmir emdr, izmir emdr terapisti, izmir travma terapisi, deprem travması terapi izmir, alsancak emdr',
  },
  'kaygi-ve-panik-atak': {
    metaTitle: 'İzmir Panik Atak ve Kaygı Terapisi',
    metaDesc:
      "İzmir'de panik atak tedavisi ve kaygı terapisi: yaygın kaygı, sosyal kaygı ve sağlık kaygısı için bilişsel davranışçı terapi (BDT); Alsancak'ta ve online.",
    metaKeys: 'izmir panik atak tedavisi, izmir kaygı terapisi, izmir anksiyete, izmir sosyal fobi, izmir bilişsel davranışçı terapi',
  },
  'depresyon-ve-yas': {
    metaTitle: 'İzmir Depresyon ve Yas Terapisi',
    metaDesc:
      "İzmir'de depresyon terapisi ve yas danışmanlığı: Alsancak'ta ve online, tükenmişlik ve kayıp sürecinde psikoterapi; şefkatli ve yapılandırılmış uzman klinik psikolog desteği.",
    metaKeys: 'izmir depresyon terapisi, izmir yas danışmanlığı, izmir tükenmişlik, izmir psikolog depresyon',
  },
};

const HEADERS = {
  services: "İzmir Alsancak'ta ve online: bireysel terapi, çift terapisi, EMDR ve travma terapisi; kaygı, panik atak, depresyon ve yas sürecinde psikolojik destek.",
  about: "İzmir'de uzman klinik psikolog olarak eğitimim, terapi yaklaşımım ve çalışma alanlarım hakkında bilmeniz gerekenler.",
  gallery: "Alsancak, İzmir'deki kliniğim: kendinizi güvende ve rahat hissetmeniz için tasarlanmış sakin bir ortam.",
  contact: "Alsancak, İzmir'deki klinik için adres, telefon ve randevu bilgileri. Genellikle 1 iş günü içinde dönüş yaparım.",
};

async function applyIzmirSeo(prisma) {
  const contact = await prisma.contactSettings.findFirst();
  if (contact) await prisma.contactSettings.update({ where: { id: contact.id }, data: { address: ADDRESS, mapIframe: MAP } });

  const home = await prisma.homePage.findFirst();
  if (home)
    await prisma.homePage.update({
      where: { id: home.id },
      data: {
        metaTitle: 'İzmir Psikolog | Uzm. Klinik Psikolog · Alsancak & Online Terapi',
        metaDesc:
          "İzmir Alsancak'ta uzman klinik psikolog: kaygı, panik atak, depresyon, ilişki sorunları ve travmada BDT, Şema Terapi ve EMDR ile yüz yüze ve online psikoterapi.",
        metaKeys:
          'izmir psikolog, psikolog izmir, alsancak psikolog, konak psikolog, izmir klinik psikolog, izmir terapist, izmir online terapi, izmir çift terapisi, izmir emdr',
      },
    });

  const firstSlide = await prisma.slide.findFirst({ orderBy: { order: 'asc' } });
  if (firstSlide)
    await prisma.slide.update({
      where: { id: firstSlide.id },
      data: { subtitle: 'İzmir Psikolog · Uzm. Klinik Psikolog · Alsancak & Online', metaTitle: "İzmir Alsancak'ta sakin terapi odası" },
    });

  for (const [slug, data] of Object.entries(SERVICES)) {
    await prisma.service.updateMany({ where: { slug }, data });
  }

  const about = await prisma.aboutPage.findFirst();
  if (about)
    await prisma.aboutPage.update({
      where: { id: about.id },
      data: {
        metaTitle: 'Hakkımda · İzmir Uzman Klinik Psikolog',
        metaDesc:
          "İzmir'de uzman klinik psikolog: Alsancak'taki kliniğimde eğitim, BDT, Şema Terapi ve EMDR yaklaşımı, etik ilkeler ve çalışma alanları.",
        metaKeys: 'izmir uzman klinik psikolog, izmir emdr terapisti, izmir bdt terapisti, izmir şema terapi, alsancak psikolog',
        storyDesc1:
          "Psikoloji lisans ve Klinik Psikoloji yüksek lisans eğitimlerimin ardından İzmir'de, Alsancak'taki kliniğimde yetişkinlerle bireysel terapi ve çiftlerle ilişki terapisi alanında çalışıyorum. Danışanlarımın kendileriyle ve çevreleriyle daha huzurlu bir ilişki kurmalarına eşlik etmek, işimin en anlamlı yanı.",
      },
    });

  const prod = await prisma.productionInfo.findFirst();
  if (prod)
    await prisma.productionInfo.update({
      where: { id: prod.id },
      data: {
        metaTitle: 'Terapi Süreci Nasıl İlerler? · İzmir Psikolog',
        metaDesc: "İzmir'de psikoterapiye başlarken: ön görüşmeden sonlandırmaya kadar adım adım terapi süreci, seans süresi ve sıklığı.",
        metaKeys: 'terapi süreci, ilk seans, psikolog seansı nasıl geçer, izmir psikolog ilk görüşme',
      },
    });

  for (const [pageIdentifier, description] of Object.entries(HEADERS)) {
    await prisma.pageHeader.updateMany({ where: { pageIdentifier }, data: { description } });
  }
}

module.exports = { applyIzmirSeo };

if (require.main === module) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  applyIzmirSeo(prisma)
    .then(() => console.log('📍 İzmir SEO içerikleri yazıldı.'))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
