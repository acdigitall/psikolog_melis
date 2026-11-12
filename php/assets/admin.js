(function () {
  // Mobil yan menü
  var aside = document.getElementById('admin-aside');
  var backdrop = document.getElementById('admin-backdrop');
  function drawer(open) {
    aside.classList.toggle('-translate-x-full', !open);
    backdrop.classList.toggle('hidden', !open);
  }
  document.querySelectorAll('[data-drawer-open]').forEach(function (b) { b.addEventListener('click', function () { drawer(true); }); });
  document.querySelectorAll('[data-drawer-close]').forEach(function (b) { b.addEventListener('click', function () { drawer(false); }); });

  // Silme onayı
  document.querySelectorAll('form[data-confirm]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      if (!window.confirm(f.getAttribute('data-confirm'))) e.preventDefault();
    });
  });

  // Tekrarlanan satırlar (telefon, madde, sosyal medya...)
  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-repeater-add]');
    if (add) {
      var wrap = add.closest('[data-repeater]');
      var html = wrap.querySelector('template').innerHTML.replace(/__i__/g, Date.now());
      wrap.querySelector('[data-repeater-rows]').insertAdjacentHTML('beforeend', html);
      return;
    }
    var remove = e.target.closest('[data-repeater-remove]');
    if (remove) remove.closest('[data-repeater-row]').remove();
  });

  // Seçilen görselin önizlemesi
  document.querySelectorAll('input[type=file][data-preview]').forEach(function (input) {
    input.addEventListener('change', function () {
      var img = document.getElementById(input.getAttribute('data-preview'));
      if (img && input.files[0] && input.files[0].type.indexOf('image/') === 0) {
        img.src = URL.createObjectURL(input.files[0]);
        img.classList.remove('hidden');
      }
    });
  });

  // Randevu: başlangıç seçilince bitiş boşsa 50 dk sonrası önerilir
  var apptStart = document.querySelector('[data-appt-start]');
  var apptEnd = document.querySelector('[data-appt-end]');
  if (apptStart && apptEnd) {
    apptStart.addEventListener('change', function () {
      var m = /^(\d{2}):(\d{2})$/.exec(apptStart.value);
      if (!m || apptEnd.value) return;
      var t = Math.min(+m[1] * 60 + +m[2] + 50, 23 * 60 + 55);
      apptEnd.value = String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
    });
  }

  // SMS şablonu: canlı önizleme ve karakter/SMS sayısı
  var tpl = document.querySelector('[data-sms-template]');
  if (tpl) {
    var preview = document.querySelector('[data-sms-preview]');
    var count = document.querySelector('[data-sms-count]');
    var sample = { '{ad}': 'Ayşe', '{adsoyad}': 'Ayşe Yılmaz', '{tarih}': '12 Kasım', '{saat}': '14:00', '{psikolog}': tpl.getAttribute('data-psikolog') };
    var render = function () {
      var text = tpl.value.replace(/\{(ad|adsoyad|tarih|saat|psikolog)\}/g, function (k) { return sample[k]; }).trim();
      preview.textContent = text;
      // Türkçe karakterli SMS: tek mesaj 155, çok parçalı her parça 149 karakter (yaklaşık)
      var parts = text.length <= 155 ? 1 : Math.ceil(text.length / 149);
      count.textContent = text.length + ' karakter · ' + parts + ' SMS';
    };
    tpl.addEventListener('input', render);
    render();
  }

  // Hizmet adından adres önerisi
  var map = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' };
  var slug = document.querySelector('[data-slug-from]');
  if (slug) {
    var source = document.querySelector('[name="' + slug.getAttribute('data-slug-from') + '"]');
    var touched = slug.value !== '';
    slug.addEventListener('input', function () { touched = true; });
    source.addEventListener('input', function () {
      if (touched) return;
      slug.value = source.value.toLocaleLowerCase('tr').replace(/[çğıöşü]/g, function (c) { return map[c]; })
        .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
    });
  }
})();
