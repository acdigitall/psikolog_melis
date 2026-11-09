<?php
$meta = page_meta([
    'title' => "İzmir Psikolog · Alsancak'ta Yüz Yüze ve Online Terapi",
    'description' => "İzmir'de psikolog arıyorsanız: Alsancak'taki klinikte uzman klinik psikolog ile kaygı, panik atak, depresyon, ilişki ve travma için yüz yüze ya da online terapi. Ulaşım, ilçeler ve randevu bilgisi.",
    'keywords' => 'izmir psikolog, psikolog izmir, alsancak psikolog, konak psikolog, karşıyaka psikolog, bornova psikolog, bayraklı psikolog, buca psikolog, izmir terapist, izmir uzman klinik psikolog',
    'path' => '/izmir-psikolog',
    'image' => '/images/klinik-salon.jpg',
]);

$transport = [
    ['İZBAN', 'Alsancak istasyonu; Karşıyaka, Bayraklı, Çiğli ve Gaziemir yönünden doğrudan bağlantı.'],
    ['Metro & tramvay', 'Konak metro istasyonu ve Konak–Alsancak tramvay hattı; Bornova, Buca ve Karabağlar yönünden aktarmayla.'],
    ['Vapur', 'Alsancak iskelesi; Karşıyaka ve Bayraklı’dan körfezi geçerek birkaç dakikalık yürüyüşle.'],
    ['Otomobil', 'Çevrede ücretli otoparklar bulunur; seans saatinden birkaç dakika önce gelmeniz yeterlidir.'],
];
$districtGuides = [
    ['Alsancak ve Konak', "Alsancak'ta psikolog arıyorsanız klinik yürüme mesafesinde; Konak'ta psikolog arayanlar için de tramvayla birkaç durak uzaklıkta."],
    ['Karşıyaka', "Karşıyaka'dan psikolog desteği almak isteyenler İZBAN ile Alsancak istasyonuna ya da vapurla Alsancak iskelesine geçebilir; körfezin karşısı en kısa yoldan buraya bağlanır."],
    ['Bayraklı', "Bayraklı'da psikolog arayan danışanlar İZBAN ile ya da vapurla Alsancak'a birkaç dakikada ulaşır; Bayraklı'daki iş merkezlerinden öğle arası seanslar da planlanabilir."],
    ['Bornova', "Bornova'dan gelenler metroyla Basmane ya da Çankaya istasyonuna gelip kısa bir yürüyüşle kliniğe ulaşabilir. Bornova'da psikolog arayan öğrenciler ve çalışanlar için akşam saatleri de açık."],
    ['Buca', "Buca'da psikolog arayanlar Şirinyer İZBAN istasyonundan doğrudan Alsancak'a gelebilir; otobüsle Konak üzerinden de ulaşım kolaydır."],
    ['Karabağlar, Balçova ve Narlıdere', "Bu ilçelerden metroyla Konak istasyonuna, oradan tramvayla Alsancak'a gelinir. Ulaşım zor olan haftalarda seanslar online sürdürülebilir."],
];
$dayTr = ['Monday' => 'Pazartesi', 'Friday' => 'Cuma', 'Saturday' => 'Cumartesi'];
$allServices = services();
$settings = contact_settings();
$localFaqs = array_filter(FAQS, fn ($f) => preg_match('/İzmir|Randevu/u', $f['q']));

page_hero([
    'image' => '/images/klinik-salon.jpg',
    'imageAlt' => "İzmir Alsancak'taki kliniğin aydınlık bekleme alanı",
    'eyebrow' => 'Alsancak · Konak / İzmir',
    'title' => "İzmir'de psikolog desteği",
    'description' => "Alsancak'taki klinikte yüz yüze, İzmir'in ve Türkiye'nin her yerinden online; kanıta dayalı yöntemlerle, size özel bir terapi süreci.",
    'crumbs' => [['label' => 'İzmir Psikolog']],
]);
?>
<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:px-10">
  <div class="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
    <div data-reveal class="max-w-2xl space-y-6 text-[1.12rem] leading-[1.8] text-ink/80">
      <p class="font-serif text-[1.55rem] leading-[1.5] text-forest">İzmir'de uzman klinik psikolog olarak Alsancak'taki kliniğimde yetişkinlerle bireysel terapi ve çiftlerle ilişki terapisi yapıyorum.</p>
      <p>En sık çalıştığım konular kaygı ve panik atak, depresyon, ilişki ve evlilik sorunları, travma, yas ve tükenmişlik. Seanslarda Bilişsel Davranışçı Terapi (BDT), Şema Terapi ve EMDR gibi etkinliği araştırmalarla desteklenen yöntemleri, sizin ihtiyacınıza göre bir araya getiriyorum.</p>
      <p>Bireysel seanslar 50 dakika, çift seansları 60–75 dakika sürer. Yüz yüze gelemediğiniz haftalarda aynı süreci güvenli görüntülü görüşmeyle online olarak sürdürebiliriz.</p>
    </div>
    <dl data-reveal class="self-start rounded-[1.75rem] bg-sand px-8 py-4">
      <?php if (!empty($settings['address'])): ?>
        <div class="border-b border-line py-5">
          <dt class="text-sm text-muted">Adres</dt>
          <dd class="mt-1 font-serif text-[1.2rem] leading-snug text-forest"><address class="not-italic"><?= e($settings['address']) ?></address></dd>
        </div>
      <?php endif; ?>
      <div class="border-b border-line py-5">
        <dt class="text-sm text-muted">Seans saatleri</dt>
        <dd class="mt-1 font-serif text-[1.2rem] leading-snug text-forest">
          <?php foreach (OPENING_HOURS as $h):
              $days = count($h['days']) > 1 ? $dayTr[$h['days'][0]] . '–' . $dayTr[end($h['days'])] : $dayTr[$h['days'][0]];
          ?>
            <span class="block"><?= e("$days {$h['opens']}–{$h['closes']}") ?></span>
          <?php endforeach; ?>
        </dd>
      </div>
      <?php if (!empty($settings['phone1'])): ?>
        <div class="border-b border-line py-5">
          <dt class="text-sm text-muted">Telefon</dt>
          <dd class="mt-1 font-serif text-[1.2rem] text-forest"><a href="<?= e(tel_href($settings['phone1'])) ?>" class="hover:text-olive"><?= e($settings['phone1']) ?></a></dd>
        </div>
      <?php endif; ?>
      <div class="py-5">
        <dt class="text-sm text-muted">Seans biçimi</dt>
        <dd class="mt-1 font-serif text-[1.2rem] text-forest">Yüz yüze (Alsancak) · Online</dd>
      </div>
    </dl>
  </div>
