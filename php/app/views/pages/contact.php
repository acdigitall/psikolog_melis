<?php
$meta = page_meta([
    'title' => 'İletişim ve Adres · Alsancak, Konak / İzmir',
    'description' => "İzmir Alsancak'taki klinik adresi, telefon, e-posta, seans saatleri ve ulaşım bilgileri. Yüz yüze ya da online randevu için ulaşın.",
    'path' => '/contact',
    'image' => '/images/klinik-detay.jpg',
]);
$settings = contact_settings();
$header = page_header('contact');
$socialLinks = parse_list($settings['socialLinks'] ?? null);
$phones = parse_list($settings['phones'] ?? null);
if (!$phones && !empty($settings['phone1'])) {
    $phones = [['label' => 'Telefon', 'value' => $settings['phone1']]];
}
$emails = parse_list($settings['emails'] ?? null);
if (!$emails && !empty($settings['email'])) {
    $emails = [['label' => 'E-posta', 'value' => $settings['email']]];
}
$map = map_embed($settings['mapIframe'] ?? '');

$row = function (string $label, string $html): void {
    echo '<div data-reveal class="grid gap-2 border-b border-line py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">'
        . '<dt class="text-sm text-muted pt-1">' . e($label) . '</dt>'
        . '<dd class="font-serif text-[1.35rem] leading-snug text-forest">' . $html . '</dd></div>';
};

page_hero([
    'background' => 'scene-cizim',
    'image' => '/images/klinik-detay.jpg',
    'title' => ($header['title'] ?? null) ?: 'İletişim',
    'description' => $header['description'] ?? null,
    'crumbs' => [['label' => 'İletişim']],
]);
?>
<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
  <div class="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
    <div>
      <dl class="border-t border-line">
        <?php
        if (!empty($settings['address'])) {
            $row('Adres', '<address class="not-italic">' . e($settings['address']) . '</address>');
        }
        $row('Ulaşım', '<span class="block text-[1.1rem] leading-relaxed font-sans text-ink/75">Alsancak İZBAN istasyonu, Alsancak vapur iskelesi ve Konak tramvay hattına yürüme mesafesinde. <a href="/izmir-psikolog" class="text-forest underline decoration-line underline-offset-4 hover:text-olive">Ulaşım ve hizmet bölgeleri</a></span>');
        foreach ($phones as $p) {
            $row((string) ($p['label'] ?? 'Telefon'), '<a href="' . e(tel_href($p['value'] ?? '')) . '" class="hover:text-olive transition-colors">' . e($p['value'] ?? '') . '</a>');
        }
        foreach ($emails as $m) {
            $row((string) ($m['label'] ?? 'E-posta'), '<a href="mailto:' . e($m['value'] ?? '') . '" class="hover:text-olive transition-colors break-all">' . e($m['value'] ?? '') . '</a>');
        }
        $row('Seans saatleri', 'Hafta içi 10:00–20:00<br>Cumartesi 10:00–16:00');
        if ($socialLinks) {
            $links = '';
            foreach ($socialLinks as $s) {
                $links .= '<a href="' . e(safe_url($s['url'] ?? '')) . '" target="_blank" rel="noopener noreferrer" class="hover:text-olive transition-colors">' . e(($s['name'] ?? '') ?: ($s['platform'] ?? '')) . '</a>';
            }
            $row('Sosyal medya', '<span class="flex flex-wrap gap-x-6 gap-y-1">' . $links . '</span>');
        }
        ?>
      </dl>
      <div data-reveal class="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
        <a href="/quote" class="btn-primary">Randevu talebi oluştur <?= arrow_right() ?></a>
        <p class="text-sm text-muted">Mesajlara genellikle 1 iş günü içinde dönüş yapılır.</p>
      </div>
    </div>

    <div data-reveal="image" class="lg:sticky lg:top-28 lg:self-start">
      <div class="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-mist lg:aspect-[4/5]">
        <?php if ($map): ?>
          <div class="absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0 [&>iframe]:grayscale-[35%]"><?= $map ?></div>
        <?php else: ?>
          <div class="flex h-full items-center justify-center text-sm text-muted">Harita eklenmedi</div>
        <?php endif; ?>
      </div>
      <p class="mt-6 text-[15px] leading-relaxed text-muted">Acil bir durumdaysanız lütfen bu sayfayı kullanmak yerine hemen <span class="text-forest">112</span>'yi arayın ya da en yakın acil servise başvurun.</p>
    </div>
  </div>
</section>
