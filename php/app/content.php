<?php
declare(strict_types=1);

// src/lib ve src/app/actions içindeki sabit içeriklerin PHP karşılığı.

const FAQS = [
    [
        'q' => 'İzmir\'de klinik nerede, nasıl ulaşırım?',
        'a' => 'Klinik İzmir\'in merkezinde, Konak ilçesine bağlı Alsancak\'tadır. Alsancak İZBAN istasyonu, Konak–Alsancak tramvay hattı, metro ve Alsancak vapur iskelesi yürüme mesafesindedir; Karşıyaka, Bornova, Bayraklı ve Buca\'dan toplu taşımayla kolayca gelinebilir. Tam adres ve yol tarifi iletişim sayfasındadır.',
    ],
    [
        'q' => 'Yüz yüze gelemiyorum; İzmir dışından da görüşebilir miyiz?',
        'a' => 'Evet. İzmir\'in uzak ilçelerinden, Türkiye\'nin farklı şehirlerinden ya da yurt dışından danışanlarla güvenli görüntülü görüşmeyle online seanslar yapıyorum. Online seanslar yüz yüze seanslarla aynı süre, yöntem ve gizlilik ilkeleriyle yürütülür.',
    ],
    [
        'q' => 'Hangi konularda destek alabilirim?',
        'a' => 'Kaygı ve panik atak, depresyon, ilişki ve evlilik sorunları, travma ve zorlayıcı yaşam olayları, yas, tükenmişlik, özgüven ve sınır koyma güçlükleri en sık çalıştığım alanlardır. Emin değilseniz ilk görüşmede birlikte değerlendirebiliriz.',
    ],
    [
        'q' => 'Daha önce terapi aldım ama işe yaramadı. Bu sefer farklı olur mu?',
        'a' => 'Terapinin işe yaraması büyük ölçüde doğru yöntem ve güvenli bir terapötik ilişkiyle ilgilidir. İlk seanslarda daha önce neyin iyi gelip neyin gelmediğini konuşur, hedeflerinizi somutlaştırır ve size uygun kanıta dayalı bir yol haritası oluştururuz.',
    ],
    [
        'q' => 'Bir seans ne kadar sürer, ne sıklıkla görüşürüz?',
        'a' => 'Bireysel seanslar 50 dakika, çift seansları 60–75 dakika sürer. Başlangıçta genellikle haftada bir görüşülür; ilerleme kaydedildikçe seans aralıkları iki haftaya ya da aya açılabilir.',
    ],
    [
        'q' => 'Online terapi yüz yüze terapi kadar etkili mi?',
        'a' => 'Evet. Araştırmalar kaygı, depresyon ve travma gibi pek çok alanda online terapinin yüz yüze seanslarla benzer etkililikte olduğunu gösteriyor. Sessiz, bölünmeyeceğiniz bir ortam ve stabil bir internet bağlantısı yeterlidir.',
    ],
    [
        'q' => 'Paylaştığım bilgiler gizli kalır mı?',
        'a' => 'Evet. Seanslarda konuşulan her şey mesleki etik ilkeler ve KVKK çerçevesinde gizli tutulur, açık onayınız olmadan kimseyle paylaşılmaz. Tek istisna, sizin ya da bir başkasının can güvenliğinin ciddi risk altında olduğu yasal zorunluluk durumlarıdır.',
    ],
    [
        'q' => 'Terapi süreci ne kadar sürer?',
        'a' => 'Bu, ihtiyaçlarınıza ve hedeflerinize göre değişir. Belirli bir soruna odaklanan çalışmalar 8–16 seans sürebilirken, köklü örüntüler ya da karmaşık travmalarla çalışmak daha uzun soluklu olabilir. Süreci düzenli olarak birlikte değerlendiririz.',
    ],
    [
        'q' => 'İlk seansta ne olur?',
        'a' => 'İlk görüşme bir tanışma ve değerlendirme seansıdır. Sizi terapiye getiren konuları, yaşam öykünüzü ve beklentilerinizi konuşur; sürecin nasıl ilerleyeceğini netleştiririz. Hiçbir şeyi anlatmaya hazır hissetmek zorunda değilsiniz, tempoyu siz belirlersiniz.',
    ],
    [
        'q' => 'Psikiyatriste mi yoksa psikoloğa mı gitmeliyim?',
        'a' => 'Psikologlar ilaç dışı yöntemlerle, yani psikoterapiyle çalışır. İlaç tedavisi gerekebilecek durumlarda sizi bir psikiyatriste yönlendirir ve gerekirse iş birliği içinde ilerleriz. Pek çok kişi için en etkili yol, iki desteğin birlikte yürütülmesidir.',
    ],
    [
        'q' => 'İzmir\'de psikolog seans ücretleri ne kadar?',
        'a' => 'Seans ücreti; seansın bireysel ya da çift seansı olmasına ve yüz yüze/online yapılmasına göre değişir. Güncel ücret bilgisini telefonla ya da randevu formu üzerinden sorabilirsiniz; ilk görüşmeden önce şeffaf biçimde paylaşılır.',
    ],
    [
        'q' => 'Randevu almak için ne yapmalıyım?',
        'a' => 'Randevu formunu doldurabilir, telefonla arayabilir ya da WhatsApp üzerinden yazabilirsiniz. Hafta içi 10:00–20:00 ve cumartesi 10:00–16:00 arasında seans planlanır; talebinize genellikle 1 iş günü içinde dönüş yapılır.',
    ],
];

