(function () {
  var body = document.body;

  // Üst menü: kaydırınca zemin
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobil menü
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobil-menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    body.style.overflow = open ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    menu.setAttribute('aria-hidden', String(!open));
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // Sayfa geçişinde üstte ince ilerleme çizgisi
  var bar = document.getElementById('route-bar');
  if (bar) {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      var a = e.target.closest && e.target.closest('a');
      var href = a && a.getAttribute('href');
      if (a && href && href.charAt(0) === '/' && href.indexOf('/#') !== 0 && a.target !== '_blank' && href.split('?')[0] !== location.pathname) {
        bar.classList.add('is-loading');
      }
    });
    window.addEventListener('pageshow', function () { bar.classList.remove('is-loading'); });
  }

  // Form gönderilirken düğmeyi kilitle
  document.querySelectorAll('button[data-busy]').forEach(function (btn) {
    btn.form.addEventListener('submit', function () {
      btn.disabled = true;
      btn.textContent = btn.getAttribute('data-busy');
    });
  });

  // Galeri büyütme
  var box = document.getElementById('lightbox');
  if (box) {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    var img = document.getElementById('lightbox-img');
    var count = document.getElementById('lightbox-count');
    var title = document.getElementById('lightbox-title');
    var category = document.getElementById('lightbox-category');
    var active = null;

    var show = function (i) {
      active = (i + items.length) % items.length;
      var d = items[active].dataset;
      img.src = d.src;
      img.alt = d.alt;
      title.textContent = d.title;
      category.textContent = d.category;
      count.textContent = (active + 1) + ' / ' + items.length;
      box.classList.remove('hidden');
      box.classList.add('flex');
      body.style.overflow = 'hidden';
    };
    var close = function () {
      active = null;
      box.classList.add('hidden');
      box.classList.remove('flex');
      body.style.overflow = '';
    };

    items.forEach(function (el, i) { el.addEventListener('click', function () { show(i); }); });
    box.addEventListener('click', function (e) {
      if (e.target.closest('[data-lightbox-prev]')) return show(active - 1);
      if (e.target.closest('[data-lightbox-next]')) return show(active + 1);
      if (e.target !== img) close();
    });
    window.addEventListener('keydown', function (e) {
      if (active === null) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(active + 1);
      else if (e.key === 'ArrowLeft') show(active - 1);
    });
  }
})();
