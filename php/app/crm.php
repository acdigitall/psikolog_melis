<?php
declare(strict_types=1);

/**
 * CRM takvim + seans sonrası SMS (NetGSM).
 *
 * Akış: psikolog randevuyu (başlangıç/bitiş) girer → zamanlayıcı (app/tools/sms-cron.php)
 * her 5-10 dakikada bir çalışır → bitişinden "gecikme" kadar süre geçmiş randevulara
 * paneldeki şablonla SMS gönderir. Randevu notları yalnızca panelde görünür, SMS'e girmez.
 */

const APPOINTMENT_STATUSES = ['Planlandı', 'Gerçekleşti', 'İptal'];
const SMS_DELAY_OPTIONS = [30 => '30 dakika', 60 => '1 saat', 90 => '1,5 saat', 120 => '2 saat', 180 => '3 saat'];
const SMS_MAX_ATTEMPTS = 3;
/** Bitiş + gecikmeden bu kadar sonra hâlâ gönderilmemişse (ör. geriye dönük kayıt) SMS atlanır. */
const SMS_STALE_AFTER = 12 * 3600;
const NETGSM_SEND_URL = 'https://api.netgsm.com.tr/sms/rest/v2/send';
const DEFAULT_SMS_TEMPLATE = 'Merhaba {ad}, bugünkü görüşmemiz için teşekkür ederim. Bir sonraki seansa kadar kendinize iyi bakın. {psikolog}';

const NETGSM_ERRORS = [
    '20' => 'Mesaj metni hatalı ya da çok uzun.',
    '30' => 'Kullanıcı adı/şifre hatalı veya API erişim izni yok (NetGSM panelinden API erişimini ve IP kısıtını kontrol edin).',
    '40' => 'Mesaj başlığı (gönderici adı) sistemde tanımlı değil.',
    '50' => 'İYS kontrollü gönderim bu hesapta yapılamıyor.',
    '51' => 'Bu numara için İYS izni bulunamadı.',
    '70' => 'Hatalı istek; parametreleri kontrol edin.',
    '80' => 'Gönderim sınırı aşıldı.',
    '85' => 'Aynı numaraya kısa sürede çok fazla mesaj gönderildi.',
];

/* ---------- Tablolar ---------- */

/** Tablolar yoksa oluşturur (app/tools/schema.sql ile aynı yapı). İstek başına bir kez çalışır. */
function crm_ensure_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $opts = 'DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
    db()->exec("CREATE TABLE IF NOT EXISTS `Appointment` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `clientName` VARCHAR(191) NOT NULL,
        `phone` VARCHAR(191) NOT NULL,
        `startAt` DATETIME(3) NOT NULL,
        `endAt` DATETIME(3) NOT NULL,
        `note` TEXT NULL,
        `status` VARCHAR(191) NOT NULL DEFAULT 'Planlandı',
        `smsEnabled` BOOLEAN NOT NULL DEFAULT true,
        `smsStatus` VARCHAR(191) NOT NULL DEFAULT 'Bekliyor',
        `smsAttempts` INTEGER NOT NULL DEFAULT 0,
        `smsSentAt` DATETIME(3) NULL,
        `smsError` TEXT NULL,
        `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        `updatedAt` DATETIME(3) NOT NULL,
        INDEX `Appointment_startAt_idx`(`startAt`),
        INDEX `Appointment_smsStatus_endAt_idx`(`smsStatus`, `endAt`),
        PRIMARY KEY (`id`)
    ) $opts");
    db()->exec("CREATE TABLE IF NOT EXISTS `SmsSettings` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `enabled` BOOLEAN NOT NULL DEFAULT false,
        `usercode` VARCHAR(191) NOT NULL DEFAULT '',
        `passwordEnc` TEXT NULL,
        `msgheader` VARCHAR(191) NOT NULL DEFAULT '',
        `delayMinutes` INTEGER NOT NULL DEFAULT 90,
        `template` TEXT NOT NULL,
        `updatedAt` DATETIME(3) NOT NULL,
        PRIMARY KEY (`id`)
    ) $opts");
    db()->exec("CREATE TABLE IF NOT EXISTS `SmsLog` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `appointmentId` INTEGER NULL,
        `phone` VARCHAR(191) NOT NULL,
        `message` TEXT NOT NULL,
        `success` BOOLEAN NOT NULL DEFAULT false,
        `response` TEXT NULL,
        `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX `SmsLog_createdAt_idx`(`createdAt`),
        PRIMARY KEY (`id`)
    ) $opts");
    $done = true;
}

