<?php
$d = home_page();
$about = about_page();
$allServices = services();
$allSlides = slides();
$hero = $allSlides[0] ?? null;
$posts = array_slice(published_posts(), 0, 3);
$steps = array_slice(production_steps(), 0, 4);

$featured = array_values(array_filter($allServices, fn ($s) => !empty($s['isFeatured'])));
$shownServices = array_slice($featured ?: $allServices, 0, 6);
$approach = parse_list($d['whyUsItems'] ?? null);
$concerns = split_csv($about['materials'] ?? '');

$meta = page_meta([
    'title' => ($d['metaTitle'] ?? null) ?: DEFAULT_TITLE,
    'description' => ($d['metaDesc'] ?? null) ?: DEFAULT_DESCRIPTION,
    'keywords' => ($d['metaKeys'] ?? null) ?: 'izmir psikolog, psikolog izmir, alsancak psikolog, izmir klinik psikolog, izmir online terapi',
    'path' => '/',
    'absoluteTitle' => true,
]);
?>
<section class="mx-auto grid max-w-[1240px] items-center gap-12 px-6 pt-10 pb-16 md:grid-cols-[1.25fr_1fr] md:gap-10 md:pt-14 md:pb-24 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:pb-28 lg:px-10">
  <div>
    <h1 class="intro kicker mb-7 font-sans"><?= e(($hero['subtitle'] ?? null) ?: 'İzmir Psikolog · Uzm. Klinik Psikolog · Alsancak & Online') ?></h1>
    <p <?= delay(80) ?> class="intro display max-w-[15ch] [text-wrap:balance]"><?= accent(($hero['title'] ?? null) ?: 'Pratik, şefkatli ve gerçekten işe yarayan bir terapi', 2) ?></p>
    <p <?= delay(160) ?> class="intro lead mt-7 max-w-xl"><?= e(($hero['desc'] ?? null) ?: 'Kaygı, depresyon, ilişki sorunları ve travma sonrası süreçlerde kanıta dayalı yöntemlerle, size özel bir yol haritası oluşturuyoruz.') ?></p>
    <div <?= delay(240) ?> class="intro mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <a href="/quote" class="btn-primary">Randevu talebi oluştur <?= arrow_right() ?></a>
      <a href="/contact" class="btn-ghost">Ön görüşme için arayın</a>
    </div>
    <p <?= delay(320) ?> class="intro mt-10 text-sm text-muted">
      <a href="/izmir-psikolog" class="underline decoration-line underline-offset-4 hover:text-forest transition-colors">İzmir Alsancak'taki klinikte</a> yüz yüze · Türkiye'nin her yerinden online
    </p>
  </div>
  <div class="intro-image mx-auto w-full max-w-[300px] sm:max-w-[380px] md:max-w-none lg:max-w-[480px]">
    <div class="arch relative aspect-[4/5] bg-sage-light">
      <?= img_fill(($hero['bg'] ?? null) ?: '/images/hero-sakin-oda.jpg', ($hero['metaTitle'] ?? null) ?: "İzmir Alsancak'ta sakin terapi odası", '', true) ?>
    </div>
  </div>
</section>

<?php if ($concerns): ?>
<section class="scene-adacayi border-y border-line">
  <div class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
    <div data-reveal class="max-w-2xl">
      <h2 class="h-section">Şu durumlarda destek olabilirim</h2>
      <p class="lead mt-5">Aşağıdakilerden biri size tanıdık geliyorsa, bunu birlikte anlamlandırabiliriz.</p>
    </div>
    <ul data-reveal class="mt-12 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      <?php foreach ($concerns as $c): ?>
        <li class="flex items-baseline gap-3 text-[1.05rem] text-ink/85">
          <span class="mt-2 h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full bg-olive"></span>
          <?= e($c) ?>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
<?php endif; ?>

