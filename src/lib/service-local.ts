/**
 * Hizmet sayfalarına özel İzmir (yerel SEO) metinleri ve sık sorulan sorular.
 * Sorular sayfada görünür ve FAQPage şemasıyla işaretlenir (GEO: yapay zekâ yanıtlarında alıntılanabilir).
 */
export interface ServiceLocal {
  heading: string;
  paragraphs: string[];
  faqs: { q: string; a: string }[];
  relatedPosts: string[];
}

export const serviceLocal: Record<string, ServiceLocal> = {
  'bireysel-yetiskin-terapisi': {
    heading: "İzmir'de bireysel terapi",
    paragraphs: [
      "İzmir'de bireysel terapi arayan yetişkinlerle Alsancak'taki klinikte haftalık, 50 dakikalık seanslarla çalışıyorum. Kaygı, depresyon, özgüven, öfke ve duygu düzenleme güçlükleri en sık birlikte çalıştığımız konular.",
      "Karşıyaka, Bornova, Bayraklı ve Buca'dan gelen danışanlar için Alsancak; İZBAN, metro, tramvay ve vapurla ulaşımı kolay bir merkez. Gelemediğiniz haftalarda seansı online sürdürebiliriz.",
    ],
    faqs: [
      {
        q: "İzmir'de bireysel terapi kaç seans sürer?",
        a: 'Belirli bir soruna odaklanan bireysel terapi çoğunlukla 8–16 seans sürer; köklü örüntülerle ya da karmaşık travmalarla çalışmak daha uzun olabilir. Süreyi ilk seanslarda hedeflerinize göre birlikte planlarız.',
      },
      {
        q: 'Bireysel terapide hangi yöntemler kullanılıyor?',
        a: 'Ağırlıklı olarak Bilişsel Davranışçı Terapi (BDT) ve Şema Terapi; travma izleri varsa EMDR. Yöntem, değerlendirme sonrasında ihtiyacınıza göre seçilir.',
      },
    ],
    relatedPosts: ['izmirde-psikolog-nasil-secilir', 'ilk-terapi-seansi-nasil-gecer', 'bilissel-davranisci-terapi-nedir'],
  },
  'cift-ve-iliski-terapisi': {
    heading: "İzmir'de çift terapisi ve evlilik terapisi",
    paragraphs: [
      "İzmir'de çift terapisi ve evlilik terapisi için Alsancak'taki klinikte, iki partnerle birlikte 60–75 dakikalık seanslar yapıyorum. Tekrarlayan tartışmalar, güven kaybı, aldatma sonrası onarım ve duygusal uzaklaşma en sık çalıştığımız konular.",
      "İlişki terapisinde taraf tutulmaz; odak, aradaki döngüdür. İzmir'de ilişki terapisi almak isteyen ama partnerlerinden biri şehir dışında olan çiftler için seanslar online ya da karma (biri klinikte, biri online) yürütülebilir.",
    ],
    faqs: [
      {
        q: "İzmir'de çift terapisine partnerim gelmek istemezse ne yapabilirim?",
        a: 'Tek başınıza başlayabilirsiniz. Bireysel seanslarda ilişkideki kendi payınızı ve iletişim biçiminizi ele alırız; çoğu zaman bu değişim partnerin de sürece katılma isteğini artırır.',
      },
      {
        q: 'Çift terapisi boşanmayı önler mi?',
        a: "Çift terapisinin amacı ilişkiyi ne pahasına olursa olsun sürdürmek değil, her iki tarafın da ne istediğini netleştirmektir. Birçok çift için ilişki onarılır; ayrılık kararı verilirse süreç daha az yıpratıcı geçer.",
      },
    ],
    relatedPosts: ['cift-terapisi-ne-zaman-gerekir', 'iliskilerde-saglikli-sinirlar'],
  },
  'online-terapi': {
    heading: "İzmir'den online terapi",
    paragraphs: [
      "İzmir'den online terapi seanslarını, güvenli bir görüntülü görüşme platformuyla yapıyorum. İzmir'in Urla, Çiğli, Gaziemir gibi uzak ilçelerinden, Türkiye'nin farklı şehirlerinden ve yurt dışından danışanlarla online psikolog desteği veriyorum.",
      'Online terapi; yüz yüze terapiyle aynı süre, yöntem ve gizlilik ilkeleriyle yürütülür. İsterseniz yüz yüze ve online seansları dönem dönem birleştirebiliriz.',
    ],
    faqs: [
      {
        q: 'Online terapi etkili mi?',
        a: 'Evet. Araştırmalar kaygı, depresyon ve travma sonrası stres gibi pek çok alanda online terapinin yüz yüze terapiyle benzer etkililikte olduğunu gösteriyor. Belirleyici olan; düzenli seanslar, güvenli bir terapötik ilişki ve sessiz, bölünmeyeceğiniz bir ortamdır.',
      },
      {
        q: "Yurt dışından İzmir'deki bir psikologla online görüşebilir miyim?",
        a: 'Evet. Seans saatleri bulunduğunuz ülkenin saat farkı gözetilerek planlanır. Yalnızca stabil bir internet bağlantısı ve kulaklık yeterlidir.',
      },
    ],
    relatedPosts: ['online-terapi-etkili-mi', 'ilk-terapi-seansi-nasil-gecer'],
  },
  'emdr-ve-travma-terapisi': {
    heading: "İzmir'de EMDR terapisi ve travma terapisi",
    paragraphs: [
      "İzmir'de EMDR terapisi ve travma terapisi için Alsancak'taki klinikte çalışıyorum. Kaza, ani kayıp, deprem gibi afetler, çocukluk dönemi zorlayıcı yaşantılar ve fobiler EMDR ile çalıştığımız başlıca konular.",
      "2020 İzmir depreminin ardından pek çok kişi hâlâ sarsıntıya benzer uyaranlarda yoğun kaygı yaşayabiliyor. Bu tepkiler anlaşılır ve tedavi edilebilir; İzmir'de travma terapisi arayanlar için EMDR, güvenlik ve dengeleme çalışmalarıyla sizin temponuzda ilerler.",
    ],
    faqs: [
      {
        q: 'EMDR kaç seansta sonuç verir?',
        a: 'Tek bir olaya bağlı travmalarda birkaç seansta belirgin rahatlama görülebilir; çocukluk dönemine uzanan, tekrarlayan yaşantılarda süreç daha uzundur. İlk seanslar her zaman hazırlık ve dengeleme içindir.',
      },
      {
        q: 'EMDR online yapılabilir mi?',
        a: 'Evet, uygun danışanlarda EMDR online olarak da uygulanabilir. Hangi biçimin size uygun olduğuna değerlendirme sonrasında birlikte karar veririz.',
      },
    ],
    relatedPosts: ['emdr-terapisi-nedir', 'deprem-sonrasi-kaygi-ve-travma'],
  },
  'kaygi-ve-panik-atak': {
    heading: "İzmir'de kaygı terapisi ve panik atak tedavisi",
    paragraphs: [
      "İzmir'de panik atak, yaygın kaygı, sosyal kaygı ve sağlık kaygısı için Bilişsel Davranışçı Terapi (BDT) temelli kaygı terapisi uyguluyorum. Panik atakların döngüsünü anlamak, kaçınmaları azaltmak ve bedensel belirtilerle baş etmek bu çalışmanın temelini oluşturur.",
      "İzmir'de panik atak yaşayan ve toplu taşımada ya da kalabalıkta atak geçirmekten korkanlar için seanslara online başlayıp, kademeli olarak Alsancak'taki kliniğe geçmek de mümkün.",
    ],
    faqs: [
      {
        q: 'Panik atak tamamen geçer mi?',
        a: 'Panik bozukluk, tedaviye en iyi yanıt veren kaygı sorunlarından biridir. BDT ile çoğu kişide ataklar belirgin biçimde azalır ya da tamamen durur; daha da önemlisi, atak korkusu hayatınızı yönetmez hale gelir.',
      },
      {
        q: 'Panik atak için ilaç mı terapi mi?',
        a: 'Hafif ve orta düzey panik bozuklukta BDT tek başına etkilidir. Belirtiler çok yoğunsa bir psikiyatristle iş birliği içinde ilaç ve terapi birlikte yürütülebilir.',
      },
    ],
    relatedPosts: ['panik-atak-nedir-nasil-gecer', 'kaygiyla-yasamayi-ogrenmek'],
  },
  'depresyon-ve-yas': {
    heading: "İzmir'de depresyon terapisi ve yas danışmanlığı",
    paragraphs: [
      "İzmir'de depresyon terapisi ve yas danışmanlığı için Alsancak'taki klinikte ve online çalışıyorum. Süregen mutsuzluk, isteksizlik, tükenmişlik ve bir kaybın ardından gelen yoğun keder, birlikte ele aldığımız konular.",
      'Depresyonda ilk adım çoğu zaman en zor olanıdır. Bu yüzden ilk görüşmeyi online yapmayı tercih edebilir, enerjiniz arttıkça yüz yüze seanslara geçebilirsiniz.',
    ],
    faqs: [
      {
        q: 'Depresyon ile üzüntü arasındaki fark nedir?',
        a: 'Üzüntü bir olaya verilen ve zamanla hafifleyen bir tepkidir. Depresyonda ise en az iki hafta boyunca çökkünlük ya da zevk alamama; uyku, iştah, enerji ve odaklanmada belirgin değişikliklerle birlikte günlük işlevleri etkiler.',
      },
      {
        q: 'Yas süreci ne zaman destek gerektirir?',
        a: 'Aylar geçmesine rağmen günlük işlevleriniz ciddi biçimde etkileniyorsa, kayıpla ilgili yoğun suçluluk ya da anlamsızlık duyguları sürüyorsa profesyonel destek iyi gelebilir.',
      },
    ],
    relatedPosts: ['depresyon-belirtileri', 'yas-sureci'],
  },
};

/** Blog kategorisine göre ilgili hizmet (yazı sonundaki iç link). */
export const categoryService: Record<string, string> = {
  Kaygı: 'kaygi-ve-panik-atak',
  İlişkiler: 'cift-ve-iliski-terapisi',
  'Terapi Yöntemleri': 'emdr-ve-travma-terapisi',
  'Kişisel Gelişim': 'bireysel-yetiskin-terapisi',
  'Yas & Kayıp': 'depresyon-ve-yas',
  Depresyon: 'depresyon-ve-yas',
  Travma: 'emdr-ve-travma-terapisi',
  'Online Terapi': 'online-terapi',
  'Terapiye Başlarken': 'bireysel-yetiskin-terapisi',
};
