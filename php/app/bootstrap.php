<?php
declare(strict_types=1);

const APP_DIR = __DIR__;
define('ROOT_DIR', dirname(__DIR__));
const STORAGE_DIR = APP_DIR . '/storage';
define('UPLOAD_DIR', ROOT_DIR . '/uploads');

ini_set('display_errors', '0');
mb_internal_encoding('UTF-8');
date_default_timezone_set('UTC');

/* ---------- Ayarlar ---------- */

/** app/.env dosyasındaki değerler (dosya yoksa boş dizi). */
function env_file(): array
{
    static $file = null;
    if ($file !== null) {
        return $file;
    }
    $file = [];
    $path = APP_DIR . '/.env';
    if (is_readable($path)) {
        foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
                continue;
            }
            [$name, $value] = explode('=', $line, 2);
            $value = trim($value);
            if (strlen($value) >= 2 && ($value[0] === '"' || $value[0] === "'") && $value[-1] === $value[0]) {
                $value = substr($value, 1, -1);
            }
            $file[trim($name)] = $value;
        }
    }
    return $file;
}

/** Ayar değeri; sunucuda tanımlı gerçek ortam değişkenleri app/.env dosyasından önceliklidir. */
function env(string $key, string $default = ''): string
{
    $real = getenv($key);
    if ($real !== false && $real !== '') {
        return $real;
    }
    return env_file()[$key] ?? $default;
}

function is_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
}

/* ---------- Veritabanı ---------- */

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $url = parse_url(env('DATABASE_URL'));
    if (!$url || empty($url['host']) || empty($url['path'])) {
        throw new RuntimeException('DATABASE_URL tanımlı değil veya geçersiz.');
    }
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        $url['host'],
        $url['port'] ?? 3306,
        rawurldecode(ltrim($url['path'], '/'))
    );
    $pdo = new PDO($dsn, rawurldecode($url['user'] ?? ''), rawurldecode($url['pass'] ?? ''), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    // Tarihler (Prisma'daki gibi) UTC tutulur; görüntülerken İstanbul saatine çevrilir.
    $pdo->exec("SET time_zone = '+00:00'");
    return $pdo;
}

function db_all(string $sql, array $params = []): array
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function db_one(string $sql, array $params = []): ?array
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    $row = $stmt->fetch();
    return $row === false ? null : $row;
}

function db_value(string $sql, array $params = []): mixed
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchColumn();
}

function db_run(string $sql, array $params = []): void
{
    db()->prepare($sql)->execute($params);
}

/** Tablo ve sütun adları yalnızca koddaki sabit tanımlardan gelir; kullanıcı girdisi değildir. */
function db_insert(string $table, array $data): int
{
    $columns = implode(', ', array_map(fn ($c) => "`$c`", array_keys($data)));
    $marks = implode(', ', array_fill(0, count($data), '?'));
    db_run("INSERT INTO `$table` ($columns) VALUES ($marks)", array_values($data));
    return (int) db()->lastInsertId();
}

function db_update(string $table, int $id, array $data): void
{
    $sets = implode(', ', array_map(fn ($c) => "`$c` = ?", array_keys($data)));
    db_run("UPDATE `$table` SET $sets WHERE id = ?", [...array_values($data), $id]);
}

function now_sql(): string
{
    return gmdate('Y-m-d H:i:s');
}

/** Veritabanı hatasında sayfa düşmesin; hata günlüğe yazılır, varsayılan değer döner. */
function safe(callable $fn, mixed $fallback = null): mixed
{
    try {
        return $fn();
    } catch (Throwable $e) {
        error_log('[psikolog] ' . $e->getMessage());
        return $fallback;
    }
}

/* ---------- Yardımcılar ---------- */

