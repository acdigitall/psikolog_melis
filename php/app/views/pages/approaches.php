<?php
$raw = approaches_page();
$d = [];
foreach (DEFAULT_APPROACHES as $k => $default) {
    $value = $raw[$k] ?? null;
    $d[$k] = is_string($value) && trim($value) !== '' ? $value : $default;
}
$items = parse_list($raw['items'] ?? null) ?: DEFAULT_APPROACHES['items'];
$paragraphs = fn (string $text) => array_filter(array_map('trim', preg_split('/\n+/', $text) ?: []));

$meta = page_meta([
    'title' => $d['metaTitle'],
    'description' => $d['metaDesc'],
    'keywords' => $d['metaKeys'],
    'path' => '/yaklasimlar',
    'image' => $d['img'],
]);

page_hero([
    'background' => 'scene-suluboya',
    'image' => $d['img'],
    'imageAlt' => $d['imgAlt'],
    'title' => $d['title'],
    'description' => $d['desc'],
    'crumbs' => [['label' => $d['title']]],
]);
?>
<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:px-10">
  <div class="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
    <h2 data-reveal class="h-section"><?= e($d['introTitle']) ?></h2>
    <div data-reveal <?= delay(80) ?> class="space-y-5">
      <?php foreach ($paragraphs($d['introText']) as $p): ?>
        <p class="lead"><?= e($p) ?></p>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="mx-auto max-w-[1240px] px-6 pb-16 md:pb-24 lg:pb-28 lg:px-10">
  <ol class="border-t border-line">
    <?php foreach ($items as $i => $item): ?>
      <li data-reveal class="grid gap-6 border-b border-line py-12 md:py-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <div>
          <span class="font-serif text-[2.4rem] leading-none italic text-clay"><?= str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) ?></span>
          <h2 class="mt-5 font-serif text-[clamp(1.6rem,1.2rem+1.1vw,2.3rem)] leading-tight text-forest"><?= e($item['title'] ?? '') ?></h2>
          <?php if (!empty($item['tagline'])): ?>
            <p class="mt-3 text-[1.05rem] italic text-olive"><?= e($item['tagline']) ?></p>
          <?php endif; ?>
        </div>
        <div>
          <div class="space-y-4 text-ink/80 leading-[1.8]">
            <?php foreach ($paragraphs((string) ($item['desc'] ?? '')) as $p): ?>
              <p><?= e($p) ?></p>
            <?php endforeach; ?>
          </div>
          <?php if (!empty($item['fit'])): ?>
            <div class="mt-8 rounded-2xl bg-clay-light/70 px-6 py-5">
              <p class="kicker mb-2 font-sans">Hangi konularda?</p>
              <p class="text-ink/80 leading-relaxed"><?= e($item['fit']) ?></p>
            </div>
          <?php endif; ?>
        </div>
      </li>
    <?php endforeach; ?>
  </ol>
</section>

<section class="scene-adacayi border-y border-line">
  <div class="mx-auto grid max-w-[1240px] gap-8 px-6 py-16 md:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-24 lg:px-10">
    <h2 data-reveal class="h-section"><?= e($d['closingTitle']) ?></h2>
    <div data-reveal <?= delay(80) ?> class="space-y-5">
      <?php foreach ($paragraphs($d['closingText']) as $p): ?>
        <p class="lead"><?= e($p) ?></p>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<div class="pt-16 md:pt-24 lg:pt-28"><?php cta_band(['title' => $d['ctaTitle'], 'description' => $d['ctaDesc']]); ?></div>
