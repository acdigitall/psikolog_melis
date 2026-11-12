<?php
declare(strict_types=1);

/**
 * Yönetim paneli kimlik doğrulaması.
 * Oturum, httpOnly + SameSite=Lax çerezde tutulan HMAC imzalı belirteçtir (PHP oturumu kullanılmaz).
 */
const SESSION_COOKIE = 'psk_admin_session';
const SESSION_TTL = 8 * 60 * 60;
const LOGIN_WINDOW = 15 * 60;
const LOGIN_MAX_PER_IP = 5;
const LOGIN_MAX_GLOBAL = 30;

// E-posta yanlışken de aynı süre harcansın diye kullanılan sahte özet.
const DUMMY_HASH = '$2y$12$ITQ.P9klh5ds5h1b8nJYe.le6Kxu4UVjxtahq1OCh86N9f8/eIuVq';

function b64url(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function b64url_decode(string $data): string
{
    return (string) base64_decode(strtr($data, '-_', '+/'), true);
}

function session_secret(): ?string
{
    $secret = env('SESSION_SECRET');
    return strlen($secret) >= 32 ? $secret : null;
}

function admin_email(): string
{
    return strtolower(trim(env('ADMIN_EMAIL')));
}

/** "b64:" önekli özeti çözer; düz özeti olduğu gibi döndürür. */
function decode_password_hash(string $value): string
{
    $value = trim($value);
    if (str_starts_with($value, 'b64:')) {
        $decoded = base64_decode(substr($value, 4), true);
        return $decoded === false ? '' : $decoded;
    }
    return $value;
}

/**
 * Yönetici şifre özeti. Bazı paneller ortam değişkenindeki "$" işaretlerini bozduğu için özet
 * "b64:" önekiyle base64 olarak da verilebilir. Sunucudaki ortam değişkeni geçersizse (ör. panel
 * eski değeri tutuyorsa) app/.env dosyasındaki geçerli özet kullanılır.
 */
function admin_password_hash(): string
{
    $candidates = [(string) getenv('ADMIN_PASSWORD_HASH'), env_file()['ADMIN_PASSWORD_HASH'] ?? ''];
    foreach ($candidates as $candidate) {
        $hash = decode_password_hash($candidate);
        if ($hash !== '' && password_get_info($hash)['algo'] !== null) {
            return $hash;
        }
    }
    return decode_password_hash(env('ADMIN_PASSWORD_HASH'));
}

function sign_token(string $body, string $secret): string
{
    return b64url(hash_hmac('sha256', $body, $secret, true));
}

function create_session_token(string $sub): array
{
    $secret = session_secret();
    if ($secret === null) {
        throw new RuntimeException('SESSION_SECRET eksik veya 32 karakterden kısa.');
    }
    $now = time();
    $body = b64url((string) json_encode(['sub' => $sub, 'iat' => $now, 'exp' => $now + SESSION_TTL]));
    return [$body . '.' . sign_token($body, $secret), $now + SESSION_TTL];
}

function verify_session_token(?string $token): ?array
{
    if (!$token || strlen($token) > 1024) {
        return null;
    }
    $secret = session_secret();
    $parts = explode('.', $token);
    if ($secret === null || count($parts) !== 2) {
        return null;
    }
    [$body, $sig] = $parts;
    if (!hash_equals(sign_token($body, $secret), $sig)) {
        return null;
    }
    $payload = json_decode(b64url_decode($body), true);
    if (!is_array($payload) || !is_string($payload['sub'] ?? null) || !is_int($payload['exp'] ?? null)) {
        return null;
    }
    // Yönetici e-postası değiştirildiyse eski oturumlar geçersiz olur.
    if ($payload['exp'] <= time() || $payload['sub'] !== admin_email()) {
        return null;
    }
    return $payload;
}

function admin_session(): ?array
{
    static $session = false;
    if ($session === false) {
        $session = verify_session_token($_COOKIE[SESSION_COOKIE] ?? null);
    }
    return $session;
}

function send_session_cookie(string $value, int $expires): void
{
    setcookie(SESSION_COOKIE, $value, [
        'expires' => $expires,
        'path' => '/',
        'secure' => is_https(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

/** Panel ayarlarında eksik varsa hata mesajı döner; kurulum sorununu "şifre hatalı"dan ayırmak için. */
function auth_config_error(): ?string
{
    $hash = admin_password_hash();
    if (admin_email() === '' || session_secret() === null || env('ADMIN_PASSWORD_HASH') === '') {
        return 'Yönetici girişi henüz yapılandırılmamış. app/.env dosyasını kontrol edin.';
    }
    if (password_get_info($hash)['algo'] === null) {
        // Değerin nereden okunduğunu göster; yanlış yerin düzeltilmesini önler.
        $source = ((string) getenv('ADMIN_PASSWORD_HASH')) !== '' ? 'sunucu ortam değişkeni' : 'app/.env dosyası';
        if (str_starts_with(env('ADMIN_PASSWORD_HASH'), 'scrypt:')) {
            return "Şifre özeti eski (Next.js) biçiminde. Kaynak: $source. Yeni özeti app/.env dosyasına ADMIN_PASSWORD_HASH=b64:... olarak yazın.";
        }
        return "Şifre özeti okunamadı. Kaynak: $source. sifre-olustur.php çıktısındaki \"b64:\" ile başlayan satırı kullanın.";
    }
    return null;
}

function check_credentials(string $email, string $password): bool
{
    $emailOk = strtolower(trim($email)) === admin_email();
    $passOk = password_verify($password, $emailOk ? admin_password_hash() : DUMMY_HASH);
    return $emailOk && $passOk;
}

/** @return string|null Hata mesajı; başarılıysa null. */
function attempt_login(string $email, string $password): ?string
{
    if ($email === '' || $password === '' || strlen($email) > 254 || strlen($password) > 256) {
        return 'E-posta ve şifre gerekli.';
    }
    $configError = auth_config_error();
    if ($configError !== null) {
        return $configError;
    }

    $ipKey = 'login-ip:' . client_ip();
    if (rate_count($ipKey, LOGIN_WINDOW) >= LOGIN_MAX_PER_IP || rate_count('login-global', LOGIN_WINDOW) >= LOGIN_MAX_GLOBAL) {
        return 'Çok fazla hatalı deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin.';
    }

    if (!check_credentials($email, $password)) {
        rate_count($ipKey, LOGIN_WINDOW, true);
        rate_count('login-global', LOGIN_WINDOW, true);
        usleep(random_int(400000, 800000));
        return 'E-posta veya şifre hatalı.';
    }

    rate_clear($ipKey);
    [$token, $expires] = create_session_token(strtolower(trim($email)));
    send_session_cookie($token, $expires);
    return null;
}

function logout(): void
{
    send_session_cookie('', time() - 3600);
}

/** Oturuma bağlı form belirteci; çapraz site isteklerini engeller. */
function csrf_token(): string
{
    return hash_hmac('sha256', 'csrf|' . ($_COOKIE[SESSION_COOKIE] ?? ''), (string) session_secret());
}

function csrf_field(): string
{
    return '<input type="hidden" name="_csrf" value="' . e(csrf_token()) . '">';
}

function csrf_valid(): bool
{
    return is_string($_POST['_csrf'] ?? null) && hash_equals(csrf_token(), $_POST['_csrf']);
}
