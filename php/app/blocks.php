<?php
declare(strict_types=1);

/*
 * Sayfa bölümleri: admin panelden sayfalara eklenen, şablonu seçilebilen ek bölümler.
 * Her bölüm PageBlock tablosunda bir satırdır; şablona özel alanlar `data` (JSON) içinde tutulur.
 */

/** Bölüm eklenebilen sayfalar: anahtar => [admin'deki adı, sitedeki adresi] */
const BLOCK_PAGES = [
    'about' => ['Hakkımda', '/about'],
];

const PAGE_BLOCK_SQL = "CREATE TABLE IF NOT EXISTS `PageBlock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `template` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `PageBlock_page_idx` (`page`, `sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

const BLOCK_BACKGROUNDS = [
    'Krem (sayfa zemini)' => '',
    'Kum' => 'bg-sand',
    'Açık yeşil' => 'bg-mist',
    'Koyu yeşil' => 'bg-forest block-dark',
];

/**
 * Şablonlar: anahtar => [ad, kısa açıklama, alanlar]. Alan tanımları admin formuyla aynı biçimdedir.
 * Her şablona ortak olarak "Arka plan" alanı eklenir (block_fields()).
 */
function block_templates(): array
{
    $kicker = ['key' => 'kicker', 'label' => 'Üst etiket (isteğe bağlı)', 'placeholder' => 'ör. Eğitim'];
    $title = ['key' => 'title', 'label' => 'Başlık', 'placeholder' => 'Bölüm başlığı (satır atlamak için <br/>)'];
    $intro = ['key' => 'intro', 'label' => 'Kısa giriş metni (isteğe bağlı)', 'type' => 'textarea', 'rows' => 2];
    $body = ['key' => 'body', 'label' => 'Metin', 'type' => 'textarea', 'rows' => 8, 'help' => 'Enter ile yeni paragraf başlatabilirsiniz.'];
    $btn = [
        ['key' => 'btnText', 'label' => 'Buton yazısı (isteğe bağlı)', 'placeholder' => 'ör. Randevu al'],
        ['key' => 'btnLink', 'label' => 'Buton bağlantısı', 'placeholder' => 'ör. /quote ya da https://...'],
    ];
    $titleDesc = [['key' => 'title', 'label' => 'Başlık'], ['key' => 'desc', 'label' => 'Açıklama', 'type' => 'textarea']];

    return [
        'text' => ['Metin', 'Başlık ve paragraflar; sade bir yazı bölümü.', [
            $kicker, $title, $body,
            ['key' => 'align', 'label' => 'Hizalama', 'type' => 'select', 'options' => ['Sola yaslı', 'Ortalı']],
            ...$btn,
        ]],
        'image_text' => ['Görsel + metin', 'Bir yanda görsel, diğer yanda yazı.', [
            $kicker, $title, $body,
            ['key' => 'img', 'label' => 'Görsel', 'type' => 'image'],
            ['key' => 'side', 'label' => 'Görselin yeri', 'type' => 'select', 'options' => ['Solda', 'Sağda']],
            ['key' => 'shape', 'label' => 'Görsel biçimi', 'type' => 'select', 'options' => ['Yuvarlatılmış köşe', 'Kemer', 'Daire']],
            ...$btn,
        ]],
        'two_col' => ['İki sütun metin', 'Yan yana iki başlıklı metin.', [
            $kicker, $title,
            ['key' => 'leftTitle', 'label' => 'Sol sütun başlığı'],
            ['key' => 'leftBody', 'label' => 'Sol sütun metni', 'type' => 'textarea', 'rows' => 5],
            ['key' => 'rightTitle', 'label' => 'Sağ sütun başlığı'],
            ['key' => 'rightBody', 'label' => 'Sağ sütun metni', 'type' => 'textarea', 'rows' => 5],
        ]],
        'cards' => ['Kartlar', 'Renkli kutular hâlinde başlık + açıklama (ör. ilkeler, sertifikalar).', [
            $kicker, $title, $intro,
            ['key' => 'cols', 'label' => 'Sütun sayısı', 'type' => 'select', 'options' => ['3', '2', '4']],
            ['key' => 'items', 'label' => 'Kartlar', 'type' => 'repeater', 'stack' => true, 'columns' => $titleDesc],
        ]],
        'list' => ['Çizgili liste', 'Solda başlık, sağda alt alta satırlar (ör. eğitimler, yayınlar).', [
            $kicker, $title, $intro,
            ['key' => 'items', 'label' => 'Satırlar', 'type' => 'repeater', 'stack' => true, 'columns' => $titleDesc],
        ]],
        'checklist' => ['Onay işaretli liste', 'Kısa maddeler, yanında ✓ işaretiyle; iki sütun.', [
            $kicker, $title, $intro,
            ['key' => 'lines', 'label' => 'Maddeler (her satıra bir madde)', 'type' => 'textarea', 'rows' => 8],
        ]],
        'chips' => ['Etiketler', 'Yuvarlak hap şeklinde kısa kelimeler (ör. çalışılan konular).', [
            $title,
            ['key' => 'lines', 'label' => 'Etiketler (virgülle ya da her satıra bir tane)', 'type' => 'textarea', 'rows' => 4],
        ]],
        'stats' => ['Rakamlar', 'Büyük rakamlar ve altında kısa açıklama (ör. 10+ yıl deneyim).', [
            $kicker, $title,
            ['key' => 'items', 'label' => 'Rakamlar', 'type' => 'repeater', 'columns' => [['key' => 'value', 'label' => 'Rakam', 'placeholder' => 'ör. 10+'], ['key' => 'label', 'label' => 'Açıklama', 'placeholder' => 'ör. yıl deneyim']]],
        ]],
        'timeline' => ['Zaman çizelgesi', 'Yıllara göre sıralı olaylar (ör. eğitim ve kariyer).', [
            $kicker, $title,
            ['key' => 'items', 'label' => 'Olaylar', 'type' => 'repeater', 'stack' => true, 'columns' => [['key' => 'year', 'label' => 'Yıl / dönem', 'placeholder' => 'ör. 2015–2017'], ...$titleDesc]],
        ]],
        'steps' => ['Numaralı adımlar', 'Sırayla ilerleyen adımlar (01, 02, 03...).', [
            $kicker, $title, $intro,
            ['key' => 'items', 'label' => 'Adımlar', 'type' => 'repeater', 'stack' => true, 'columns' => $titleDesc],
        ]],
        'quote' => ['Alıntı', 'Büyük, italik bir söz ya da danışan görüşü.', [
            ['key' => 'quote', 'label' => 'Alıntı', 'type' => 'textarea', 'rows' => 4],
            ['key' => 'author', 'label' => 'Söyleyen (isteğe bağlı)', 'placeholder' => 'ör. Carl Rogers'],
        ]],
        'testimonials' => ['Danışan yorumları', 'Kartlar hâlinde kısa yorumlar.', [
            $kicker, $title,
            ['key' => 'items', 'label' => 'Yorumlar', 'type' => 'repeater', 'stack' => true, 'columns' => [['key' => 'text', 'label' => 'Yorum', 'type' => 'textarea', 'rows' => 3], ['key' => 'name', 'label' => 'Kimden', 'placeholder' => 'ör. A.K., 34']]],
        ]],
        'faq' => ['Sık sorulan sorular', 'Açılır kapanır soru–cevap listesi.', [
            $kicker, $title,
            ['key' => 'items', 'label' => 'Sorular', 'type' => 'repeater', 'stack' => true, 'columns' => [['key' => 'q', 'label' => 'Soru'], ['key' => 'a', 'label' => 'Cevap', 'type' => 'textarea', 'rows' => 3]]],
        ]],
        'gallery' => ['Görsel galeri', 'En fazla 6 fotoğraf yan yana.', [
            $kicker, $title,
            ...array_map(fn ($i) => ['key' => "img$i", 'label' => "$i. görsel", 'type' => 'image'], range(1, 6)),
        ]],
        'video' => ['Video', 'YouTube ya da Vimeo videosu, başlık ve açıklamayla.', [
            $kicker, $title, $intro,
            ['key' => 'url', 'label' => 'Video bağlantısı', 'placeholder' => 'https://www.youtube.com/watch?v=...'],
        ]],
        'banner' => ['Görselli geniş başlık', 'Tam genişlikte görsel üzerinde başlık ve buton.', [
            ['key' => 'img', 'label' => 'Arka plan görseli', 'type' => 'image'],
            $title,
            ['key' => 'desc', 'label' => 'Açıklama', 'type' => 'textarea', 'rows' => 3],
            ...$btn,
        ]],
        'cta' => ['Vurgu kutusu', 'Yuvarlak köşeli yeşil kutu; başlık, metin ve iki buton.', [
            $title,
            ['key' => 'desc', 'label' => 'Açıklama', 'type' => 'textarea', 'rows' => 3],
            ...$btn,
            ['key' => 'btn2Text', 'label' => '2. buton yazısı (isteğe bağlı)'],
            ['key' => 'btn2Link', 'label' => '2. buton bağlantısı'],
        ]],
        'file' => ['Belge indirme', 'PDF gibi bir belgeyi indirme butonuyla sunar.', [
            $kicker, $title,
            ['key' => 'desc', 'label' => 'Açıklama', 'type' => 'textarea', 'rows' => 3],
            ['key' => 'file', 'label' => 'Belge (PDF)', 'type' => 'file'],
            ['key' => 'btnText', 'label' => 'Buton yazısı', 'placeholder' => 'Belgeyi indir'],
        ]],
    ];
}

