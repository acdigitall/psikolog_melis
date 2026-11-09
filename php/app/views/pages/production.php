<?php
$info = production_info() ?? ['title' => 'Terapi süreci nasıl ilerler?', 'desc' => '', 'metaTitle' => null, 'metaDesc' => null, 'metaKeys' => null];
$header = page_header('production');
$steps = production_steps();
$meta = page_meta([
    'title' => $info['metaTitle'] ?: 'Terapi Süreci Nasıl İlerler? · İzmir Psikolog',
    'description' => $info['metaDesc'] ?: ($info['desc'] ?: 'İlk görüşmeden sonlandırmaya kadar adım adım terapi süreci.'),
    'keywords' => $info['metaKeys'],
    'path' => '/production',
    'image' => '/images/surec-yolculuk.jpg',
]);
page_hero([
    'image' => '/images/surec-yolculuk.jpg',
    'title' => ($header['title'] ?? null) ?: $info['title'],
    'description' => ($header['description'] ?? null) ?: $info['desc'],
    'crumbs' => [['label' => 'Terapi süreci']],
]);
$facts = [
    ['50 dakika', 'Bireysel seans süresi. Çift seansları 60–75 dakika.'],
    ['Haftada bir', 'Başlangıçta önerilen sıklık; zamanla aralıklar açılır.'],
    ['Yüz yüze & online', "İzmir Alsancak'taki klinikte ya da güvenli görüntülü görüşmeyle."],
];
?>
<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-32 lg:px-10">
  <div class="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
    <div class="lg:sticky lg:top-28 lg:self-start">
      <div data-reveal="image" class="arch relative aspect-[4/5] max-w-[440px] bg-sage-light"><?= img_fill('/images/hero-orman-yolu.jpg', '', '', true) ?></div>
    </div>
    <ol class="border-t border-line">
      <?php foreach ($steps as $i => $step): ?>
        <li data-reveal <?= delay($i * 40) ?> class="grid gap-4 border-b border-line py-10 md:grid-cols-[5rem_1fr]">
          <span class="font-serif text-[2.4rem] leading-none italic text-sage"><?= str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) ?></span>
          <div>
            <h2 class="font-serif text-[clamp(1.5rem,1.2rem+0.9vw,2rem)] leading-tight"><?= e($step['title']) ?></h2>
            <p class="mt-4 max-w-xl text-ink/75 leading-[1.75]"><?= e($step['desc']) ?></p>
          </div>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>
</section>

<section class="border-t border-line">
  <dl class="mx-auto grid max-w-[1240px] gap-10 px-6 py-20 md:grid-cols-3 lg:px-10">
    <?php foreach ($facts as $i => [$k, $v]): ?>
      <div data-reveal <?= delay($i * 80) ?>>
        <dt class="font-serif text-[2rem] leading-tight text-forest"><?= e($k) ?></dt>
        <dd class="mt-3 max-w-xs text-muted leading-relaxed"><?= e($v) ?></dd>
      </div>
    <?php endforeach; ?>
  </dl>
</section>
<?php cta_band(); ?>
