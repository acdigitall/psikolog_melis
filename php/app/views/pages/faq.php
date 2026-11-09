<?php
$meta = page_meta([
    'title' => "İzmir'de Psikolog ve Terapi Hakkında Sık Sorulan Sorular",
    'description' => "İzmir'de psikoloğa gitmek, seans süresi ve sıklığı, online terapi, gizlilik ve ilk görüşme hakkında merak edilen soruların yanıtları.",
    'path' => '/faq',
]);
echo json_ld(faq_schema(FAQS));
page_hero([
    'image' => '/images/klinik-cay.jpg',
    'title' => 'Sıkça sorulan sorular',
    'description' => 'Terapiye başlamadan önce en çok merak edilenler. Yanıtını bulamadığınız bir soru olursa bana doğrudan yazabilirsiniz.',
    'crumbs' => [['label' => 'Sorular']],
]);
?>
<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
  <div class="grid gap-14 lg:grid-cols-[1fr_2fr] lg:gap-24">
    <div data-reveal class="lg:sticky lg:top-28 lg:self-start">
      <p class="text-muted leading-relaxed max-w-xs">Başka bir sorunuz mu var?</p>
      <a href="/contact" class="link-line mt-4">Bana yazın <?= arrow_right() ?></a>
    </div>
    <div class="border-t border-line">
      <?php foreach (FAQS as $i => $f): ?>
        <details data-reveal class="group border-b border-line" <?= $i === 0 ? 'open' : '' ?>>
          <summary class="flex cursor-pointer list-none items-start justify-between gap-8 py-7 font-serif text-[clamp(1.3rem,1.15rem+0.5vw,1.6rem)] leading-snug text-forest">
            <?= e($f['q']) ?>
            <?= plus_icon('mt-1.5 h-5 w-5 shrink-0 text-olive transition-transform duration-500 group-open:rotate-45') ?>
          </summary>
          <p class="-mt-1 max-w-2xl pb-8 sm:pr-12 text-ink/75 leading-[1.75]"><?= e($f['a']) ?></p>
        </details>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php cta_band(); ?>
