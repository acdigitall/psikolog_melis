<?php
declare(strict_types=1);

/*
 * Sayfa bölümleri yönetimi.
 *   /admin/blocks/{sayfa}                 bölüm listesi
 *   /admin/blocks/{sayfa}/new             şablon seçimi
 *   /admin/blocks/{sayfa}/new/{şablon}    yeni bölüm formu
 *   /admin/blocks/{sayfa}/{id}            düzenleme
 *   /admin/blocks/{sayfa}/{id}/{up|down|toggle|delete}  (POST)
 */
function admin_blocks(array $segments, string $method): void
{
    $page = $segments[1] ?? '';
    if (!isset(BLOCK_PAGES[$page])) {
        redirect('/admin/blocks/' . array_key_first(BLOCK_PAGES));
    }
    db()->exec(PAGE_BLOCK_SQL);
    $base = "/admin/blocks/$page";
    $rest = array_slice($segments, 2);

    if (!$rest) {
        admin_blocks_list($page);
        return;
    }

    if ($rest === ['new']) {
        admin_blocks_picker($page);
        return;
    }

    if (count($rest) === 2 && ctype_digit($rest[0]) && $method === 'POST') {
        admin_blocks_action($page, (int) $rest[0], $rest[1]);
        return;
    }

    $templates = block_templates();
    $isNew = count($rest) === 2 && $rest[0] === 'new' && isset($templates[$rest[1]]);
    $existing = null;
    if (!$isNew) {
        if (count($rest) !== 1 || !ctype_digit($rest[0])) {
            not_found();
        }
        $existing = db_one('SELECT * FROM `PageBlock` WHERE id = ? AND page = ?', [(int) $rest[0], $page]);
        if (!$existing || !isset($templates[$existing['template']])) {
            not_found();
        }
    }

    $template = $isNew ? $rest[1] : $existing['template'];
    $fields = block_fields($template);
    $row = $existing ? (json_decode((string) $existing['data'], true) ?: []) : [];
    $error = null;
    $action = $base . '/' . ($isNew ? "new/$template" : (int) $existing['id']);

    if ($method === 'POST') {
        [$data, $error] = collect_fields($fields);
        if ($error === null) {
            try {
                $json = json_encode($data, JSON_UNESCAPED_UNICODE);
                if ($isNew) {
                    $next = (int) db_value('SELECT COALESCE(MAX(sortOrder), 0) + 1 FROM `PageBlock` WHERE page = ?', [$page]);
                    db_insert('PageBlock', ['page' => $page, 'template' => $template, 'data' => $json, 'sortOrder' => $next, 'isActive' => 1, 'updatedAt' => now_sql()]);
                } else {
                    db_update('PageBlock', (int) $existing['id'], ['data' => $json, 'updatedAt' => now_sql()]);
                }
                redirect("$base?m=saved");
            } catch (PDOException $e) {
                error_log('[psikolog] ' . $e->getMessage());
                $error = 'Kaydedilirken bir hata oluştu.';
            }
        }
        $row = [...$row, ...$data];
    }

    [$pageLabel] = BLOCK_PAGES[$page];
    [$templateLabel, $templateDesc] = $templates[$template];
    admin_shell("$pageLabel · Bölümler", "/admin/$page", function () use ($base, $pageLabel, $templateLabel, $templateDesc, $isNew, $action, $fields, $row, $error) {
        echo '<div class="flex justify-between items-start gap-4 mb-6"><div>'
            . '<p class="text-xs font-bold uppercase tracking-wider text-stone-500">' . e($pageLabel) . ' · ' . ($isNew ? 'Yeni bölüm' : 'Bölümü düzenle') . '</p>'
            . '<h1 class="text-2xl font-serif text-stone-900 font-bold mt-1">' . e($templateLabel) . '</h1>'
            . '<p class="text-sm text-stone-500 mt-1">' . e($templateDesc) . '</p></div>'
            . '<a href="' . e($base) . '" class="px-6 py-2.5 bg-stone-900 text-white font-medium text-xs md:text-sm uppercase tracking-wider hover:bg-amber-800 transition-colors rounded shrink-0">Listeye Dön</a></div>';
        admin_form($action, $fields, $row, $error);
    });
}

