<?php
declare(strict_types=1);

/* ---------- Takvim (randevular) ---------- */

const TR_MONTHS_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

function sms_status_badge(array $a): string
{
    [$key, $label] = sms_status_info($a);
    $tone = ['sent' => 'bg-green-100 text-green-800', 'error' => 'bg-red-100 text-red-700', 'sending' => 'bg-sky-100 text-sky-800', 'off' => 'bg-stone-100 text-stone-500'][$key] ?? 'bg-amber-100 text-amber-800';
    return '<span class="inline-block px-2 py-0.5 text-[11px] font-bold rounded ' . $tone . '">' . e($label) . '</span>';
}

function admin_calendar(array $segments, string $method): void
{
    try {
        crm_ensure_schema();
    } catch (Throwable $e) {
        error_log('[psikolog] ' . $e->getMessage());
        admin_shell('Takvim', '/admin/calendar', fn () => print(admin_alert('error', 'Takvim tabloları oluşturulamadı. Veritabanı bağlantısını kontrol edin.')));
        return;
    }

    $rest = array_slice($segments, 1);
    if (!$rest) {
        admin_calendar_page();
        return;
    }
    if ($rest === ['events'] && $method !== 'POST') {
        admin_calendar_events();
        return;
    }
    if ($rest === ['new']) {
        admin_appointment_form(null, $method);
        return;
    }
    if (!ctype_digit($rest[0])) {
        not_found();
    }
    $appointment = db_one('SELECT * FROM `Appointment` WHERE id = ?', [(int) $rest[0]]);
    if (!$appointment) {
        not_found();
    }
    $id = (int) $appointment['id'];
    $week = '?week=' . utc_to_local($appointment['startAt'])->format('Y-m-d');

    if (count($rest) === 2 && $method === 'POST') {
        if ($rest[1] === 'move') {
            admin_calendar_move($appointment);
            return;
        }
        if ($rest[1] === 'delete') {
            safe(fn () => db_run('DELETE FROM `Appointment` WHERE id = ?', [$id]));
            redirect('/admin/calendar' . $week . '&m=deleted');
        }
        if ($rest[1] === 'send-sms') {
            $settings = sms_settings();
            $error = sms_config_error($settings);
            if ($error === null) {
                $result = send_appointment_sms($appointment, $settings);
                redirect("/admin/calendar/$id?m=" . ($result['ok'] ? 'sms-sent' : 'sms-failed'));
            }
            redirect("/admin/calendar/$id?m=sms-config");
        }
        not_found();
    }
    if (count($rest) !== 1) {
        not_found();
    }
    admin_appointment_form($appointment, $method);
}

/** Takvim ve listelerde kullanılan SMS durumu: [anahtar, etiket]. */
function sms_status_info(array $a): array
{
    if (!$a['smsEnabled'] || $a['status'] === 'İptal') {
        return ['off', 'SMS yok'];
    }
    return match ($a['smsStatus']) {
        'Gönderildi' => ['sent', 'SMS gönderildi'],
        'Hata' => ['error', 'SMS hatası'],
        'Gönderiliyor' => ['sending', 'SMS gönderiliyor'],
        'Atlandı' => ['off', 'SMS atlandı'],
        'Kapalı' => ['off', 'SMS yok'],
        default => ['pending', 'SMS bekliyor'],
    };
}

/** FullCalendar için randevular (saatler İstanbul yerel saati olarak, saat dilimi eki olmadan). */
function admin_calendar_events(): void
{
    header('Content-Type: application/json; charset=utf-8');
    $from = local_to_utc(substr((string) ($_GET['start'] ?? ''), 0, 10), '00:00');
    $to = local_to_utc(substr((string) ($_GET['end'] ?? ''), 0, 10), '00:00');
    if ($from === null || $to === null) {
        echo '[]';
        return;
    }
    $rows = safe(fn () => db_all('SELECT * FROM `Appointment` WHERE startAt < ? AND endAt > ? ORDER BY startAt ASC LIMIT 2000', [$to, $from]), []);
    $classes = ['Planlandı' => 'appt--planned', 'Gerçekleşti' => 'appt--done', 'İptal' => 'appt--cancelled'];
    $events = array_map(function (array $a) use ($classes) {
        [$smsKey, $smsLabel] = sms_status_info($a);
        $mobile = normalize_tr_mobile($a['phone']);
        return [
            'id' => (string) $a['id'],
            'title' => $a['clientName'],
            'start' => utc_to_local($a['startAt'])->format('Y-m-d\TH:i:s'),
            'end' => utc_to_local($a['endAt'])->format('Y-m-d\TH:i:s'),
            'classNames' => ['appt', $classes[$a['status']] ?? 'appt--planned'],
            'extendedProps' => [
                'phone' => $mobile ? format_tr_mobile($mobile) : $a['phone'],
                'tel' => $mobile ? '+' . $mobile : $a['phone'],
                'wa' => $mobile,
                'note' => (string) ($a['note'] ?? ''),
                'status' => $a['status'],
                'smsKey' => $smsKey,
                'smsLabel' => $smsLabel,
            ],
        ];
    }, $rows);
    echo json_encode($events, JSON_UNESCAPED_UNICODE);
}

