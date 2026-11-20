<?php
declare(strict_types=1);

// Tarayıcıların otomatik /favicon.ico isteğine PNG favicon'u ver.
if (parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) === '/favicon.ico') {
    header('Content-Type: image/png');
    header('Cache-Control: public, max-age=604800');
    readfile(__DIR__ . '/icon.png');
    exit;
}

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
