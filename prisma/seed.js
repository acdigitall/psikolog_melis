/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Psikolog web sitesi – veritabanı içerik tohumlaması.
 * Çalıştırma: npm run db:seed
 *
 * Eski (mobilya/dekorasyon) içerikleri temizler ve tüm sayfa içeriklerini
 * psikolog sitesine uygun metin ve /public/images altındaki görsellerle yazar.
 * Tekrar çalıştırılabilir (idempotent).
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { applyIzmirSeo } = require('./seo-izmir');
const { applyIzmirBlog } = require('./blog-izmir');

const IMG = (name) => `/images/${name}.jpg`;

async function upsertSingleton(model, data) {
  const existing = await prisma[model].findFirst();
  if (existing) return prisma[model].update({ where: { id: existing.id }, data });
  return prisma[model].create({ data });
}

async function main() {
  console.log('🌱 Psikolog sitesi içerikleri yazılıyor...');

  // 0. Eski dekorasyon verilerini temizle
  console.log('🧹 Eski proje, ürün ve galeri kayıtları siliniyor...');
  await prisma.project.deleteMany();
  await prisma.productGroup.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.pageHeader.deleteMany({ where: { pageIdentifier: { in: ['products', 'projects'] } } });

  // 1. İletişim ayarları
  console.log('📞 İletişim ayarları...');
  await upsertSingleton('contactSettings', {
    address: 'Kıbrıs Şehitleri Caddesi No: 00/0, Alsancak, 35220 Konak / İzmir',
    phone1: '+90 (555) 000 00 00',
    phone2: '+90 (555) 000 00 01',
    email: 'bilgi@psikolog.com',
    phones: [
      { label: 'Randevu', value: '+90 (555) 000 00 00' },
      { label: 'WhatsApp', value: '+90 (555) 000 00 01' },
    ],
    emails: [{ label: 'Randevu & Danışma', value: 'bilgi@psikolog.com' }],
    socialLinks: [
      { name: 'Instagram', url: 'https://instagram.com' },
      { name: 'LinkedIn', url: 'https://linkedin.com' },
      { name: 'YouTube', url: 'https://youtube.com' },
    ],
    mapIframe:
      '<iframe src="https://www.google.com/maps?q=Ba%C4%9Fdat%20Caddesi%2C%20Kad%C4%B1k%C3%B6y%2C%20%C4%B0stanbul&output=embed" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    logo: '',
    logoFooter: '',
  });

  // 2. Ana sayfa
  console.log('🏠 Ana sayfa...');
  await upsertSingleton('homePage', {
    metaTitle: 'İzmir Psikolog | Uzm. Klinik Psikolog · Alsancak & Online Terapi',
    metaDesc:
      'Kaygı, depresyon, ilişki sorunları ve travma alanlarında BDT, Şema Terapi ve EMDR gibi kanıta dayalı yöntemlerle yüz yüze ve online psikoterapi.',
    metaKeys: 'psikolog, klinik psikolog, izmir psikolog, online terapi, çift terapisi, emdr, bilişsel davranışçı terapi, şema terapi',
    servicesTitle: 'Size nasıl destek olabilirim?',
    whyUsTitle: 'Kanıta dayalı, güçlü yanlarınızı merkeze alan bir terapi',
    whyUsItems: [
      { title: 'Pratik ve hedef odaklı', desc: 'Seanslardan somut beceriler ve günlük hayatta kullanabileceğiniz araçlarla ayrılırsınız.' },
      { title: 'Şefkatli ve yargısız', desc: 'Ne yaşadığınızı anlatırken kendinizi güvende hissedeceğiniz, kabul dolu bir alan.' },
      { title: 'Travma bilgili', desc: 'Geçmiş deneyimlerin bugüne etkisini gözeten, tempoyu sizin belirlediğiniz bir süreç.' },
      { title: 'Size özel plan', desc: 'BDT, Şema Terapi ve EMDR gibi yöntemleri ihtiyaçlarınıza göre bir araya getiriyoruz.' },
    ],
    whyUsImg: IMG('anasayfa-yaklasim'),
    projectsTitle: 'Blogdan son yazılar',
    projectsDesc: 'Ruh sağlığı, ilişkiler ve kendini anlama üzerine sade ve uygulanabilir yazılar.',
    ctaTitle: 'Kendinizi daha iyi hissetmeye doğru ilk adımı atın',
    ctaDesc:
      'Yüz yüze ya da online; size uygun bir zamanda tanışma görüşmesi planlayalım. Hangi desteğin size iyi geleceğini birlikte netleştirelim.',
    ctaBtn1Text: 'Randevu talebi oluştur',
    ctaBtn1Link: '/quote',
    ctaBtn2Text: 'Önce soru sormak istiyorum',
    ctaBtn2Link: '/contact',
  });

  // 3. Hero slaytları
  console.log('📸 Slaytlar...');
  await prisma.slide.deleteMany();
  await prisma.slide.createMany({
    data: [
      {
        subtitle: 'İzmir Psikolog · Uzm. Klinik Psikolog · Alsancak & Online',
        title: 'Pratik, şefkatli ve gerçekten işe yarayan bir terapi',
        desc: 'Kaygı, depresyon, ilişki sorunları ve travma sonrası süreçlerde kanıta dayalı yöntemlerle, size özel bir yol haritası oluşturuyoruz.',
        bg: IMG('hero-sakin-oda'),
        order: 1,
        metaTitle: 'Sakin terapi odası',
      },
      {
        subtitle: 'Yüz Yüze & Online Seanslar',
        title: 'Nerede olursanız olun, güvenli bir alan',
        desc: "Görüntülü görüşmeyle Türkiye'nin ve dünyanın her yerinden, yüz yüze seanslarla aynı özen ve gizlilikle görüşebiliriz.",
        bg: IMG('hero-nefes'),
        order: 2,
        metaTitle: 'Deniz kenarında nefes egzersizi yapan kadın',
      },
      {
        subtitle: 'Kanıta Dayalı Yöntemler',
        title: 'BDT, Şema Terapi ve EMDR ile kalıcı değişim',
        desc: 'Belirtileri yalnızca hafifletmek değil; onları besleyen düşünce, duygu ve davranış örüntülerini birlikte dönüştürmek için.',
        bg: IMG('hero-orman-yolu'),
        order: 3,
        metaTitle: 'Işık süzülen orman yolu',
      },
    ],
  });

  // 4. Hizmetler
  console.log('🩺 Hizmetler...');
  await prisma.service.deleteMany();
  await prisma.service.createMany({
    data: [
      {
        slug: 'bireysel-yetiskin-terapisi',
        title: 'Bireysel Yetişkin Terapisi',
        desc: 'Kendinizi daha iyi tanımak, zorlayıcı duygularla baş etmek ve hayatınızda istediğiniz değişimi yaratmak için birebir, yapılandırılmış bir terapi süreci.',
        longDesc:
          'Bireysel terapi; günlük yaşamınızı, ilişkilerinizi ve iç huzurunuzu zorlayan duygu, düşünce ve davranış örüntülerini birlikte anlamayı ve dönüştürmeyi amaçlar.\n\nSeanslarda Bilişsel Davranışçı Terapi (BDT) ve Şema Terapi temelli, kanıta dayalı teknikler kullanılır. Amaç yalnızca belirtileri hafifletmek değil; kendi iç kaynaklarınızı fark etmeniz, psikolojik dayanıklılık kazanmanız ve seanslar bittiğinde de kullanabileceğiniz beceriler edinmenizdir.',
        features: 'Kaygı ve sürekli endişe, Depresyon ve motivasyon kaybı, Özgüven ve sınır koyma, Değersizlik ve yetersizlik hissi, Öfke ve duygu düzenleme, Mükemmeliyetçilik ve tükenmişlik',
        steps: 'Tanışma ve değerlendirme, Hedeflerin birlikte belirlenmesi, Düşünce ve davranış örüntülerinin keşfi, Baş etme becerilerinin geliştirilmesi, Kazanımların pekiştirilmesi ve sonlandırma',
        img: IMG('hizmet-bireysel'),
        isFeatured: true,
        metaTitle: 'Bireysel Yetişkin Terapisi',
        metaDesc: 'Kaygı, depresyon, özgüven ve duygu düzenleme güçlüklerinde BDT ve Şema Terapi temelli bireysel psikoterapi.',
      },
      {
        slug: 'cift-ve-iliski-terapisi',
        title: 'Çift ve İlişki Terapisi',
        desc: 'Tekrarlayan tartışma döngülerinden çıkmak, güveni yeniden inşa etmek ve partnerinizle daha derin bir bağ kurmak için birlikte çalışıyoruz.',
        longDesc:
          'İlişkilerde zaman zaman iletişim kopuklukları, anlaşılmama hissi, güven sorunları ya da duygusal uzaklaşma yaşanabilir. Çift terapisi, partnerlerin birbirinin duygusal ihtiyaçlarını daha iyi anlamasına, yıkıcı çatışma döngülerini fark edip durdurmasına ve sağlıklı sınırlar oluşturmasına yardımcı olur.\n\nSeanslarda taraf tutulmaz; odak noktası ilişkinin kendisidir. Hem ortak hem de gerektiğinde bireysel görüşmelerle ilerlenir.',
        features: 'İletişim kopukluğu ve sık tartışmalar, Güven sorunları, Aldatma sonrası onarım, Ayrılık ve boşanma süreci, Duygusal yakınlık ve bağlanma, Evlilik öncesi danışmanlık',
        steps: 'Ortak ilk görüşme, Bireysel değerlendirme seansları, Çatışma döngülerinin haritalanması, İletişim ve onarım egzersizleri, Güvenin ve yakınlığın yeniden inşası',
        img: IMG('hizmet-cift'),
        isFeatured: true,
        metaTitle: 'Çift ve İlişki Terapisi',
        metaDesc: 'İletişim sorunları, güven kaybı ve duygusal uzaklaşma yaşayan çiftler için ilişki terapisi.',
      },
      {
        slug: 'online-terapi',
        title: 'Online Terapi',
        desc: 'Evinizin ya da ofisinizin konforunda, güvenli görüntülü görüşmeyle; yüz yüze seanslarla aynı özen ve gizlilikte terapi.',
        longDesc:
          'Yoğun iş temposu, farklı bir şehirde ya da yurt dışında yaşamak veya ulaşım güçlükleri terapiye erişimi zorlaştırabilir. Online terapi, yüz yüze seanslarla aynı etik ilkeler ve klinik yöntemlerle yürütülür.\n\nAraştırmalar kaygı, depresyon ve travma gibi pek çok alanda online terapinin yüz yüze terapiyle benzer etkililikte olduğunu gösteriyor. İhtiyacınız olan tek şey sessiz, bölünmeyeceğiniz bir ortam ve stabil bir internet bağlantısı.',
        features: 'Kendi alanınızda görüşme, Şehir dışı ve yurt dışı danışanlar, Esnek seans saatleri, Ulaşım ve zaman tasarrufu, Uçtan uca şifreli görüşme platformları',
        steps: 'Online randevu planlama, Kısa ön görüşme, Güvenli bağlantı üzerinden ilk seans, Düzenli haftalık seanslar, Düzenli ilerleme değerlendirmesi',
        img: IMG('hizmet-online'),
        isFeatured: true,
        metaTitle: 'Online Terapi',
        metaDesc: 'Türkiye ve yurt dışından güvenli görüntülü görüşmeyle online psikoterapi.',
      },
      {
        slug: 'emdr-ve-travma-terapisi',
        title: 'EMDR & Travma Terapisi',
        desc: 'Geçmişte yaşanan zorlayıcı deneyimlerin bugününüz üzerindeki etkisini azaltmak için bilimsel olarak desteklenen bir yöntem.',
        longDesc:
          'EMDR (Göz Hareketleriyle Duyarsızlaştırma ve Yeniden İşleme); kaza, kayıp, ihmal, istismar ya da çocukluk dönemine ait zorlayıcı yaşantılar gibi beynin tam olarak işleyemediği anıların yeniden işlenmesine yardımcı olan bir terapi yöntemidir.\n\nAnı silinmez; ancak anıya eşlik eden yoğun duygu, bedensel gerginlik ve olumsuz inançlar zamanla yerini daha sakin ve güçlendirici bir bakışa bırakır. Süreç, güvenlik ve dengeleme çalışmalarıyla, sizin tempoda ilerler.',
        features: 'Çocukluk dönemi zorlayıcı yaşantılar, Ani kayıplar ve travmatik yas, Kaza ve afet sonrası travma, Fobiler ve tetikleyici korkular, Kronik suçluluk ve değersizlik inançları',
        steps: 'Yaşam öyküsü ve güvenli yer çalışması, Hedef anıların belirlenmesi, Çift yönlü uyarımla yeniden işleme, Olumlu inancın yerleştirilmesi, Beden taraması ve kapanış',
        img: IMG('hizmet-travma'),
        isFeatured: true,
        metaTitle: 'EMDR ve Travma Terapisi',
        metaDesc: 'Travma, kayıp ve zorlayıcı yaşam olaylarının etkilerini azaltmaya yönelik EMDR terapisi.',
      },
      {
        slug: 'kaygi-ve-panik-atak',
        title: 'Kaygı & Panik Atak',
        desc: 'Sürekli endişe, panik atak, sosyal kaygı ve bedensel kaygı belirtileriyle baş etmek için BDT temelli, adım adım bir çalışma.',
        longDesc:
          'Kaygı, bedenimizin doğal alarm sistemidir; ancak gerçek bir tehlike yokken sürekli tetikte olmak hayatı daraltır. Panik atakların ve felaketleştirici düşüncelerin döngüsünü anlamak, çözümün ilk adımıdır.\n\nSeanslarda kaygının nasıl çalıştığını öğrenir, nefes ve beden farkındalığı tekniklerini uygular, kaçındığınız durumlarla kademeli ve güvenli biçimde yeniden temas kurmayı çalışırız.',
        features: 'Panik bozukluk ve agorafobi, Yaygın kaygı bozukluğu, Sosyal kaygı, Sağlık kaygısı, Sınav ve performans kaygısı, Obsesif düşünceler',
        steps: 'Kaygı döngüsü hakkında psikoeğitim, Düşünce çarpıtmalarının fark edilmesi, Nefes ve beden farkındalığı teknikleri, Kademeli maruz bırakma, Bağımsızlık ve özgüvenin pekiştirilmesi',
        img: IMG('hizmet-kaygi'),
        isFeatured: true,
        metaTitle: 'Kaygı ve Panik Atak Terapisi',
        metaDesc: 'Panik atak, yaygın kaygı ve sosyal kaygı için bilişsel davranışçı terapi.',
      },
      {
        slug: 'depresyon-ve-yas',
        title: 'Depresyon & Yas',
        desc: 'İçsel boşluk, isteksizlik, tükenmişlik ya da bir kaybın ardından gelen yoğun keder döneminde şefkatli ve yapılandırılmış destek.',
        longDesc:
          'Depresyon, hem enerjinizi hem de geleceğe dair umudunuzu gölgeleyebilir. Yas ise sevilen birinin, bir ilişkinin ya da bir yaşam döneminin kaybına verilen doğal ama bazen içinden çıkılması zor bir tepkidir.\n\nTerapide bu duyguları güvenle yaşayabileceğiniz bir alan oluşturur; davranışsal aktivasyon, öz-şefkat ve anlam odaklı çalışmalarla yeniden hayata bağlanmanıza destek oluruz.',
        features: 'Süregen mutsuzluk ve çökkünlük, Enerji ve motivasyon kaybı, Yoğun keder ve karmaşık yas, Tükenmişlik, Yalnızlık ve geri çekilme',
        steps: 'Duyguların ifadesi için güvenli zemin, Davranışsal aktivasyon, Olumsuz otomatik düşüncelerle çalışma, Kabul ve öz-şefkat, Anlamın yeniden inşası',
        img: IMG('hizmet-depresyon-yas'),
        isFeatured: true,
        metaTitle: 'Depresyon ve Yas Danışmanlığı',
        metaDesc: 'Depresyon, tükenmişlik ve yas sürecinde psikoterapi desteği.',
      },
    ],
  });

  // 5. Hakkımda
  console.log('👤 Hakkımda...');
  await upsertSingleton('aboutPage', {
    metaTitle: 'Hakkımda',
    metaDesc: 'Eğitimim, terapi yaklaşımım (BDT, Şema Terapi, EMDR), etik ilkelerim ve çalışma alanlarım.',
    metaKeys: 'uzman klinik psikolog, bdt terapisti, emdr terapisti, şema terapi, izmir psikolog',
    storyImg: IMG('hakkimda-hikaye'),
    storyTitle: 'Kendinizi anlama ve iyileşme yolculuğunuzda yanınızdayım',
    storyDesc1:
      'Psikoloji lisans ve Klinik Psikoloji yüksek lisans eğitimlerimin ardından yetişkinlerle bireysel terapi ve çiftlerle ilişki terapisi alanında çalışıyorum. Danışanlarımın kendileriyle ve çevreleriyle daha huzurlu bir ilişki kurmalarına eşlik etmek, işimin en anlamlı yanı.',
    storyDesc2:
      'Seanslarımda Bilişsel Davranışçı Terapi, Şema Terapi ve EMDR gibi kanıta dayalı yöntemleri, her danışanın biricik hikâyesine göre uyarlıyorum. Yargısız, şefkatli ve güvenli bir terapötik ilişkinin değişimin temeli olduğuna inanıyorum.',
    visionTitle: 'Pratik ve şefkatli bir terapi',
    visionText:
      'Belirtileri yalnızca bastırmak yerine onları besleyen örüntüleri anlamayı; seanslardan günlük hayatta işinize yarayacak somut becerilerle ayrılmanızı hedefliyorum.',
    missionTitle: 'Etik ve gizlilik',
    missionText:
      'Türk Psikologlar Derneği etik ilkeleri ve KVKK çerçevesinde danışan gizliliğini titizlikle korur; şeffaf, dürüst ve insani değerlere bağlı bir çalışma yürütürüm.',
    bridgeLabel: 'Yöntemler',
    bridgeTitle: 'Bilimsel yaklaşım,<br/>şefkatli dinleme',
    bridgeDesc1:
      'Uyguladığım yöntemler, etkinliği klinik araştırmalarla desteklenen Bilişsel Davranışçı Terapi (BDT), Şema Terapi ve travma odaklı EMDR terapisidir. Hangi yöntemin size uygun olduğuna değerlendirme sürecinde birlikte karar veririz.',
    bridgeDesc2:
      'Düzenli süpervizyon ve sürekli mesleki eğitimle güncel literatürü takip ediyor; yüz yüze ve online seanslarda aynı klinik standartları uyguluyorum.',
    bridgeImg: IMG('hakkimda-denge'),
    brochureLabel: 'Eğitim & Sertifikalar',
    brochureTitle: 'Klinik eğitimler',
    brochureDesc: 'Akademik geçmişim ve aldığım psikoterapi eğitimleri.',
    brochureUrl: '#',
    brochureHighlights: JSON.stringify([
      { title: 'Lisans & Yüksek Lisans', desc: 'Psikoloji lisans ve Klinik Psikoloji tezli yüksek lisans.' },
      { title: 'Bilişsel Davranışçı Terapi', desc: 'Teorik eğitim ve süpervizyonlu uygulama programı.' },
      { title: 'EMDR Düzey I & II', desc: 'Travma odaklı EMDR terapisi eğitimleri.' },
      { title: 'Şema Terapi', desc: 'Şema Terapi temel ve ileri düzey eğitim programı.' },
    ]),
    materialsTitle: 'Çalışma alanlarım',
    materials:
      'Kaygı ve panik atak, Depresyon ve isteksizlik, İlişki ve evlilik sorunları, Travma ve zorlayıcı yaşam olayları, Yas ve kayıp, Tükenmişlik ve iş stresi, Özgüven ve sınır koyma, Duygu düzenleme ve öfke, Obsesif düşünceler, Sosyal kaygı',
    policyTitle: 'Danışan hakları ve terapi ilkeleri',
    policies: JSON.stringify([
      { title: 'Gizlilik', desc: 'Seanslarda paylaşılan her şey etik ilkeler ve danışan mahremiyeti çerçevesinde gizli tutulur.' },
      { title: 'Yargısız ve güvenli alan', desc: 'Duygu ve düşünceleriniz kabul ve empatiyle karşılanır; tempoyu siz belirlersiniz.' },
      { title: 'İş birliği ve şeffaflık', desc: 'Hedefler birlikte belirlenir, süreç düzenli olarak birlikte değerlendirilir.' },
    ]),
  });

  // 6. Terapi süreci
  console.log('🌿 Terapi süreci...');
  await upsertSingleton('productionInfo', {
    title: 'Terapi süreci nasıl ilerler?',
    desc: 'Terapi, kendinizi daha iyi tanıma ve yaşam kalitenizi artırma yolculuğudur. Her adımı birlikte ve sizin temponuzda atıyoruz.',
    img: IMG('surec-yolculuk'),
    metaTitle: 'Terapi Süreci',
    metaDesc: 'İlk görüşmeden sonlandırmaya kadar adım adım psikoterapi süreci.',
    metaKeys: 'terapi süreci, ilk seans, psikolog seansı nasıl geçer',
  });
  await prisma.productionStep.deleteMany();
  await prisma.productionStep.createMany({
    data: [
      { order: 1, title: 'Ön görüşme ve tanışma', desc: 'Kısa bir telefon görüşmesiyle ihtiyacınızı dinler, sorularınızı yanıtlar ve size uygun seans biçimini (yüz yüze/online) belirleriz.' },
      { order: 2, title: 'Değerlendirme', desc: 'İlk seanslarda sizi terapiye getiren konuları, yaşam öykünüzü ve beklentilerinizi konuşur; güvenli bir terapötik ilişkinin temelini atarız.' },
      { order: 3, title: 'Hedefleri birlikte belirleme', desc: 'Neyin değişmesini istediğinizi netleştirir; somut, ulaşılabilir ve size anlamlı gelen hedefler oluştururuz.' },
      { order: 4, title: 'Size özel terapi planı', desc: 'İhtiyacınıza en uygun yöntemi (BDT, Şema Terapi, EMDR) seçer, yapılandırılmış bir yol haritası hazırlarız.' },
      { order: 5, title: 'Düzenli seanslar ve beceri geliştirme', desc: 'Haftalık 50 dakikalık seanslarda örüntüler üzerinde çalışır, öğrendiğiniz becerileri günlük hayata taşımanız için küçük uygulamalar planlarız.' },
      { order: 6, title: 'Değerlendirme ve sonlandırma', desc: 'Hedeflere yaklaştıkça seans aralıklarını açar, kazanımları pekiştirir ve süreci birlikte, planlı bir şekilde tamamlarız.' },
    ],
  });

  // 7. Blog
  console.log('📝 Blog yazıları...');
  await prisma.blogPost.deleteMany();
  const day = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const posts = [
    {
      title: 'Kaygıyla Yaşamayı Öğrenmek: Bedende ve Zihinde Neler Olur?',
      slug: 'kaygiyla-yasamayi-ogrenmek',
      category: 'Kaygı',
      image: IMG('blog-kaygi'),
      excerpt: 'Kalp çarpıntısı, bitmeyen "ya olursa"lar ve tükenmişlik… Kaygıyı bir düşman olarak görmek yerine onu anlamak mümkün mü?',
      content: `Kaygı, insanın tehlike karşısında hayatta kalmasını sağlayan doğal bir alarm sistemidir. Ancak tehditler fiziksel olmaktan çok sosyal ve zihinsel olduğunda, bu alarm yanlış zamanda ve olması gerekenden daha yüksek sesle çalabilir.

Kaygı anında bedende neler olur?
Beyin bir tehdit algıladığında "savaş ya da kaç" tepkisi devreye girer. Kalp hızlanır, nefes sığlaşır, kaslar gerilir. Bu belirtiler gerçek bir tehlike olmadığını bilseniz bile korkutucu hissettirebilir.

Neler yapabilirsiniz?
1. Nefesi yavaşlatmak: 4 saniye nefes alıp 6 saniyede vermek, bedene "güvendesin" mesajı verir.
2. Düşünceleri sorgulamak: "Bunun gerçekleşme olasılığı ne?" sorusu felaketleştirici düşünce zincirini yavaşlatır.
3. Kaçınmak yerine temas etmek: Kaygı duyulan durumlardan kaçınmak kısa vadede rahatlatır ama uzun vadede kaygıyı büyütür. Kademeli temas güven duygusunu yeniden inşa eder.

Kaygı işinizi, ilişkilerinizi ya da günlük hayatınızı kısıtlamaya başladıysa, bir uzmandan destek almak kalıcı bir değişimin ilk adımı olabilir.`,
      views: 240,
      createdAt: new Date(now - 2 * day),
    },
    {
      title: 'İlişkilerde Sağlıklı Sınırlar Koymak Neden Bu Kadar Zor?',
      slug: 'iliskilerde-saglikli-sinirlar',
      category: 'İlişkiler',
      image: IMG('blog-sinirlar'),
      excerpt: '"Hayır" diyememek, sürekli başkalarını memnun etmeye çalışmak ve günün sonunda tükenmiş hissetmek… Sınır koymak neden suçluluk yaratır?',
      content: `Pek çok kişi için "hayır" demek; karşı tarafı kıracakmış, sevilmeyecekmiş ya da terk edilecekmiş gibi hissettirir. Oysa sınırlar ilişkileri bitiren değil, onları koruyan ve sürdürülebilir kılan şeylerdir.

Sınır koymanın önündeki engeller
- Onaylanma ihtiyacı: Değerimizi başkalarının bizi beğenmesi üzerinden tanımlamak.
- Çatışma korkusu: Gerginlik yaşamamak için kendi ihtiyaçlarımızdan vazgeçmek.
- Suçluluk: Kendi isteğimizi öne koyduğumuzda bencil hissetmek.

Küçük adımlarla başlayın
Sınır koymak bir beceridir ve pratikle gelişir. Önce düşük riskli durumlarda, kısa ve net cümlelerle başlayabilirsiniz: "Bu akşam müsait değilim, hafta sonu konuşalım mı?"

Unutmayın; sağlıklı bir ilişkide "evet"leriniz kadar "hayır"larınız da değer görür.`,
      views: 185,
      createdAt: new Date(now - 9 * day),
    },
    {
      title: 'EMDR Terapisi Nedir, Nasıl Çalışır?',
      slug: 'emdr-terapisi-nedir',
      category: 'Terapi Yöntemleri',
      image: IMG('blog-emdr'),
      excerpt: 'Geçmişte yaşanan zorlayıcı olayların bugünkü etkisini azaltmaya yardımcı olan EMDR terapisinin temel ilkeleri.',
      content: `EMDR (Eye Movement Desensitization and Reprocessing), Türkçesiyle Göz Hareketleriyle Duyarsızlaştırma ve Yeniden İşleme; travma sonrası stres, panik, fobiler ve süregen değersizlik inançlarında kullanılan, araştırmalarla desteklenen bir psikoterapi yöntemidir.

Nasıl çalışır?
Beyin normalde yaşadıklarımızı işler ve belleğe yerleştirir. Çok sarsıcı bir deneyimde ise anı adeta "donmuş" haliyle kalabilir; benzer bir uyaranla karşılaştığımızda o günkü duygular yeniden canlanır.

EMDR seanslarında kullanılan çift yönlü uyarım (göz hareketleri, dokunsal ya da işitsel uyaranlar), beynin doğal işleme mekanizmasını yeniden harekete geçirir. Anı silinmez; ancak anıya eşlik eden yoğun duygu ve bedensel gerginlik azalır.

EMDR her zaman doğrudan travmatik anılarla başlamaz. Önce güvenlik ve dengeleme çalışmaları yapılır; süreç sizin hazır olma halinize göre ilerler.`,
      views: 310,
      createdAt: new Date(now - 16 * day),
    },
    {
      title: 'Öz-Şefkat: Kendinize En Yakın Arkadaşınız Gibi Davranmak',
      slug: 'oz-sefkat-nedir',
      category: 'Kişisel Gelişim',
      image: IMG('blog-oz-sefkat'),
      excerpt: 'Hata yaptığınızda içinizdeki ses ne söylüyor? Öz-eleştirinin yerine öz-şefkati koymak, değişimi zorlaştırmaz; kolaylaştırır.',
      content: `Çoğumuz zor bir an yaşayan bir arkadaşımıza nazik ve destekleyici davranırız. Aynı durumda kendimize ise çoğu zaman sert ve acımasız bir dil kullanırız.

Öz-şefkat nedir?
Öz-şefkat; zorlandığımız anlarda kendimize anlayış, nezaket ve kabulle yaklaşabilmektir. Araştırmalar öz-şefkatin kaygı ve depresyon belirtilerini azalttığını, motivasyonu ise azaltmadığını gösteriyor.

Üç temel bileşen
1. Kendine nezaket: Kendinizi yargılamak yerine destekleyici bir iç ses kullanmak.
2. Ortak insanlık: Zorlanmanın insan olmanın bir parçası olduğunu hatırlamak.
3. Farkındalık: Acı veren duyguları bastırmadan ya da büyütmeden fark etmek.

Küçük bir egzersiz
Zorlandığınız bir anda elinizi kalbinize koyup kendinize şunu söyleyin: "Bu şu an gerçekten zor. Zorlanmak insanca. Kendime şu an nasıl iyi davranabilirim?"`,
      views: 152,
      createdAt: new Date(now - 23 * day),
    },
    {
      title: 'Günlük Tutmanın Ruh Sağlığına Etkileri',
      slug: 'gunluk-tutmanin-faydalari',
      category: 'Kişisel Gelişim',
      image: IMG('blog-gunluk'),
      excerpt: 'Düşüncelerinizi kâğıda dökmek, zihindeki karmaşayı düzenlemenin en basit ve en etkili yollarından biri olabilir.',
      content: `Zihnimizde dönüp duran düşünceler, yazıya döküldüğünde çoğu zaman daha anlaşılır ve yönetilebilir hale gelir. Günlük tutmak, terapide de sıkça önerilen basit ama güçlü bir araçtır.

Neden işe yarar?
Yazmak, duyguları adlandırmamıza ve aralarında bir mesafe koymamıza yardımcı olur. Ayrıca tekrarlayan düşünce ve davranış örüntülerini fark etmeyi kolaylaştırır.

Nasıl başlayabilirsiniz?
- Günde 10 dakika ayırın; mükemmel olması gerekmiyor.
- "Bugün beni en çok ne zorladı, ne iyi geldi?" gibi basit sorularla başlayın.
- Gün içinde fark ettiğiniz üç küçük güzel şeyi not edin.

Günlük, terapinin yerini tutmaz; ancak seanslar arasında kendinizle bağlantıda kalmanın değerli bir yoludur.`,
      views: 98,
      createdAt: new Date(now - 30 * day),
    },
    {
      title: 'Yas Süreci: Kayıpla Birlikte Yaşamayı Öğrenmek',
      slug: 'yas-sureci',
      category: 'Yas & Kayıp',
      image: IMG('blog-yas'),
      excerpt: 'Yasın "doğru" bir yolu ya da süresi yoktur. Kayıp sonrası yaşananları anlamak, bu zorlu dönemde kendinize alan açmanıza yardımcı olabilir.',
      content: `Sevdiğimiz birini, bir ilişkiyi ya da hayatımızdaki önemli bir dönemi kaybettiğimizde yaşadığımız acı, sevginin ve bağın doğal bir yansımasıdır.

Yas doğrusal değildir
Yas çoğu zaman dalgalar halinde gelir. Bir gün iyi hissederken ertesi gün beklenmedik bir anı yoğun bir hüzün getirebilir. Bu, geriye gittiğiniz anlamına gelmez.

Kendinize nasıl destek olabilirsiniz?
- Duygularınıza izin verin; hüzün, öfke, suçluluk ve hatta rahatlama bir arada olabilir.
- Rutinlerinizi küçük adımlarla sürdürmeye çalışın: uyku, beslenme, kısa yürüyüşler.
- Güvendiğiniz kişilerle konuşun; yalnız taşımak zorunda değilsiniz.

Ne zaman destek almalı?
Aylar geçmesine rağmen günlük işlevleriniz ciddi biçimde etkileniyorsa, kayıpla ilgili yoğun suçluluk ya da anlamsızlık duyguları sürüyorsa, profesyonel destek almak iyi gelebilir.`,
      views: 121,
      createdAt: new Date(now - 37 * day),
    },
  ];
  for (const p of posts) {
    await prisma.blogPost.create({
      data: {
        ...p,
        status: 'Yayında',
        metaTitle: p.title,
        metaDesc: p.excerpt,
      },
    });
  }

  // 8. Galeri (klinik)
  console.log('🖼️  Klinik galerisi...');
  const gallery = [
    ['klinik-oturma', 'Seans odasında sakin bir köşe', 'Seans Odası'],
    ['klinik-salon', 'Aydınlık bekleme alanı', 'Bekleme Alanı'],
    ['klinik-masa', 'Gün ışığı alan çalışma masası', 'Seans Odası'],
    ['klinik-detay', 'Küçük detaylar', 'Detaylar'],
    ['klinik-calisma', 'Sade ve düzenli çalışma alanı', 'Seans Odası'],
    ['klinik-bitki', 'Doğadan dokunuşlar', 'Detaylar'],
    ['klinik-sukulent', 'Yeşil bir mola', 'Detaylar'],
    ['klinik-cay', 'Seans öncesi bir fincan çay', 'Bekleme Alanı'],
    ['klinik-yapraklar', 'Huzur veren yeşil tonlar', 'Detaylar'],
    ['klinik-defter', 'Not almak için', 'Detaylar'],
    ['klinik-pencere', 'Pencere kenarı', 'Bekleme Alanı'],
    ['klinik-doku', 'Doğal dokular', 'Detaylar'],
  ];
  await prisma.galleryItem.createMany({
    data: gallery.map(([img, title, category], i) => ({ img: IMG(img), title, category, order: i, metaTitle: title })),
  });

  // 9. Sayfa başlıkları
  console.log('📑 Sayfa başlıkları...');
  const headers = [
    { pageIdentifier: 'services', title: 'Size nasıl destek olabilirim?', description: 'Bireysel terapi, çift terapisi, online terapi, EMDR ve travma terapisi; kaygı, depresyon ve yas sürecinde psikolojik destek.' },
    { pageIdentifier: 'production', title: 'Terapi süreci nasıl ilerler?', description: 'Ön görüşmeden sonlandırmaya kadar her adımı birlikte, sizin temponuzda atıyoruz.' },
    { pageIdentifier: 'about', title: 'Merhaba, tanışalım', description: 'Eğitimim, terapi yaklaşımım ve çalışma alanlarım hakkında bilmeniz gerekenler.' },
    { pageIdentifier: 'gallery', title: 'Klinik & seans odası', description: 'Kendinizi güvende ve rahat hissetmeniz için tasarlanmış sakin bir ortam.' },
    { pageIdentifier: 'blog', title: 'Psikoloji blogu', description: 'Ruh sağlığı, ilişkiler ve kendini anlama üzerine sade ve uygulanabilir yazılar.' },
    { pageIdentifier: 'contact', title: 'İletişim & randevu', description: 'Sorularınız ya da randevu talebiniz için bana ulaşabilirsiniz. Genellikle 1 iş günü içinde dönüş yaparım.' },
  ];
  for (const h of headers) {
    await prisma.pageHeader.upsert({
      where: { pageIdentifier: h.pageIdentifier },
      update: { title: h.title, description: h.description },
      create: h,
    });
  }

  // 10. Randevu formu kategorileri
  console.log('🏷️  Kategoriler...');
  const catNames = [
    'Bireysel Yetişkin Terapisi',
    'Çift ve İlişki Terapisi',
    'Online Terapi',
    'EMDR & Travma Terapisi',
    'Kaygı & Panik Atak',
    'Depresyon & Yas',
    'Henüz emin değilim',
  ];
  await prisma.category.deleteMany({ where: { name: { notIn: catNames } } });
  for (const name of catNames) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }

  // 11. İzmir yerel SEO alanları (adres, meta başlıklar, sayfa açıklamaları)
  console.log('📍 İzmir SEO...');
  await applyIzmirSeo(prisma);
  await applyIzmirBlog(prisma);

  console.log('🎉 Tamamlandı.');
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
