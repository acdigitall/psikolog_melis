<?php
$meta = page_meta(['title' => 'Sayfa bulunamadı', 'description' => 'Aradığınız sayfa bulunamadı.', 'path' => current_path()]) + ['noindex' => true];
?>
<section class="mx-auto max-w-[1240px] px-6 py-24 md:py-32 lg:px-10">
  <p class="kicker mb-6">404</p>
  <h1 class="display max-w-[16ch]">Aradığınız sayfa bulunamadı</h1>
  <p class="lead mt-7 max-w-xl">Sayfa taşınmış ya da kaldırılmış olabilir.</p>
  <a href="/" class="btn-primary mt-10">Anasayfaya dön <?= arrow_right() ?></a>
</section>