/* ---------- Saat dilimi ---------- */

function local_tz(): DateTimeZone
{
    static $tz = null;
    return $tz ??= new DateTimeZone('Europe/Istanbul');
}

/** "2026-11-12" + "14:30" (İstanbul) → UTC SQL zamanı; geçersizse null. */
function local_to_utc(string $date, string $time): ?string
{
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || !preg_match('/^\d{2}:\d{2}$/', $time)) {
        return null;
    }
    $dt = DateTimeImmutable::createFromFormat('!Y-m-d H:i', "$date $time", local_tz());
    if (!$dt || $dt->format('Y-m-d H:i') !== "$date $time") {
        return null;
    }
    return $dt->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s');
}

function utc_to_local(string $sql): DateTimeImmutable
{
    return parse_date($sql)->setTimezone(local_tz());
}

/* ---------- Telefon ---------- */

/** Türkiye cep numarasını 905XXXXXXXXX biçimine çevirir; geçersizse null. */
function normalize_tr_mobile(string $phone): ?string
{
    $digits = (string) preg_replace('/\D+/', '', $phone);
    if (str_starts_with($digits, '0090')) {
        $digits = substr($digits, 2);
    }
    if (strlen($digits) === 11 && $digits[0] === '0') {
        $digits = '90' . substr($digits, 1);
    } elseif (strlen($digits) === 10 && $digits[0] === '5') {
        $digits = '90' . $digits;
    }
    return preg_match('/^905\d{9}$/', $digits) ? $digits : null;
}

function format_tr_mobile(string $normalized): string
{
    return preg_match('/^90(\d{3})(\d{3})(\d{2})(\d{2})$/', $normalized, $m)
        ? "0{$m[1]} {$m[2]} {$m[3]} {$m[4]}"
        : $normalized;
}

/* ---------- SMS ayarları ---------- */

function sms_secret_key(): string
{
    return hash('sha256', 'netgsm|' . (string) session_secret(), true);
}

/** NetGSM şifresi veritabanında SESSION_SECRET'tan türetilen anahtarla şifreli tutulur. */
function sms_encrypt(string $plain): string
{
    $iv = random_bytes(12);
    $tag = '';
    $cipher = openssl_encrypt($plain, 'aes-256-gcm', sms_secret_key(), OPENSSL_RAW_DATA, $iv, $tag);
    if ($cipher === false) {
        throw new RuntimeException('Şifreleme başarısız.');
    }
    return 'v1:' . base64_encode($iv . $tag . $cipher);
}

function sms_decrypt(?string $stored): string
{
    if (!$stored || !str_starts_with($stored, 'v1:')) {
        return '';
    }
    $raw = base64_decode(substr($stored, 3), true);
    if ($raw === false || strlen($raw) < 29) {
        return '';
    }
    $plain = openssl_decrypt(substr($raw, 28), 'aes-256-gcm', sms_secret_key(), OPENSSL_RAW_DATA, substr($raw, 0, 12), substr($raw, 12, 16));
    return $plain === false ? '' : $plain;
}

function sms_settings(): array
{
    crm_ensure_schema();
    $row = db_one('SELECT * FROM `SmsSettings` ORDER BY id ASC LIMIT 1');
    if ($row) {
        return $row;
    }
    $id = db_insert('SmsSettings', [
        'enabled' => 0,
        'usercode' => '',
        'passwordEnc' => null,
        'msgheader' => '',
        'delayMinutes' => 90,
        'template' => DEFAULT_SMS_TEMPLATE,
        'updatedAt' => now_sql(),
    ]);
    return db_one('SELECT * FROM `SmsSettings` WHERE id = ?', [$id]);
}

/** Ayarlar eksikse kullanıcıya gösterilecek açıklama; hazırsa null. */
function sms_config_error(array $settings): ?string
{
    if ($settings['usercode'] === '' || sms_decrypt($settings['passwordEnc']) === '' || $settings['msgheader'] === '') {
        return 'NetGSM kullanıcı kodu, şifre ve mesaj başlığı girilmeli.';
    }
    if (trim($settings['template']) === '') {
        return 'SMS şablonu boş.';
    }
    return null;
}

