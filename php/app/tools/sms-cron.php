<?php
declare(strict_types=1);

/**
 * Seans sonrası SMS zamanlayıcısı. Hostinger > Cron İşleri'ne her 5 dakikada bir eklenir:
 *   php /home/KULLANICI/public_html/app/tools/sms-cron.php
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require dirname(__DIR__) . '/bootstrap.php';

// Aynı anda iki kopya çalışmasın.
$lockDir = STORAGE_DIR;
if (!is_dir($lockDir)) {
    @mkdir($lockDir, 0755, true);
}
$lock = @fopen($lockDir . '/sms-cron.lock', 'c');
if ($lock && !flock($lock, LOCK_EX | LOCK_NB)) {
    echo "Başka bir kopya çalışıyor.\n";
    exit(0);
}

try {
    $stats = dispatch_due_sms();
    printf("[%s] gönderildi=%d hata=%d atlandı=%d%s\n", gmdate('c'), $stats['sent'], $stats['failed'], $stats['skipped'], isset($stats['note']) ? ' · ' . $stats['note'] : '');
    exit($stats['failed'] > 0 ? 1 : 0);
} catch (Throwable $e) {
    error_log('[psikolog] sms-cron: ' . $e->getMessage());
    fwrite(STDERR, 'Hata: ' . $e->getMessage() . "\n");
    exit(2);
}