function e(mixed $value): string
{
    return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function redirect(string $to, int $code = 303): never
{
    header('Location: ' . $to, true, $code);
    exit;
}

function client_ip(): string
{
    return substr($_SERVER['REMOTE_ADDR'] ?? 'yerel', 0, 64);
}

function parse_list(mixed $value): array
{
    if (is_array($value)) {
        return $value;
    }
    if (is_string($value) && $value !== '') {
        $decoded = json_decode($value, true);
        // Prisma Json alanlarında çift kodlanmış metin de bulunabilir.
        if (is_string($decoded)) {
            $decoded = json_decode($decoded, true);
        }
        return is_array($decoded) ? $decoded : [];
    }
    return [];
}

function split_csv(?string $value): array
{
    if (!$value) {
        return [];
    }
    return array_values(array_filter(array_map('trim', explode(',', $value)), fn ($v) => $v !== ''));
}

function slugify(string $text): string
{
    $text = strtr($text, [
        'ç' => 'c', 'Ç' => 'c', 'ğ' => 'g', 'Ğ' => 'g', 'ı' => 'i', 'I' => 'i', 'İ' => 'i',
        'ö' => 'o', 'Ö' => 'o', 'ş' => 's', 'Ş' => 's', 'ü' => 'u', 'Ü' => 'u',
    ]);
    $text = trim(mb_strtolower($text));
    $text = (string) preg_replace('/\s+/', '-', $text);
    $text = (string) preg_replace('/[^a-z0-9_\-]+/', '', $text);
    $text = (string) preg_replace('/-{2,}/', '-', $text);
    return trim($text, '-');
}

function parse_date(string $value): DateTimeImmutable
{
    return new DateTimeImmutable($value, new DateTimeZone('UTC'));
}

function iso_date(string $value): string
{
    return parse_date($value)->format('Y-m-d\TH:i:s.v\Z');
}

/** Örn. "9 Kasım 2026"; $time verilirse saat de eklenir, $short ise yıl yazılmaz ve ay kısalır. */
function tr_date(string $value, bool $time = false, bool $short = false): string
{
    $months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    $date = parse_date($value)->setTimezone(new DateTimeZone('Europe/Istanbul'));
    $month = $months[(int) $date->format('n') - 1];
    $text = $date->format('j') . ' ' . ($short ? mb_substr($month, 0, 3) : $month) . ($short ? '' : ' ' . $date->format('Y'));
    return $time ? $text . ' ' . $date->format('H:i') : $text;
}

/* ---------- Kötüye kullanım sınırı ---------- */

/**
 * Pencere içindeki deneme sayısını dosyada tutar (PHP'de süreçler arası bellek yok).
 * $record true ise yeni bir deneme de eklenir.
 */
function rate_count(string $key, int $window, bool $record = false): int
{
    $dir = STORAGE_DIR . '/rate';
    if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
        error_log('[psikolog] app/storage yazılamıyor; deneme sınırı uygulanamadı.');
        return 0;
    }
    $handle = @fopen($dir . '/' . sha1($key) . '.json', 'c+');
    if (!$handle) {
        error_log('[psikolog] app/storage yazılamıyor; deneme sınırı uygulanamadı.');
        return 0;
    }
    flock($handle, LOCK_EX);
    $hits = json_decode((string) stream_get_contents($handle), true);
    $now = time();
    $hits = array_values(array_filter(is_array($hits) ? $hits : [], fn ($t) => is_int($t) && $now - $t < $window));
    if ($record) {
        $hits[] = $now;
    }
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($hits));
    flock($handle, LOCK_UN);
    fclose($handle);
    return count($hits);
}

function rate_clear(string $key): void
{
    @unlink(STORAGE_DIR . '/rate/' . sha1($key) . '.json');
}

/** POST'un kendi sitemizden geldiğini doğrular (Origin, yoksa Referer). */
function same_origin(): bool
{
    $source = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
    if ($source === '') {
        return true;
    }
    $host = parse_url($source, PHP_URL_HOST);
    $port = parse_url($source, PHP_URL_PORT);
    $full = $port ? "$host:$port" : (string) $host;
    return hash_equals(strtolower($_SERVER['HTTP_HOST'] ?? ''), strtolower($full));
}

require APP_DIR . '/site.php';
require APP_DIR . '/content.php';
require APP_DIR . '/data.php';
require APP_DIR . '/auth.php';
require APP_DIR . '/crm.php';
require APP_DIR . '/components.php';