</section>

<section class="border-y border-line bg-white/60">
  <div class="mx-auto grid max-w-[1240px] gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:px-10">
    <div data-reveal>
      <h2 class="h-section">Kliniğe nasıl ulaşırım?</h2>
      <p class="lead mt-5 max-w-md">Alsancak, İzmir'in toplu taşımayla en kolay ulaşılan semtlerinden biri.</p>
      <div class="arch relative mt-10 hidden aspect-[4/5] max-w-[300px] bg-sage-light lg:block"><?= img_fill('/images/klinik-pencere.jpg', "Alsancak'taki kliniğin pencere kenarı") ?></div>
    </div>
    <dl data-reveal class="divide-y divide-line border-y border-line self-start">
      <?php foreach ($transport as [$t, $desc]): ?>
        <div class="grid gap-2 py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
          <dt class="font-serif text-[1.35rem] leading-tight text-forest"><?= e($t) ?></dt>
          <dd class="leading-relaxed text-ink/75"><?= e($desc) ?></dd>
        </div>
      <?php endforeach; ?>
    </dl>
  </div>
</section>

<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:px-10">
  <div data-reveal class="max-w-2xl">
    <h2 class="h-section">İzmir'in hangi ilçelerinden geliniyor?</h2>
    <p class="lead mt-5">Danışanlarım çoğunlukla aşağıdaki ilçelerden yüz yüze seanslara geliyor; daha uzak ilçelerden ve şehir dışından online görüşüyoruz.</p>
  </div>
  <ul data-reveal class="mt-10 flex flex-wrap gap-2.5">
    <?php foreach (IZMIR_DISTRICTS as $district): ?>
      <li class="rounded-full bg-sage-light/70 px-5 py-2.5 text-[15px] text-forest"><?= e($district) ?></li>
    <?php endforeach; ?>
  </ul>
</section>

<section class="border-t border-line">
  <div class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:px-10">
    <h2 data-reveal class="h-section max-w-2xl">Semtinize göre kliniğe ulaşım</h2>
    <div class="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
      <?php foreach ($districtGuides as [$district, $text]): ?>
        <div data-reveal class="border-t border-forest/30 pt-6">
          <h3 class="font-serif text-[1.4rem] leading-snug"><?= e($district) ?></h3>
          <p class="mt-3 text-[15px] leading-relaxed text-muted"><?= e($text) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php if ($allServices): ?>
<section class="border-t border-line bg-sand/60">
  <div class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:px-10">
    <h2 data-reveal class="h-section max-w-2xl">İzmir'de hangi konularda destek alabilirsiniz?</h2>
    <ul class="mt-12 grid gap-x-10 border-t border-line md:grid-cols-2">
      <?php foreach ($allServices as $s): ?>
        <li data-reveal class="border-b border-line">
          <a href="/services/<?= e($s['slug']) ?>" class="group flex items-start justify-between gap-6 py-7">
            <span>
              <span class="block font-serif text-[1.45rem] leading-snug text-forest transition-colors group-hover:text-olive"><?= e($s['title']) ?></span>
              <span class="mt-2 block text-[15px] leading-relaxed text-muted line-clamp-2"><?= e($s['desc']) ?></span>
            </span>
            <?= arrow_right('mt-2 h-5 w-5 shrink-0 text-olive transition-transform duration-300 group-hover:translate-x-1') ?>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
<?php endif; ?>

<?php if ($localFaqs): ?>
<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:px-10">
  <div class="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
    <div data-reveal>
      <h2 class="h-section">İzmir'de terapi hakkında sorular</h2>
      <a href="/faq" class="link-line mt-8">Tüm sorular <?= arrow_right() ?></a>
    </div>
    <div data-reveal class="border-t border-line">
      <?php foreach ($localFaqs as $f) { faq_details($f); } ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php cta_band([
    'title' => "İzmir'de ilk görüşmenizi planlayalım",
    'description' => "Alsancak'taki klinikte ya da online; size uygun bir zamanda kısa bir tanışma görüşmesiyle başlayalım.",
]); ?>
