<?php
$meta = page_meta([
    'title' => 'Randevu Al · İzmir Psikolog (Yüz Yüze & Online)',
    'description' => "İzmir Alsancak'taki klinikte yüz yüze ya da online terapi için randevu talebi oluşturun. Genellikle 1 iş günü içinde dönüş yapılır.",
    'path' => '/quote',
]);

$preset = clean_input($_GET['service'] ?? '', 120);
$names = service_titles() ? [...service_titles(), 'Henüz emin değilim'] : DEFAULT_CATEGORIES;
$options = ($preset !== '' && !in_array($preset, $names, true)) ? [$preset, ...$names] : $names;

$formError = null;
$values = ['name' => '', 'email' => '', 'phone' => '', 'service' => $preset ?: ($options[0] ?? ''), 'message' => '', 'sessionType' => SESSION_TYPES[0]['value'], 'consent' => false];

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    foreach (['name', 'email', 'phone', 'service', 'message', 'sessionType'] as $k) {
        $values[$k] = is_string($_POST[$k] ?? null) ? $_POST[$k] : '';
    }
    $values['consent'] = !empty($_POST['consent']);
    $formError = same_origin() ? submit_quote($values) : 'Bir sorun oluştu. Lütfen sayfayı yenileyip tekrar deneyin.';
    if ($formError === null) {
        redirect('/quote?gonderildi=1');
    }
}
$sent = isset($_GET['gonderildi']);

$field = 'peer w-full border-0 border-b border-forest/25 bg-transparent px-0 pb-3 pt-2 text-[1.05rem] text-ink placeholder:text-ink/35 focus:border-forest focus:outline-none focus:ring-0 transition-colors';
$label = 'block text-sm text-muted';

page_hero([
    'image' => '/images/klinik-oturma.jpg',
    'title' => 'Randevu talebi',
    'description' => 'Formu doldurun; size uygun gün ve saatleri konuşmak için en kısa sürede dönüş yapayım. Bilgileriniz gizli tutulur.',
    'crumbs' => [['label' => 'Randevu']],
]);
?>
<section class="mx-auto max-w-[1240px] px-6 py-16 md:py-24 lg:py-28 lg:px-10">
  <div class="grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
    <form method="post" action="/quote" class="space-y-12" novalidate>
      <?php if ($sent): ?>
        <p role="status" class="border-l-2 pl-5 py-1 text-[15px] border-olive text-forest">Teşekkürler, talebiniz bana ulaştı. En kısa sürede uygun saatlerle size dönüş yapacağım.</p>
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
          <input type="tel" name="phone" required autocomplete="tel" value="<?= e($values['phone']) ?>" class="<?= $field ?>" placeholder="05xx xxx xx xx">
        </label>
        <label class="block">
          <span class="<?= $label ?>">E-posta</span>
          <input type="email" name="email" required autocomplete="email" value="<?= e($values['email']) ?>" class="<?= $field ?>">
        </label>
        <label class="block">
          <span class="<?= $label ?>">Destek almak istediğiniz alan</span>
          <select name="service" class="<?= $field ?> cursor-pointer">
            <?php foreach ($options as $c): ?>
              <option value="<?= e($c) ?>" <?= $c === $values['service'] ? 'selected' : '' ?>><?= e($c) ?></option>
            <?php endforeach; ?>
          </select>
        </label>
      </div>

      <fieldset>
        <legend class="<?= $label ?>">Seans tercihi</legend>
        <div class="mt-4 flex flex-col gap-3 sm:flex-row">
          <?php foreach (SESSION_TYPES as $t): ?>
            <label class="group flex flex-1 cursor-pointer items-center justify-between gap-4 rounded-full border border-forest/25 px-6 py-3.5 text-forest transition-colors duration-300 hover:border-forest/60 has-[:checked]:border-forest has-[:checked]:bg-forest has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-olive">
              <input type="radio" name="sessionType" value="<?= e($t['value']) ?>" <?= $t['value'] === $values['sessionType'] ? 'checked' : '' ?> class="sr-only">
              <span class="font-medium"><?= e($t['title']) ?></span>
              <span class="text-sm text-muted group-has-[:checked]:text-paper/70"><?= e($t['desc']) ?></span>
            </label>
          <?php endforeach; ?>
        </div>
      </fieldset>

      <label class="block">
        <span class="<?= $label ?>">Kısaca sizi neyin getirdiği ve uygun saatleriniz (isteğe bağlı)</span>
        <textarea name="message" rows="4" class="<?= $field ?> resize-y" placeholder="Ayrıntıya girmek zorunda değilsiniz; birkaç cümle yeterli."><?= e($values['message']) ?></textarea>
      </label>

      <label class="flex items-start gap-3 text-[15px] text-muted">
        <input type="checkbox" name="consent" value="1" <?= $values['consent'] ? 'checked' : '' ?> class="mt-1 h-4 w-4 accent-[#21492C]">
        <span>Kişisel verilerimin randevu planlaması amacıyla işlenmesine ilişkin <a href="/kvkk" class="text-forest underline underline-offset-4 decoration-forest/30 hover:decoration-forest">aydınlatma metnini</a> okudum.</span>
      </label>

      <button type="submit" data-busy="Gönderiliyor…" class="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed">Talebi gönder <?= arrow_right() ?></button>
    </form>

    <aside class="lg:sticky lg:top-28 lg:self-start">
      <h2 class="h-sub">Sonra ne olacak?</h2>
      <ol class="mt-8 border-t border-line">
        <?php foreach (['Talebiniz bana ulaşır; genellikle 1 iş günü içinde dönüş yaparım.', 'Kısa bir telefon görüşmesiyle ihtiyacınızı ve uygun saatleri konuşuruz.', 'İlk seansımızı yüz yüze ya da online olarak planlarız.'] as $i => $t): ?>
          <li class="grid grid-cols-[2.5rem_1fr] border-b border-line py-5 text-[15px] leading-relaxed text-ink/80">
            <span class="font-serif italic text-olive"><?= $i + 1 ?>.</span>
            <?= e($t) ?>
          </li>
        <?php endforeach; ?>
      </ol>
      <p class="mt-8 text-sm leading-relaxed text-muted">Bu form acil durumlar için uygun değildir. Kendinize ya da bir başkasına zarar verme riski varsa hemen 112'yi arayın.</p>
    </aside>
  </div>
</section>