/** Takvimde sürükle-bırak / yeniden boyutlandırma ile saat değişikliği. */
function admin_calendar_move(array $appointment): void
{
    header('Content-Type: application/json; charset=utf-8');
    $parse = fn (mixed $v) => is_string($v) && preg_match('/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/', $v, $m) ? local_to_utc($m[1], $m[2]) : null;
    $start = $parse($_POST['start'] ?? null);
    $end = $parse($_POST['end'] ?? null);
    $fail = function (string $message): void {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => $message], JSON_UNESCAPED_UNICODE);
    };
    if ($start === null || $end === null || $end <= $start) {
        $fail('Geçersiz saat aralığı.');
        return;
    }
    if (strtotime($end) - strtotime($start) > 12 * 3600) {
        $fail('Randevu 12 saatten uzun olamaz.');
        return;
    }
    $save = ['startAt' => $start, 'endAt' => $end, 'updatedAt' => now_sql()];
    // Gönderilmiş SMS tekrar gönderilmez; diğerlerinde zamanlama yeni bitiş saatine göre işler.
    if ($appointment['smsStatus'] !== 'Gönderildi') {
        $save['smsStatus'] = ($appointment['smsEnabled'] && $appointment['status'] !== 'İptal') ? 'Bekliyor' : 'Kapalı';
        $save['smsAttempts'] = 0;
        $save['smsError'] = null;
    }
    try {
        db_update('Appointment', (int) $appointment['id'], $save);
        echo '{"ok":true}';
    } catch (PDOException $e) {
        error_log('[psikolog] ' . $e->getMessage());
        http_response_code(500);
        echo '{"ok":false,"error":"Kaydedilemedi."}';
    }
}