const SERVICE_LOCAL = [
    'bireysel-yetiskin-terapisi' => [
        'heading' => 'İzmir\'de bireysel terapi',
        'paragraphs' => [
            'İzmir\'de bireysel terapi arayan yetişkinlerle Alsancak\'taki klinikte haftalık, 50 dakikalık seanslarla çalışıyorum. Kaygı, depresyon, özgüven, öfke ve duygu düzenleme güçlükleri en sık birlikte çalıştığımız konular.',
            'Karşıyaka, Bornova, Bayraklı ve Buca\'dan gelen danışanlar için Alsancak; İZBAN, metro, tramvay ve vapurla ulaşımı kolay bir merkez. Gelemediğiniz haftalarda seansı online sürdürebiliriz.',
        ],
        'faqs' => [
            [
                'q' => 'İzmir\'de bireysel terapi kaç seans sürer?',
                'a' => 'Belirli bir soruna odaklanan bireysel terapi çoğunlukla 8–16 seans sürer; köklü örüntülerle ya da karmaşık travmalarla çalışmak daha uzun olabilir. Süreyi ilk seanslarda hedeflerinize göre birlikte planlarız.',
            ],
            [
                'q' => 'Bireysel terapide hangi yöntemler kullanılıyor?',
                'a' => 'Ağırlıklı olarak Bilişsel Davranışçı Terapi (BDT) ve Şema Terapi; travma izleri varsa EMDR. Yöntem, değerlendirme sonrasında ihtiyacınıza göre seçilir.',
            ],
        ],
        'relatedPosts' => [
            'izmirde-psikolog-nasil-secilir',
            'ilk-terapi-seansi-nasil-gecer',
            'bilissel-davranisci-terapi-nedir',
        ],
    ],
    'cift-ve-iliski-terapisi' => [
        'heading' => 'İzmir\'de çift terapisi ve evlilik terapisi',
        'paragraphs' => [
            'İzmir\'de çift terapisi ve evlilik terapisi için Alsancak\'taki klinikte, iki partnerle birlikte 60–75 dakikalık seanslar yapıyorum. Tekrarlayan tartışmalar, güven kaybı, aldatma sonrası onarım ve duygusal uzaklaşma en sık çalıştığımız konular.',
            'İlişki terapisinde taraf tutulmaz; odak, aradaki döngüdür. İzmir\'de ilişki terapisi almak isteyen ama partnerlerinden biri şehir dışında olan çiftler için seanslar online ya da karma (biri klinikte, biri online) yürütülebilir.',
        ],
        'faqs' => [
            [
                'q' => 'İzmir\'de çift terapisine partnerim gelmek istemezse ne yapabilirim?',
                'a' => 'Tek başınıza başlayabilirsiniz. Bireysel seanslarda ilişkideki kendi payınızı ve iletişim biçiminizi ele alırız; çoğu zaman bu değişim partnerin de sürece katılma isteğini artırır.',
            ],
            [
                'q' => 'Çift terapisi boşanmayı önler mi?',
                'a' => 'Çift terapisinin amacı ilişkiyi ne pahasına olursa olsun sürdürmek değil, her iki tarafın da ne istediğini netleştirmektir. Birçok çift için ilişki onarılır; ayrılık kararı verilirse süreç daha az yıpratıcı geçer.',
            ],
        ],
        'relatedPosts' => [
            'cift-terapisi-ne-zaman-gerekir',
            'iliskilerde-saglikli-sinirlar',
        ],
    ],
    'online-terapi' => [
        'heading' => 'İzmir\'den online terapi',
        'paragraphs' => [
            'İzmir\'den online terapi seanslarını, güvenli bir görüntülü görüşme platformuyla yapıyorum. İzmir\'in Urla, Çiğli, Gaziemir gibi uzak ilçelerinden, Türkiye\'nin farklı şehirlerinden ve yurt dışından danışanlarla online psikolog desteği veriyorum.',
            'Online terapi; yüz yüze terapiyle aynı süre, yöntem ve gizlilik ilkeleriyle yürütülür. İsterseniz yüz yüze ve online seansları dönem dönem birleştirebiliriz.',
        ],
        'faqs' => [
            [
                'q' => 'Online terapi etkili mi?',
                'a' => 'Evet. Araştırmalar kaygı, depresyon ve travma sonrası stres gibi pek çok alanda online terapinin yüz yüze terapiyle benzer etkililikte olduğunu gösteriyor. Belirleyici olan; düzenli seanslar, güvenli bir terapötik ilişki ve sessiz, bölünmeyeceğiniz bir ortamdır.',
            ],
            [
                'q' => 'Yurt dışından İzmir\'deki bir psikologla online görüşebilir miyim?',
                'a' => 'Evet. Seans saatleri bulunduğunuz ülkenin saat farkı gözetilerek planlanır. Yalnızca stabil bir internet bağlantısı ve kulaklık yeterlidir.',
            ],
        ],
        'relatedPosts' => [
            'online-terapi-etkili-mi',
            'ilk-terapi-seansi-nasil-gecer',
        ],
    ],
    'emdr-ve-travma-terapisi' => [
        'heading' => 'İzmir\'de EMDR terapisi ve travma terapisi',
        'paragraphs' => [
            'İzmir\'de EMDR terapisi ve travma terapisi için Alsancak\'taki klinikte çalışıyorum. Kaza, ani kayıp, deprem gibi afetler, çocukluk dönemi zorlayıcı yaşantılar ve fobiler EMDR ile çalıştığımız başlıca konular.',
            '2020 İzmir depreminin ardından pek çok kişi hâlâ sarsıntıya benzer uyaranlarda yoğun kaygı yaşayabiliyor. Bu tepkiler anlaşılır ve tedavi edilebilir; İzmir\'de travma terapisi arayanlar için EMDR, güvenlik ve dengeleme çalışmalarıyla sizin temponuzda ilerler.',
        ],
        'faqs' => [
            [
                'q' => 'EMDR kaç seansta sonuç verir?',
                'a' => 'Tek bir olaya bağlı travmalarda birkaç seansta belirgin rahatlama görülebilir; çocukluk dönemine uzanan, tekrarlayan yaşantılarda süreç daha uzundur. İlk seanslar her zaman hazırlık ve dengeleme içindir.',
            ],
            [
                'q' => 'EMDR online yapılabilir mi?',
                'a' => 'Evet, uygun danışanlarda EMDR online olarak da uygulanabilir. Hangi biçimin size uygun olduğuna değerlendirme sonrasında birlikte karar veririz.',
            ],
        ],
        'relatedPosts' => [
            'emdr-terapisi-nedir',
            'deprem-sonrasi-kaygi-ve-travma',
        ],
    ],
    'kaygi-ve-panik-atak' => [
        'heading' => 'İzmir\'de kaygı terapisi ve panik atak tedavisi',
        'paragraphs' => [
            'İzmir\'de panik atak, yaygın kaygı, sosyal kaygı ve sağlık kaygısı için Bilişsel Davranışçı Terapi (BDT) temelli kaygı terapisi uyguluyorum. Panik atakların döngüsünü anlamak, kaçınmaları azaltmak ve bedensel belirtilerle baş etmek bu çalışmanın temelini oluşturur.',
            'İzmir\'de panik atak yaşayan ve toplu taşımada ya da kalabalıkta atak geçirmekten korkanlar için seanslara online başlayıp, kademeli olarak Alsancak\'taki kliniğe geçmek de mümkün.',
        ],
        'faqs' => [
            [
                'q' => 'Panik atak tamamen geçer mi?',
                'a' => 'Panik bozukluk, tedaviye en iyi yanıt veren kaygı sorunlarından biridir. BDT ile çoğu kişide ataklar belirgin biçimde azalır ya da tamamen durur; daha da önemlisi, atak korkusu hayatınızı yönetmez hale gelir.',
            ],
            [
                'q' => 'Panik atak için ilaç mı terapi mi?',
                'a' => 'Hafif ve orta düzey panik bozuklukta BDT tek başına etkilidir. Belirtiler çok yoğunsa bir psikiyatristle iş birliği içinde ilaç ve terapi birlikte yürütülebilir.',
            ],
        ],
        'relatedPosts' => [
            'panik-atak-nedir-nasil-gecer',
            'kaygiyla-yasamayi-ogrenmek',
        ],
    ],
    'depresyon-ve-yas' => [
        'heading' => 'İzmir\'de depresyon terapisi ve yas danışmanlığı',
        'paragraphs' => [
            'İzmir\'de depresyon terapisi ve yas danışmanlığı için Alsancak\'taki klinikte ve online çalışıyorum. Süregen mutsuzluk, isteksizlik, tükenmişlik ve bir kaybın ardından gelen yoğun keder, birlikte ele aldığımız konular.',
            'Depresyonda ilk adım çoğu zaman en zor olanıdır. Bu yüzden ilk görüşmeyi online yapmayı tercih edebilir, enerjiniz arttıkça yüz yüze seanslara geçebilirsiniz.',
        ],
        'faqs' => [
            [
                'q' => 'Depresyon ile üzüntü arasındaki fark nedir?',
                'a' => 'Üzüntü bir olaya verilen ve zamanla hafifleyen bir tepkidir. Depresyonda ise en az iki hafta boyunca çökkünlük ya da zevk alamama; uyku, iştah, enerji ve odaklanmada belirgin değişikliklerle birlikte günlük işlevleri etkiler.',
            ],
            [
                'q' => 'Yas süreci ne zaman destek gerektirir?',
                'a' => 'Aylar geçmesine rağmen günlük işlevleriniz ciddi biçimde etkileniyorsa, kayıpla ilgili yoğun suçluluk ya da anlamsızlık duyguları sürüyorsa profesyonel destek iyi gelebilir.',
            ],
        ],
        'relatedPosts' => [
            'depresyon-belirtileri',
            'yas-sureci',
        ],
    ],
];