/** Şablonun admin formundaki tüm alanları (ortak ayarlar dâhil). */
function block_fields(string $template): array
{
    return [
        ...block_templates()[$template][2],
        ['section' => 'Görünüm'],
        ['key' => 'bg', 'label' => 'Arka plan', 'type' => 'select', 'options' => array_keys(BLOCK_BACKGROUNDS)],
    ];
}

function page_blocks(string $page, bool $onlyActive = true): array
{
    return safe(function () use ($page, $onlyActive) {
        db()->exec(PAGE_BLOCK_SQL);
        $rows = db_all('SELECT * FROM `PageBlock` WHERE page = ?' . ($onlyActive ? ' AND isActive = 1' : '') . ' ORDER BY sortOrder ASC, id ASC', [$page]);
        foreach ($rows as &$row) {
            $row['data'] = json_decode((string) $row['data'], true) ?: [];
        }
        return $rows;
    }, []);
}

/* ---------- Sitede gösterim ---------- */

function render_blocks(string $page): void
{
    $templates = block_templates();
    foreach (page_blocks($page) as $block) {
        if (isset($templates[$block['template']])) {
            render_block($block['template'], $block['data']);
        }
    }
}

function block_paragraphs(?string $text, string $class = ''): string
{
    $out = '';
    foreach (preg_split('/\n+/', trim((string) $text)) ?: [] as $p) {
        if (trim($p) !== '') {
            $out .= '<p' . ($class ? ' class="' . $class . '"' : '') . '>' . e(trim($p)) . '</p>';
        }
    }
    return $out;
}

