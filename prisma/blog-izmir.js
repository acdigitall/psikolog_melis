/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * İzmir yerel SEO ve GEO odaklı blog yazıları.
 * Her yazı "kısa yanıt" ile başlar, soru biçimli ara başlıklar kullanır (yapay zekâ yanıtlarında alıntılanmaya uygun).
 * Slug'a göre ekler/günceller; admin'den eklenen diğer yazılara dokunmaz.
 * Çalıştırma: node prisma/blog-izmir.js   (seed.js sonunda da otomatik çalışır)
 */
const IMG = (n) => `/images/${n}.jpg`;
const day = 24 * 60 * 60 * 1000;

const posts = [
  {
    slug: 'izmirde-psikolog-nasil-secilir',
    title: "İzmir'de Psikolog Nasıl Seçilir? Dikkat Edilmesi Gereken 7 Nokta",
    category: 'Terapiye Başlarken',
    image: IMG('klinik-oturma'),
    daysAgo: 1,
    excerpt:
      "İzmir'de psikolog seçerken unvan ve eğitim, çalışılan yöntem, uzmanlık alanı, ulaşım, seans biçimi ve ilk görüşmedeki güven duygusu belirleyicidir.",
    metaTitle: "İzmir'de Psikolog Nasıl Seçilir? 7 Önemli Nokta",
    metaDesc:
      "İzmir'de psikolog ararken unvan, eğitim, yöntem, uzmanlık alanı, ulaşım ve ücret konusunda nelere dikkat etmelisiniz? Uzman klinik psikologdan pratik rehber.",
    metaKeys: 'izmir psikolog, izmir psikolog seçimi, izmir uzman klinik psikolog, iyi psikolog nasıl seçilir, psikolog izmir',
    content: `Kısa yanıt: İzmir'de psikolog seçerken önce unvana ve eğitime bakın, sonra size uygun yöntemle ve sizin yaşadığınız konuda deneyimli biriyle çalıştığınızdan emin olun. Ulaşım, seans biçimi (yüz yüze/online) ve ilk görüşmede kendinizi güvende hissedip hissetmediğiniz de en az bunlar kadar önemlidir.

1. Unvan ve eğitim: psikolog, klinik psikolog, psikiyatrist
Psikolog, dört yıllık psikoloji lisansını tamamlamış kişidir. Uzman klinik psikolog ise buna ek olarak klinik psikoloji alanında yüksek lisans yapmış, tanı ve psikoterapi konusunda süpervizyonlu eğitim almıştır. Psikiyatrist tıp doktorudur ve ilaç yazabilir. Psikoterapi için uzman klinik psikolog ya da psikoterapi eğitimi almış bir psikologla çalışmak en sağlıklı yoldur.

2. Kullandığı yöntem kanıta dayalı mı?
Bilişsel Davranışçı Terapi (BDT), Şema Terapi ve EMDR gibi yöntemlerin etkinliği araştırmalarla desteklenmiştir. Psikoloğunuza hangi yöntemle çalıştığını ve bu yöntemin sizin sorununuz için neden uygun olduğunu sormaktan çekinmeyin.

3. Sizin konunuzda deneyimli mi?
Panik atak, çift ilişkisi, travma ya da yas gibi konular farklı beceriler gerektirir. Web sitesindeki çalışma alanlarına ve aldığı eğitimlere bakmak iyi bir başlangıçtır.

4. Ulaşım ve seans saatleri
Terapi genellikle haftalık bir süreçtir; bu yüzden kliniğe ulaşımın kolay olması devamlılığı doğrudan etkiler. Alsancak gibi İZBAN, metro, tramvay ve vapurla bağlantılı merkezler, Karşıyaka, Bornova, Bayraklı ve Buca'dan gelenler için pratiktir. Akşam ve cumartesi seansları çalışanlar için önemlidir.

5. Online seans imkânı
Yoğun haftalarda, hastalıkta ya da şehir dışındayken seansı online sürdürebilmek, sürecin kesintiye uğramamasını sağlar.

6. Ücret ve iptal koşullarında şeffaflık
Seans ücreti, süresi ve iptal kuralları ilk görüşmeden önce açıkça paylaşılmalıdır.

7. İlk görüşmede kendinizi nasıl hissettiniz?
Araştırmalar terapinin başarısında en güçlü etkenlerden birinin terapötik ilişki olduğunu gösteriyor. İlk bir iki seansın sonunda anlaşıldığınızı ve yargılanmadığınızı hissediyorsanız doğru yerdesiniz. Hissetmiyorsanız başka bir uzmana geçmek tamamen normaldir.

Unutmayın: doğru psikoloğu bulmak bazen birkaç deneme gerektirebilir. Önemli olan, ilk adımı atmış olmanızdır.`,
  },
  {
    slug: 'panik-atak-nedir-nasil-gecer',
    title: 'Panik Atak Nedir, Nasıl Geçer? Belirtiler ve Tedavi',
    category: 'Kaygı',
    image: IMG('blog-kaygi'),
    daysAgo: 4,
    excerpt:
      'Panik atak, birkaç dakika içinde zirveye ulaşan yoğun korku ve bedensel belirtilerdir. Tehlikeli değildir ve Bilişsel Davranışçı Terapi ile büyük ölçüde tedavi edilebilir.',
    metaTitle: 'Panik Atak Nedir, Nasıl Geçer? Belirtiler ve Tedavi',
    metaDesc:
      'Panik atak belirtileri nelerdir, atak anında ne yapılmalı, panik atak tamamen geçer mi? İzmir\'de BDT ile panik atak terapisi yapan uzman klinik psikologdan rehber.',
    metaKeys: 'panik atak nedir, panik atak belirtileri, panik atak nasıl geçer, panik atak tedavisi izmir, izmir panik atak',
    content: `Kısa yanıt: Panik atak, ortada gerçek bir tehlike yokken aniden başlayan ve genellikle 10 dakika içinde zirveye ulaşan yoğun bir korku halidir. Kalp çarpıntısı, nefes darlığı ve "kontrolü kaybedeceğim" hissi çok korkutucu olsa da panik atak tehlikeli değildir. Bilişsel Davranışçı Terapi (BDT), panik bozukluğun en etkili tedavilerinden biridir.

Panik atak belirtileri nelerdir?
- Kalp çarpıntısı ya da kalbin hızla atması
- Nefes darlığı, boğulma hissi
- Göğüste sıkışma veya ağrı
- Baş dönmesi, sersemlik, bayılacak gibi olma
- Titreme, terleme, üşüme ya da ateş basması
- Uyuşma, karıncalanma
- Kendini ya da çevreyi gerçek dışı hissetme
- Ölme, delirme ya da kontrolü kaybetme korkusu

Panik atak neden olur?
Beyin bedensel bir duyumu (örneğin hızlanan kalp atışını) tehlike işareti olarak yorumlar. Bu yorum kaygıyı artırır, kaygı bedensel belirtileri güçlendirir ve bir kısır döngü başlar. Yoğun stres, uykusuzluk, kafein ve geçmişteki zorlayıcı yaşantılar bu döngüyü kolaylaştırabilir.

Atak anında ne yapmalı?
1. Belirtileri adlandırın: "Bu bir panik atak, rahatsız edici ama tehlikeli değil."
2. Nefesi yavaşlatın: 4 saniye burundan alın, 6 saniyede ağızdan verin.
3. Ortamı terk etmeye çalışmayın: Kaçmak kısa vadede rahatlatır ama bir sonraki atağın korkusunu büyütür.
4. Dikkatinizi şimdiye getirin: Gördüğünüz beş şeyi, duyduğunuz üç sesi sayın.

Panik atak tamamen geçer mi?
Evet, çoğu kişide geçer. BDT'de kaygı döngüsünü öğrenir, felaketleştirici düşünceleri sorgular ve kaçındığınız durumlarla kademeli olarak yeniden temas kurarsınız. Pek çok danışan 10–16 seans içinde ataklarında belirgin azalma yaşar. Belirtiler çok yoğunsa bir psikiyatristle birlikte çalışmak da seçenekler arasındadır.

Ne zaman destek almalı?
Ataklar tekrarlıyorsa, bir sonraki atağın korkusuyla yaşıyorsanız ya da toplu taşıma, kalabalık veya yalnız kalmak gibi durumlardan kaçınmaya başladıysanız destek almanın zamanı gelmiş demektir. Önce bir hekimle bedensel nedenlerin dışlanması da önerilir.`,
  },
  {
    slug: 'cift-terapisi-ne-zaman-gerekir',
    title: 'Çift Terapisi Ne Zaman Gerekir? 7 İşaret',
    category: 'İlişkiler',
    image: IMG('hizmet-cift'),
    daysAgo: 8,
    excerpt:
      'Aynı tartışmaların döngü halinde tekrarlaması, güvenin sarsılması ya da birbirinize yabancılaştığınızı hissetmek çift terapisine başlamak için önemli işaretlerdir.',
    metaTitle: 'Çift Terapisi Ne Zaman Gerekir? 7 İşaret',
    metaDesc:
      "Çift terapisine ne zaman başlamalı, nasıl geçer, partnerim gelmezse ne olur? İzmir'de çift ve evlilik terapisi yapan uzman klinik psikologdan 7 işaret.",
    metaKeys: 'çift terapisi ne zaman gerekir, çift terapisi nasıl geçer, izmir çift terapisi, evlilik terapisi izmir, ilişki terapisi',
    content: `Kısa yanıt: Çift terapisi yalnızca ilişki bitme noktasına geldiğinde değil, aynı sorunlar tekrar tekrar yaşandığında ve kendi başınıza çözemediğinizi fark ettiğinizde en etkilidir. Ne kadar erken başlanırsa onarım o kadar kolay olur.

Çift terapisine ihtiyaç olduğunu gösteren 7 işaret
1. Aynı tartışma, farklı konular: Kavgalar bulaşık, para ya da ailelerle ilgili gibi görünse de hep aynı yerde düğümleniyor.
2. Konuşmak yerine susmak: Çatışmadan kaçınmak için önemli konular açılmıyor.
3. Güvenin sarsılması: Aldatma, yalan ya da sır, ilişkide derin bir yara açtı.
4. Duygusal ya da cinsel uzaklaşma: Ev arkadaşı gibi yaşadığınızı hissediyorsunuz.
5. Büyük bir değişim: Bebek, taşınma, iş kaybı ya da hastalık dengeyi bozdu.
6. Küçümseme ve savunma: Tartışmalarda alay, suçlama ve sürekli kendini savunma arttı.
7. Ayrılığı düşünmek: Birinizin ya da ikinizin aklından ayrılık geçiyor ama emin değilsiniz.

Çift terapisi nasıl geçer?
İlk görüşmeye iki partner birlikte gelir. Ardından genellikle her biriyle bir bireysel görüşme yapılır ve ilişkideki döngü birlikte haritalanır. Seanslar 60–75 dakika sürer. Terapist taraf tutmaz; odak, iki kişinin arasında olan biteni anlamaktır.

Partnerim gelmek istemezse?
Tek başınıza başlayabilirsiniz. Kendi iletişim biçiminiz değiştiğinde ilişkideki dans da değişir; bu çoğu zaman partnerin sürece katılma isteğini artırır.

Çift terapisi boşanmayı önler mi?
Amaç ilişkiyi ne pahasına olursa olsun sürdürmek değil, iki tarafın da ne istediğini netleştirmektir. Birçok çift için ilişki onarılır; ayrılık kararı verilirse süreç, özellikle çocuklar varsa, daha az yıpratıcı geçer.

İzmir'de çift terapisine başlamak isteyenler Alsancak'taki klinikte yüz yüze ya da online olarak görüşebilir.`,
  },
  {
    slug: 'online-terapi-etkili-mi',
    title: 'Online Terapi Etkili mi? Nasıl Hazırlanmalı?',
    category: 'Online Terapi',
    image: IMG('hizmet-online'),
    daysAgo: 12,
    excerpt:
      'Araştırmalar kaygı, depresyon ve travma gibi pek çok alanda online terapinin yüz yüze terapi kadar etkili olduğunu gösteriyor. Doğru hazırlıkla seanslardan en iyi verimi alabilirsiniz.',
    metaTitle: 'Online Terapi Etkili mi? Nasıl Hazırlanmalı?',
    metaDesc:
      'Online terapi yüz yüze terapi kadar etkili mi, kimler için uygun, seansa nasıl hazırlanılır? İzmir merkezli online psikolog desteği hakkında bilmeniz gerekenler.',
    metaKeys: 'online terapi etkili mi, online psikolog, online terapi nasıl yapılır, izmir online terapi, görüntülü terapi',
    content: `Kısa yanıt: Evet. Araştırmalar kaygı bozuklukları, depresyon ve travma sonrası stres gibi pek çok alanda online terapinin yüz yüze terapiyle benzer sonuçlar verdiğini gösteriyor. Etkiyi belirleyen şey ekran değil; düzenli seanslar, doğru yöntem ve güvenli bir terapötik ilişkidir.

Online terapi kimler için uygun?
- Yoğun çalışan ve ulaşıma zaman ayıramayanlar
- İzmir'in uzak ilçelerinde, başka bir şehirde ya da yurt dışında yaşayanlar
- Panik atak ya da sosyal kaygı nedeniyle dışarı çıkmakta zorlananlar
- Yeni bir şehre taşınıp aynı terapistle devam etmek isteyenler

Online terapi kimler için uygun olmayabilir?
Ciddi kriz durumlarında, intihar riski olduğunda ya da evde güvenli ve mahrem bir alan bulunmadığında yüz yüze destek daha uygundur. Acil durumlarda 112 aranmalıdır.

Seansa nasıl hazırlanmalı?
1. Sessiz ve kapalı bir oda seçin; mümkünse kapıyı kilitleyin.
2. Kulaklık kullanın; mahremiyeti artırır, sesi netleştirir.
3. Bağlantınızı ve şarjınızı seanstan önce kontrol edin.
4. Bildirimleri kapatın; seans saatini kendinize ayrılmış bir zaman olarak koruyun.
5. Seans öncesi ve sonrası birkaç dakika boşluk bırakın; doğrudan toplantıya geçmeyin.

Gizlilik nasıl sağlanıyor?
Seanslar uçtan uca şifreli görüntülü görüşme platformlarıyla yapılır ve kaydedilmez. Gizlilik, yüz yüze seanslarla aynı etik ilkeler ve KVKK çerçevesinde korunur.

Yüz yüze ve online birlikte olabilir mi?
Evet. İzmir'de yaşayan pek çok danışan Alsancak'taki klinikte yüz yüze başlayıp yoğun haftalarda online devam ediyor.`,
  },
  {
    slug: 'deprem-sonrasi-kaygi-ve-travma',
    title: 'Deprem Sonrası Kaygı ve Travma: Ne Zaman Geçer, Nasıl Destek Olunur?',
    category: 'Travma',
    image: IMG('hizmet-travma'),
    daysAgo: 16,
    excerpt:
      'Depremden sonra uykusuzluk, irkilme ve "yine olacak" korkusu yaşamak normaldir. Belirtiler haftalar içinde azalmıyorsa travma odaklı terapi ve EMDR iyi gelebilir.',
    metaTitle: 'Deprem Sonrası Kaygı ve Travma: Belirtiler ve Destek',
    metaDesc:
      "Deprem sonrası kaygı, uykusuzluk ve travma belirtileri ne zaman geçer? İzmir'de EMDR ve travma terapisi yapan uzman klinik psikologdan yetişkinler ve çocuklar için öneriler.",
    metaKeys: 'deprem sonrası kaygı, deprem travması, deprem korkusu nasıl geçer, izmir travma terapisi, izmir emdr',
    content: `Kısa yanıt: Deprem gibi sarsıcı bir olaydan sonra ilk haftalarda yoğun kaygı, uykusuzluk ve irkilme yaşamak beklenen, normal bir tepkidir ve çoğu kişide zamanla azalır. Belirtiler bir ayı aşkın süredir devam ediyor ya da günlük hayatı kısıtlıyorsa travma odaklı terapi ve EMDR etkili destek sunar.

İzmir'de yaşayan pek çok kişi 2020 depreminin ve sonrasında yaşanan sarsıntıların izlerini hâlâ taşıyor. Kapı çarpması, kamyon geçişi ya da binanın hafif sallanması bile bedeni bir anda alarma geçirebilir.

Deprem sonrası sık görülen tepkiler
- Tekrar deprem olacağına dair sürekli tetikte olma
- Uykuya dalmakta zorlanma, gece sık uyanma
- Sarsıntıya benzer uyaranlarda irkilme, kalp çarpıntısı
- Kapalı alanlarda, yüksek katlarda kalmaktan kaçınma
- Haberleri ve deprem uygulamalarını sürekli kontrol etme
- Suçluluk, öfke ya da duygusal donukluk

Ne zaman profesyonel destek almalı?
Belirtiler dört haftadan uzun sürüyorsa, olay zihninizde istemsizce tekrar tekrar canlanıyorsa, evinizde ya da işyerinizde rahat edemiyorsanız ya da alkol ve ilaçla baş etmeye çalışıyorsanız bir uzmana başvurmanız önerilir.

Kendinize nasıl destek olabilirsiniz?
1. Güvenlik planı yapın: Deprem çantası ve aile planı, kontrol duygusunu artırır.
2. Haber tüketimini sınırlayın: Günde bir iki kez, belirli saatlerde kontrol edin.
3. Bedeni sakinleştirin: Yavaş nefes, yürüyüş ve düzenli uyku saatleri sinir sistemini dengeler.
4. Yalnız kalmayın: Yaşadıklarınızı güvendiğiniz kişilerle konuşun.

Çocuklarla nasıl konuşmalı?
Çocukların sorularını kısa ve dürüst yanıtlayın, korkularını küçümsemeyin ve rutinlerini korumaya çalışın. Gece altını ıslatma, yalnız kalmak istememe ya da oyunlarda depremi tekrar tekrar canlandırma haftalarca sürüyorsa bir çocuk ruh sağlığı uzmanına danışın.

EMDR nasıl yardımcı olur?
EMDR, beynin sarsıcı anıyı yeniden işlemesine yardım eder. Anı silinmez; ancak ona eşlik eden yoğun korku ve bedensel gerginlik azalır. Süreç her zaman güvenlik ve dengeleme çalışmalarıyla başlar.`,
  },
  {
    slug: 'ilk-terapi-seansi-nasil-gecer',
    title: 'İlk Terapi Seansı Nasıl Geçer? Ne Beklemeli, Ne Sormalı?',
    category: 'Terapiye Başlarken',
    image: IMG('klinik-cay'),
    daysAgo: 20,
    excerpt:
      'İlk seans bir tanışma ve değerlendirme görüşmesidir: neden geldiğinizi, beklentilerinizi ve yaşam öykünüzü konuşur, sürecin nasıl ilerleyeceğini netleştirirsiniz.',
    metaTitle: 'İlk Terapi Seansı Nasıl Geçer? Ne Beklemeli?',
    metaDesc:
      "Psikoloğa ilk kez gitmeden önce bilmeniz gerekenler: ilk seansta ne konuşulur, ne kadar sürer, hangi soruları sormalısınız? İzmir'de uzman klinik psikologdan rehber.",
    metaKeys: 'ilk terapi seansı, psikoloğa ilk gidiş, ilk seansta ne olur, psikolog seansı nasıl geçer, izmir psikolog',
    content: `Kısa yanıt: İlk terapi seansı, yaklaşık 50 dakikalık bir tanışma ve değerlendirme görüşmesidir. Sizi terapiye getiren konuyu, beklentilerinizi ve kısaca yaşam öykünüzü konuşursunuz; psikolog da süreç, yöntem ve gizlilik hakkında bilgi verir. Hiçbir şeyi anlatmaya hazır hissetmek zorunda değilsiniz.

İlk seansta neler konuşulur?
- Şu anda sizi en çok zorlayan şey ve ne zamandır sürdüğü
- Günlük hayatınıza, işinize ve ilişkilerinize etkisi
- Daha önce aldığınız destekler ve neyin iyi gelip gelmediği
- Terapiden beklentileriniz ve hedefleriniz

Psikoloğunuza sorabileceğiniz sorular
1. Hangi yöntemle çalışıyorsunuz ve bu benim için neden uygun?
2. Süreç yaklaşık kaç seans sürer, ilerlemeyi nasıl değerlendireceğiz?
3. Seans ücreti, iptal ve erteleme kuralları neler?
4. Gizlilik nasıl korunuyor, hangi durumlarda istisna olur?
5. Gerektiğinde online seans yapabilir miyiz?

İlk seanstan sonra nasıl hissedilir?
Kimi danışan rahatlamış, kimi yorgun ya da duygusal hisseder; ikisi de normaldir. Önemli olan, anlaşıldığınızı ve yargılanmadığınızı hissetmenizdir.

Hazırlık için küçük öneriler
Aklınıza gelenleri birkaç madde halinde not alın, seanstan önce birkaç dakika erken gelin ve seans sonrasında kendinize biraz boş zaman bırakın. İzmir Alsancak'taki kliniğe gelmeden önce ulaşım bilgisine göz atabilir ya da ilk görüşmeyi online yapabilirsiniz.`,
  },
  {
    slug: 'bilissel-davranisci-terapi-nedir',
    title: 'Bilişsel Davranışçı Terapi (BDT) Nedir, Kimlere İyi Gelir?',
    category: 'Terapi Yöntemleri',
    image: IMG('klinik-defter'),
    daysAgo: 25,
    excerpt:
      'BDT; düşünce, duygu ve davranış arasındaki bağı ele alan, hedef odaklı ve kanıta dayalı bir terapidir. Kaygı, panik atak ve depresyonda en çok araştırılmış yöntemlerdendir.',
    metaTitle: 'Bilişsel Davranışçı Terapi (BDT) Nedir? Kimlere İyi Gelir?',
    metaDesc:
      "Bilişsel Davranışçı Terapi (BDT) nedir, nasıl uygulanır, kaç seans sürer ve hangi sorunlarda etkilidir? İzmir'de BDT uygulayan uzman klinik psikologdan açıklama.",
    metaKeys: 'bilişsel davranışçı terapi nedir, bdt nedir, bdt kaç seans sürer, izmir bilişsel davranışçı terapi, izmir bdt',
    content: `Kısa yanıt: Bilişsel Davranışçı Terapi (BDT); düşüncelerimizin, duygularımızın ve davranışlarımızın birbirini nasıl etkilediğini ele alan, yapılandırılmış ve hedef odaklı bir psikoterapi yöntemidir. Kaygı bozuklukları, panik atak, depresyon ve obsesif kompulsif bozuklukta etkinliği en çok araştırılmış terapilerden biridir.

BDT nasıl çalışır?
Aynı olay farklı kişilerde farklı duygular uyandırır; çünkü belirleyici olan olayın kendisinden çok, onu nasıl yorumladığımızdır. BDT'de bu otomatik yorumları fark eder, gerçekçiliklerini sorgular ve sizi kısıtlayan davranış örüntülerini adım adım değiştirirsiniz.

Bir BDT seansında neler olur?
- Haftanın kısa bir değerlendirmesi ve gündem belirleme
- Zorlayıcı bir durum üzerinden düşünce–duygu–davranış bağının incelenmesi
- Yeni bir becerinin öğrenilmesi ve seansta denenmesi
- Bir sonraki haftaya kadar uygulanacak küçük bir ödev

BDT hangi sorunlarda etkilidir?
- Panik atak ve agorafobi
- Yaygın kaygı ve sağlık kaygısı
- Sosyal kaygı
- Depresyon
- Obsesif kompulsif bozukluk
- Uyku sorunları ve tükenmişlik

BDT kaç seans sürer?
Belirli bir soruna odaklanan BDT çoğunlukla 8–20 seans sürer. Daha köklü ve tekrarlayan örüntülerde Şema Terapi gibi BDT'den gelişmiş yaklaşımlarla daha uzun soluklu çalışılabilir.

BDT ile Şema Terapi ve EMDR arasındaki fark
BDT bugünkü düşünce ve davranışlara odaklanır. Şema Terapi bu örüntülerin çocukluktaki köklerine iner. EMDR ise travmatik anıların yeniden işlenmesine yöneliktir. Uygulamada bu yöntemler çoğu zaman birlikte kullanılır.`,
  },
  {
    slug: 'depresyon-belirtileri',
    title: 'Depresyon Belirtileri: Üzüntüden Farkı Nedir, Ne Zaman Destek Almalı?',
    category: 'Depresyon',
    image: IMG('hizmet-depresyon-yas'),
    daysAgo: 30,
    excerpt:
      'Depresyon, en az iki hafta süren çökkünlük ya da zevk alamamanın uyku, iştah, enerji ve odaklanmadaki değişikliklerle birlikte günlük hayatı etkilemesidir.',
    metaTitle: 'Depresyon Belirtileri: Üzüntüden Farkı ve Tedavi',
    metaDesc:
      "Depresyon belirtileri nelerdir, üzüntüden nasıl ayrılır, ne zaman psikoloğa gitmeli? İzmir'de depresyon terapisi yapan uzman klinik psikologdan açıklama.",
    metaKeys: 'depresyon belirtileri, depresyon nedir, depresyon tedavisi, izmir depresyon terapisi, depresyon psikolog izmir',
    content: `Kısa yanıt: Depresyon, en az iki hafta boyunca neredeyse her gün süren çökkünlük ya da daha önce keyif alınan şeylerden zevk alamama halidir. Buna uyku, iştah, enerji ve odaklanmadaki belirgin değişiklikler eşlik eder ve iş, ilişkiler gibi günlük işlevler etkilenir. Depresyon tedavi edilebilir; psikoterapi en etkili yollardan biridir.

Depresyonun sık görülen belirtileri
- Günün büyük bölümünde süren mutsuzluk, boşluk ya da umutsuzluk
- Eskiden keyif veren şeylere karşı ilgisizlik
- Uykusuzluk ya da çok fazla uyuma
- İştahta ve kiloda belirgin değişiklik
- Sürekli yorgunluk, enerji kaybı
- Değersizlik ya da aşırı suçluluk duyguları
- Odaklanma ve karar vermede güçlük
- Ölüm ya da kendine zarar verme düşünceleri

Üzüntü ile depresyon arasındaki fark
Üzüntü belirli bir olaya verilen ve zamanla hafifleyen doğal bir tepkidir; kişi yine de güzel anlar yaşayabilir. Depresyonda ise çökkünlük olaylardan bağımsız hale gelir, haftalarca sürer ve hayatın genel rengini değiştirir.

Ne zaman destek almalı?
Belirtiler iki haftadan uzun sürüyorsa, işinizi ya da ilişkilerinizi etkiliyorsa destek almanın zamanı gelmiştir. Kendinize zarar verme düşünceleriniz varsa beklemeden 112'yi arayın ya da en yakın acil servise başvurun.

Depresyon nasıl tedavi edilir?
Hafif ve orta düzey depresyonda Bilişsel Davranışçı Terapi ve davranışsal aktivasyon tek başına etkilidir. Ağır depresyonda psikiyatrist tarafından düzenlenen ilaç tedavisiyle psikoterapinin birlikte yürütülmesi önerilir.

Kendinize bugün nasıl destek olabilirsiniz?
1. Küçük ve somut bir hedef seçin: 10 dakikalık bir yürüyüş gibi.
2. Uyku saatlerinizi sabitlemeye çalışın.
3. Bir kişiyle de olsa bağlantıda kalın.
4. Kendinize, zor zamanlar geçiren bir arkadaşınıza davranacağınız gibi davranın.`,
  },
];

async function applyIzmirBlog(prisma) {
  const now = Date.now();
  for (const { daysAgo, ...p } of posts) {
    const data = { ...p, status: 'Yayında' };
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: data,
      create: { ...data, views: 0, createdAt: new Date(now - daysAgo * day) },
    });
  }
}

module.exports = { applyIzmirBlog, izmirPosts: posts };

if (require.main === module) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  applyIzmirBlog(prisma)
    .then(() => console.log(`📝 ${posts.length} İzmir/GEO yazısı yazıldı.`))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
