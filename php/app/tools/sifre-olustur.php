<?php
// Kullanım: php app/tools/sifre-olustur.php 'YeniSifre'
// Çıktıdaki satırlardan uygun olanı kullanın: app/.env dosyası ya da hosting panelindeki ortam değişkeni.
if (PHP_SAPI !== 'cli') {
    exit;
}
$password = $argv[1] ?? '';
if (strlen($password) < 10) {
    fwrite(STDERR, "Şifre en az 10 karakter olmalı.\n");
    exit(1);
}
if (strlen($password) > 72) {
    fwrite(STDERR, "Şifre en fazla 72 bayt olabilir.\n");
    exit(1);
}
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
echo "app/.env dosyası için:\n  ADMIN_PASSWORD_HASH=$hash\n\n";
echo "Hosting panelindeki ortam değişkeni için (\"$\" içermez):\n  ADMIN_PASSWORD_HASH=b64:" . base64_encode($hash) . "\n";
