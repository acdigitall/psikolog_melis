<?php
/** @var array $meta  @var string $content */
$settings = contact_settings();
$fullTitle = ($meta['absoluteTitle'] ?? false) ? $meta['title'] : $meta['title'] . ' | Melisa Sağlam';
$ogImage = abs_url($meta['image']);
$siteLabel = SITE_NAME . ' · ' . CITY;
$path = current_path();
$navLinks = [
    ['Hakkımda', '/about'], ['Hizmetler', '/services'], ['Süreç', '/production'], ['Klinik', '/gallery'],
    ['Yazılar', '/blog'], ['Sorular', '/faq'], ['İletişim', '/contact'],
];
$phone = $settings['phone1'] ?? null;
$socialLinks = parse_list($settings['socialLinks'] ?? null);
$footerLink = 'text-paper/65 hover:text-paper transition-colors duration-300';
?>
<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#FBF8F0">
<title><?= e($fullTitle) ?></title>
<meta name="description" content="<?= e($meta['description']) ?>">
<meta name="keywords" content="<?= e($meta['keywords']) ?>">
<meta name="application-name" content="<?= e(SITE_NAME) ?>">
<meta name="author" content="<?= e(PSYCHOLOGIST_NAME) ?>">
<meta name="creator" content="<?= e(PSYCHOLOGIST_NAME) ?>">
<meta name="publisher" content="<?= e(SITE_NAME) ?>">
<meta name="category" content="health">
<?php if (!empty($meta['noindex'])): ?>
<meta name="robots" content="noindex">
<?php else: ?>
<meta name="robots" content="index, follow">
<meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="<?= e(abs_url($meta['path'])) ?>">
<?php endif; ?>
<meta name="geo.region" content="TR-35">
<meta name="geo.placename" content="İzmir">
<meta name="geo.position" content="<?= GEO['lat'] ?>;<?= GEO['lng'] ?>">
<meta name="ICBM" content="<?= GEO['lat'] ?>, <?= GEO['lng'] ?>">
<?php foreach (['google-site-verification' => 'GOOGLE_SITE_VERIFICATION', 'yandex-verification' => 'YANDEX_VERIFICATION', 'msvalidate.01' => 'BING_VERIFICATION'] as $tag => $key): ?>
<?php if (env($key) !== ''): ?><meta name="<?= e($tag) ?>" content="<?= e(env($key)) ?>"><?php endif; ?>
<?php endforeach; ?>
<meta property="og:title" content="<?= e($meta['title']) ?>">
<meta property="og:description" content="<?= e($meta['description']) ?>">
<meta property="og:url" content="<?= e(abs_url($meta['path'])) ?>">
<meta property="og:site_name" content="<?= e($siteLabel) ?>">
<meta property="og:locale" content="tr_TR">
<meta property="og:type" content="<?= e($meta['type']) ?>">
<meta property="og:image" content="<?= e($ogImage) ?>">
<meta property="og:image:alt" content="<?= e($meta['title']) ?>">
<?php if (!empty($meta['publishedTime'])): ?>
<meta property="article:published_time" content="<?= e($meta['publishedTime']) ?>">
<?php endif; ?>
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= e($meta['title']) ?>">
<meta name="twitter:description" content="<?= e($meta['description']) ?>">
<meta name="twitter:image" content="<?= e($ogImage) ?>">
<link rel="icon" href="/icon.png" type="image/png">
<link rel="apple-touch-icon" href="/apple-icon.png">
<link rel="stylesheet" href="/assets/site.css?v=<?= (int) @filemtime(ROOT_DIR . '/assets/site.css') ?>">
<script src="/assets/site.js?v=<?= (int) @filemtime(ROOT_DIR . '/assets/site.js') ?>" defer></script>
</head>
<body class="bg-paper text-ink antialiased">
<?= json_ld(site_graph($settings)) ?>
<div aria-hidden="true" class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"><div id="route-bar" class="h-full bg-olive"></div></div>

<header id="site-header" class="site-header sticky top-0 z-50 w-full transition-[background-color,border-color] duration-500 border-b">
  <nav class="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-8 px-6 lg:px-10">
    <a href="/" class="shrink-0" aria-label="Anasayfa"><?= brand($settings['logo'] ?? null) ?></a>
    <ul class="hidden lg:flex items-center gap-8">
      <?php foreach ($navLinks as [$name, $href]): $active = str_starts_with($path, $href); ?>
        <li>
          <a href="<?= e($href) ?>" <?= $active ? 'aria-current="page"' : '' ?> class="relative py-2 text-[15px] transition-colors duration-300 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-forest after:transition-[width] after:duration-500 after:ease-[cubic-bezier(.22,1,.36,1)] <?= $active ? 'text-forest after:w-full' : 'text-ink/70 hover:text-forest after:w-0 hover:after:w-full' ?>"><?= e($name) ?></a>
        </li>
      <?php endforeach; ?>
    </ul>
    <div class="flex items-center gap-5">
      <a href="/quote" class="hidden sm:inline-flex btn-primary !h-11 !px-5">Randevu al</a>
      <button id="menu-toggle" type="button" class="lg:hidden -mr-2 flex h-11 w-11 items-center justify-center text-forest" aria-label="Menüyü aç" aria-expanded="false" aria-controls="mobil-menu">
        <span class="relative block h-3 w-6">
          <span class="menu-bar absolute left-0 h-px w-6 bg-current"></span>
          <span class="menu-bar absolute left-0 h-px w-6 bg-current"></span>
        </span>
      </button>
    </div>
  </nav>
