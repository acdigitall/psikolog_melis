<?php
declare(strict_types=1);

function current_path(): string
{
    static $path = null;
    if ($path === null) {
        $path = rawurldecode((string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH));
    }
    return $path;
}

function send_security_headers(): void
{
    header_remove('X-Powered-By');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()');
    if (is_https()) {
        header('Strict-Transport-Security: max-age=63072000; includeSubDomains');
    }
}

function not_found(): never
{
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    render('404', [], [], 404);
    exit;
}

function route_request(): void
{
    send_security_headers();
    $path = current_path();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($path !== '/' && str_ends_with($path, '/')) {
        $query = $_SERVER['QUERY_STRING'] ?? '';
        redirect(rtrim($path, '/') . ($query !== '' ? "?$query" : ''), 308);
    }

    if (preg_match('#^/(?:api/)?uploads/([^/]+)$#', $path, $m)) {
        serve_upload($m[1]);
        return;
    }

    if ($path === '/cron/sms') {
        send_cron_sms();
        return;
    }

    if ($path === '/admin' || str_starts_with($path, '/admin/')) {
        require APP_DIR . '/admin.php';
        admin_route($path, $method);
        return;
    }

    if ($method !== 'GET' && $method !== 'HEAD' && !($method === 'POST' && $path === '/quote')) {
        http_response_code(405);
        header('Allow: GET, HEAD');
        return;
    }

    $pages = [
        '/' => 'home',
        '/about' => 'about',
        '/services' => 'services',
        '/production' => 'production',
        '/gallery' => 'gallery',
        '/blog' => 'blog',
        '/faq' => 'faq',
        '/contact' => 'contact',
        '/quote' => 'quote',
        '/izmir-psikolog' => 'izmir',
        '/kvkk' => 'kvkk',
        '/privacy' => 'privacy',
        '/terms' => 'terms',
    ];

    if (isset($pages[$path])) {
        render($pages[$path]);
        return;
    }
    if (preg_match('#^/services/([^/]+)$#', $path, $m)) {
        render('service', ['slug' => $m[1]]);
        return;
    }
    if (preg_match('#^/blog/([^/]+)$#', $path, $m)) {
        render('post', ['slug' => $m[1]]);
        return;
    }

    switch ($path) {
        case '/robots.txt':
            send_robots();
            return;
        case '/sitemap.xml':
            send_sitemap();
            return;
        case '/llms.txt':
            send_llms();
            return;
    }

    not_found();
}

/** Komut çalıştıramayan zamanlayıcılar için: /cron/sms?key=GİZLİ_ANAHTAR */
function send_cron_sms(): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex, nofollow');
    $secret = cron_secret();
    $key = is_string($_GET['key'] ?? null) ? $_GET['key'] : '';
    if ($secret === '' || !hash_equals($secret, $key)) {
        http_response_code(404);
        echo '{"error":"not found"}';
        return;
    }
    try {
        echo json_encode(dispatch_due_sms(), JSON_UNESCAPED_UNICODE);
    } catch (Throwable $e) {
        error_log('[psikolog] cron: ' . $e->getMessage());
        http_response_code(500);
        echo '{"error":"internal"}';
    }
}

function send_robots(): void
{
    header('Content-Type: text/plain; charset=utf-8');
    $bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'YandexBot'];
    $out = "User-Agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\n\n";
    foreach ($bots as $bot) {
        $out .= "User-Agent: $bot\n";
    }
    $out .= "Allow: /\nDisallow: /admin\nDisallow: /admin/\n\n";
    $out .= 'Host: ' . site_url() . "\nSitemap: " . site_url() . "/sitemap.xml\n";
    echo $out;
}

