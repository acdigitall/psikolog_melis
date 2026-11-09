<?php
$meta = page_meta([
    'title' => 'Klinik ve Seans Odası · Alsancak, İzmir',
    'description' => "İzmir Alsancak'taki sakin, konforlu ve gizliliğe özen gösterilen terapi ortamından kareler.",
    'path' => '/gallery',
    'image' => '/images/klinik-salon.jpg',
]);
$items = gallery_items();
$header = page_header('gallery');
page_hero([
    'image' => '/images/klinik-salon.jpg',
    'title' => ($header['title'] ?? null) ?: 'Klinik & seans odası',
    'description' => $header['description'] ?? null,
    'crumbs' => [['label' => 'Klinik']],
]);
$arrow = fn (string $d, string $size) => '<svg class="' . $size . '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="' . $d . '"/></svg>';
$roundBtn = 'bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer';
?>
<section class="py-16 md:py-24 lg:py-28 px-6 lg:px-10">
  <div class="max-w-[1240px] mx-auto">
    <?php if (!$items): ?>
      <p class="text-muted">Galeriye henüz görsel eklenmedi.</p>
    <?php else: ?>
      <div class="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
        <?php foreach ($items as $i => $img):
            $tall = $i % 3 === 1;
            $src = $img['img'] ?: '/images/klinik-oturma.jpg';
            $alt = $img['metaTitle'] ?: $img['title'];
        ?>
          <figure data-reveal <?= delay(($i % 3) * 80) ?> class="break-inside-avoid">
            <button type="button" data-lightbox="<?= $i ?>" data-src="<?= e($src) ?>" data-alt="<?= e($alt) ?>" data-title="<?= e($img['title']) ?>" data-category="<?= e($img['category']) ?>" class="group relative block w-full overflow-hidden rounded-[1.25rem] bg-sage-light" aria-label="<?= e($img['title']) ?> görselini büyüt">
              <img src="<?= e($src) ?>" alt="<?= e($alt) ?>" width="960" height="<?= $tall ? 1200 : 720 ?>" loading="lazy" decoding="async" class="w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03] <?= $tall ? 'aspect-[4/5]' : 'aspect-[4/3]' ?>">
            </button>
            <figcaption class="mt-3 flex justify-between gap-4 text-sm">
              <span class="text-ink/80"><?= e($img['title']) ?></span>
              <span class="text-muted"><?= e($img['category']) ?></span>
            </figcaption>
          </figure>
        <?php endforeach; ?>
      </div>

      <div id="lightbox" class="hidden fixed inset-0 z-[100] flex-col justify-between bg-forest-dark/95 p-4 md:p-8 select-none">
        <div class="flex justify-between items-center text-white z-20">
          <span id="lightbox-count" class="text-xs font-semibold uppercase tracking-wider text-white/60"></span>
          <button type="button" data-lightbox-close class="w-10 h-10 <?= $roundBtn ?>" aria-label="Kapat"><?= $arrow('M6 18L18 6M6 6l12 12', 'w-5 h-5') ?></button>
        </div>
        <div class="relative flex-1 w-full flex items-center justify-center my-4">
          <button type="button" data-lightbox-prev class="absolute left-2 md:left-4 z-20 w-12 h-12 <?= $roundBtn ?>" aria-label="Önceki Görsel"><?= $arrow('M15 19l-7-7 7-7', 'w-6 h-6') ?></button>
          <div class="relative w-full h-full max-w-5xl max-h-[70vh] flex items-center justify-center">
            <img id="lightbox-img" src="data:," alt="" class="absolute inset-0 h-full w-full object-contain">
          </div>
          <button type="button" data-lightbox-next class="absolute right-2 md:right-4 z-20 w-12 h-12 <?= $roundBtn ?>" aria-label="Sonraki Görsel"><?= $arrow('M9 5l7 7-7 7', 'w-6 h-6') ?></button>
        </div>
        <div class="text-center text-white z-20 mt-2">
          <span id="lightbox-category" class="text-sage-light text-xs font-bold uppercase tracking-widest block mb-1"></span>
          <h3 id="lightbox-title" class="text-lg md:text-xl font-heading font-semibold !text-white"></h3>
        </div>
      </div>
    <?php endif; ?>
  </div>
</section>
<?php cta_band(); ?>
