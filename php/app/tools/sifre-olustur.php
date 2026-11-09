<?php
// Kullanım: php app/tools/sifre-olustur.php 'YeniSifre'
// Çıktıdaki satırı app/.env dosyasına yapıştırın.
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
echo 'ADMIN_PASSWORD_HASH=' . password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]) . PHP_EOL;