const CATEGORY_SERVICE = [
    'Kaygı' => 'kaygi-ve-panik-atak',
    'İlişkiler' => 'cift-ve-iliski-terapisi',
    'Terapi Yöntemleri' => 'emdr-ve-travma-terapisi',
    'Kişisel Gelişim' => 'bireysel-yetiskin-terapisi',
    'Yas & Kayıp' => 'depresyon-ve-yas',
    'Depresyon' => 'depresyon-ve-yas',
    'Travma' => 'emdr-ve-travma-terapisi',
    'Online Terapi' => 'online-terapi',
    'Terapiye Başlarken' => 'bireysel-yetiskin-terapisi',
];

const DEFAULT_SLIDES = [
    [
        'subtitle' => 'İzmir Psikolog · Uzm. Klinik Psikolog · Alsancak & Online',
        'title' => 'Pratik, şefkatli ve gerçekten işe yarayan bir terapi',
        'desc' => 'Kaygı, depresyon, ilişki sorunları ve travma sonrası süreçlerde kanıta dayalı yöntemlerle, size özel bir yol haritası oluşturuyoruz.',
        'bg' => '/images/hero-sakin-oda.jpg',
        'order' => 1,
    ],
    [
        'subtitle' => 'Yüz Yüze & Online Seanslar',
        'title' => 'Nerede olursanız olun, güvenli bir alan',
        'desc' => 'Görüntülü görüşmeyle Türkiye\'nin ve dünyanın her yerinden, yüz yüze seanslarla aynı özen ve gizlilikle görüşebiliriz.',
        'bg' => '/images/hero-nefes.jpg',
        'order' => 2,
    ],
    [
        'subtitle' => 'Kanıta Dayalı Yöntemler',
        'title' => 'BDT, Şema Terapi ve EMDR ile kalıcı değişim',
        'desc' => 'Belirtileri yalnızca hafifletmek değil; onları besleyen düşünce, duygu ve davranış örüntülerini birlikte dönüştürmek için.',
        'bg' => '/images/hero-orman-yolu.jpg',
        'order' => 3,
    ],
];