function admin_calendar_page(): void
{
    $tz = local_tz();
    $utc = new DateTimeZone('UTC');
    $now = new DateTimeImmutable('now', $tz);
    $sql = fn (DateTimeImmutable $d) => $d->setTimezone($utc)->format('Y-m-d H:i:s');
    $today = $now->setTime(0, 0);
    $tomorrow = $today->modify('+1 day');
    $monday = $today->modify('-' . ((int) $today->format('N') - 1) . ' days');
    $monthStart = $today->modify('first day of this month');

    $count = fn (DateTimeImmutable $from, DateTimeImmutable $to) => (int) safe(fn () => db_value(
        "SELECT COUNT(*) FROM `Appointment` WHERE status <> 'İptal' AND startAt >= ? AND startAt < ?",
        [$sql($from), $sql($to)]
    ), 0);
    $stats = [
        ['Bugün', $count($today, $tomorrow), 'randevu'],
        ['Bu hafta', $count($monday, $monday->modify('+7 days')), 'randevu'],
        ['Bu ay', $count($monthStart, $monthStart->modify('+1 month')), 'randevu'],
        ['Bekleyen SMS', (int) safe(fn () => db_value("SELECT COUNT(*) FROM `Appointment` WHERE smsStatus = 'Bekliyor' AND smsEnabled = 1 AND status <> 'İptal'"), 0), 'gönderilecek'],
    ];
    $todayRows = safe(fn () => db_all('SELECT * FROM `Appointment` WHERE startAt >= ? AND startAt < ? ORDER BY startAt ASC', [$sql($today), $sql($tomorrow)]), []);
    $upcoming = safe(fn () => db_all("SELECT * FROM `Appointment` WHERE status <> 'İptal' AND startAt >= ? ORDER BY startAt ASC LIMIT 6", [$sql($tomorrow)]), []);

    $settings = safe(fn () => sms_settings(), []);
    $smsWarning = !$settings || empty($settings['enabled']) || sms_config_error($settings) !== null;
    $days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    $longDate = tr_date($sql($now)) . ', ' . $days[(int) $now->format('N') - 1];
    $focus = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) ($_GET['week'] ?? '')) ? $_GET['week'] : '';

    $v = fn (string $file) => $file . '?v=' . (int) @filemtime(ROOT_DIR . $file);
    $head = '<link rel="stylesheet" href="' . $v('/assets/calendar.css') . '">'
        . '<script src="' . $v('/assets/vendor/fullcalendar/index.global.min.js') . '" defer></script>'
        . '<script src="' . $v('/assets/vendor/fullcalendar/tr.global.min.js') . '" defer></script>'
        . '<script src="' . $v('/assets/calendar.js') . '" defer></script>';

    $item = function (array $a, bool $withDate) {
        [$smsKey, $smsLabel] = sms_status_info($a);
        $start = utc_to_local($a['startAt']);
        $cancelled = $a['status'] === 'İptal';
        ?>
        <li>
          <a href="/admin/calendar/<?= (int) $a['id'] ?>" class="cal-agenda-item<?= $cancelled ? ' is-cancelled' : '' ?>">
            <span class="cal-agenda-time">
              <?php if ($withDate): ?><span class="cal-agenda-date"><?= e($start->format('j') . ' ' . TR_MONTHS_SHORT[(int) $start->format('n') - 1]) ?></span><?php endif; ?>
              <?= e($start->format('H:i')) ?>
            </span>
            <span class="cal-agenda-body">
              <span class="cal-agenda-name"><?= e($a['clientName']) ?></span>
              <span class="cal-agenda-meta"><?= e($start->format('H:i') . ' – ' . utc_to_local($a['endAt'])->format('H:i')) ?><?= $cancelled ? ' · İptal' : '' ?></span>
            </span>
            <span class="sms-dot sms-dot--<?= e($smsKey) ?>" title="<?= e($smsLabel) ?>"></span>
          </a>
        </li>
        <?php
    };

    admin_shell('Takvim', '/admin/calendar', function () use ($stats, $todayRows, $upcoming, $smsWarning, $longDate, $focus, $item, $tz, $now) {
        ?>
        <div class="cal-page">
          <div class="cal-top">
            <div>
              <p class="cal-eyebrow"><?= e($longDate) ?></p>
              <h1 class="cal-title">Randevu Takvimi</h1>
            </div>
            <a href="/admin/calendar/new" class="cal-new"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>Yeni randevu</a>
          </div>

          <div class="cal-stats">
            <?php foreach ($stats as [$label, $value, $unit]): ?>
              <div class="cal-stat">
                <span class="cal-stat-label"><?= e($label) ?></span>
                <span class="cal-stat-value"><?= (int) $value ?><small><?= e($unit) ?></small></span>
              </div>
            <?php endforeach; ?>
          </div>

          <?php if ($smsWarning): ?>
            <div class="cal-notice">Seans sonrası SMS gönderimi henüz etkin değil. <a href="/admin/sms">SMS ayarlarını tamamlayın</a></div>
          <?php endif; ?>

          <div class="cal-layout">
            <div class="cal-card">
              <div id="calendar" data-csrf="<?= e(csrf_token()) ?>" data-offset="<?= (int) ($tz->getOffset($now) / 60) ?>" data-date="<?= e($focus) ?>"></div>
              <div class="cal-legend">
                <div>
                  <p class="cal-legend-title">Randevu renkleri</p>
                  <ul class="cal-legend-items">
                    <li><i class="lg lg--planned"></i><span><strong>Planlandı</strong><small>Takvime girilmiş, henüz “gerçekleşti” ya da “iptal” olarak işaretlenmemiş randevu.</small></span></li>
                    <li><i class="lg lg--done"></i><span><strong>Gerçekleşti</strong><small>Seans yapıldı. Randevuyu açıp durumunu “Gerçekleşti” seçtiğinizde bu renge döner.</small></span></li>
                    <li><i class="lg lg--cancelled"></i><span><strong>İptal</strong><small>İptal edilen randevu. Takvimde üstü çizili kalır, SMS gönderilmez.</small></span></li>
                  </ul>
                </div>
                <div>
                  <p class="cal-legend-title">İsmin yanındaki nokta: seans sonrası SMS</p>
                  <ul class="cal-legend-items cal-legend-sms">
                    <li><span class="sms-dot sms-dot--pending"></span>Gönderilecek</li>
                    <li><span class="sms-dot sms-dot--sent"></span>Gönderildi</li>
                    <li><span class="sms-dot sms-dot--error"></span>Gönderilemedi</li>
                    <li><span class="sms-dot sms-dot--off"></span>SMS yok / kapalı</li>
                  </ul>
                </div>
                <p class="cal-legend-hint">İpucu: Boş bir saate tıklayıp sürükleyerek randevu ekleyin; var olan randevuyu sürükleyerek taşıyın.</p>
              </div>
            </div>

            <aside class="cal-side">
              <section class="cal-panel">
                <h2>Bugün</h2>
                <?php if ($todayRows): ?>
                  <ul class="cal-agenda"><?php foreach ($todayRows as $a) { $item($a, false); } ?></ul>
                <?php else: ?>
                  <p class="cal-empty">Bugün için randevu yok.</p>
                <?php endif; ?>
              </section>
              <section class="cal-panel">
                <h2>Yaklaşan</h2>
                <?php if ($upcoming): ?>
                  <ul class="cal-agenda"><?php foreach ($upcoming as $a) { $item($a, true); } ?></ul>
                <?php else: ?>
                  <p class="cal-empty">Yaklaşan randevu yok.</p>
                <?php endif; ?>
              </section>
            </aside>
          </div>
        </div>

        <dialog id="appt-dialog" class="appt-dialog" aria-labelledby="appt-name">
          <button type="button" class="appt-close" data-close aria-label="Kapat"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
          <div class="appt-head">
            <span class="appt-avatar" data-f="initials"></span>
            <div>
              <h2 id="appt-name" data-f="name"></h2>
              <p class="appt-when" data-f="when"></p>
            </div>
          </div>
          <div class="appt-chips">
            <span class="chip" data-f="status"></span>
            <span class="chip" data-f="sms"></span>
          </div>
          <div class="appt-row">
            <span class="appt-label">Telefon</span>
            <span class="appt-phone" data-f="phone"></span>
            <span class="appt-contact">
              <a data-f="tel" class="appt-mini">Ara</a>
              <a data-f="wa" class="appt-mini" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </span>
          </div>
          <div class="appt-note" data-f="noteWrap">
            <span class="appt-label">Özel not</span>
            <p data-f="note"></p>
          </div>
          <div class="appt-actions">
            <button type="button" class="appt-btn appt-btn--ghost" data-close>Kapat</button>
            <a data-f="edit" class="appt-btn appt-btn--primary">Düzenle</a>
          </div>
        </dialog>
        <div id="cal-toast" class="cal-toast" role="status" aria-live="polite"></div>
        <?php
    }, ['head' => $head, 'wide' => true]);
}

