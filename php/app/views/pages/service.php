<?php
/** @var string $slug */
$service = service_by_slug($slug);
if (!$service) {
    not_found();
}

$others = array_slice(array_values(array_filter(services(), fn ($s) => $s['slug'] !== $service['slug'])), 0, 3);
$features = split_csv($service['features']);
$serviceSteps = split_csv($service['steps']);
$paragraphs = array_values(array_filter(preg_split('/\n\s*\n/', $service['longDesc']) ?: [], fn ($p) => trim($p) !== ''));
$quoteHref = '/quote?service=' . rawurlencode($service['title']);
$local = SERVICE_LOCAL[$service['slug']] ?? null;
$relatedPosts = [];
if ($local) {
    $bySlug = array_column(published_posts(), null, 'slug');
    foreach ($local['relatedPosts'] as $postSlug) {
        if (isset($bySlug[$postSlug])) {
            $relatedPosts[] = $bySlug[$postSlug];
        }
    }
}

$meta = page_meta([
    'title' => $service['metaTitle'] ?: 'İzmir ' . $service['title'],
    'description' => $service['metaDesc'] ?: $service['desc'],
    'keywords' => $service['metaKeys'],
    'path' => '/services/' . $service['slug'],
    'image' => $service['img'],
]);

echo json_ld([
    service_schema($service),
    breadcrumb_schema([['name' => 'Hizmetler', 'path' => '/services'], ['name' => $service['title'], 'path' => '/services/' . $service['slug']]]),
    ...($local && $local['faqs'] ? [faq_schema($local['faqs'])] : []),
]);
?>
<section class="border-b border-line bg-sand/60 pb-14 md:pb-20">
  <div class="mx-auto max-w-[1240px] px-6 pt-12 md:pt-14 lg:px-10">
    <nav aria-label="Sayfa yolu" class="mb-12 md:mb-16 text-sm text-muted">
      <a href="/" class="hover:text-forest">Anasayfa</a>
      <span class="mx-2 text-sage/60">/</span>
      <a href="/services" class="hover:text-forest">Hizmetler</a>
      <span class="mx-2 text-sage/60">/</span>
      <span class="text-ink/80"><?= e($service['title']) ?></span>
    </nav>
    <div class="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
      <h1 class="intro display">
        <span class="mb-5 flex items-center gap-3 font-sans text-[13px] font-medium tracking-[0.02em] text-olive before:h-px before:w-7 before:bg-current before:opacity-60">İzmir · Alsancak &amp; online</span>
        <?= e($service['title']) ?>
      </h1>
      <div <?= delay(120) ?> class="intro lg:pb-2">
        <p class="lead max-w-md"><?= e($service['desc']) ?></p>
        <a href="<?= e($quoteHref) ?>" class="btn-primary mt-8">Randevu talebi <?= arrow_right() ?></a>
      </div>
    </div>
    <div class="intro-image relative mt-14 md:mt-16 aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[1.5rem] bg-sage-light">
      <?= img_fill($service['img'], $service['title'] . ' · İzmir', '', true) ?>
    </div>
  </div>
</section>