</header>

<div id="mobil-menu" aria-hidden="true" class="lg:hidden fixed inset-x-0 top-[76px] bottom-0 z-40 bg-paper">
  <div class="flex h-full flex-col justify-between overflow-y-auto px-6 pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] [@media(max-height:700px)]:pt-5">
    <ul class="space-y-1">
      <?php foreach ([['Anasayfa', '/'], ...$navLinks] as $i => [$name, $href]): ?>
        <li style="--i:<?= $i ?>">
          <a href="<?= e($href) ?>" class="block py-2 font-serif text-[2.1rem] leading-tight text-forest [@media(max-height:700px)]:py-1 [@media(max-height:700px)]:text-[1.65rem]"><?= e($name) ?></a>
        </li>
      <?php endforeach; ?>
    </ul>
    <div class="space-y-5 border-t border-line pt-6">
      <?php if ($phone): ?><a href="<?= e(tel_href($phone)) ?>" class="block text-muted"><?= e($phone) ?></a><?php endif; ?>
      <a href="/quote" class="btn-primary w-full">Randevu al <?= arrow_right() ?></a>
    </div>
  </div>
</div>

<?= $content ?>

<footer class="bg-forest text-paper">
  <div class="mx-auto max-w-[1240px] px-6 lg:px-10">
    <div class="grid grid-cols-2 gap-x-8 gap-y-12 pt-16 pb-12 md:pt-20 md:pb-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div class="col-span-2 space-y-5 lg:col-span-1">
        <?= brand($settings['logoFooter'] ?? null, 'light') ?>
        <p class="max-w-xs text-sm text-paper/60 leading-relaxed">İzmir Alsancak'ta uzman klinik psikolog: kaygı, depresyon, ilişki sorunları ve travma sonrası süreçlerde yüz yüze ve online psikoterapi.</p>
      </div>
      <div>
        <h4 class="mb-5 font-sans text-sm text-paper/45">Sayfalar</h4>
        <ul class="space-y-2.5 text-[15px]">
          <?php foreach ([['Hakkımda', '/about'], ['Hizmetler', '/services'], ['Terapi süreci', '/production'], ['Klinik', '/gallery'], ['Yazılar', '/blog'], ['Sorular', '/faq'], ['İzmir psikolog', '/izmir-psikolog']] as [$name, $href]): ?>
            <li><a href="<?= e($href) ?>" class="<?= $footerLink ?>"><?= e($name) ?></a></li>
          <?php endforeach; ?>
        </ul>
      </div>
      <div>
        <h4 class="mb-5 font-sans text-sm text-paper/45">İletişim</h4>
        <ul class="space-y-2.5 text-[15px] text-paper/65 break-words">
          <?php if (!empty($settings['address'])): ?><li class="leading-relaxed"><address class="not-italic"><?= e($settings['address']) ?></address></li><?php endif; ?>
          <?php if ($phone): ?><li><a href="<?= e(tel_href($phone)) ?>" class="<?= $footerLink ?>"><?= e($phone) ?></a></li><?php endif; ?>
          <?php if (!empty($settings['email'])): ?><li><a href="mailto:<?= e($settings['email']) ?>" class="<?= $footerLink ?>"><?= e($settings['email']) ?></a></li><?php endif; ?>
        </ul>
      </div>
      <div class="col-span-2 sm:col-span-1">
        <h4 class="mb-5 font-sans text-sm text-paper/45">Seans saatleri</h4>
        <dl class="space-y-2.5 text-[15px] text-paper/65">
          <div class="flex justify-between gap-6"><dt>Hafta içi</dt><dd>10:00–20:00</dd></div>
          <div class="flex justify-between gap-6"><dt>Cumartesi</dt><dd>10:00–16:00</dd></div>
          <div class="flex justify-between gap-6"><dt>Pazar</dt><dd>Kapalı</dd></div>
        </dl>
        <?php if ($socialLinks): ?>
          <ul class="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
            <?php foreach ($socialLinks as $s): ?>
              <li><a href="<?= e(safe_url($s['url'] ?? '')) ?>" target="_blank" rel="noopener noreferrer" class="<?= $footerLink ?>"><?= e(($s['name'] ?? '') ?: ($s['platform'] ?? '')) ?></a></li>
            <?php endforeach; ?>
          </ul>
        <?php endif; ?>
      </div>
    </div>
    <div class="border-t border-paper/15 py-8 text-sm text-paper/50 space-y-5">
      <p class="max-w-3xl leading-relaxed">Bu site acil destek sağlamaz. Kendinize ya da bir başkasına zarar verme riski varsa lütfen hemen 112'yi arayın veya en yakın acil servise başvurun.</p>
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>&copy; <?= date('Y') ?> Uzm. Klinik Psikolog Melisa Sağlam</p>
        <div class="flex flex-wrap gap-x-6 gap-y-2">
          <a href="/privacy" class="<?= $footerLink ?>">Gizlilik</a>
          <a href="/terms" class="<?= $footerLink ?>">Kullanım koşulları</a>
          <a href="/kvkk" class="<?= $footerLink ?>">KVKK</a>
        </div>
      </div>
    </div>
  </div>
</footer>
</body>
</html>
