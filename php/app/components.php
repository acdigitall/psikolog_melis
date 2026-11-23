<?php
declare(strict_types=1);

function arrow_right(string $class = 'w-4 h-4'): string
{
    return '<svg class="' . e($class) . '" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3.5 10h13m0 0-5-5m5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

/** Sosyal medya platform logosu (admin'deki platform adına göre); tanınmayanlarda bağlantı ikonu. */
function social_icon(string $platform, string $class = 'h-[18px] w-[18px]'): string
{
    $p = mb_strtolower($platform);
    $fill = fn (string $d) => '<svg class="' . e($class) . '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' . $d . '"/></svg>';
    $stroke = fn (string $inner) => '<svg class="' . e($class) . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $inner . '</svg>';

    return match (true) {
        str_contains($p, 'instagram') => $stroke('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>'),
        str_contains($p, 'linkedin') => $fill('M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'),
        str_contains($p, 'youtube') => $fill('M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'),
        str_contains($p, 'facebook') => $fill('M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z'),
        str_contains($p, 'twitter'), $p === 'x' => $fill('M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'),
        str_contains($p, 'tiktok') => $fill('M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'),
        str_contains($p, 'whatsapp') => $stroke('<path d="M3 21l1.65-4.95A8.5 8.5 0 1 1 7.9 19.4z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/>'),
        str_contains($p, 'pinterest') => $stroke('<circle cx="12" cy="12" r="9"/><path d="M11 9.5c1.5-1.5 5-1 5 1.8 0 2.4-2 3.7-3.4 3.2M12 11l-2.5 9.5"/>'),
        default => $stroke('<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>'),
    };
}

/** Platformun kendi marka rengi (CSS background değeri). */
function social_brand_bg(string $platform): string
{
    $p = mb_strtolower($platform);
    return match (true) {
        str_contains($p, 'instagram') => 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
        str_contains($p, 'linkedin') => '#0A66C2',
        str_contains($p, 'youtube') => '#FF0000',
        str_contains($p, 'facebook') => '#1877F2',
        str_contains($p, 'twitter'), $p === 'x' => '#000000',
        str_contains($p, 'tiktok') => '#000000',
        str_contains($p, 'whatsapp') => '#25D366',
        str_contains($p, 'pinterest') => '#E60023',
        default => 'rgba(255,255,255,.15)',
    };
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
    return e($head) . ' <em class="italic text-clay">' . e($tail) . '</em>';
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
    // Logo şeffaf PNG (siyah sembol); koyu zeminde beyaza çevrilir.
    $blend = $light ? 'invert' : '';
    return '<span class="flex items-center gap-2.5">'
        . '<img src="/logo/psikoloji_logo.png?v=2" alt="" width="40" height="40" class="h-10 w-10 shrink-0 ' . $blend . '">'
        . '<span class="flex flex-col leading-none">'
        . '<span class="text-[12px] ' . $sub . '">Uzm. Klinik Psikolog</span>'
        . '<span class="mt-1.5 font-serif text-[1.35rem] tracking-[-0.01em] ' . $main . '">Melis Sağlam Güleç</span>'
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
          <?php if (!empty($o['link'])): ?>
            <p <?= delay(220) ?> class="intro mt-6 text-[15px] text-muted">
              <?= e($o['link']['lead'] ?? '') ?>
              <a href="<?= e($o['link']['href']) ?>" class="font-medium text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest transition-colors"><?= e($o['link']['text']) ?> →</a>
            </p>
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

/**
 * Sayfa sonu çağrı kutusu. Tüm sayfalarda aynıdır ve içeriği admin'de
 * "Ana Sayfa" ayarlarındaki çağrı bölümünden gelir.
 */
function cta_band(): void
{
    $d = home_page() ?? [];
    // Admin'de boş bırakılan alan (başlık, açıklama, buton) gizlenir; varsayılan yalnızca hiç kayıt yokken gösterilir.
    $title = trim((string) ($d['ctaTitle'] ?? 'Kendinizi daha iyi hissetmeye doğru ilk adımı atın'));
    $description = trim((string) ($d['ctaDesc'] ?? 'Yüz yüze ya da online; size uygun bir zamanda tanışma görüşmesi planlayalım. Hangi desteğin size iyi geleceğini birlikte netleştirelim.'));
    $button = function (string $textKey, string $linkKey, string $text, string $href) use ($d): ?array {
        $value = $d[$textKey] ?? $text;
        return trim((string) $value) === '' ? null : ['text' => $value, 'href' => ($d[$linkKey] ?? null) ?: $href];
    };
    $primary = $button('ctaBtn1Text', 'ctaBtn1Link', 'Randevu talebi oluştur', '/quote');
    $secondary = $button('ctaBtn2Text', 'ctaBtn2Link', 'Önce soru sormak istiyorum', '/contact');
    if ($title === '' && $description === '' && !$primary && !$secondary) {
        return;
    }
    ?>
    <section class="mx-auto max-w-[1240px] px-6 pb-16 md:pb-24 lg:pb-28 lg:px-10">
      <div data-reveal class="scene-tepeler overflow-hidden rounded-[1.75rem] bg-forest px-6 py-14 text-center text-paper sm:px-10 md:px-16 md:py-20">
        <?php if ($title !== ''): ?><h2 class="h-section mx-auto max-w-2xl !text-paper"><?= with_breaks($title) ?></h2><?php endif; ?>
        <?php if ($description !== ''): ?><p class="mx-auto max-w-xl text-base leading-relaxed text-paper/90 sm:text-lg <?= $title !== '' ? 'mt-5' : '' ?>"><?= e($description) ?></p><?php endif; ?>
        <?php if ($primary || $secondary): ?>
        <div class="<?= $title !== '' || $description !== '' ? 'mt-10' : '' ?> flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <?php if ($primary): ?><a href="<?= e(safe_url($primary['href'])) ?>" class="btn-light"><?= e($primary['text']) ?> <?= arrow_right() ?></a><?php endif; ?>
          <?php if ($secondary): ?><a href="<?= e(safe_url($secondary['href'])) ?>" class="btn-outline-light"><?= e($secondary['text']) ?></a><?php endif; ?>
        </div>
        <?php endif; ?>
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