<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-32 lg:px-10">
  <div class="grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
    <aside class="lg:sticky lg:top-28 lg:self-start order-last lg:order-first">
      <div data-reveal class="rounded-[1.75rem] bg-forest p-8 text-paper">
        <p class="font-serif text-[1.6rem] leading-snug text-paper"><?= e($service['title']) ?> için görüşme planlayalım</p>
        <p class="mt-4 text-[15px] text-paper/75 leading-relaxed">Yüz yüze ya da online seans için talebinizi iletin; size en kısa sürede uygun saatlerle dönüş yapayım.</p>
        <div class="mt-8 flex flex-col items-start gap-5">
          <a href="<?= e($quoteHref) ?>" class="btn-light">Randevu talebi <?= arrow_right() ?></a>
          <a href="/faq" class="link-line !text-paper">Sıkça sorulan sorular</a>
        </div>
      </div>
    </aside>

    <div>
      <div data-reveal class="max-w-2xl space-y-6 text-[1.12rem] leading-[1.8] text-ink/80">
        <?php foreach ($paragraphs as $i => $p): ?>
          <p class="<?= $i === 0 ? 'font-serif text-[1.55rem] leading-[1.5] text-forest' : '' ?>"><?= e($p) ?></p>
        <?php endforeach; ?>
      </div>

      <?php if ($features): ?>
        <div class="mt-20">
          <h2 data-reveal class="h-sub">Birlikte çalışabileceğimiz konular</h2>
          <ul class="mt-8 flex flex-wrap gap-2.5">
            <?php foreach ($features as $i => $f): ?>
              <li data-reveal <?= delay(($i % 4) * 50) ?> class="rounded-full bg-sage-light/70 px-5 py-2.5 text-[15px] text-forest"><?= e($f) ?></li>
            <?php endforeach; ?>
          </ul>
        </div>
      <?php endif; ?>

      <?php if ($serviceSteps): ?>
        <div class="mt-20">
          <h2 data-reveal class="h-sub">Süreç nasıl ilerler?</h2>
          <ol class="mt-10 rounded-[1.75rem] bg-sand px-8 py-4">
            <?php foreach ($serviceSteps as $i => $s): ?>
              <li data-reveal <?= delay($i * 60) ?> class="grid grid-cols-[3.5rem_1fr] items-baseline border-b border-line py-5 last:border-b-0">
                <span class="font-serif text-lg italic text-olive"><?= str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) ?></span>
                <span class="font-serif text-[1.3rem] leading-snug text-forest"><?= e($s) ?></span>
              </li>
            <?php endforeach; ?>
          </ol>
        </div>
      <?php endif; ?>

      <?php if ($local): ?>
        <div data-reveal class="mt-20 border-t border-line pt-10">
          <h2 class="h-sub"><?= e($local['heading']) ?></h2>
          <div class="mt-5 max-w-2xl space-y-5 leading-[1.8] text-ink/80">
            <?php foreach ($local['paragraphs'] as $p): ?><p><?= e($p) ?></p><?php endforeach; ?>
          </div>
          <div class="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <a href="/izmir-psikolog" class="link-line">Klinik konumu ve ulaşım <?= arrow_right() ?></a>
            <?php if ($service['slug'] !== 'online-terapi'): ?>
              <a href="/services/online-terapi" class="link-line">Online terapi <?= arrow_right() ?></a>
            <?php endif; ?>
          </div>
        </div>
      <?php endif; ?>

      <?php if ($local && $local['faqs']): ?>
        <div data-reveal class="mt-20">
          <h2 class="h-sub">Sık sorulan sorular</h2>
          <div class="mt-6 border-t border-line">
            <?php foreach ($local['faqs'] as $f) { faq_details($f); } ?>
          </div>
        </div>
      <?php endif; ?>

      <?php if ($relatedPosts): ?>
        <div data-reveal class="mt-20">
          <h2 class="h-sub">Bu konuda yazılar</h2>
          <ul class="mt-6 border-t border-line">
            <?php foreach ($relatedPosts as $p): ?>
              <li class="border-b border-line">
                <a href="/blog/<?= e($p['slug']) ?>" class="group flex items-start justify-between gap-6 py-5">
                  <span class="font-serif text-[1.2rem] leading-snug text-forest transition-colors group-hover:text-olive"><?= e($p['title']) ?></span>
                  <?= arrow_right('mt-1 h-5 w-5 shrink-0 text-olive transition-transform duration-300 group-hover:translate-x-1') ?>
                </a>
              </li>
            <?php endforeach; ?>
          </ul>
        </div>
      <?php endif; ?>
    </div>
  </div>
</section>

<?php if ($others): ?>
<section class="border-t border-line">
  <div class="mx-auto max-w-[1240px] px-6 py-24 lg:px-10">
    <h2 data-reveal class="h-sub mb-10">Diğer çalışma alanları</h2>
    <div class="snap-row sm:grid sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
      <?php foreach ($others as $i => $item): ?>
        <a href="/services/<?= e($item['slug']) ?>" data-reveal <?= delay($i * 80) ?> class="group block">
          <div class="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-sage-light">
            <?= img_fill($item['img'], '', 'transition-transform duration-[1.2s] group-hover:scale-[1.03]') ?>
          </div>
          <h3 class="mt-5 font-serif text-[1.45rem] leading-snug group-hover:text-olive transition-colors duration-500"><?= e($item['title']) ?></h3>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>
<?php cta_band(); ?>
