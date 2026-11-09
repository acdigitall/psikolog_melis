<?php
$meta = page_meta([
    'title' => 'İzmir Psikoterapi Hizmetleri · Bireysel, Çift, EMDR',
    'description' => "İzmir Alsancak'ta ve online: bireysel terapi, çift ve ilişki terapisi, EMDR travma terapisi, kaygı-panik atak ve depresyon-yas için uzman klinik psikolog desteği.",
    'keywords' => 'izmir bireysel terapi, izmir çift terapisi, izmir emdr, izmir panik atak, izmir depresyon terapisi, izmir online terapi',
    'path' => '/services',
    'image' => '/images/hero-nefes.jpg',
]);
$header = page_header('services');
page_hero([
    'image' => '/images/hero-nefes.jpg',
    'title' => ($header['title'] ?? null) ?: 'Size nasıl destek olabilirim?',
    'description' => $header['description'] ?? null,
    'crumbs' => [['label' => 'Hizmetler']],
]);
?>
<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
  <div class="space-y-24 md:space-y-32">
    <?php foreach (services() as $i => $s):
        $features = array_slice(split_csv($s['features']), 0, 5);
        $href = '/services/' . e($s['slug']);
    ?>
      <article class="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <a href="<?= $href ?>" data-reveal="image" tabindex="-1" aria-hidden="true" class="group relative block aspect-[5/4] overflow-hidden rounded-[1.25rem] bg-sage-light <?= $i % 2 === 1 ? 'lg:order-2' : '' ?>">
          <?= img_fill($s['img'] ?: '/images/hizmet-bireysel.jpg', '', 'transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]') ?>
        </a>
        <div data-reveal>
          <h2 class="h-section"><a href="<?= $href ?>" class="hover:text-olive transition-colors duration-500"><?= e($s['title']) ?></a></h2>
          <p class="lead mt-6 max-w-lg"><?= e($s['desc']) ?></p>
          <?php if ($features): ?>
            <ul class="mt-8 max-w-lg border-t border-line">
              <?php foreach ($features as $f): ?><li class="border-b border-line py-3 text-[15px] text-ink/80"><?= e($f) ?></li><?php endforeach; ?>
            </ul>
          <?php endif; ?>
          <a href="<?= $href ?>" class="link-line mt-10">Detaylı bilgi <?= arrow_right() ?></a>
        </div>
      </article>
    <?php endforeach; ?>
  </div>
</section>
<?php cta_band(); ?>