function admin_blocks_action(string $page, int $id, string $op): void
{
    $base = "/admin/blocks/$page";
    $block = db_one('SELECT * FROM `PageBlock` WHERE id = ? AND page = ?', [$id, $page]);
    if (!$block) {
        not_found();
    }
    try {
        switch ($op) {
            case 'delete':
                db_run('DELETE FROM `PageBlock` WHERE id = ?', [$id]);
                redirect("$base?m=deleted");
            case 'toggle':
                db_run('UPDATE `PageBlock` SET isActive = 1 - isActive WHERE id = ?', [$id]);
                redirect("$base?m=saved");
            case 'up':
            case 'down':
                // Sıra numaraları önce 1..n olarak yeniden yazılır, sonra komşuyla yer değiştirilir.
                $ids = array_map('intval', array_column(db_all('SELECT id FROM `PageBlock` WHERE page = ? ORDER BY sortOrder ASC, id ASC', [$page]), 'id'));
                $i = array_search($id, $ids, true);
                $j = $op === 'up' ? $i - 1 : $i + 1;
                if ($i !== false && isset($ids[$j])) {
                    [$ids[$i], $ids[$j]] = [$ids[$j], $ids[$i]];
                }
                foreach ($ids as $n => $blockId) {
                    db_run('UPDATE `PageBlock` SET sortOrder = ? WHERE id = ?', [$n + 1, $blockId]);
                }
                redirect($base);
            default:
                not_found();
        }
    } catch (PDOException $e) {
        error_log('[psikolog] ' . $e->getMessage());
        redirect("$base?m=error");
    }
}

/** Sayfa sekmeleri (birden fazla sayfa açıldığında). */
function admin_blocks_tabs(string $page): string
{
    if (count(BLOCK_PAGES) < 2) {
        return '';
    }
    $html = '<div class="flex flex-wrap gap-2 mb-6">';
    foreach (BLOCK_PAGES as $key => [$label]) {
        $active = $key === $page ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50';
        $html .= '<a href="/admin/blocks/' . e($key) . '" class="px-4 py-2 rounded-full text-xs font-bold ' . $active . '">' . e($label) . '</a>';
    }
    return $html . '</div>';
}

function block_summary(array $block): string
{
    $d = is_array($block['data']) ? $block['data'] : (json_decode((string) $block['data'], true) ?: []);
    foreach (['title', 'quote', 'leftTitle', 'kicker', 'desc', 'body'] as $key) {
        if (trim((string) ($d[$key] ?? '')) !== '') {
            return mb_strimwidth(trim(strip_tags(str_replace(['<br/>', '<br>'], ' ', (string) $d[$key]))), 0, 80, '…');
        }
    }
    return '(başlıksız)';
}

function admin_blocks_list(string $page): void
{
    [$label, $path] = BLOCK_PAGES[$page];
    $blocks = page_blocks($page, false);
    $templates = block_templates();
    $base = "/admin/blocks/$page";

    admin_shell("$label · Ek Bölümler", "/admin/$page", function () use ($page, $label, $path, $blocks, $templates, $base) {
        $post = fn (int $id, string $op, string $text, string $class, string $confirm = '') => '<form method="post" action="' . e("$base/$id/$op") . '"' . ($confirm ? ' data-confirm="' . e($confirm) . '"' : '') . '>' . csrf_field()
            . '<button type="submit" class="px-2.5 py-1.5 text-xs font-bold rounded ' . $class . '">' . $text . '</button></form>';
        ?>
        <?= admin_blocks_tabs($page) ?>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-serif text-stone-900 font-bold"><?= e($label) ?> · Ek Bölümler</h1>
            <p class="text-sm text-stone-500 mt-1">Bu bölümler sayfanın sabit içeriğinin altında, sayfa sonu kutusundan önce bu sırayla görünür.</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <a href="<?= e($path) ?>" target="_blank" class="px-4 py-2.5 bg-white border border-stone-200 text-stone-700 text-xs md:text-sm font-medium uppercase tracking-wider rounded hover:bg-stone-50">Sayfayı gör</a>
            <a href="<?= e("$base/new") ?>" class="px-6 py-2.5 bg-stone-900 text-white font-medium text-xs md:text-sm uppercase tracking-wider hover:bg-amber-800 transition-colors rounded">+ Bölüm ekle</a>
          </div>
        </div>
        <div class="bg-white border border-stone-200 shadow-sm rounded-xl divide-y divide-stone-100">
          <?php if (!$blocks): ?>
            <div class="text-center py-14 px-6">
              <p class="text-stone-600 text-sm">Bu sayfaya henüz ek bölüm eklenmedi.</p>
              <a href="<?= e("$base/new") ?>" class="inline-block mt-4 text-sm font-bold text-stone-900 underline underline-offset-4">İlk bölümü ekleyin</a>
            </div>
          <?php endif; ?>
          <?php foreach ($blocks as $i => $b): $id = (int) $b['id']; $active = (int) $b['isActive'] === 1; ?>
            <div class="flex flex-col md:flex-row md:items-center gap-4 px-5 py-4 <?= $active ? '' : 'opacity-60' ?>">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-bold text-stone-700"><?= $i + 1 ?></span>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold uppercase tracking-wider text-stone-500"><?= e($templates[$b['template']][0] ?? $b['template']) ?><?= $active ? '' : ' · Gizli' ?></p>
                <p class="text-stone-900 font-medium truncate"><?= e(block_summary($b)) ?></p>
              </div>
              <div class="flex flex-wrap items-center gap-1">
                <?= $i > 0 ? $post($id, 'up', '↑', 'text-stone-700 hover:bg-stone-100') : '' ?>
                <?= $i < count($blocks) - 1 ? $post($id, 'down', '↓', 'text-stone-700 hover:bg-stone-100') : '' ?>
                <?= $post($id, 'toggle', $active ? 'Gizle' : 'Göster', 'text-stone-700 hover:bg-stone-100') ?>
                <a href="<?= e("$base/$id") ?>" class="px-3 py-1.5 bg-stone-100 text-stone-800 text-xs font-bold rounded hover:bg-stone-200">Düzenle</a>
                <?= $post($id, 'delete', 'Sil', 'text-red-600 hover:bg-red-50', 'Bu bölümü silmek istediğinize emin misiniz?') ?>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
        <?php
    });
}

