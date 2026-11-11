<?php
declare(strict_types=1);

function arrow_right(string $class = 'w-4 h-4'): string
{
    return '<svg class="' . e($class) . '" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3.5 10h13m0 0-5-5m5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function plus_icon(string $class = 'w-4 h-4'): string
{
    return '<svg class="' . e($class) . '" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M10 4v12M4 10h12" stroke-linecap="round"/></svg>';
}

function delay(int $ms): string
{
    return 'style="--reveal-delay:' . $ms . 'ms"';
}

function json_ld(array $data): string
{
    $json = (string) json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return '<script type="application/ld+json">' . str_replace('<', '<', $json) . '</script>';
}

/** Kapsayıcısını dolduran görsel; $priority ilk ekrandaki görseller içindir. */
function img_fill(?string $src, string $alt = '', string $class = '', bool $priority = false): string
{
    $loading = $priority ? 'fetchpriority="high"' : 'loading="lazy"';
    return '<img src="' . e($src) . '" alt="' . e($alt) . '" ' . $loading . ' decoding="async" class="absolute inset-0 h-full w-full object-cover ' . e($class) . '">';
}

/** Yönetici metinlerinde yalnızca satır sonuna izin verilir. */
function with_breaks(?string $text): string
{
    return (string) preg_replace('#&lt;br\s*/?&gt;#i', '<br>', e($text));
}

function accent(string $text, int $words = 1): string
{
    $parts = preg_split('/\s+/u', trim($text)) ?: [];
    if (count($parts) <= $words) {
        return e($text);
    }
    $head = implode(' ', array_slice($parts, 0, -$words));
    $tail = implode(' ', array_slice($parts, -$words));
    return e($head) . ' <em class="italic text-olive">' . e($tail) . '</em>';
}

function safe_url(?string $url): string
{
    return preg_match('#^(https?:|mailto:|tel:|/)#i', (string) $url) ? (string) $url : '#';
}

function tel_href(?string $value): string
{
    return 'tel:' . preg_replace('/[^\d+]/', '', (string) $value);
}

function brand(?string $logo, string $variant = 'dark'): string
{
    if ($logo) {
        return '<img src="' . e($logo) . '" alt="' . e(SITE_NAME) . '" width="170" height="52" class="h-10 w-auto object-contain">';
    }
    $light = $variant === 'light';
    $main = $light ? 'text-paper' : 'text-forest';
    $sub = $light ? 'text-paper/60' : 'text-muted';
    // Logo dosyası şeffaf değil: zemin önce beyaza çekilir, sonra harmanlamayla gizlenir.
    $blend = $light ? 'brightness-[1.15] invert mix-blend-screen' : 'brightness-[1.15] mix-blend-multiply';
    return '<span class="flex items-center gap-2.5">'
        . '<img src="/logo/psikoloji_logo.png" alt="" width="40" height="40" class="h-10 w-10 shrink-0 ' . $blend . '">'
        . '<span class="flex flex-col leading-none">'
        . '<span class="text-[12px] ' . $sub . '">Uzm. Klinik Psikolog</span>'
        . '<span class="mt-1.5 font-serif text-[1.35rem] tracking-[-0.01em] ' . $main . '">melis Sağlam</span>'
        . '</span></span>';
}

function page_hero(array $o): void
{
    $title = $o['title'];
    $description = $o['description'] ?? null;
    $image = $o['image'] ?? null;
    $crumbs = $o['crumbs'] ?? [];
    $eyebrow = $o['eyebrow'] ?? null;
    $background = $o['background'] ?? 'bg-sand/60';
    ?>
    <section class="border-b border-line <?= e($background) ?>">
      <?php if ($crumbs): ?>
        <?= json_ld(breadcrumb_schema(array_map(fn ($c) => ['name' => $c['label'], 'path' => $c['href'] ?? null], $crumbs))) ?>
      <?php endif; ?>
      <div class="mx-auto grid max-w-[1240px] items-center gap-12 px-6 pt-12 pb-16 md:pt-14 md:pb-20 lg:px-10 <?= $image ? 'lg:grid-cols-[1.4fr_1fr] lg:gap-20' : '' ?>">
        <div>
          <?php if ($crumbs): ?>
            <nav aria-label="Sayfa yolu" class="intro mb-10 text-sm text-muted">
              <a href="/" class="hover:text-forest transition-colors">Anasayfa</a>
              <?php foreach ($crumbs as $c): ?>
                <span>
                  <span class="mx-2 opacity-50">/</span>
                  <?php if (!empty($c['href'])): ?>
                    <a href="<?= e($c['href']) ?>" class="hover:text-forest transition-colors"><?= e($c['label']) ?></a>
                  <?php else: ?>
                    <span class="text-forest"><?= e($c['label']) ?></span>
                  <?php endif; ?>
                </span>
              <?php endforeach; ?>
            </nav>
          <?php endif; ?>
          <?php if ($eyebrow): ?><p class="intro kicker mb-6"><?= e($eyebrow) ?></p><?php endif; ?>
          <h1 <?= delay(60) ?> class="intro display max-w-[16ch]"><?= e($title) ?></h1>
          <?php if ($description): ?>
            <p <?= delay(140) ?> class="intro lead mt-7 max-w-xl whitespace-pre-line"><?= e($description) ?></p>
          <?php endif; ?>
        </div>
        <?php if ($image): ?>
          <div class="intro-image mx-auto hidden w-full max-w-[340px] lg:block">
            <div class="arch relative aspect-[4/5] bg-sage-light">
              <?= img_fill($image, $o['imageAlt'] ?? '', '', true) ?>
            </div>
          </div>
        <?php endif; ?>
      </div>
    </section>
    <?php
}

function cta_band(array $o = []): void
{
    $title = ($o['title'] ?? null) ?: 'Kendinizi daha iyi hissetmeye doğru ilk adımı atın';
    $description = ($o['description'] ?? null) ?: 'Yüz yüze ya da online; size uygun bir zamanda tanışma görüşmesi planlayalım. Hangi desteğin size iyi geleceğini birlikte netleştirelim.';
    $primary = $o['primary'] ?? ['text' => 'Randevu talebi oluştur', 'href' => '/quote'];
    $secondary = $o['secondary'] ?? ['text' => 'Önce soru sormak istiyorum', 'href' => '/contact'];
    ?>
    <section class="mx-auto max-w-[1240px] px-6 pb-16 md:pb-24 lg:pb-28 lg:px-10">
      <div data-reveal class="scene-tepeler overflow-hidden rounded-[1.75rem] bg-forest px-6 py-14 text-center text-paper sm:px-10 md:px-16 md:py-20">
        <h2 class="h-section mx-auto max-w-2xl !text-paper"><?= with_breaks($title) ?></h2>
        <p class="mx-auto mt-5 max-w-xl text-base leading-relaxed text-paper/90 sm:text-lg"><?= e($description) ?></p>
        <div class="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a href="<?= e(safe_url($primary['href'])) ?>" class="btn-light"><?= e($primary['text']) ?> <?= arrow_right() ?></a>
          <a href="<?= e(safe_url($secondary['href'])) ?>" class="btn-outline-light"><?= e($secondary['text']) ?></a>
        </div>
      </div>
    </section>
    <?php
}

function faq_details(array $f, string $summaryPadding = 'py-6', string $answerClass = 'leading-relaxed', string $attrs = ''): void
{
    ?>
    <details class="group border-b border-line" <?= $attrs ?>>
      <summary class="flex cursor-pointer list-none items-start justify-between gap-8 <?= e($summaryPadding) ?> font-serif text-[1.25rem] leading-snug text-forest">
        <?= e($f['q']) ?>
        <?= plus_icon('mt-1 h-5 w-5 shrink-0 text-olive transition-transform duration-300 group-open:rotate-45') ?>
      </summary>
      <p class="-mt-1 pb-7 sm:pr-12 <?= e($answerClass) ?> text-ink/75"><?= e($f['a']) ?></p>
    </details>
    <?php
}

/** Harita alanına bağlantı ya da tam iframe kodu girilebilir; yalnızca src kullanılır. */
function map_embed(?string $value): string
{
    $value = trim((string) $value);
    if (preg_match('/src=["\']([^"\']+)["\']/i', $value, $m)) {
        $value = html_entity_decode($m[1]);
    }
    if (!preg_match('#^https://#i', $value)) {
        return '';
    }
    return '<iframe src="' . e($value) . '" title="Klinik konumu" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
}

function render(string $view, array $vars = [], array $meta = [], int $status = 200): void
{
    http_response_code($status);
    extract($vars, EXTR_SKIP);
    ob_start();
    include APP_DIR . '/views/pages/' . $view . '.php';
    $content = (string) ob_get_clean();
    include APP_DIR . '/views/layout.php';
}
