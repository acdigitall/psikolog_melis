<?php
$raw = about_page();
$d = [];
foreach ([...DEFAULT_ABOUT, ...$raw] as $k => $v) {
    $d[$k] = $v ?: (DEFAULT_ABOUT[$k] ?? $v);
}
$header = page_header('about');
$highlights = parse_list($raw['brochureHighlights'] ?? null) ?: parse_list(DEFAULT_ABOUT['brochureHighlights']);
$policies = parse_list($raw['policies'] ?? null) ?: parse_list(DEFAULT_ABOUT['policies']);
$areas = split_csv($d['materials'] ?? '');

$meta = page_meta([
    'title' => $d['metaTitle'] ?: 'Hakkımda · İzmir Uzman Klinik Psikolog',
    'description' => $d['metaDesc'] ?: "İzmir Alsancak'ta çalışan uzman klinik psikolog: eğitim, terapi yaklaşımı (BDT, Şema Terapi, EMDR) ve çalışma alanları.",
    'keywords' => $d['metaKeys'] ?: 'izmir uzman klinik psikolog, izmir emdr terapisti, izmir bdt',
    'path' => '/about',
    'image' => $d['storyImg'],
]);

page_hero([
    'background' => 'scene-suluboya',
    'image' => '/images/klinik-pencere.jpg',
    'title' => ($header['title'] ?? null) ?: 'Hakkımda',
    'description' => $header['description'] ?? null,
    'crumbs' => [['label' => 'Hakkımda']],
]);
?>
<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-32 lg:px-10">
  <div class="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
    <div data-reveal="image" class="lg:sticky lg:top-28 lg:self-start">
      <div class="arch relative aspect-[4/5] max-w-[480px] bg-sage-light"><?= img_fill($d['storyImg'], '', '', true) ?></div>
    </div>
    <div data-reveal class="lg:pt-10">
      <h2 class="h-section"><?= e($d['storyTitle']) ?></h2>
      <div class="mt-10 max-w-xl space-y-6 text-[1.08rem] leading-[1.8] text-ink/80">
        <p class="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[4.4rem] first-letter:leading-[0.8] first-letter:text-forest"><?= e($d['storyDesc1']) ?></p>
        <p><?= e($d['storyDesc2']) ?></p>
      </div>
      <div class="mt-16 grid gap-10 border-t border-line pt-10 sm:grid-cols-2">
        <?php foreach ([[$d['visionTitle'], $d['visionText']], [$d['missionTitle'], $d['missionText']]] as $i => [$boxTitle, $boxText]): ?>
          <div data-reveal <?= delay($i * 100) ?>>
            <h3 class="font-serif text-[1.5rem] leading-tight"><?= e($boxTitle) ?></h3>
            <p class="mt-3 text-[15px] text-muted leading-relaxed"><?= e($boxText) ?></p>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</section>

<section class="bg-forest text-paper">
  <div class="mx-auto grid max-w-[1240px] items-center gap-14 px-6 py-16 md:py-24 lg:py-32 lg:grid-cols-[1.1fr_1fr] lg:gap-24 lg:px-10">
    <div data-reveal>
      <p class="kicker mb-6 !text-sage-light"><?= e($d['bridgeLabel']) ?></p>
      <h2 class="h-section !text-paper"><?= with_breaks($d['bridgeTitle']) ?></h2>
      <p class="mt-8 max-w-xl text-[1.08rem] leading-[1.75] text-paper/80"><?= e($d['bridgeDesc1']) ?></p>
      <p class="mt-5 max-w-xl text-[15px] leading-relaxed text-paper/60"><?= e($d['bridgeDesc2']) ?></p>
    </div>
    <div data-reveal="image" class="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-forest-dark"><?= img_fill($d['bridgeImg']) ?></div>
  </div>
</section>

<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-32 lg:px-10">
  <div class="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
    <div data-reveal>
      <h2 class="h-section"><?= e($d['brochureTitle']) ?></h2>
      <p class="lead mt-6 max-w-sm"><?= e($d['brochureDesc']) ?></p>
    </div>
    <dl class="border-t border-line">
      <?php foreach ($highlights as $i => $item): ?>
        <div data-reveal <?= delay($i * 60) ?> class="grid gap-2 border-b border-line py-7 md:grid-cols-[1fr_1.3fr] md:gap-10">
          <dt class="font-serif text-[1.4rem] leading-snug text-forest"><?= e($item['title'] ?? '') ?></dt>
          <dd class="text-muted leading-relaxed"><?= e($item['desc'] ?? '') ?></dd>
        </div>
      <?php endforeach; ?>
    </dl>
  </div>
  <?php if ($areas): ?>
    <div data-reveal class="scene-kolaj mt-24 md:mt-32 rounded-[2rem] bg-sage-light/70 p-8 md:p-14">
      <h3 class="h-sub"><?= e($d['materialsTitle']) ?></h3>
      <ul class="mt-8 flex flex-wrap gap-3">
        <?php foreach ($areas as $a): ?>
          <li class="rounded-full bg-paper px-5 py-2.5 font-serif text-[1.15rem] text-forest"><?= e($a) ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
  <?php endif; ?>
</section>

<section class="border-t border-line">
  <div class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-32 lg:px-10">
    <h2 data-reveal class="h-section max-w-2xl"><?= e($d['policyTitle']) ?></h2>
    <div class="mt-14 grid gap-5 md:grid-cols-3">
      <?php foreach ($policies as $i => $p): ?>
        <div data-reveal <?= delay($i * 90) ?> class="rounded-[1.75rem] p-8 <?= ['bg-sand', 'bg-mist', 'bg-sage-light/70'][$i % 3] ?>">
          <h3 class="font-serif text-[1.5rem] leading-tight"><?= e($p['title'] ?? '') ?></h3>
          <p class="mt-3 text-muted leading-relaxed"><?= e($p['desc'] ?? '') ?></p>
        </div>
      <?php endforeach; ?>
    </div>
    <a data-reveal href="/services" class="link-line mt-16">Çalışma alanlarım <?= arrow_right() ?></a>
  </div>
</section>
<?php cta_band(); ?>