/* ---------- Şablon ---------- */

function sms_placeholders(): array
{
    return [
        '{ad}' => 'Danışanın adı (ilk kelime)',
        '{adsoyad}' => 'Danışanın tam adı',
        '{tarih}' => 'Seans tarihi (ör. 12 Kasım)',
        '{saat}' => 'Seans başlangıç saati (ör. 14:00)',
        '{psikolog}' => 'Psikolog adı',
    ];
}

function render_sms(string $template, array $appointment): string
{
    $months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    $start = utc_to_local($appointment['startAt']);
    $full = trim((string) $appointment['clientName']);
    return trim(strtr($template, [
        '{ad}' => explode(' ', $full)[0] ?? $full,
        '{adsoyad}' => $full,
        '{tarih}' => $start->format('j') . ' ' . $months[(int) $start->format('n') - 1],
        '{saat}' => $start->format('H:i'),
        '{psikolog}' => SITE_NAME,
    ]));
}

/* ---------- NetGSM ---------- */

/**
 * Tek numaraya SMS gönderir.
 * @return array{ok: bool, message: string, raw: string}
 */
function netgsm_send(array $settings, string $phone, string $text): array
{
    $password = sms_decrypt($settings['passwordEnc']);
    $body = json_encode([
        'msgheader' => $settings['msgheader'],
        'messages' => [['msg' => $text, 'no' => $phone]],
        'encoding' => 'TR',
        'iysfilter' => '0', // Bilgilendirme amaçlı (ticari olmayan) ileti
        'partnercode' => '',
    ], JSON_UNESCAPED_UNICODE);

    $raw = '';
    $httpCode = 0;
    $transportError = '';
    if (function_exists('curl_init')) {
        $ch = curl_init(NETGSM_SEND_URL);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_USERPWD => $settings['usercode'] . ':' . $password,
            CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 20,
        ]);
        $raw = (string) curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $transportError = curl_error($ch);
    } else {
        $context = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\nAuthorization: Basic " . base64_encode($settings['usercode'] . ':' . $password),
            'content' => $body,
            'timeout' => 20,
            'ignore_errors' => true,
        ]]);
        $raw = (string) @file_get_contents(NETGSM_SEND_URL, false, $context);
        $httpCode = preg_match('#HTTP/\S+\s+(\d{3})#', $http_response_header[0] ?? '', $m) ? (int) $m[1] : 0;
        $transportError = $raw === '' ? 'Bağlantı kurulamadı.' : '';
    }

    if ($raw === '' && $transportError !== '') {
        return ['ok' => false, 'message' => 'NetGSM’e bağlanılamadı: ' . $transportError, 'raw' => ''];
    }
    $json = json_decode($raw, true);
    $code = is_array($json) ? (string) ($json['code'] ?? '') : trim(explode(' ', trim($raw))[0] ?? '');
    if ($code === '00' || $code === '01' || $code === '02') {
        return ['ok' => true, 'message' => 'Gönderildi' . (isset($json['jobid']) ? ' (iş no: ' . $json['jobid'] . ')' : ''), 'raw' => $raw];
    }
    if ($httpCode === 401) {
        $code = '30';
    }
    $desc = NETGSM_ERRORS[$code] ?? ('Beklenmeyen yanıt' . ($code !== '' ? " (kod $code)" : '') . ($httpCode ? " · HTTP $httpCode" : ''));
    return ['ok' => false, 'message' => $desc, 'raw' => $raw];
}

function sms_log(?int $appointmentId, string $phone, string $message, array $result): void
{
    safe(fn () => db_insert('SmsLog', [
        'appointmentId' => $appointmentId,
        'phone' => $phone,
        'message' => $message,
        'success' => $result['ok'] ? 1 : 0,
        'response' => mb_substr($result['message'] . ($result['raw'] !== '' ? ' | ' . $result['raw'] : ''), 0, 2000),
        'createdAt' => now_sql(),
    ]));
}

/* ---------- Randevu SMS'i ---------- */

/**
 * Randevuyu "Gönderiliyor" olarak kilitleyip SMS'i gönderir (iki zamanlayıcı aynı anda çalışsa da tek SMS gider).
 * @return array{ok: bool, message: string}
 */