const DEFAULT_HOME = [
    'metaTitle' => 'melis Sağlam | Bireysel, Çift ve Online Terapi',
    'metaDesc' => 'Kaygı, depresyon, ilişki sorunları ve kişisel gelişim alanlarında bilimsel ekoller ile profesyonel psikolojik danışmanlık.',
    'metaKeys' => 'psikolog, klinik psikolog, bireysel terapi, çift terapisi, online terapi, emdr',
    'servicesTitle' => 'Terapi ve Danışmanlık Hizmetlerimiz',
    'whyUsTitle' => 'Neden Terapi & Neden Bu Yaklaşım?',
    'whyUsItems' => '[{"title":"Güvenli ve Yargısız Alan","desc":"Tüm seanslarımızda gizlilik ve etik ilkeler temelinde, kendinizi rahatça ifade edebileceğiniz güvenli bir alan sunulur."},{"title":"Kanıta Dayalı Terapi Ekolleri","desc":"Bilişsel Davranışçı Terapi (BDT), Şema Terapi ve EMDR gibi bilimsel geçerliliği kanıtlanmış yöntemler uygulanır."},{"title":"Bireye Özgü Yaklaşım","desc":"Her bireyin içsel dünyası, ihtiyaçları ve geçmiş deneyimleri benzersizdir; terapi süreci tamamen size özel şekillendirilir."},{"title":"Sürekli Mesleki Gelişim","desc":"Klinik uygulamalar düzenli süpervizyonlar ve uluslararası akredite eğitimlerle sürekli desteklenir."}]',
    'whyUsImg' => '/images/anasayfa-yaklasim.jpg',
    'projectsTitle' => 'Blogdan Son Yazılar',
    'projectsDesc' => 'Ruh sağlığı, ilişkiler ve kendini anlama üzerine sade ve uygulanabilir yazılar.',
    'ctaTitle' => 'Kendinize Bir Adım Atın, <br/>İçsel Yolculuğunuza Başlayın',
    'ctaDesc' => 'Zorlayıcı yaşam olayları, kaygı, ilişki problemleri veya kişisel gelişim hedefleriniz için profesyonel destek almaya bugün karar verin.',
    'ctaBtn1Text' => 'Randevu Alın',
    'ctaBtn1Link' => '/quote',
    'ctaBtn2Text' => 'İletişime Geçin',
    'ctaBtn2Link' => '/contact',
];

