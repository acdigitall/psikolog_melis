<?php
declare(strict_types=1);

// Yerel geliştirme (php -S): gerçek statik dosyaları sunucuya bırak.
if (PHP_SAPI === 'cli-server') {
    $staticPath = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    if ($staticPath !== '/' && !preg_match('#^/(app|uploads|api|\.)#', $staticPath) && is_file(__DIR__ . $staticPath)) {
        return false;
    }
}

require __DIR__ . '/app/bootstrap.php';
require APP_DIR . '/router.php';

route_request();