function block_lines(?string $text): array
{
    return array_values(array_filter(array_map('trim', preg_split('/[\n,]+/', (string) $text) ?: []), 'strlen'));
}

function block_items(array $d): array
{
    return array_values(array_filter(parse_list($d['items'] ?? null), 'is_array'));
}

/** Başlık alanı: üst etiket + başlık (+ giriş). */
function block_heading(array $d, bool $center = false): string
{
    $html = '';
    if (($d['kicker'] ?? '') !== '') {
        $html .= '<p class="kicker mb-6">' . e($d['kicker']) . '</p>';
    }
    if (($d['title'] ?? '') !== '') {
        $html .= '<h2 class="h-section max-w-3xl' . ($center ? ' mx-auto' : '') . '">' . with_breaks($d['title']) . '</h2>';
    }
    if (($d['intro'] ?? '') !== '') {
        $html .= '<p class="lead mt-6 max-w-2xl' . ($center ? ' mx-auto' : '') . '">' . e($d['intro']) . '</p>';
    }
    return $html === '' ? '' : '<div data-reveal class="' . ($center ? 'text-center ' : '') . 'mb-12 md:mb-16">' . $html . '</div>';
}

function block_button(?string $text, ?string $link, string $class = 'btn-forest'): string
{
    if (trim((string) $text) === '') {
        return '';
    }
    return '<a href="' . e(safe_url(($link ?? '') ?: '/quote')) . '" class="' . $class . '">' . e($text) . ' ' . arrow_right() . '</a>';
}

/** YouTube / Vimeo bağlantısını gömülebilir adrese çevirir. */
function video_embed_url(?string $url): ?string
{
    $url = trim((string) $url);
    if (preg_match('~(?:youtube\.com/(?:watch\?(?:.*&)?v=|embed/|shorts/)|youtu\.be/)([\w-]{11})~', $url, $m)) {
        return 'https://www.youtube-nocookie.com/embed/' . $m[1];
    }
    if (preg_match('~vimeo\.com/(?:video/)?(\d+)~', $url, $m)) {
        return 'https://player.vimeo.com/video/' . $m[1];
    }
    return null;
}

