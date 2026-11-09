<?php
declare(strict_types=1);

/**
 * Sayfaların okuduğu veriler. Kayıt yoksa varsayılan içerik oluşturulur.
 * Bir sorguda hata olursa sayfa boş bölümle açılır, hata günlüğe yazılır.
 */

function contact_settings(): ?array
{
    static $cache = false;
    if ($cache !== false) {
        return $cache;
    }
    return $cache = safe(function () {
        $row = db_one('SELECT * FROM `ContactSettings` LIMIT 1');
        if ($row) {
            return $row;
        }
        $id = db_insert('ContactSettings', [
            'address' => 'Kıbrıs Şehitleri Caddesi No: 00/0, Alsancak, 35220 Konak / İzmir',
            'phone1' => '+90 (555) 000 00 00',
            'phone2' => '+90 (555) 000 00 01',
            'email' => 'bilgi@psikolog.com',
            'phones' => json_encode([['label' => 'Randevu', 'value' => '+90 (555) 000 00 00'], ['label' => 'WhatsApp', 'value' => '+90 (555) 000 00 01']], JSON_UNESCAPED_UNICODE),
            'emails' => json_encode([['label' => 'Randevu & Danışma', 'value' => 'bilgi@psikolog.com']], JSON_UNESCAPED_UNICODE),
            'socialLinks' => json_encode([['name' => 'Instagram', 'url' => 'https://instagram.com'], ['name' => 'LinkedIn', 'url' => 'https://linkedin.com']]),
            'mapIframe' => '',
            'logo' => '',
            'logoFooter' => '',
            'updatedAt' => now_sql(),
        ]);
        return db_one('SELECT * FROM `ContactSettings` WHERE id = ?', [$id]);
    });
}

function page_header(string $identifier): ?array
{
    return safe(fn () => db_one('SELECT * FROM `PageHeader` WHERE pageIdentifier = ?', [$identifier]));
}

function services(): array
{
    static $cache = null;
    return $cache ??= safe(fn () => db_all('SELECT * FROM `Service` ORDER BY id ASC'), []);
}

function service_by_slug(string $slug): ?array
{
    return safe(fn () => db_one('SELECT * FROM `Service` WHERE slug = ?', [$slug]));
}

function published_posts(): array
{
    static $cache = null;
    return $cache ??= safe(fn () => db_all("SELECT * FROM `BlogPost` WHERE status = 'Yayında' ORDER BY createdAt DESC"), []);
}

/** Taslaklar yalnızca yöneticiye görünür; her görüntülemede sayaç artar. */
function post_by_slug(string $slug): ?array
{
    return safe(function () use ($slug) {
        $post = db_one('SELECT * FROM `BlogPost` WHERE slug = ?', [$slug]);
        if (!$post || ($post['status'] !== 'Yayında' && !admin_session())) {
            return null;
        }
        db_run('UPDATE `BlogPost` SET views = views + 1 WHERE id = ?', [$post['id']]);
        return $post;
    });
}

function gallery_items(): array
{
    return safe(fn () => db_all('SELECT * FROM `GalleryItem` ORDER BY createdAt DESC'), []);
}

function categories(): array
{
    return safe(function () {
        $rows = db_all('SELECT * FROM `Category` ORDER BY name ASC');
        if (!$rows) {
            foreach (['Konut', 'Otel', 'Ofis', 'Restoran', 'Eğitim', 'Sağlık', 'Üretim (Fabrika)'] as $name) {
                db_run('INSERT IGNORE INTO `Category` (name) VALUES (?)', [$name]);
            }
            $rows = db_all('SELECT * FROM `Category` ORDER BY name ASC');
        }
        return $rows;
    }, []);
}

function slides(): array
{
    return safe(function () {
        $rows = db_all('SELECT * FROM `Slide` ORDER BY `order` ASC');
        if (!$rows) {
            foreach (DEFAULT_SLIDES as $slide) {
                db_insert('Slide', $slide);
            }
            $rows = db_all('SELECT * FROM `Slide` ORDER BY `order` ASC');
        }
        return $rows;
    }, []);
}