function admin_blocks_picker(string $page): void
{
    [$label] = BLOCK_PAGES[$page];
    $base = "/admin/blocks/$page";
    admin_shell("$label · Bölüm ekle", "/admin/$page", function () use ($label, $base) {
        ?>
        <div class="flex justify-between items-start gap-4 mb-6">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-stone-500"><?= e($label) ?> · Yeni bölüm</p>
            <h1 class="text-2xl font-serif text-stone-900 font-bold mt-1">Bir şablon seçin</h1>
            <p class="text-sm text-stone-500 mt-1">Sonraki adımda seçtiğiniz şablonun alanlarını dolduracaksınız. Arka plan rengini de orada seçebilirsiniz.</p>
          </div>
          <a href="<?= e($base) ?>" class="px-6 py-2.5 bg-stone-900 text-white font-medium text-xs md:text-sm uppercase tracking-wider hover:bg-amber-800 transition-colors rounded shrink-0">Vazgeç</a>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <?php foreach (block_templates() as $key => [$name, $desc]): ?>
            <a href="<?= e("$base/new/$key") ?>" class="group flex flex-col rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-900 hover:shadow-md">
              <div class="flex h-28 items-center justify-center rounded-lg bg-stone-50 p-4 text-stone-400 group-hover:text-stone-700"><?= block_preview($key) ?></div>
              <p class="mt-4 font-bold text-stone-900"><?= e($name) ?></p>
              <p class="mt-1 text-xs leading-relaxed text-stone-500"><?= e($desc) ?></p>
            </a>
          <?php endforeach; ?>
        </div>
        <?php
    });
}