function render_block(string $template, array $d): void
{
    $bg = BLOCK_BACKGROUNDS[$d['bg'] ?? ''] ?? '';
    $wrap = 'mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:px-10';

    // Bu iki şablon kendi kutusunu çizer; arka plan ayarı dış zemine uygulanır.
    if ($template === 'cta' || $template === 'banner') {
        echo '<section class="' . $bg . '"><div class="' . $wrap . '">';
        $template === 'cta' ? block_cta($d) : block_banner($d);
        echo '</div></section>';
        return;
    }

    echo '<section class="' . $bg . '"><div class="' . $wrap . '">';
    match ($template) {
        'text' => block_text($d),
        'image_text' => block_image_text($d),
        'two_col' => block_two_col($d),
        'cards' => block_cards($d),
        'list' => block_list($d),
        'checklist' => block_checklist($d),
        'chips' => block_chips($d),
        'stats' => block_stats($d),
        'timeline' => block_timeline($d),
        'steps' => block_steps($d),
        'quote' => block_quote($d),
        'testimonials' => block_testimonials($d),
        'faq' => block_faq($d),
        'gallery' => block_gallery($d),
        'video' => block_video($d),
        'file' => block_file($d),
        default => null,
    };
    echo '</div></section>';
}

function block_text(array $d): void
{
    $center = ($d['align'] ?? '') === 'Ortalı';
    ?>
    <div data-reveal class="<?= $center ? 'mx-auto text-center' : '' ?> max-w-3xl">
      <?php if (($d['kicker'] ?? '') !== ''): ?><p class="kicker mb-6"><?= e($d['kicker']) ?></p><?php endif; ?>
      <?php if (($d['title'] ?? '') !== ''): ?><h2 class="h-section"><?= with_breaks($d['title']) ?></h2><?php endif; ?>
      <div class="mt-8 space-y-5 text-[1.08rem] leading-[1.8] text-ink/80"><?= block_paragraphs($d['body'] ?? '') ?></div>
      <?php if ($b = block_button($d['btnText'] ?? '', $d['btnLink'] ?? '')): ?><div class="mt-10"><?= $b ?></div><?php endif; ?>
    </div>
    <?php
}

function block_image_text(array $d): void
{
    $right = ($d['side'] ?? '') === 'Sağda';
    $shape = match ($d['shape'] ?? '') {
        'Kemer' => 'arch aspect-[4/5]',
        'Daire' => 'aspect-square rounded-full',
        default => 'aspect-[4/5] rounded-[1.25rem]',
    };
    ?>
    <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
      <div data-reveal="image" class="<?= $right ? 'lg:order-2' : '' ?>">
        <div class="relative mx-auto w-full max-w-[480px] overflow-hidden bg-sage-light <?= $shape ?>"><?php if (($d['img'] ?? '') !== ''): ?><?= img_fill($d['img'], strip_tags((string) ($d['title'] ?? ''))) ?><?php endif; ?></div>
      </div>
      <div data-reveal>
        <?php if (($d['kicker'] ?? '') !== ''): ?><p class="kicker mb-6"><?= e($d['kicker']) ?></p><?php endif; ?>
        <?php if (($d['title'] ?? '') !== ''): ?><h2 class="h-section"><?= with_breaks($d['title']) ?></h2><?php endif; ?>
        <div class="mt-8 max-w-xl space-y-5 text-[1.08rem] leading-[1.8] text-ink/80"><?= block_paragraphs($d['body'] ?? '') ?></div>
        <?php if ($b = block_button($d['btnText'] ?? '', $d['btnLink'] ?? '')): ?><div class="mt-10"><?= $b ?></div><?php endif; ?>
      </div>
    </div>
    <?php
}

function block_two_col(array $d): void
{
    echo block_heading($d);
    ?>
    <div class="grid gap-12 border-t border-line pt-12 md:grid-cols-2 md:gap-20">
      <?php foreach ([['leftTitle', 'leftBody'], ['rightTitle', 'rightBody']] as $i => [$t, $b]): ?>
        <div data-reveal <?= delay($i * 100) ?>>
          <?php if (($d[$t] ?? '') !== ''): ?><h3 class="h-sub"><?= e($d[$t]) ?></h3><?php endif; ?>
          <div class="mt-5 space-y-4 leading-relaxed text-ink/75"><?= block_paragraphs($d[$b] ?? '') ?></div>
        </div>
      <?php endforeach; ?>
    </div>
    <?php
}

