<?php
/** @var string $slug */
$post = post_by_slug($slug);
if (!$post) {
    not_found();
}

/** Düz metin içeriği paragraf, liste ve ara başlıklara ayırır. */
$renderContent = function (string $text) use (&$renderContent): string {
    $html = '';
    $blocks = array_filter(array_map('trim', preg_split('/\n\s*\n/', $text) ?: []), fn ($b) => $b !== '');
    foreach ($blocks as $block) {
        $lines = explode("\n", $block);
        $isList = !array_filter($lines, fn ($l) => !preg_match('/^(\d+\.|-|•)\s/u', trim($l)));
        if ($isList) {
            $tag = preg_match('/^\d+\./', trim($lines[0])) ? 'ol' : 'ul';
            $html .= "<$tag class=\"my-8 space-y-4 border-l border-line pl-6\">";
            foreach ($lines as $l) {
                $html .= '<li>' . e(preg_replace('/^(\d+\.|-|•)\s*/u', '', trim($l))) . '</li>';
            }
            $html .= "</$tag>";
            continue;
        }
        $firstLine = $lines[0];
        $restLines = array_slice($lines, 1);
        $looksLikeHeading = mb_strlen($firstLine) < 70 && !preg_match('/[.!]$/u', $firstLine) && ($restLines || preg_match('/[?:]$/u', $firstLine));
        if ($looksLikeHeading) {
            $html .= '<div><h2 class="mt-14 mb-5 font-serif text-[1.85rem] leading-tight">' . e(preg_replace('/:$/', '', $firstLine)) . '</h2>';
            if ($restLines) {
                $html .= $renderContent(implode("\n", $restLines));
            }
            $html .= '</div>';
            continue;
        }
        if (str_starts_with($block, 'Kısa yanıt:')) {
            $html .= '<p class="mb-10 rounded-[1.25rem] border-l-2 border-olive bg-sand/70 px-6 py-5 text-[1.08rem] leading-[1.75] text-ink/85"><strong class="font-medium text-forest">Kısa yanıt:</strong>'
                . e(substr($block, strlen('Kısa yanıt:'))) . '</p>';
            continue;
        }
        $html .= '<p class="mb-6">' . e($block) . '</p>';
    }
    return $html;
};

$minutes = max(2, (int) round(count(preg_split('/\s+/u', $post['content']) ?: []) / 200));
$serviceSlug = CATEGORY_SERVICE[$post['category']] ?? null;
foreach (SERVICE_LOCAL as $key => $local) {
    if (in_array($post['slug'], $local['relatedPosts'], true)) {
        $serviceSlug = $key;
        break;
    }
}
$relatedService = $serviceSlug ? service_by_slug($serviceSlug) : null;
$others = array_filter(published_posts(), fn ($p) => $p['slug'] !== $post['slug']);
$morePosts = array_slice([
    ...array_filter($others, fn ($p) => $p['category'] === $post['category']),
    ...array_filter($others, fn ($p) => $p['category'] !== $post['category']),
], 0, 3);

$meta = page_meta([
    'title' => $post['metaTitle'] ?: $post['title'],
    'description' => $post['metaDesc'] ?: $post['excerpt'],
    'keywords' => $post['metaKeys'],
    'path' => '/blog/' . $post['slug'],
    'image' => $post['image'],
    'type' => 'article',
    'publishedTime' => iso_date($post['createdAt']),
]);

echo json_ld([
    article_schema($post),
    breadcrumb_schema([['name' => 'Yazılar', 'path' => '/blog'], ['name' => $post['title'], 'path' => '/blog/' . $post['slug']]]),
]);
?>
<article>
  <header class="mx-auto max-w-3xl px-6 pt-14 md:pt-20 text-center">
    <a href="/blog" class="text-sm text-muted hover:text-forest transition-colors">← Tüm yazılar</a>
    <p class="intro mt-12 text-sm text-muted">
      <span class="text-olive"><?= e($post['category']) ?></span> · <time datetime="<?= e(iso_date($post['createdAt'])) ?>"><?= e(tr_date($post['createdAt'])) ?></time> · <?= $minutes ?> dk okuma
    </p>
    <h1 class="intro mt-6 font-serif text-[clamp(2.2rem,1.5rem+2.8vw,3.75rem)] leading-[1.08] tracking-[-0.02em]"><?= e($post['title']) ?></h1>
    <p class="intro lead mx-auto mt-8 max-w-2xl"><?= e($post['excerpt']) ?></p>
  </header>

  <?php if ($post['image']): ?>
    <div class="intro-image mx-auto mt-14 md:mt-20 max-w-[1100px] px-6">
      <div class="relative aspect-[16/9] overflow-hidden rounded-[1.25rem] bg-sage-light"><?= img_fill($post['image'], $post['title'], '', true) ?></div>
    </div>
  <?php endif; ?>

  <div class="mx-auto max-w-[680px] px-6 py-16 md:py-24 text-[1.15rem] leading-[1.85] text-ink/85">
    <?= $renderContent($post['content']) ?>

    <?php if ($relatedService): ?>
      <aside class="mt-16 rounded-[1.5rem] bg-sand px-7 py-8">
        <p class="text-sm text-olive">İzmir'de ve online destek</p>
        <p class="mt-2 font-serif text-[1.5rem] leading-snug text-forest"><?= e($relatedService['title']) ?></p>
        <p class="mt-3 text-[1rem] leading-relaxed text-ink/75"><?= e($relatedService['desc']) ?></p>
        <a href="/services/<?= e($relatedService['slug']) ?>" class="link-line mt-5 text-[1rem]">Hizmet hakkında bilgi <?= arrow_right() ?></a>
      </aside>
    <?php endif; ?>

    <p class="mt-16 border-t border-line pt-8 text-[15px] leading-relaxed text-muted">
      <span class="block font-serif text-lg text-forest">Yazar: <a href="/about" rel="author" class="underline decoration-line underline-offset-4 hover:text-olive"><?= e(PSYCHOLOGIST_NAME) ?></a></span>
      <span class="mt-1 block"><?= e(JOB_TITLE) ?> · Alsancak, İzmir</span>
      <span class="mt-4 block">Bu yazı genel bilgilendirme amaçlıdır; bireysel bir değerlendirme ya da tedavinin yerini tutmaz.</span>
    </p>
  </div>
</article>

<?php if ($morePosts): ?>
<section class="border-t border-line">
  <div class="mx-auto max-w-[1240px] px-6 py-16 md:py-20 lg:px-10">
    <h2 class="h-sub">Diğer yazılar</h2>
    <ul class="mt-8 grid gap-x-10 border-t border-line md:grid-cols-3 md:border-t-0">
      <?php foreach ($morePosts as $p): ?>
        <li class="border-b border-line md:border-b-0 md:border-t">
          <a href="/blog/<?= e($p['slug']) ?>" class="group block py-6">
            <span class="text-sm text-olive"><?= e($p['category']) ?></span>
            <span class="mt-2 block font-serif text-[1.25rem] leading-snug text-forest transition-colors group-hover:text-olive"><?= e($p['title']) ?></span>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
<?php endif; ?>
<?php cta_band(); ?>