<section class="mx-auto max-w-[1240px] px-6 pt-16 md:pt-24 lg:pt-28 lg:px-10">
  <div data-reveal class="flex flex-col gap-8 rounded-[1.75rem] bg-forest px-6 py-10 text-paper sm:px-10 sm:py-12 md:flex-row md:items-center md:justify-between md:px-14">
    <div class="max-w-xl">
      <h2 class="font-serif text-[clamp(1.7rem,1.3rem+1.2vw,2.4rem)] leading-tight !text-paper">Bu yolu tek başınıza yürümek zorunda değilsiniz.</h2>
      <p class="mt-3 text-paper/75">Kısa bir ön görüşmeyle sorularınızı yanıtlayalım, size uygun desteği birlikte belirleyelim.</p>
    </div>
    <a href="/quote" class="btn-light shrink-0">Ön görüşme talep et <?= arrow_right() ?></a>
  </div>
</section>

<section class="mx-auto grid max-w-[1240px] items-center gap-12 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-10 md:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:py-28 lg:px-10">
  <div data-reveal="image" class="mx-auto w-full max-w-[320px] sm:max-w-[380px] md:max-w-none lg:max-w-[440px]">
    <div class="arch relative aspect-[4/5] bg-sage-light">
      <?= img_fill(($about['storyImg'] ?? null) ?: '/images/hakkimda-hikaye.jpg', "İzmir'de uzman klinik psikolog ile terapi") ?>
    </div>
  </div>
  <div data-reveal>
    <p class="kicker mb-6">Merhaba, tanışalım</p>
    <h2 class="h-section"><?= e($about['storyTitle'] ?? '') ?></h2>
    <div class="mt-7 max-w-xl space-y-5 leading-[1.75] text-ink/80">
      <p><?= e($about['storyDesc1'] ?? '') ?></p>
      <p><?= e($about['storyDesc2'] ?? '') ?></p>
    </div>
    <a href="/about" class="link-line mt-9">Hakkımda daha fazlası <?= arrow_right() ?></a>
  </div>
</section>

<section class="bg-sand/70">
  <div class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
    <div class="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
      <div data-reveal>
        <p class="kicker mb-6">Yaklaşımım</p>
        <h2 class="h-section"><?= e(($d['whyUsTitle'] ?? null) ?: 'Kanıta dayalı, güçlü yanlarınızı merkeze alan bir terapi') ?></h2>
        <div class="mt-10 grid max-w-md grid-cols-2 gap-4">
          <div class="arch relative aspect-[3/4] bg-sage-light"><?= img_fill(($d['whyUsImg'] ?? null) ?: '/images/anasayfa-yaklasim.jpg') ?></div>
          <div class="arch relative mt-10 aspect-[3/4] bg-sage-light"><?= img_fill('/images/hakkimda-denge.jpg') ?></div>
        </div>
      </div>
      <div data-reveal class="lg:pt-4">
        <dl class="divide-y divide-line border-y border-line">
          <?php foreach ($approach as $item): ?>
            <div class="py-7">
              <dt class="font-serif text-[1.45rem] leading-tight text-forest"><?= e($item['title'] ?? '') ?></dt>
              <dd class="mt-2 text-ink/70 leading-relaxed"><?= e($item['desc'] ?? '') ?></dd>
            </div>
          <?php endforeach; ?>
        </dl>
        <blockquote class="mt-10 border-l-2 border-olive pl-6 font-serif text-[1.45rem] italic leading-snug text-forest">“Değişim, kendimize yargıyla değil merakla bakmaya başladığımızda mümkün olur.”</blockquote>
      </div>
    </div>
  </div>
</section>