function block_cards(array $d): void
{
    $cols = ['2' => 'md:grid-cols-2', '4' => 'md:grid-cols-2 lg:grid-cols-4'][$d['cols'] ?? ''] ?? 'md:grid-cols-3';
    echo block_heading($d);
    ?>
    <div class="grid gap-5 <?= $cols ?>">
      <?php foreach (block_items($d) as $i => $item): ?>
        <div data-reveal <?= delay($i * 90) ?> class="block-card rounded-[1.75rem] p-8 <?= ['bg-sand', 'bg-mist', 'bg-sage-light'][$i % 3] ?>">
          <h3 class="font-serif text-[1.5rem] leading-tight text-forest"><?= e($item['title'] ?? '') ?></h3>
          <p class="mt-3 leading-relaxed text-muted"><?= e($item['desc'] ?? '') ?></p>
        </div>
      <?php endforeach; ?>
    </div>
    <?php
}

function block_list(array $d): void
{
    ?>
    <div class="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
      <div data-reveal>
        <?php if (($d['kicker'] ?? '') !== ''): ?><p class="kicker mb-6"><?= e($d['kicker']) ?></p><?php endif; ?>
        <?php if (($d['title'] ?? '') !== ''): ?><h2 class="h-section"><?= with_breaks($d['title']) ?></h2><?php endif; ?>
        <?php if (($d['intro'] ?? '') !== ''): ?><p class="lead mt-6 max-w-sm"><?= e($d['intro']) ?></p><?php endif; ?>
      </div>
      <dl class="border-t border-line">
        <?php foreach (block_items($d) as $i => $item): ?>
          <div data-reveal <?= delay($i * 60) ?> class="grid gap-2 border-b border-line py-7 md:grid-cols-[1fr_1.3fr] md:gap-10">
            <dt class="font-serif text-[1.4rem] leading-snug text-forest"><?= e($item['title'] ?? '') ?></dt>
            <dd class="leading-relaxed text-muted"><?= e($item['desc'] ?? '') ?></dd>
          </div>
        <?php endforeach; ?>
      </dl>
    </div>
    <?php
}

function block_checklist(array $d): void
{
    echo block_heading($d);
    ?>
    <ul class="grid gap-x-12 gap-y-5 md:grid-cols-2">
      <?php foreach (preg_split('/\n+/', trim((string) ($d['lines'] ?? ''))) ?: [] as $i => $line): if (trim($line) === '') continue; ?>
        <li data-reveal <?= delay(($i % 6) * 50) ?> class="flex items-start gap-4 border-b border-line pb-5 text-[1.05rem] leading-relaxed text-ink/80">
          <span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-paper"><svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          <span><?= e(trim($line)) ?></span>
        </li>
      <?php endforeach; ?>
    </ul>
    <?php
}

function block_chips(array $d): void
{
    ?>
    <div data-reveal class="scene-kolaj rounded-[2rem] bg-sage-light/70 p-8 md:p-14">
      <?php if (($d['title'] ?? '') !== ''): ?><h3 class="h-sub"><?= e($d['title']) ?></h3><?php endif; ?>
      <ul class="mt-8 flex flex-wrap gap-3">
        <?php foreach (block_lines($d['lines'] ?? '') as $chip): ?>
          <li class="rounded-full bg-paper px-5 py-2.5 font-serif text-[1.15rem] text-forest"><?= e($chip) ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
    <?php
}

function block_stats(array $d): void
{
    echo block_heading($d, true);
    $items = block_items($d);
    ?>
    <div class="grid grid-cols-2 gap-y-12 border-y border-line py-12 <?= count($items) >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3' ?>">
      <?php foreach ($items as $i => $item): ?>
        <div data-reveal <?= delay($i * 90) ?> class="px-4 text-center">
          <p class="font-serif text-forest" style="font-size: clamp(2.6rem, 2rem + 2.4vw, 4rem); line-height: 1"><?= e($item['value'] ?? '') ?></p>
          <p class="mt-3 text-[15px] text-muted"><?= e($item['label'] ?? '') ?></p>
        </div>
      <?php endforeach; ?>
    </div>
    <?php
}