function send_appointment_sms(array $appointment, array $settings): array
{
    $id = (int) $appointment['id'];
    $claim = db()->prepare("UPDATE `Appointment` SET smsStatus = 'Gönderiliyor', smsAttempts = smsAttempts + 1, updatedAt = ? WHERE id = ? AND smsStatus IN ('Bekliyor', 'Hata', 'Atlandı')");
    $claim->execute([now_sql(), $id]);
    if ($claim->rowCount() !== 1) {
        return ['ok' => false, 'message' => 'Bu randevunun SMS’i zaten işleniyor veya gönderilmiş.'];
    }

    $phone = normalize_tr_mobile($appointment['phone']);
    if ($phone === null) {
        db_update('Appointment', $id, ['smsStatus' => 'Hata', 'smsError' => 'Telefon numarası geçerli bir Türkiye cep numarası değil.', 'updatedAt' => now_sql()]);
        return ['ok' => false, 'message' => 'Telefon numarası geçersiz.'];
    }

    $text = render_sms($settings['template'], $appointment);
    $result = netgsm_send($settings, $phone, $text);
    sms_log($id, $phone, $text, $result);

    if ($result['ok']) {
        db_update('Appointment', $id, ['smsStatus' => 'Gönderildi', 'smsSentAt' => now_sql(), 'smsError' => null, 'updatedAt' => now_sql()]);
    } else {
        $attempts = (int) $appointment['smsAttempts'] + 1;
        // Geçici hatalarda zamanlayıcı birkaç kez daha dener.
        db_update('Appointment', $id, [
            'smsStatus' => $attempts < SMS_MAX_ATTEMPTS ? 'Bekliyor' : 'Hata',
            'smsError' => $result['message'],
            'updatedAt' => now_sql(),
        ]);
    }
    return $result;
}

/**
 * Zamanı gelen SMS'leri gönderir. Zamanlayıcıdan (cron) çağrılır.
 * @return array{sent: int, failed: int, skipped: int, note?: string}
 */
function dispatch_due_sms(): array
{
    crm_ensure_schema();
    $stats = ['sent' => 0, 'failed' => 0, 'skipped' => 0];
    $settings = sms_settings();
    if (empty($settings['enabled'])) {
        return $stats + ['note' => 'SMS gönderimi panelde kapalı.'];
    }
    $configError = sms_config_error($settings);
    if ($configError !== null) {
        return $stats + ['note' => $configError];
    }

    $delay = max(0, (int) $settings['delayMinutes']) * 60;
    $now = time();
    $dueBefore = gmdate('Y-m-d H:i:s', $now - $delay);
    $staleBefore = gmdate('Y-m-d H:i:s', $now - $delay - SMS_STALE_AFTER);

    // Çok eski (ör. geçmişe dönük girilmiş) randevulara SMS atılmaz.
    $skip = db()->prepare("UPDATE `Appointment` SET smsStatus = 'Atlandı', smsError = 'Gönderim zamanı çok geçmişti.', updatedAt = ? WHERE smsStatus = 'Bekliyor' AND endAt < ?");
    $skip->execute([now_sql(), $staleBefore]);
    $stats['skipped'] = $skip->rowCount();

    // Takılı kalmış kilitleri (30 dk) serbest bırak.
    db_run("UPDATE `Appointment` SET smsStatus = 'Bekliyor' WHERE smsStatus = 'Gönderiliyor' AND updatedAt < ?", [gmdate('Y-m-d H:i:s', $now - 1800)]);

    $due = db_all(
        "SELECT * FROM `Appointment` WHERE smsStatus = 'Bekliyor' AND smsEnabled = 1 AND status <> 'İptal' AND endAt <= ? ORDER BY endAt ASC LIMIT 50",
        [$dueBefore]
    );
    foreach ($due as $appointment) {
        $result = send_appointment_sms($appointment, $settings);
        $result['ok'] ? $stats['sent']++ : $stats['failed']++;
    }
    return $stats;
}

/** Zamanlayıcı bağlantısı için gizli anahtar (CRON_SECRET yoksa SESSION_SECRET'tan türetilir). */
function cron_secret(): string
{
    $secret = env('CRON_SECRET');
    if (strlen($secret) >= 16) {
        return $secret;
    }
    $session = session_secret();
    return $session === null ? '' : substr(hash_hmac('sha256', 'cron', $session), 0, 32);
}