function home_page(): ?array
{
    return safe(function () {
        $row = db_one('SELECT * FROM `HomePage` LIMIT 1');
        if ($row) {
            return $row;
        }
        $id = db_insert('HomePage', [...DEFAULT_HOME, 'updatedAt' => now_sql()]);
        return db_one('SELECT * FROM `HomePage` WHERE id = ?', [$id]);
    });
}

function about_page(): array
{
    return safe(function () {
        $row = db_one('SELECT * FROM `AboutPage` LIMIT 1');
        if ($row) {
            return $row;
        }
        $id = db_insert('AboutPage', [...DEFAULT_ABOUT, 'updatedAt' => now_sql()]);
        return db_one('SELECT * FROM `AboutPage` WHERE id = ?', [$id]);
    }, DEFAULT_ABOUT) ?? DEFAULT_ABOUT;
}

function production_info(): ?array
{
    return safe(function () {
        $row = db_one('SELECT * FROM `ProductionInfo` LIMIT 1');
        if ($row) {
            return $row;
        }
        $id = db_insert('ProductionInfo', [...DEFAULT_PRODUCTION, 'updatedAt' => now_sql()]);
        return db_one('SELECT * FROM `ProductionInfo` WHERE id = ?', [$id]);
    });
}

function production_steps(): array
{
    return safe(function () {
        $rows = db_all('SELECT * FROM `ProductionStep` ORDER BY `order` ASC');
        if (!$rows) {
            foreach (DEFAULT_STEPS as $step) {
                db_insert('ProductionStep', [...$step, 'updatedAt' => now_sql()]);
            }
            $rows = db_all('SELECT * FROM `ProductionStep` ORDER BY `order` ASC');
        }
        return $rows;
    }, []);
}

/* ---------- Randevu formu ---------- */

function clean_input(mixed $value, int $max): string
{
    $text = is_string($value) ? $value : '';
    $text = (string) preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $text);
    return mb_substr(trim($text), 0, $max);
}

/** @return string|null Hata mesajı; başarılıysa null. */
function submit_quote(array $input): ?string
{
    $name = clean_input($input['name'] ?? '', 120);
    $email = clean_input($input['email'] ?? '', 254);
    $phone = clean_input($input['phone'] ?? '', 40);
    $service = clean_input($input['service'] ?? '', 120);

    if ($name === '' || $email === '' || $phone === '') {
        return 'Lütfen ad, e-posta ve telefon alanlarını doldurun.';
    }
    if (empty($input['consent'])) {
        return 'Devam etmek için KVKK aydınlatma metnini onaylamanız gerekiyor.';
    }
    if (mb_strlen($name) < 2) {
        return 'Lütfen adınızı yazın.';
    }
    if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u', $email)) {
        return 'Lütfen geçerli bir e-posta adresi yazın.';
    }
    if (!preg_match('/^[0-9+()\s-]{7,40}$/', $phone)) {
        return 'Lütfen geçerli bir telefon numarası yazın.';
    }

    $sessionType = in_array($input['sessionType'] ?? '', array_column(SESSION_TYPES, 'value'), true)
        ? $input['sessionType']
        : SESSION_TYPES[0]['value'];
    $message = clean_input("[Seans tercihi: $sessionType]\n\n" . ($input['message'] ?? ''), 3000);

    $rateKey = 'quote-ip:' . client_ip();
    if (rate_count($rateKey, 3600) >= 5) {
        return 'Kısa sürede çok fazla talep gönderildi. Lütfen daha sonra tekrar deneyin ya da telefonla ulaşın.';
    }
    rate_count($rateKey, 3600, true);

    try {
        db_insert('Quote', compact('name', 'email', 'phone', 'service', 'message') + ['status' => 'Yeni']);
    } catch (Throwable $e) {
        error_log('[psikolog] ' . $e->getMessage());
        return 'Talebiniz şu anda gönderilemedi. Lütfen telefonla ulaşın.';
    }
    return null;
}