function block_timeline(array $d): void
{
    echo block_heading($d);
    ?>
    <ol class="relative ml-2 border-l border-line md:ml-[11rem]">
      <?php foreach (block_items($d) as $i => $item): ?>
        <li data-reveal <?= delay($i * 70) ?> class="relative pb-12 pl-8 last:pb-0 md:pl-12">
          <span class="absolute -left-[7px] top-2 h-3.5 w-3.5 rounded-full border-2 border-paper bg-olive"></span>
          <p class="text-sm font-medium text-bark md:absolute md:-left-[11rem] md:top-1 md:w-36 md:text-right"><?= e($item['year'] ?? '') ?></p>
          <h3 class="mt-1 font-serif text-[1.4rem] leading-snug text-forest md:mt-0"><?= e($item['title'] ?? '') ?></h3>
          <?php if (($item['desc'] ?? '') !== ''): ?><p class="mt-2 max-w-2xl leading-relaxed text-muted"><?= e($item['desc']) ?></p><?php endif; ?>
        </li>
      <?php endforeach; ?>
    </ol>
    <?php
}

function block_steps(array $d): void
{
    echo block_heading($d);
    ?>
    <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
      <?php foreach (block_items($d) as $i => $item): ?>
        <div data-reveal <?= delay($i * 90) ?> class="border-t border-line pt-6">
          <p class="font-serif text-[2.5rem] leading-none text-clay"><?= sprintf('%02d', $i + 1) ?></p>
          <h3 class="mt-5 font-serif text-[1.45rem] leading-snug text-forest"><?= e($item['title'] ?? '') ?></h3>
          <p class="mt-3 leading-relaxed text-muted"><?= e($item['desc'] ?? '') ?></p>
        </div>
      <?php endforeach; ?>
    </div>
    <?php
}

function block_quote(array $d): void
{
    ?>
    <figure data-reveal class="mx-auto max-w-4xl text-center">
      <span class="block font-serif text-[5rem] leading-[0.6] text-clay" aria-hidden="true">“</span>
      <blockquote class="mt-6 font-serif italic text-forest" style="font-size: clamp(1.6rem, 1.2rem + 1.6vw, 2.6rem); line-height: 1.3"><?= with_breaks($d['quote'] ?? '') ?></blockquote>
      <?php if (($d['author'] ?? '') !== ''): ?><figcaption class="mt-8 text-[15px] text-muted">— <?= e($d['author']) ?></figcaption><?php endif; ?>
    </figure>
    <?php
}

function block_testimonials(array $d): void
{
    echo block_heading($d);
    ?>
    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <?php foreach (block_items($d) as $i => $item): ?>
        <figure data-reveal <?= delay($i * 90) ?> class="block-card flex flex-col rounded-[1.75rem] bg-paper p-8 ring-1 ring-line">
          <span class="font-serif text-[3rem] leading-[0.6] text-clay" aria-hidden="true">“</span>
          <blockquote class="mt-4 flex-1 leading-relaxed text-ink/80"><?= e($item['text'] ?? '') ?></blockquote>
          <?php if (($item['name'] ?? '') !== ''): ?><figcaption class="mt-6 text-sm font-medium text-forest"><?= e($item['name']) ?></figcaption><?php endif; ?>
        </figure>
      <?php endforeach; ?>
    </div>
    <?php
}

function block_faq(array $d): void
{
    ?>
    <div class="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
      <div data-reveal>
        <?php if (($d['kicker'] ?? '') !== ''): ?><p class="kicker mb-6"><?= e($d['kicker']) ?></p><?php endif; ?>
        <?php if (($d['title'] ?? '') !== ''): ?><h2 class="h-section"><?= with_breaks($d['title']) ?></h2><?php endif; ?>
      </div>
      <div data-reveal class="border-t border-line">
        <?php foreach (block_items($d) as $item): ?>
          <?php faq_details(['q' => $item['q'] ?? '', 'a' => $item['a'] ?? '']); ?>
        <?php endforeach; ?>
      </div>
    </div>
    <?php
}