function send_sitemap(): void
{
    header('Content-Type: application/xml; charset=utf-8');
    $now = gmdate('Y-m-d\TH:i:s\Z');
    $routes = [
        ['', 'weekly', '1.0'], ['/izmir-psikolog', 'monthly', '0.9'], ['/about', 'monthly', '0.8'],
        ['/services', 'weekly', '0.9'], ['/blog', 'daily', '0.8'], ['/contact', 'monthly', '0.7'],
        ['/faq', 'monthly', '0.6'], ['/gallery', 'weekly', '0.6'], ['/quote', 'monthly', '0.6'],
        ['/production', 'monthly', '0.6'], ['/kvkk', 'yearly', '0.4'], ['/privacy', 'yearly', '0.4'], ['/terms', 'yearly', '0.4'],
    ];
    $base = site_url();
    $entry = fn ($loc, $mod, $freq, $prio) => '<url><loc>' . e($loc) . "</loc><lastmod>$mod</lastmod><changefreq>$freq</changefreq><priority>$prio</priority></url>\n";

    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($routes as [$path, $freq, $prio]) {
        echo $entry($base . $path, $now, $freq, $prio);
    }
    foreach (services() as $s) {
        echo $entry("$base/services/{$s['slug']}", iso_date($s['createdAt']), 'monthly', '0.8');
    }
    foreach (published_posts() as $p) {
        echo $entry("$base/blog/{$p['slug']}", iso_date($p['createdAt']), 'monthly', '0.6');
    }
    echo '</urlset>';
}

function send_llms(): void
{
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: public, max-age=3600');
    $url = site_url();
    $c = contact_settings();
    $lines = [
        '# ' . SITE_NAME . ' · İzmir',
        '',
        '> ' . DEFAULT_DESCRIPTION,
        '',
        PSYCHOLOGIST_NAME . ' (' . JOB_TITLE . "), İzmir'in Konak ilçesindeki Alsancak semtinde yetişkinlerle bireysel terapi ve çiftlerle ilişki terapisi yapar. Yüz yüze seansların yanı sıra Türkiye ve yurt dışından online (görüntülü) seanslar da sunulur. Kullanılan yöntemler: Bilişsel Davranışçı Terapi (BDT), Şema Terapi ve EMDR.",
        '',
        '## Temel bilgiler',
        '',
    ];
    if (!empty($c['address'])) {
        $lines[] = '- Adres: ' . $c['address'];
    }
    if (!empty($c['phone1'])) {
        $lines[] = '- Telefon: ' . $c['phone1'];
    }
    if (!empty($c['email'])) {
        $lines[] = '- E-posta: ' . $c['email'];
    }
    array_push(
        $lines,
        '- Seans saatleri: Pazartesi–Cuma 10:00–20:00, Cumartesi 10:00–16:00, Pazar kapalı',
        '- Seans süresi: bireysel 50 dakika, çift seansı 60–75 dakika',
        '- Seans biçimi: yüz yüze (Alsancak, İzmir) ve online',
        '- Yüz yüze hizmet verilen ilçeler: ' . implode(', ', IZMIR_DISTRICTS),
        '- Ulaşım: Alsancak İZBAN istasyonu, Alsancak vapur iskelesi, Konak metro ve tramvay hattı',
        "- Randevu: $url/quote",
        '',
        '## Hizmetler',
        ''
    );
    foreach (services() as $s) {
        $lines[] = "- [{$s['title']}]($url/services/{$s['slug']}): {$s['desc']}";
    }
    array_push(
        $lines,
        '',
        '## Önemli sayfalar',
        '',
        "- [İzmir psikolog · konum ve ulaşım]($url/izmir-psikolog)",
        "- [Hakkımda]($url/about)",
        "- [Terapi süreci]($url/production)",
        "- [Sıkça sorulan sorular]($url/faq)",
        "- [İletişim]($url/contact)",
        '',
        '## Sıkça sorulan sorular',
        ''
    );
    foreach (FAQS as $f) {
        array_push($lines, '### ' . $f['q'], '', $f['a'], '');
    }
    array_push($lines, '## Yazılar', '');
    foreach (published_posts() as $p) {
        $lines[] = "- [{$p['title']}]($url/blog/{$p['slug']}): {$p['excerpt']}";
    }
    array_push($lines, '', '## Not', '', 'Acil durumlarda 112 aranmalıdır; bu site kriz hizmeti sunmaz.', '');
    echo implode("\n", $lines);
}