/* ---------- Dosya yükleme ---------- */

const IMAGE_MAX = 8 * 1024 * 1024;
const PDF_MAX = 15 * 1024 * 1024;

/** Tür, bildirilen MIME'a değil dosyanın gerçek içeriğine göre belirlenir. SVG kabul edilmez. */
function detect_file_kind(string $head): ?string
{
    if (strlen($head) < 12) {
        return null;
    }
    return match (true) {
        str_starts_with($head, "\xFF\xD8\xFF") => 'jpg',
        str_starts_with($head, "\x89PNG\r\n\x1A\n") => 'png',
        str_starts_with($head, 'GIF8') => 'gif',
        str_starts_with($head, 'RIFF') && substr($head, 8, 4) === 'WEBP' => 'webp',
        str_starts_with($head, '%PDF-') => 'pdf',
        default => null,
    };
}

/**
 * @param array $file $_FILES içindeki tek dosya
 * @return array{url?: string, error?: string}
 */
function save_upload(array $file, bool $allowPdf): array
{
    $code = $file['error'] ?? UPLOAD_ERR_NO_FILE;
    if ($code === UPLOAD_ERR_INI_SIZE || $code === UPLOAD_ERR_FORM_SIZE) {
        return ['error' => 'Dosya, sunucunun izin verdiği boyuttan büyük.'];
    }
    if ($code !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name']) || $file['size'] === 0) {
        return ['error' => 'Dosya seçilmedi veya boş.'];
    }
    if ($file['size'] > PDF_MAX) {
        return ['error' => 'Dosya 15 MB’tan büyük olamaz.'];
    }

    $kind = detect_file_kind((string) file_get_contents($file['tmp_name'], false, null, 0, 16));
    if ($kind === null || ($kind === 'pdf' && !$allowPdf)) {
        return ['error' => $allowPdf
            ? 'Yalnızca JPG, PNG, WEBP, GIF görselleri veya PDF yükleyebilirsiniz.'
            : 'Yalnızca JPG, PNG, WEBP veya GIF görselleri yükleyebilirsiniz.'];
    }
    if ($kind !== 'pdf' && $file['size'] > IMAGE_MAX) {
        return ['error' => 'Görsel 8 MB’tan büyük olamaz.'];
    }

    if (!is_dir(UPLOAD_DIR)) {
        @mkdir(UPLOAD_DIR, 0755, true);
    }
    $name = (int) (microtime(true) * 1000) . '_' . bin2hex(random_bytes(6)) . '.' . $kind;
    if (!@move_uploaded_file($file['tmp_name'], UPLOAD_DIR . '/' . $name)) {
        return ['error' => 'Sunucuda uploads klasörüne yazma izni yok (CHMOD 755 gerekli).'];
    }
    return ['url' => '/uploads/' . $name];
}

/** Yüklenen dosyaları klasör dışına çıkılamayacak biçimde sunar. */
function serve_upload(string $name): void
{
    $types = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'gif' => 'image/gif', 'svg' => 'image/svg+xml', 'pdf' => 'application/pdf'];
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $path = UPLOAD_DIR . '/' . $name;

    if (!preg_match('/^[A-Za-z0-9][A-Za-z0-9._-]{0,200}$/', $name) || str_contains($name, '..') || !isset($types[$ext]) || !is_file($path)) {
        http_response_code(404);
        header('Content-Type: text/plain; charset=utf-8');
        echo 'Not found';
        return;
    }

    header('Content-Type: ' . $types[$ext]);
    header('Content-Length: ' . filesize($path));
    header('Cache-Control: public, max-age=31536000, immutable');
    header('X-Content-Type-Options: nosniff');
    // Görsel/PDF içinde betik çalıştırılmasını engeller (özellikle eski SVG dosyaları için).
    header("Content-Security-Policy: default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox");
    if ($ext === 'svg') {
        header('Content-Disposition: inline; filename="image.svg"');
    }
    readfile($path);
}