/** @return array{0: array, 1: ?string} Kaydedilecek veri ve varsa hata */
function collect_appointment(?array $existing): array
{
    $in = is_array($_POST['f'] ?? null) ? $_POST['f'] : [];
    $str = fn (string $k, int $max) => clean_input($in[$k] ?? '', $max);

    $name = $str('clientName', 120);
    $phone = $str('phone', 40);
    // Geçerli cep numaraları tek biçimde saklanır: 0532 123 45 67
    if (($mobile = normalize_tr_mobile($phone)) !== null) {
        $phone = format_tr_mobile($mobile);
    }
    $date = $str('date', 10);
    $start = local_to_utc($date, $str('start', 5));
    $end = local_to_utc($date, $str('end', 5));
    $note = mb_substr(normalize_text($in['note'] ?? ''), 0, 2000);
    $status = in_array($in['status'] ?? '', APPOINTMENT_STATUSES, true) ? $in['status'] : 'Planlandı';
    $smsEnabled = empty($in['smsEnabled']) ? 0 : 1;

    $data = [
        'clientName' => $name,
        'phone' => $phone,
        'startAt' => $start,
        'endAt' => $end,
        'note' => trim($note) === '' ? null : $note,
        'status' => $status,
        'smsEnabled' => $smsEnabled,
        // Form değerlerini yeniden doldurmak için
        '_date' => $date, '_start' => $str('start', 5), '_end' => $str('end', 5),
    ];

    if ($name === '' || $phone === '') {
        return [$data, 'Danışan adı ve telefon gerekli.'];
    }
    if ($start === null || $end === null) {
        return [$data, 'Tarih ve saatleri kontrol edin.'];
    }
    if ($end <= $start) {
        return [$data, 'Bitiş saati başlangıçtan sonra olmalı.'];
    }
    if ($smsEnabled && normalize_tr_mobile($phone) === null) {
        return [$data, 'SMS için geçerli bir Türkiye cep numarası girin (ör. 0532 123 45 67) ya da bu randevu için SMS’i kapatın.'];
    }
    if ($status !== 'İptal') {
        $clash = db_one(
            "SELECT clientName, startAt, endAt FROM `Appointment` WHERE status <> 'İptal' AND startAt < ? AND endAt > ? AND id <> ? LIMIT 1",
            [$end, $start, (int) ($existing['id'] ?? 0)]
        );
        if ($clash && empty($in['allowOverlap'])) {
            $data['_clash'] = true;
            return [$data, 'Bu saat aralığında başka bir randevu var: ' . $clash['clientName'] . ' (' . utc_to_local($clash['startAt'])->format('H:i') . '–' . utc_to_local($clash['endAt'])->format('H:i') . '). Yine de kaydetmek için aşağıdaki kutuyu işaretleyin.'];
        }
    }
    return [$data, null];
}