/** Şablon seçim ekranındaki küçük şematik çizim. */
function block_preview(string $key): string
{
    $l = fn (float $x, float $y, float $w, float $h = 3, float $o = 1) => "<rect x=\"$x\" y=\"$y\" width=\"$w\" height=\"$h\" rx=\"1.5\" fill=\"currentColor\" opacity=\"$o\"/>";
    $box = fn (float $x, float $y, float $w, float $h, float $r = 3, float $o = .35) => "<rect x=\"$x\" y=\"$y\" width=\"$w\" height=\"$h\" rx=\"$r\" fill=\"currentColor\" opacity=\"$o\"/>";
    $c = fn (float $x, float $y, float $r, float $o = 1) => "<circle cx=\"$x\" cy=\"$y\" r=\"$r\" fill=\"currentColor\" opacity=\"$o\"/>";
    $text = fn (float $x, float $y, float $w, int $n = 3) => implode('', array_map(fn ($i) => $l($x, $y + $i * 6, $i === $n - 1 ? $w * .6 : $w, 2.5, .45), range(0, $n - 1)));

    $svg = match ($key) {
        'text' => $l(30, 14, 60, 5) . $text(30, 28, 60, 5),
        'image_text' => $box(8, 10, 40, 50, 4) . $l(58, 16, 50, 5) . $text(58, 30, 50, 4),
        'two_col' => $l(8, 10, 50, 5) . $l(8, 26, 40, 3.5) . $text(8, 34, 46) . $l(66, 26, 40, 3.5) . $text(66, 34, 46),
        'cards' => $l(8, 8, 50, 5) . $box(8, 22, 32, 38) . $box(44, 22, 32, 38, 3, .25) . $box(80, 22, 32, 38, 3, .15),
        'list' => $l(8, 12, 32, 5) . $text(8, 22, 30, 2) . implode('', array_map(fn ($i) => $l(52, 12 + $i * 14, 24, 3.5) . $l(80, 12 + $i * 14, 32, 2.5, .45) . $l(52, 19 + $i * 14, 60, .6, .4), range(0, 3))),
        'checklist' => $l(8, 8, 50, 5) . implode('', array_map(fn ($i) => $c(12 + ($i % 2) * 54, 26 + intdiv($i, 2) * 12, 3) . $l(19 + ($i % 2) * 54, 25 + intdiv($i, 2) * 12, 38, 2.5, .5), range(0, 5))),
        'chips' => $box(4, 6, 112, 58, 6, .15) . $l(12, 14, 40, 5) . $box(12, 28, 26, 9, 4.5, .5) . $box(42, 28, 34, 9, 4.5, .5) . $box(80, 28, 24, 9, 4.5, .5) . $box(12, 42, 30, 9, 4.5, .5) . $box(46, 42, 22, 9, 4.5, .5),
        'stats' => $l(40, 8, 40, 4) . $l(14, 26, 18, 10) . $l(51, 26, 18, 10) . $l(88, 26, 18, 10) . $l(12, 42, 22, 2.5, .45) . $l(49, 42, 22, 2.5, .45) . $l(86, 42, 22, 2.5, .45),
        'timeline' => $l(46, 10, 0.8, 52, .5) . implode('', array_map(fn ($i) => $l(18, 12 + $i * 17, 20, 3, .6) . $c(46.4, 13.5 + $i * 17, 3) . $l(56, 11 + $i * 17, 40, 3.5) . $l(56, 17 + $i * 17, 52, 2.5, .45), range(0, 2))),
        'steps' => $l(8, 8, 50, 5) . implode('', array_map(fn ($i) => $l(8 + $i * 37, 24, 33, .6, .5) . $l(8 + $i * 37, 30, 12, 7, .7) . $l(8 + $i * 37, 42, 28, 3) . $text(8 + $i * 37, 49, 30, 2), range(0, 2))),
        'quote' => '<text x="52" y="30" font-size="28" font-family="serif" fill="currentColor">“</text>' . $l(20, 32, 80, 4) . $l(28, 40, 64, 4) . $l(46, 52, 28, 2.5, .45),
        'testimonials' => implode('', array_map(fn ($i) => $box(6 + $i * 37, 10, 33, 50, 4, .2) . '<text x="' . (11 + $i * 37) . '" y="24" font-size="12" font-family="serif" fill="currentColor">“</text>' . $text(11 + $i * 37, 28, 23, 3) . $l(11 + $i * 37, 50, 14, 2.5), range(0, 2))),
        'faq' => $l(8, 10, 32, 5) . implode('', array_map(fn ($i) => $l(50, 10 + $i * 13, 52, 3.5) . $l(108, 9 + $i * 13, 4, 4, .6) . $l(50, 17 + $i * 13, 62, .6, .4), range(0, 3))),
        'gallery' => $l(8, 6, 40, 4) . implode('', array_map(fn ($i) => $box(8 + ($i % 3) * 36, 16 + intdiv($i, 3) * 24, 32, 21, 3, .25 + ($i % 3) * .1), range(0, 5))),
        'video' => $l(40, 6, 40, 4) . $box(22, 15, 76, 46, 4, .3) . '<path d="M55 30l14 8-14 8z" fill="currentColor"/>',
        'banner' => $box(4, 6, 112, 58, 6, .3) . $box(4, 36, 112, 28, 6, .25) . $l(14, 38, 56, 6) . $l(14, 48, 44, 2.5, .6) . $box(14, 54, 22, 6, 3, .8),
        'cta' => $box(4, 8, 112, 54, 8, .5) . $l(30, 18, 60, 5, .9) . $l(36, 28, 48, 2.5, .6) . $box(30, 42, 28, 9, 4.5, .9) . $box(62, 42, 28, 9, 4.5, .6),
        'file' => $box(4, 12, 112, 46, 6, .2) . $box(12, 22, 16, 20, 3, .6) . $l(34, 24, 40, 4) . $l(34, 33, 46, 2.5, .45) . $box(86, 30, 24, 9, 4.5, .9),
        default => $box(10, 10, 100, 50),
    };
    return '<svg viewBox="0 0 120 70" class="h-full w-full" aria-hidden="true">' . $svg . '</svg>';
}