const DEFAULT_ABOUT = [
    'id' => 1,
    'metaTitle' => 'Hakkımda | melis Sağlam',
    'metaDesc' => 'Eğitimim, benimsediğim terapi ekolleri (BDT, EMDR, Şema Terapi), etik değerler ve klinik yaklaşımım hakkında detaylı bilgi.',
    'metaKeys' => 'uzman klinik psikolog hakkında, bdt terapisti, emdr terapisti, istanbul psikolog',
    'storyImg' => '/images/hakkimda-hikaye.jpg',
    'storyTitle' => 'Kendinizi Anlama ve İyileşme Yolculuğunda Yanınızdayım',
    'storyDesc1' => 'Lisans ve Klinik Psikoloji yüksek lisans eğitimlerimi tamamladıktan sonra bireysel psikoterapi, çift ve yetişkin danışmanlığı alanlarında seanslar yürütmekteyim. İnsan zihninin derinliklerini anlama arzusu ve danışanlarımın yaşam kalitesini artırma motivasyonuyla klinik pratiğimi sürdürüyorum.',
    'storyDesc2' => 'Seanslarımda bilimsel ve kanıta dayalı psikoterapi ekollerini (Bilişsel Davranışçı Terapi, EMDR ve Şema Terapi) temel alıyorum. Her danışanın kendi biricik hikayesine saygı duyarak, yargısız, şefkatli ve güvenli bir terapötik bağ kurmayı en önemli önceliğim olarak kabul ediyorum.',
    'visionTitle' => 'Terapi Yaklaşımım',
    'visionText' => 'Bireyin kendi içsel kaynaklarını ve gücünü keşfetmesini sağlamak, semptomları yalnızca bastırmak değil kök nedenlerine inerek kalıcı duygusal dayanıklılık kazandırmak.',
    'missionTitle' => 'Etik ve Gizlilik İlkem',
    'missionText' => 'Türk Psikologlar Derneği (TPD) etik yönetmeliği çerçevesinde, danışan gizliliğini koşulsuz koruyarak, dürüst, profesyonel ve insani değerlere sadık bir danışmanlık hizmeti sunmak.',
    'bridgeLabel' => 'Ekoller & Uzmanlıklar',
    'bridgeTitle' => 'Bilimsel Yaklaşım,<br/>Şefkatli Dinleme',
    'bridgeDesc1' => 'Uyguladığım yöntemler dünya çapında etkinliği klinik çalışmalarla kanıtlanmış Bilişsel Davranışçı Terapi (BDT), Travma odaklı EMDR Terapisi ve Şema Terapi ekollerinden oluşmaktadır.',
    'bridgeDesc2' => 'Sürekli süpervizyon ve mesleki eğitimlerle güncel literatürü takip ediyor; yüz yüze ve online seanslarda aynı yüksek klinik standartları uyguluyorum.',
    'bridgeImg' => '/images/hakkimda-denge.jpg',
    'brochureLabel' => 'Mesleki Yetkinlikler',
    'brochureTitle' => 'Klinik Eğitimler ve Akreditasyonlar',
    'brochureDesc' => 'Eğitim belgelerim, uluslararası psikoterapi sertifikalarım ve akademik geçmişim hakkında detaylı bilgi edinebilirsiniz.',
    'brochureUrl' => '#',
    'brochureHighlights' => '[{"title":"Lisans & Yüksek Lisans","desc":"Psikoloji Lisansı ve Klinik Psikoloji Tezli Yüksek Lisans derecesi."},{"title":"Bilişsel Davranışçı Terapi (BDT)","desc":"Avrupa Davranış ve Bilişsel Terapiler Birliği (EABCT) onaylı teorik ve süpervizyon eğitimi."},{"title":"EMDR Düzey I & II","desc":"EMDR Derneği onaylı travma ve ilişki odaklı psikoterapi sertifikasyonu."},{"title":"Şema Terapi","desc":"ISST onaylı Şema Terapi uluslararası terapist sertifikasyon programı."}]',
    'materialsTitle' => 'Çalışma ve Uzmanlık Alanları',
    'materials' => 'Depresyon, Kaygı Bozuklukları (Anksiyete), Panik Atak, Obsesif Kompulsif Bozukluk (OKB), Travma & TSSB, İlişki ve Evlilik Problemleri, Sosyal Fobi, Öfke Kontrolü, Yas Süreci, Tükenmişlik',
    'policyTitle' => 'Danışan Hakları ve Terapi İlkeleri',
    'policies' => '[{"title":"Koşulsuz Gizlilik","desc":"Seans odasında paylaşılan tüm bilgiler etik kurallar ve danışan mahremiyeti çerçevesinde gizli tutulur."},{"title":"Yargısız ve Güvenli Alan","desc":"Duygu ve düşüncelerinizin yargılanmadan, kabul ve empati ile dinlendiği güvenli bir ortam."},{"title":"İş Birlikçi Hedefler","desc":"Terapi hedefleri danışan ve terapist tarafından birlikte belirlenir; süreç şeffaf biçimde yürütülür."}]',
];