function admin_appointment_form(?array $existing, string $method): void
{
    $isNew = $existing === null;
    $action = $isNew ? '/admin/calendar/new' : '/admin/calendar/' . (int) $existing['id'];
    $error = null;

    if ($existing) {
        $s = utc_to_local($existing['startAt']);
        $row = $existing + ['_date' => $s->format('Y-m-d'), '_start' => $s->format('H:i'), '_end' => utc_to_local($existing['endAt'])->format('H:i')];
    } else {
        $date = (string) ($_GET['date'] ?? '');
        $row = [
            'smsEnabled' => 1, 'status' => 'Planlandı',
            '_date' => preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) ? $date : (new DateTimeImmutable('now', local_tz()))->format('Y-m-d'),
            '_start' => preg_match('/^\d{2}:\d{2}$/', (string) ($_GET['start'] ?? '')) ? $_GET['start'] : '',
            '_end' => preg_match('/^\d{2}:\d{2}$/', (string) ($_GET['end'] ?? '')) ? $_GET['end'] : '',
        ];
    }

    if ($method === 'POST') {
        [$data, $error] = collect_appointment($existing);
        if ($error === null) {
            $save = array_filter($data, fn ($k) => $k[0] !== '_', ARRAY_FILTER_USE_KEY);
            // Gönderilmiş SMS tekrar gönderilmez; diğer durumlarda zamanlama yeniden hesaplanır.
            if ($isNew || $existing['smsStatus'] !== 'Gönderildi') {
                $save['smsStatus'] = ($save['smsEnabled'] && $save['status'] !== 'İptal') ? 'Bekliyor' : 'Kapalı';
                $save['smsAttempts'] = 0;
                $save['smsError'] = null;
            }
            $save['updatedAt'] = now_sql();
            try {
                if ($isNew) {
                    $save['createdAt'] = now_sql();
                    db_insert('Appointment', $save);
                } else {
                    db_update('Appointment', (int) $existing['id'], $save);
                }
                redirect('/admin/calendar?week=' . utc_to_local($save['startAt'])->format('Y-m-d') . '&m=saved');
            } catch (PDOException $e) {
                error_log('[psikolog] ' . $e->getMessage());
                $error = 'Kaydedilirken bir hata oluştu.';
            }
        }
        $row = [...$row, ...$data];
    }

    $settings = safe(fn () => sms_settings(), []);
    $delay = (int) ($settings['delayMinutes'] ?? 90);
    $extra = match ($_GET['m'] ?? '') {
        'sms-sent' => admin_alert('success', 'SMS gönderildi.'),
        'sms-failed' => admin_alert('error', 'SMS gönderilemedi: ' . ($existing['smsError'] ?? 'bilinmeyen hata')),
        'sms-config' => admin_alert('error', 'Önce SMS ayarlarını tamamlayın.'),
        default => '',
    };

    admin_shell($isNew ? 'Yeni randevu' : 'Randevu', '/admin/calendar', function () use ($isNew, $action, $row, $error, $existing, $delay, $extra) {
        $back = '/admin/calendar' . (!empty($row['_date']) ? '?week=' . e($row['_date']) : '');
        echo $extra;
        ?>
        <div class="flex justify-between items-center gap-4 mb-6">
          <h1 class="text-2xl font-serif text-stone-900 font-bold"><?= $isNew ? 'Yeni randevu' : 'Randevu · Düzenle' ?></h1>
          <a href="<?= $back ?>" class="px-6 py-2.5 bg-stone-900 text-white font-medium text-xs md:text-sm uppercase tracking-wider hover:bg-amber-800 transition-colors rounded shrink-0">Takvime dön</a>
        </div>
        <div class="flex flex-col lg:flex-row gap-6 items-start">
          <form method="post" action="<?= e($action) ?>" class="<?= CARD_CLASS ?> space-y-6 w-full lg:flex-1">
            <?= csrf_field() ?>
            <?php if ($error !== null) { echo admin_alert('error', $error); } ?>
            <div class="grid sm:grid-cols-2 gap-5">
              <div class="space-y-2">
                <label for="clientName" class="<?= LABEL_CLASS ?>">Danışan adı *</label>
                <input id="clientName" name="f[clientName]" required maxlength="120" value="<?= e($row['clientName'] ?? '') ?>" class="<?= INPUT_CLASS ?>" autocomplete="off">
              </div>
              <div class="space-y-2">
                <label for="phone" class="<?= LABEL_CLASS ?>">Cep telefonu *</label>
                <input id="phone" name="f[phone]" type="tel" inputmode="tel" required maxlength="40" value="<?= e($row['phone'] ?? '') ?>" placeholder="0532 123 45 67" data-phone class="<?= INPUT_CLASS ?>" autocomplete="off">
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div class="space-y-2">
                <label for="date" class="<?= LABEL_CLASS ?>">Tarih *</label>
                <input id="date" name="f[date]" type="date" required value="<?= e($row['_date'] ?? '') ?>" class="<?= INPUT_CLASS ?>">
              </div>
              <div class="space-y-2">
                <label for="start" class="<?= LABEL_CLASS ?>">Başlangıç *</label>
                <input id="start" name="f[start]" type="time" required step="300" value="<?= e($row['_start'] ?? '') ?>" data-appt-start class="<?= INPUT_CLASS ?>">
              </div>
              <div class="space-y-2">
                <label for="end" class="<?= LABEL_CLASS ?>">Bitiş *</label>
                <input id="end" name="f[end]" type="time" required step="300" value="<?= e($row['_end'] ?? '') ?>" data-appt-end class="<?= INPUT_CLASS ?>">
              </div>
            </div>
            <div class="space-y-2">
              <label for="note" class="<?= LABEL_CLASS ?>">Özel not</label>
              <p class="text-xs text-stone-400">Yalnızca sizin göreceğiniz kısa not. Danışana gönderilmez, SMS’e eklenmez.</p>
              <textarea id="note" name="f[note]" rows="4" maxlength="2000" class="<?= INPUT_CLASS ?> resize-y"><?= e($row['note'] ?? '') ?></textarea>
            </div>
            <div class="grid sm:grid-cols-2 gap-5 items-end">
              <div class="space-y-2">
                <label for="status" class="<?= LABEL_CLASS ?>">Durum</label>
                <select id="status" name="f[status]" class="<?= INPUT_CLASS ?>">
                  <?php foreach (APPOINTMENT_STATUSES as $s): ?><option value="<?= e($s) ?>"<?= ($row['status'] ?? '') === $s ? ' selected' : '' ?>><?= e($s) ?></option><?php endforeach; ?>
                </select>
              </div>
              <label class="flex items-center gap-3 text-sm text-stone-800 cursor-pointer pb-3">
                <input type="checkbox" name="f[smsEnabled]" value="1"<?= !empty($row['smsEnabled']) ? ' checked' : '' ?> class="h-4 w-4 accent-[#21492C]">
                Seans bitiminden <?= e(SMS_DELAY_OPTIONS[$delay] ?? "$delay dakika") ?> sonra SMS gönder
              </label>
            </div>
            <?php if (!empty($row['_clash'])): ?>
              <label class="flex items-center gap-3 text-sm text-red-700 cursor-pointer">
                <input type="checkbox" name="f[allowOverlap]" value="1" class="h-4 w-4"> Çakışmaya rağmen kaydet
              </label>
            <?php endif; ?>
            <div class="pt-4 border-t border-stone-100 flex justify-end"><button type="submit" class="<?= SAVE_BUTTON ?>">Kaydet</button></div>
          </form>

          <?php if (!$isNew): ?>
            <aside class="w-full lg:w-80 space-y-4">
              <div class="<?= CARD_CLASS ?> space-y-3 text-sm">
                <h2 class="text-sm font-bold uppercase tracking-wider text-stone-900">SMS durumu</h2>
                <div><?= sms_status_badge($existing) ?></div>
                <?php if ($existing['smsStatus'] === 'Gönderildi' && $existing['smsSentAt']): ?>
                  <p class="text-stone-600">Gönderim: <?= e(tr_date($existing['smsSentAt'], true)) ?></p>
                <?php elseif ($existing['smsStatus'] === 'Bekliyor' && $existing['smsEnabled'] && $existing['status'] !== 'İptal'): ?>
                  <p class="text-stone-600">Planlanan gönderim: <?= e(tr_date(gmdate('Y-m-d H:i:s', parse_date($existing['endAt'])->getTimestamp() + $delay * 60), true)) ?></p>
                <?php endif; ?>
                <?php if ($existing['smsError']): ?><p class="text-red-700"><?= e($existing['smsError']) ?></p><?php endif; ?>
                <?php if (in_array($existing['smsStatus'], ['Bekliyor', 'Hata', 'Atlandı'], true) && $existing['status'] !== 'İptal'): ?>
                  <form method="post" action="/admin/calendar/<?= (int) $existing['id'] ?>/send-sms" data-confirm="SMS şimdi gönderilsin mi?">
                    <?= csrf_field() ?>
                    <button type="submit" class="w-full px-4 py-2.5 bg-stone-100 text-stone-800 border border-stone-200 font-bold text-xs uppercase tracking-wider hover:bg-stone-200 rounded">Şimdi gönder</button>
                  </form>
                <?php endif; ?>
              </div>
              <form method="post" action="/admin/calendar/<?= (int) $existing['id'] ?>/delete" data-confirm="Bu randevuyu silmek istediğinize emin misiniz?">
                <?= csrf_field() ?>
                <button type="submit" class="w-full px-4 py-3 bg-white border border-stone-200 text-red-600 font-bold text-xs uppercase tracking-wider hover:bg-red-50 rounded-lg">Randevuyu sil</button>
              </form>
            </aside>
          <?php endif; ?>
        </div>
        <?php
    });
}

