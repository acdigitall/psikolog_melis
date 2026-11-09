<?php
$meta = page_meta([
    'title' => 'Psikoloji Yazıları · İzmir Klinik Psikolog Blogu',
    'description' => "Kaygı, panik atak, depresyon, ilişkiler, yas ve EMDR üzerine İzmir'de çalışan uzman klinik psikologdan sade ve uygulanabilir yazılar.",
    'path' => '/blog',
    'image' => '/images/blog-gunluk.jpg',
]);
$posts = published_posts();
$header = page_header('blog');
$first = $posts[0] ?? null;
$rest = array_slice($posts, 1);
$hoverZoom = 'transition-transform ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]';

page_hero([
    'image' => '/images/blog-gunluk.jpg',
    'title' => ($header['title'] ?? null) ?: 'Yazılar',
    'description' => $header['description'] ?? null,
    'crumbs' => [['label' => 'Yazılar']],
]);
?>
<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
  <?php if (!$first): ?>
    <p class="text-muted">Henüz yayınlanmış bir yazı yok.</p>
  <?php else: ?>
    <a href="/blog/<?= e($first['slug']) ?>" class="group grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
      <div class="intro-image relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-sage-light">
        <?php if ($first['image']): ?><?= img_fill($first['image'], '', "$hoverZoom duration-[1.4s]", true) ?><?php endif; ?>
      </div>
      <div class="intro" <?= delay(120) ?>>
        <p class="text-sm text-muted"><span class="text-olive"><?= e($first['category']) ?></span> · <?= e(tr_date($first['createdAt'])) ?></p>
        <h2 class="h-section mt-4 transition-colors duration-500 group-hover:text-olive"><?= e($first['title']) ?></h2>
        <p class="lead mt-6"><?= e($first['excerpt']) ?></p>
        <span class="link-line mt-8">Yazıyı oku</span>
      </div>
    </a>
    <div class="mt-24 grid gap-x-10 gap-y-16 border-t border-line pt-16 md:grid-cols-2 lg:grid-cols-3">
      <?php foreach ($rest as $i => $post): ?>
        <a href="/blog/<?= e($post['slug']) ?>" data-reveal <?= delay(($i % 3) * 80) ?> class="group block">
          <div class="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-sage-light">
            <?php if ($post['image']): ?><?= img_fill($post['image'], '', "$hoverZoom duration-[1.2s]") ?><?php endif; ?>
          </div>
          <p class="mt-6 text-sm text-muted"><span class="text-olive"><?= e($post['category']) ?></span> · <?= e(tr_date($post['createdAt'])) ?></p>
          <h2 class="mt-3 font-serif text-[1.55rem] leading-snug transition-colors duration-500 group-hover:text-olive"><?= e($post['title']) ?></h2>
          <p class="mt-3 text-[15px] text-muted leading-relaxed line-clamp-3"><?= e($post['excerpt']) ?></p>
        </a>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</section>
<?php cta_band(); ?>