const DEFAULT_PRODUCTION = [
    'title' => 'Terapi Sürecimiz Nasıl İlerler?',
    'desc' => 'Psikoterapi, kendinizi daha derinlemesine tanıma, zorlayıcı duyguları anlama ve yaşam kalitenizi artırma yolculuğudur. Sürecimiz adım adım ve tamamen sizin temponuza uygun ilerler.',
    'img' => '/images/surec-yolculuk.jpg',
    'metaTitle' => 'Terapi Süreci & Danışmanlık Yaklaşımı | melis Sağlam',
    'metaDesc' => 'İlk görüşmeden hedeflere, düzenli seanslardan sağlıklı sonlandırmaya kadar adım adım psikolojik danışmanlık süreci.',
    'metaKeys' => 'terapi süreci, psikolog seansı nasıl geçer, terapi aşamaları',
];

const DEFAULT_STEPS = [
    [
        'order' => 1,
        'title' => 'İlk Tanışma ve Değerlendirme (Anamnez)',
        'desc' => 'İlk seansta sizi terapiye getiren nedenler, beklentileriniz ve yaşam öykünüz ayrıntılı olarak dinlenir; terapi için güvenli bağın temelleri atılır.',
    ],
    [
        'order' => 2,
        'title' => 'Birlikte Hedef Belirleme',
        'desc' => 'Hangi alanlarda değişim istediğinizi (kaygı yönetimi, ilişki problemleri, özgüven, travmalar vb.) netleştirir, somut ve ulaşılabilir terapi hedefleri oluştururuz.',
    ],
    [
        'order' => 3,
        'title' => 'Kişiye Özel Terapi Planı ve Ekol Seçimi',
        'desc' => 'İhtiyaçlarınıza en uygun bilimsel ekol (Bilişsel Davranışçı Terapi, EMDR veya Şema Terapi) belirlenerek yapılandırılmış bir yol haritası hazırlanır.',
    ],
    [
        'order' => 4,
        'title' => 'Düzenli Seanslar ve Farkındalık Çalışmaları',
        'desc' => 'Haftalık veya iki haftada bir gerçekleşen 50 dakikalık seanslarla düşünce kalıpları, duygusal tetikleyiciler ve davranış döngüleri üzerinde çalışılır.',
    ],
    [
        'order' => 5,
        'title' => 'İçsel Baş Etme Becerileri ve Güçlenme',
        'desc' => 'Seanslarda edinilen yeni bakış açıları, gevşeme egzersizleri ve farkındalık çalışmaları günlük hayata entegre edilerek danışanın kendi rehberi olması desteklenir.',
    ],
    [
        'order' => 6,
        'title' => 'Değerlendirme ve Sağlıklı Sonlandırma',
        'desc' => 'Belirlenen hedeflere ulaşıldığında seans aralıkları kademeli olarak açılır; kazanılan becerilerin pekiştirilmesi ile terapi süreci başarıyla tamamlanır.',
    ],
];

const DEFAULT_CATEGORIES = [
    'Bireysel Yetişkin Terapisi',
    'Çift ve İlişki Terapisi',
    'Online Terapi',
    'EMDR & Travma Terapisi',
    'Kaygı & Panik Atak',
    'Depresyon & Yas',
];

const SESSION_TYPES = [
    [
        'value' => 'Yüz Yüze Terapi (Klinik)',
        'title' => 'Yüz yüze',
        'desc' => 'Alsancak, İzmir kliniğinde',
    ],
    [
        'value' => 'Online Terapi (Görüntülü Görüşme)',
        'title' => 'Online',
        'desc' => 'Güvenli görüntülü görüşme',
    ],
];