<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
  <div data-reveal class="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
    <h2 class="h-section max-w-2xl"><?= e(($d['servicesTitle'] ?? null) ?: 'Size nasıl destek olabilirim?') ?></h2>
    <a href="/services" class="link-line shrink-0 self-start md:self-auto">Tüm hizmetler <?= arrow_right() ?></a>
  </div>
  <div class="snap-row sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3">
    <?php foreach ($shownServices as $i => $s): ?>
      <a href="/services/<?= e($s['slug']) ?>" data-reveal <?= delay(($i % 3) * 70) ?> class="group block">
        <div class="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-sage-light">
          <?= img_fill($s['img'] ?: '/images/hizmet-bireysel.jpg', '', 'transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]') ?>
        </div>
        <h3 class="mt-6 font-serif text-[1.55rem] leading-snug transition-colors duration-300 group-hover:text-olive"><?= e($s['title']) ?></h3>
        <p class="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted"><?= e($s['desc']) ?></p>
        <span class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-forest">Detaylı bilgi <?= arrow_right('h-4 w-4 transition-transform duration-300 group-hover:translate-x-1') ?></span>
      </a>
    <?php endforeach; ?>
  </div>
</section>

<?php if ($steps): ?>
<section class="scene-dalgalar border-t border-line">
  <div class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
    <div data-reveal class="mb-12 max-w-2xl">
      <h2 class="h-section">Terapi nasıl ilerler?</h2>
      <p class="lead mt-5">Her adımı birlikte ve sizin temponuzda atıyoruz.</p>
    </div>
    <ol class="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      <?php foreach ($steps as $i => $step): ?>
        <li data-reveal <?= delay($i * 70) ?> class="border-t border-forest/30 pt-6">
          <span class="text-sm font-medium text-olive"><?= str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) ?></span>
          <h3 class="mt-3 font-serif text-[1.35rem] leading-snug"><?= e($step['title']) ?></h3>
          <p class="mt-3 text-[15px] leading-relaxed text-muted"><?= e($step['desc']) ?></p>
        </li>
      <?php endforeach; ?>
    </ol>
    <a data-reveal href="/production" class="link-line mt-12">Sürecin tamamı <?= arrow_right() ?></a>
  </div>
</section>
<?php endif; ?>

<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
  <div class="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
    <div data-reveal>
      <h2 class="h-section">Sıkça sorulan sorular</h2>
      <p class="lead mt-5 max-w-sm">Yanıtını bulamadığınız her şeyi bana doğrudan sorabilirsiniz.</p>
      <a href="/faq" class="link-line mt-8">Tüm sorular <?= arrow_right() ?></a>
    </div>
    <div data-reveal class="border-t border-line">
      <?php foreach (array_slice(FAQS, 0, 5) as $f) { faq_details($f); } ?>
    </div>
  </div>
</section>

<?php if ($posts): ?>
<section class="border-t border-line">
  <div class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
    <div data-reveal class="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <h2 class="h-section"><?= e(($d['projectsTitle'] ?? null) ?: 'Son yazılar') ?></h2>
      <a href="/blog" class="link-line shrink-0 self-start md:self-auto">Tüm yazılar <?= arrow_right() ?></a>
    </div>
    <div class="snap-row sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3">
      <?php foreach ($posts as $i => $post): ?>
        <a href="/blog/<?= e($post['slug']) ?>" data-reveal <?= delay($i * 70) ?> class="group block">
          <div class="relative aspect-[3/2] overflow-hidden rounded-[1.25rem] bg-sage-light">
            <?php if ($post['image']): ?><?= img_fill($post['image'], '', 'transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]') ?><?php endif; ?>
          </div>
          <p class="mt-5 text-sm text-olive"><?= e($post['category']) ?></p>
          <h3 class="mt-2 font-serif text-[1.35rem] leading-snug transition-colors duration-300 group-hover:text-olive"><?= e($post['title']) ?></h3>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php cta_band([
    'title' => $d['ctaTitle'] ?? null,
    'description' => $d['ctaDesc'] ?? null,
    'primary' => ['text' => ($d['ctaBtn1Text'] ?? null) ?: 'Randevu talebi oluştur', 'href' => ($d['ctaBtn1Link'] ?? null) ?: '/quote'],
    'secondary' => ['text' => ($d['ctaBtn2Text'] ?? null) ?: 'Önce soru sormak istiyorum', 'href' => ($d['ctaBtn2Link'] ?? null) ?: '/contact'],
]); ?>
