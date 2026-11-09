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