/* ---------- SMS ayarları ---------- */

function admin_sms(array $segments, string $method): void
{
    try {
        $settings = sms_settings();
    } catch (Throwable $e) {
        error_log('[psikolog] ' . $e->getMessage());
        admin_shell('SMS Ayarları', '/admin/sms', fn () => print(admin_alert('error', 'SMS tabloları oluşturulamadı. Veritabanı bağlantısını kontrol edin.')));
        return;
    }
    $sub = $segments[1] ?? '';
    $error = null;
    $testResult = null;

    if ($method === 'POST' && $sub === '') {
        $in = is_array($_POST['f'] ?? null) ? $_POST['f'] : [];
        $delay = (int) ($in['delayMinutes'] ?? 90);
        $data = [
            'enabled' => empty($in['enabled']) ? 0 : 1,
            'usercode' => clean_input($in['usercode'] ?? '', 64),
            'msgheader' => clean_input($in['msgheader'] ?? '', 11),
            'delayMinutes' => isset(SMS_DELAY_OPTIONS[$delay]) ? $delay : 90,
            'template' => mb_substr(trim(normalize_text($in['template'] ?? '')), 0, 900),
            'updatedAt' => now_sql(),
        ];
        $password = is_string($in['password'] ?? null) ? trim($in['password']) : '';
        if ($password !== '') {
            $data['passwordEnc'] = sms_encrypt($password);
        }
        if ($data['template'] === '') {
            $error = 'SMS şablonu boş olamaz.';
        } elseif ($data['enabled'] && ($configError = sms_config_error([...$settings, ...$data])) !== null) {
            $error = 'SMS gönderimi açılamadı: ' . $configError;
        }
        if ($error === null) {
            db_update('SmsSettings', (int) $settings['id'], $data);
            redirect('/admin/sms?m=saved');
        }
        $settings = [...$settings, ...$data];
    } elseif ($method === 'POST' && $sub === 'test') {
        $phone = normalize_tr_mobile(clean_input($_POST['phone'] ?? '', 40));
        $configError = sms_config_error($settings);
        if ($phone === null) {
            $testResult = ['ok' => false, 'message' => 'Geçerli bir Türkiye cep numarası girin.'];
        } elseif ($configError !== null) {
            $testResult = ['ok' => false, 'message' => $configError . ' Önce ayarları kaydedin.'];
        } elseif (rate_count('sms-test', 3600) >= 10) {
            $testResult = ['ok' => false, 'message' => 'Bir saatte en fazla 10 deneme SMS’i gönderilebilir.'];
        } else {
            rate_count('sms-test', 3600, true);
            $text = render_sms($settings['template'], ['clientName' => 'Ayşe Yılmaz', 'startAt' => now_sql()]);
            $testResult = netgsm_send($settings, $phone, $text);
            sms_log(null, $phone, $text, $testResult);
        }
    } elseif ($sub !== '') {
        not_found();
    }

    $logs = safe(fn () => db_all('SELECT * FROM `SmsLog` ORDER BY createdAt DESC LIMIT 30'), []);
    $hasPassword = sms_decrypt($settings['passwordEnc'] ?? null) !== '';
    $cronCommand = 'php ' . (realpath(APP_DIR . '/tools/sms-cron.php') ?: APP_DIR . '/tools/sms-cron.php');
    $cronUrl = cron_secret() !== '' ? site_url() . '/cron/sms?key=' . cron_secret() : '';

    admin_shell('SMS Ayarları', '/admin/sms', function () use ($settings, $error, $testResult, $logs, $hasPassword, $cronCommand, $cronUrl) {
        ?>
        <h1 class="text-2xl font-serif text-stone-900 font-bold mb-6">Seans Sonrası SMS (NetGSM)</h1>
        <div class="space-y-10">
          <form method="post" action="/admin/sms" class="<?= CARD_CLASS ?> space-y-6" autocomplete="off">
            <?= csrf_field() ?>
            <?php if ($error !== null) { echo admin_alert('error', $error); } ?>
            <label class="flex items-center gap-3 <?= LABEL_CLASS ?> cursor-pointer">
              <input type="checkbox" name="f[enabled]" value="1"<?= !empty($settings['enabled']) ? ' checked' : '' ?> class="h-4 w-4 accent-[#21492C]"> Seans sonrası SMS gönderimi açık
            </label>

            <h2 class="text-lg font-serif font-bold text-stone-900 pt-2 pb-2 border-b border-stone-100 uppercase">NetGSM API bilgileri</h2>
            <p class="text-xs text-stone-500">NetGSM panelinde <strong>Abonelik İşlemleri › API İşlemleri</strong> bölümünden bir API alt kullanıcısı oluşturup bilgilerini girin. Sunucu IP kısıtı açıksa sitenin sunucu IP’sini izinli listeye ekleyin.</p>
            <div class="grid sm:grid-cols-3 gap-5">
              <div class="space-y-2">
                <label for="usercode" class="<?= LABEL_CLASS ?>">Kullanıcı kodu</label>
                <input id="usercode" name="f[usercode]" value="<?= e($settings['usercode']) ?>" placeholder="850XXXXXXX" class="<?= INPUT_CLASS ?>">
              </div>
              <div class="space-y-2">
                <label for="password" class="<?= LABEL_CLASS ?>">API şifresi</label>
                <input id="password" name="f[password]" type="password" autocomplete="new-password" placeholder="<?= $hasPassword ? '•••••• kayıtlı (değiştirmek için yazın)' : 'Şifre' ?>" class="<?= INPUT_CLASS ?>">
              </div>
              <div class="space-y-2">
                <label for="msgheader" class="<?= LABEL_CLASS ?>">Mesaj başlığı</label>
                <input id="msgheader" name="f[msgheader]" maxlength="11" value="<?= e($settings['msgheader']) ?>" placeholder="ör. MELISSAGLAM" class="<?= INPUT_CLASS ?>">
              </div>
            </div>

            <h2 class="text-lg font-serif font-bold text-stone-900 pt-2 pb-2 border-b border-stone-100 uppercase">Gönderim</h2>
            <div class="space-y-2 sm:w-1/3">
              <label for="delayMinutes" class="<?= LABEL_CLASS ?>">Seans bitiminden sonra</label>
              <select id="delayMinutes" name="f[delayMinutes]" class="<?= INPUT_CLASS ?>">
                <?php foreach (SMS_DELAY_OPTIONS as $min => $label): ?><option value="<?= $min ?>"<?= (int) $settings['delayMinutes'] === $min ? ' selected' : '' ?>><?= e($label) ?></option><?php endforeach; ?>
              </select>
            </div>
            <div class="space-y-2">
              <label for="template" class="<?= LABEL_CLASS ?>">SMS metni</label>
              <p class="text-xs text-stone-400">Kullanılabilir alanlar:
                <?php foreach (sms_placeholders() as $tag => $desc): ?><code class="px-1 bg-stone-100 rounded" title="<?= e($desc) ?>"><?= e($tag) ?></code> <?php endforeach; ?>
                · Gizlilik için seans içeriğine dair bilgi yazmayın.
              </p>
              <textarea id="template" name="f[template]" rows="4" maxlength="900" data-sms-template data-psikolog="<?= e(SITE_NAME) ?>" class="<?= INPUT_CLASS ?> resize-y"><?= e($settings['template']) ?></textarea>
              <div class="flex flex-col sm:flex-row sm:justify-between gap-2 text-xs text-stone-500">
                <span>Önizleme: <span data-sms-preview class="text-stone-800"></span></span>
                <span data-sms-count class="shrink-0"></span>
              </div>
            </div>
            <div class="pt-4 border-t border-stone-100 flex justify-end"><button type="submit" class="<?= SAVE_BUTTON ?>">Kaydet</button></div>
          </form>

          <section class="<?= CARD_CLASS ?> space-y-4">
            <h2 class="text-lg font-serif font-bold text-stone-900 uppercase">Deneme SMS’i</h2>
            <?php if ($testResult) { echo admin_alert($testResult['ok'] ? 'success' : 'error', $testResult['message']); } ?>
            <form method="post" action="/admin/sms/test" class="flex flex-col sm:flex-row gap-3">
              <?= csrf_field() ?>
              <input name="phone" type="tel" inputmode="tel" required placeholder="Kendi cep numaranız (0532 123 45 67)" data-phone class="<?= INPUT_CLASS ?> sm:flex-1">
              <button type="submit" class="<?= SAVE_BUTTON ?>">Gönder</button>
            </form>
            <p class="text-xs text-stone-400">Kayıtlı şablon örnek bir danışan adıyla gönderilir.</p>
          </section>

          <section class="<?= CARD_CLASS ?> space-y-3 text-sm">
            <h2 class="text-lg font-serif font-bold text-stone-900 uppercase">Zamanlayıcı (Cron) kurulumu</h2>
            <p class="text-stone-600">SMS’lerin otomatik gitmesi için Hostinger panelinde <strong>Gelişmiş › Cron İşleri</strong> bölümüne <strong>her 5 dakikada bir</strong> çalışacak şu komutu ekleyin:</p>
            <pre class="bg-stone-900 text-stone-100 text-xs p-3 rounded overflow-x-auto"><?= e($cronCommand) ?></pre>
            <?php if ($cronUrl): ?>
              <p class="text-stone-600">Komut çalıştıramayan bir zamanlayıcı kullanıyorsanız bu gizli bağlantıyı çağırabilirsiniz (kimseyle paylaşmayın):</p>
              <pre class="bg-stone-900 text-stone-100 text-xs p-3 rounded overflow-x-auto"><?= e($cronUrl) ?></pre>
            <?php endif; ?>
          </section>

          <section>
            <h2 class="text-lg font-serif font-bold text-stone-900 uppercase mb-4">Son gönderimler</h2>
            <div class="bg-white border border-stone-200 shadow-sm overflow-x-auto rounded-xl">
              <?php if (!$logs): ?>
                <div class="text-center py-12 text-stone-500 text-sm">Henüz SMS gönderilmedi.</div>
              <?php else: ?>
                <table class="w-full text-left text-sm text-stone-600">
                  <thead class="bg-stone-50 text-stone-900 uppercase tracking-wider text-xs font-bold border-b border-stone-200">
                    <tr><th class="px-4 py-3">Tarih</th><th class="px-4 py-3">Numara</th><th class="px-4 py-3">Mesaj</th><th class="px-4 py-3">Sonuç</th></tr>
                  </thead>
                  <tbody class="divide-y divide-stone-100">
                    <?php foreach ($logs as $log): ?>
                      <tr>
                        <td class="px-4 py-3 whitespace-nowrap"><?= e(tr_date($log['createdAt'], true, true)) ?></td>
                        <td class="px-4 py-3 whitespace-nowrap"><?= e(format_tr_mobile($log['phone'])) ?><?= $log['appointmentId'] ? '' : ' <span class="text-xs text-stone-400">(deneme)</span>' ?></td>
                        <td class="px-4 py-3 max-w-[320px] truncate" title="<?= e($log['message']) ?>"><?= e($log['message']) ?></td>
                        <td class="px-4 py-3 max-w-[260px] truncate <?= $log['success'] ? 'text-green-700' : 'text-red-700' ?>" title="<?= e($log['response']) ?>"><?= e(explode(' | ', (string) $log['response'])[0]) ?></td>
                      </tr>
                    <?php endforeach; ?>
                  </tbody>
                </table>
              <?php endif; ?>
            </div>
          </section>
        </div>
        <?php
    });
}
