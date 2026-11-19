<?php
$meta = page_meta([
    'title' => 'Telefonda Ön Görüşme Talebi · İzmir Psikolog',
    'description' => 'Terapiye başlamadan önce kısa bir telefon görüşmesiyle sorularınızı sorun. Numaranızı bırakın, size uygun zamanda arayayım.',
    'path' => '/on-gorusme',
]);

$formError = null;
$values = ['name' => '', 'phone' => '', 'callTime' => 'Fark etmez', 'message' => '', 'consent' => false];

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    foreach (['name', 'phone', 'callTime', 'message'] as $k) {
        $values[$k] = is_string($_POST[$k] ?? null) ? $_POST[$k] : '';
    }
    $values['consent'] = !empty($_POST['consent']);
    $formError = same_origin() ? submit_precall($values) : 'Bir sorun oluştu. Lütfen sayfayı yenileyip tekrar deneyin.';
    if ($formError === null) {
        redirect('/on-gorusme?gonderildi=1');
    }
}
$sent = isset($_GET['gonderildi']);

$field = 'peer w-full border-0 border-b border-forest/25 bg-transparent px-0 pb-3 pt-2 text-[1.05rem] text-ink placeholder:text-ink/35 focus:border-forest focus:outline-none focus:ring-0 transition-colors';
$label = 'block text-sm text-muted';

page_hero([
    'image' => '/images/klinik-cay.jpg',
    'title' => 'Telefonda ön görüşme',
    'description' => 'Terapiye başlamadan önce aklınızdaki soruları konuşmak için numaranızı bırakın; size uygun zamanda kısa bir görüşme için arayayım.',
    'crumbs' => [['label' => 'Ön görüşme']],
]);
?>
<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
  <div class="grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
    <form method="post" action="/on-gorusme" class="space-y-12" novalidate>
      <?php if ($sent): ?>
        <p role="status" class="border-l-2 pl-5 py-1 text-[15px] border-olive text-forest">Teşekkürler, talebiniz bana ulaştı. Belirttiğiniz zaman aralığında sizi arayacağım.</p>
      <?php elseif ($formError): ?>
        <p role="status" class="border-l-2 pl-5 py-1 text-[15px] border-red-700 text-red-800"><?= e($formError) ?></p>
      <?php endif; ?>

      <div class="grid gap-10 md:grid-cols-2">
        <label class="block">
          <span class="<?= $label ?>">Ad soyad</span>
          <input type="text" name="name" required autocomplete="name" value="<?= e($values['name']) ?>" class="<?= $field ?>">
        </label>
        <label class="block">
          <span class="<?= $label ?>">Telefon</span>
          <input type="tel" name="phone" required autocomplete="tel" inputmode="tel" data-phone value="<?= e($values['phone']) ?>" class="<?= $field ?>" placeholder="05xx xxx xx xx">
        </label>
      </div>

      <fieldset>
        <legend class="<?= $label ?>">Sizi ne zaman arayayım?</legend>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <?php foreach (PRECALL_TIMES as $t): ?>
            <label class="flex cursor-pointer items-center justify-center rounded-full border border-forest/25 px-6 py-3.5 font-medium text-forest transition-colors duration-300 hover:border-forest/60 has-[:checked]:border-forest has-[:checked]:bg-forest has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-olive">
              <input type="radio" name="callTime" value="<?= e($t) ?>" <?= $t === $values['callTime'] ? 'checked' : '' ?> class="sr-only">
              <?= e($t) ?>
            </label>
          <?php endforeach; ?>
        </div>
      </fieldset>

      <label class="block">
        <span class="<?= $label ?>">Not (isteğe bağlı)</span>
        <textarea name="message" rows="3" class="<?= $field ?> resize-y" placeholder="ör. Saat 18:00'den sonra daha uygunum."><?= e($values['message']) ?></textarea>
      </label>

      <label class="flex items-start gap-3 text-[15px] text-muted">
        <input type="checkbox" name="consent" value="1" <?= $values['consent'] ? 'checked' : '' ?> class="mt-1 h-4 w-4 accent-[#21492C]">
        <span>Kişisel verilerimin ön görüşme için benimle iletişime geçilmesi amacıyla işlenmesine ilişkin <a href="/kvkk" class="text-forest underline underline-offset-4 decoration-forest/30 hover:decoration-forest">aydınlatma metnini</a> okudum.</span>
      </label>

      <button type="submit" data-busy="Gönderiliyor…" class="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed">Beni arayın <?= arrow_right() ?></button>
    </form>

    <aside class="lg:sticky lg:top-28 lg:self-start">
      <h2 class="h-sub">Ön görüşmede neler konuşuruz?</h2>
      <ol class="mt-8 border-t border-line">
        <?php foreach (['Kısaca sizi neyin getirdiğini ve terapiden beklentinizi.', 'Size uygun olabilecek yaklaşımı ve seans biçimini (yüz yüze ya da online).', 'Seans ücreti, süresi ve uygun gün-saatler gibi merak ettiklerinizi.'] as $i => $t): ?>
          <li class="grid grid-cols-[2.5rem_1fr] border-b border-line py-5 text-[15px] leading-relaxed text-ink/80">
            <span class="font-serif italic text-clay"><?= $i + 1 ?>.</span>
            <?= e($t) ?>
          </li>
        <?php endforeach; ?>
      </ol>
      <p class="mt-8 text-sm leading-relaxed text-muted">Doğrudan randevu almak isterseniz <a href="/quote" class="text-forest underline underline-offset-4 decoration-forest/30 hover:decoration-forest">randevu talebi</a> formunu kullanabilirsiniz. Acil durumlarda hemen 112'yi arayın.</p>
    </aside>
  </div>
</section>