function block_gallery(array $d): void
{
    $images = array_values(array_filter(array_map(fn ($i) => (string) ($d["img$i"] ?? ''), range(1, 6)), 'strlen'));
    echo block_heading($d);
    ?>
    <div class="grid grid-cols-2 gap-4 <?= count($images) % 3 === 0 ? 'md:grid-cols-3' : 'md:grid-cols-2' ?>">
      <?php foreach ($images as $i => $src): ?>
        <div data-reveal="image" <?= delay($i * 70) ?> class="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-sage-light"><?= img_fill($src) ?></div>
      <?php endforeach; ?>
    </div>
    <?php
}

function block_video(array $d): void
{
    $embed = video_embed_url($d['url'] ?? '');
    echo block_heading($d, true);
    if ($embed === null) {
        return;
    }
    ?>
    <div data-reveal class="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-[1.25rem] bg-forest-dark">
      <iframe src="<?= e($embed) ?>" title="<?= e(strip_tags((string) ($d['title'] ?? 'Video'))) ?>" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute inset-0 h-full w-full"></iframe>
    </div>
    <?php
}

function block_banner(array $d): void
{
    ?>
    <div data-reveal class="relative flex min-h-[420px] items-end overflow-hidden rounded-[1.75rem] bg-forest md:min-h-[520px]">
      <?php if (($d['img'] ?? '') !== ''): ?><?= img_fill($d['img']) ?><?php endif; ?>
      <div class="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-forest-dark/35 to-transparent"></div>
      <div class="relative max-w-2xl p-8 text-paper md:p-14">
        <?php if (($d['title'] ?? '') !== ''): ?><h2 class="h-section !text-paper"><?= with_breaks($d['title']) ?></h2><?php endif; ?>
        <?php if (($d['desc'] ?? '') !== ''): ?><p class="mt-5 text-[1.08rem] leading-relaxed text-paper/85"><?= e($d['desc']) ?></p><?php endif; ?>
        <?php if ($b = block_button($d['btnText'] ?? '', $d['btnLink'] ?? '', 'btn-light')): ?><div class="mt-8"><?= $b ?></div><?php endif; ?>
      </div>
    </div>
    <?php
}

function block_cta(array $d): void
{
    $b1 = block_button($d['btnText'] ?? '', $d['btnLink'] ?? '', 'btn-light');
    $b2 = trim((string) ($d['btn2Text'] ?? '')) === '' ? '' : '<a href="' . e(safe_url(($d['btn2Link'] ?? '') ?: '/contact')) . '" class="btn-outline-light">' . e($d['btn2Text']) . '</a>';
    ?>
    <div data-reveal class="scene-tepeler overflow-hidden rounded-[1.75rem] bg-forest px-6 py-14 text-center text-paper sm:px-10 md:px-16 md:py-20">
      <?php if (($d['title'] ?? '') !== ''): ?><h2 class="h-section mx-auto max-w-2xl !text-paper"><?= with_breaks($d['title']) ?></h2><?php endif; ?>
      <?php if (($d['desc'] ?? '') !== ''): ?><p class="mx-auto mt-5 max-w-xl text-base leading-relaxed text-paper/90 sm:text-lg"><?= e($d['desc']) ?></p><?php endif; ?>
      <?php if ($b1 || $b2): ?><div class="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"><?= $b1 . $b2 ?></div><?php endif; ?>
    </div>
    <?php
}

function block_file(array $d): void
{
    $file = (string) ($d['file'] ?? '');
    ?>
    <div data-reveal class="block-card flex flex-col gap-8 rounded-[1.75rem] bg-sand p-8 md:flex-row md:items-center md:justify-between md:p-12">
      <div class="flex items-start gap-6">
        <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-paper text-forest"><svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M12 11v6m0 0-2.5-2.5M12 17l2.5-2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div>
          <?php if (($d['kicker'] ?? '') !== ''): ?><p class="kicker mb-3"><?= e($d['kicker']) ?></p><?php endif; ?>
          <?php if (($d['title'] ?? '') !== ''): ?><h2 class="h-sub"><?= e($d['title']) ?></h2><?php endif; ?>
          <?php if (($d['desc'] ?? '') !== ''): ?><p class="mt-3 max-w-xl leading-relaxed text-muted"><?= e($d['desc']) ?></p><?php endif; ?>
        </div>
      </div>
      <?php if ($file !== ''): ?>
        <a href="<?= e(safe_url($file)) ?>" target="_blank" rel="noopener" class="btn-forest shrink-0"><?= e(($d['btnText'] ?? '') ?: 'Belgeyi indir') ?> <?= arrow_right() ?></a>
      <?php endif; ?>
    </div>
    <?php
}
