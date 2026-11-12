(function () {
  var el = document.getElementById('calendar');
  if (!el || !window.FullCalendar) return;

  // Saatler sunucudan İstanbul yerel saati olarak gelir; takvim bunları olduğu gibi gösterir.
  var offset = parseInt(el.getAttribute('data-offset'), 10) || 0;
  var csrf = el.getAttribute('data-csrf');
  var mobile = window.matchMedia('(max-width: 767px)').matches;
  var MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  var DAYS_SHORT = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  function pad(n) { return String(n).padStart(2, '0'); }
  function ymd(d) { return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }
  function hm(d) { return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()); }
  function nowLocal() { return new Date(Date.now() + offset * 60000).toISOString().slice(0, 19); }
  function node(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- Bildirim ---------- */
  var toastEl = document.getElementById('cal-toast');
  var toastTimer;
  function toast(text, isError) {
    toastEl.textContent = text;
    toastEl.className = 'cal-toast is-open' + (isError ? ' is-error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.className = 'cal-toast'; }, 2600);
  }

  /* ---------- Detay penceresi ---------- */
  var dialog = document.getElementById('appt-dialog');
  function field(name) { return dialog.querySelector('[data-f="' + name + '"]'); }
  dialog.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { dialog.close(); }); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });

  function openDetails(event) {
    var p = event.extendedProps;
    var end = event.end || event.start;
    var initials = event.title.trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toLocaleUpperCase('tr'); }).join('');
    field('initials').textContent = initials;
    field('name').textContent = event.title;
    field('when').textContent = event.start.getUTCDate() + ' ' + MONTHS[event.start.getUTCMonth()] + ' ' + DAYS[event.start.getUTCDay()] + ' · ' + hm(event.start) + ' – ' + hm(end);
    field('status').textContent = p.status;
    field('status').className = 'chip chip--' + (p.status === 'İptal' ? 'cancelled' : p.status === 'Gerçekleşti' ? 'done' : 'planned');
    field('sms').textContent = p.smsLabel;
    field('sms').className = 'chip chip--sms-' + p.smsKey;
    field('phone').textContent = p.phone;
    field('tel').href = 'tel:' + p.tel;
    field('wa').hidden = !p.wa;
    if (p.wa) field('wa').href = 'https://wa.me/' + p.wa;
    field('noteWrap').hidden = !p.note;
    field('note').textContent = p.note;
    field('edit').href = '/admin/calendar/' + event.id;
    dialog.showModal();
  }

  /* ---------- Sürükle-bırak kaydı ---------- */
  function saveMove(info) {
    var e = info.event;
    var body = new FormData();
    body.append('_csrf', csrf);
    body.append('start', ymd(e.start) + 'T' + hm(e.start));
    body.append('end', ymd(e.end || e.start) + 'T' + hm(e.end || e.start));
    fetch('/admin/calendar/' + e.id + '/move', { method: 'POST', body: body, credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (!json.ok) throw new Error(json.error || 'Kaydedilemedi.');
        toast(e.title + ' · ' + e.start.getUTCDate() + ' ' + MONTHS[e.start.getUTCMonth()] + ' ' + hm(e.start) + ' olarak güncellendi');
        calendar.refetchEvents();
      })
      .catch(function (err) {
        info.revert();
        toast(err && err.message && err.message.indexOf('JSON') === -1 ? err.message : 'Kaydedilemedi. Sayfayı yenileyip tekrar deneyin.', true);
      });
  }

  // Takvim, ekrana kaydırıldığında pencereye tam sığacak yükseklikte olur (dizüstülerde çift kaydırma olmasın).
  function fitHeight() { return Math.max(460, Math.min(860, window.innerHeight - 48)); }

  var time = { hour: '2-digit', minute: '2-digit', hour12: false };
  var calendar = new FullCalendar.Calendar(el, {
    locale: 'tr',
    timeZone: 'UTC',
    now: nowLocal,
    initialView: mobile ? 'listWeek' : 'timeGridWeek',
    initialDate: el.getAttribute('data-date') || undefined,
    firstDay: 1,
    height: mobile ? 'auto' : fitHeight(),
    windowResize: function () { if (!mobile) calendar.setOption('height', fitHeight()); },
    headerToolbar: mobile
      ? { left: 'prev,next', center: 'title', right: 'today' }
      : { left: 'prev,next today', center: 'title', right: 'timeGridWeek,timeGridDay,dayGridMonth,listWeek' },
    footerToolbar: mobile ? { center: 'listWeek,timeGridDay,dayGridMonth' } : false,
    buttonText: { today: 'Bugün', month: 'Ay', week: 'Hafta', day: 'Gün', list: 'Ajanda' },
    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
    views: {
      dayGridMonth: { titleFormat: { year: 'numeric', month: 'long' }, dayMaxEvents: 3 },
    },
    noEventsText: 'Bu aralıkta randevu yok',
    moreLinkText: function (n) { return '+' + n + ' randevu'; },
    allDaySlot: false,
    nowIndicator: true,
    slotMinTime: '07:00:00',
    slotMaxTime: '23:00:00',
    scrollTime: '08:30:00',
    slotDuration: '00:30:00',
    snapDuration: '00:05:00',
    slotLabelInterval: '01:00',
    slotLabelFormat: time,
    eventTimeFormat: time,
    businessHours: [
      { daysOfWeek: [1, 2, 3, 4, 5], startTime: '10:00', endTime: '20:00' },
      { daysOfWeek: [6], startTime: '10:00', endTime: '16:00' },
    ],
    navLinks: true,
    selectable: true,
    selectMirror: true,
    editable: true,
    eventOverlap: true,
    longPressDelay: 350,
    events: {
      url: '/admin/calendar/events',
      failure: function () { toast('Randevular yüklenemedi.', true); },
    },

    dayHeaderContent: function (arg) {
      if (arg.view.type.indexOf('list') === 0) return true;
      if (arg.view.type.indexOf('timeGrid') !== 0) return DAYS_SHORT[arg.date.getUTCDay()];
      var wrap = node('span', 'cal-dayhead');
      wrap.appendChild(node('span', 'cal-dow', DAYS_SHORT[arg.date.getUTCDay()]));
      wrap.appendChild(node('span', 'cal-dom', arg.date.getUTCDate()));
      return { domNodes: [wrap] };
    },

    eventContent: function (arg) {
      if (arg.view.type.indexOf('timeGrid') !== 0) return true;
      var e = arg.event;
      var wrap = node('div', 'appt-body');
      var end = e.end || e.start;
      if (end - e.start <= 35 * 60000) wrap.className += ' appt-body--short';
      var timeEl = node('div', 'appt-time', hm(e.start));
      timeEl.appendChild(node('span', 'appt-time-end', '–' + hm(end)));
      wrap.appendChild(timeEl);
      var name = node('div', 'appt-name');
      if (!arg.isMirror && e.extendedProps.smsKey) {
        var dot = node('span', 'sms-dot sms-dot--' + e.extendedProps.smsKey);
        dot.title = e.extendedProps.smsLabel;
        name.appendChild(dot);
      }
      name.appendChild(node('span', 'appt-name-text', arg.isMirror ? 'Yeni randevu' : e.title));
      wrap.appendChild(name);
      if (e.extendedProps.note) wrap.appendChild(node('div', 'appt-notetext', e.extendedProps.note));
      return { domNodes: [wrap] };
    },

    select: function (info) {
      var url = '/admin/calendar/new?date=' + ymd(info.start);
      if (!info.allDay) url += '&start=' + hm(info.start) + '&end=' + hm(info.end);
      window.location.href = url;
    },
    eventClick: function (info) {
      info.jsEvent.preventDefault();
      openDetails(info.event);
    },
    eventDrop: saveMove,
    eventResize: saveMove,
  });
  calendar.render();
})();
