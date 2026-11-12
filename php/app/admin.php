<?php
declare(strict_types=1);

require APP_DIR . '/admin_crm.php';

const ADMIN_MESSAGES = [
    'saved' => ['success', 'Değişiklikler kaydedildi.'],
    'deleted' => ['success', 'Kayıt silindi.'],
    'status' => ['success', 'Randevu talebi durumu güncellendi.'],
    'error' => ['error', 'İşlem sırasında bir hata oluştu.'],
    'large' => ['error', 'Gönderilen dosya, sunucunun izin verdiği boyuttan büyük.'],
    'denied' => ['error', 'Oturum doğrulanamadı. Sayfayı yenileyip tekrar deneyin.'],
];

const INPUT_CLASS = 'w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded';
const LABEL_CLASS = 'text-sm font-bold text-stone-900 uppercase tracking-wider block';
const CARD_CLASS = 'bg-white p-6 md:p-8 rounded-lg shadow-sm border border-stone-200';
const SAVE_BUTTON = 'px-8 py-3 bg-stone-900 text-white font-bold text-sm uppercase tracking-wider rounded shadow hover:bg-amber-700 transition-colors disabled:opacity-50';

function seo_fields(): array
{
    return [
        ['section' => 'SEO ayarları'],
        ['key' => 'metaTitle', 'label' => 'Meta başlık', 'placeholder' => 'Arama sonuçlarında görünecek başlık...'],
        ['key' => 'metaKeys', 'label' => 'Anahtar kelimeler', 'placeholder' => 'ör. izmir psikolog, seans odası'],
        ['key' => 'metaDesc', 'label' => 'Meta açıklama', 'type' => 'textarea', 'rows' => 3, 'placeholder' => 'Arama motorları için kısa açıklama...'],
    ];
}

/** Liste + form ekranları. Tablo ve sütun adları yalnızca buradan gelir. */
function admin_resources(): array
{
    return [
        'services' => [
            'table' => 'Service', 'title' => 'Hizmetler', 'add' => '+ Yeni hizmet ekle', 'orderBy' => 'id ASC', 'header' => 'services',
            'confirm' => 'Bu hizmeti silmek istediğinize emin misiniz?', 'duplicate' => 'Bu URL (slug) zaten kullanımda. Lütfen başka bir URL belirleyin.',
            'columns' => [['img', 'Görsel', 'image'], ['title', 'Hizmet', 'text'], ['slug', 'Adres', 'text'], ['isFeatured', 'Öne çıkan', 'bool']],
            'fields' => [
                ['key' => 'title', 'label' => 'Hizmet adı *', 'required' => true, 'placeholder' => 'ör. Çift ve İlişki Terapisi'],
                ['key' => 'slug', 'label' => 'Sayfa adresi (slug) *', 'placeholder' => 'ör. cift-ve-iliski-terapisi', 'slugFrom' => 'f[title]'],
                ['key' => 'isFeatured', 'label' => 'Ana sayfada öne çıkar', 'type' => 'checkbox'],
                ...seo_fields(),
                ['section' => 'İçerik'],
                ['key' => 'desc', 'label' => 'Kısa açıklama (özet)', 'type' => 'textarea', 'rows' => 3, 'required' => true, 'placeholder' => 'Hizmet listesinde görünecek kısa özet...'],
                ['key' => 'longDesc', 'label' => 'Uzun açıklama (detay sayfası için)', 'type' => 'textarea', 'rows' => 10, 'required' => true, 'placeholder' => 'Detay sayfasında görünecek ayrıntılı açıklama...'],
                ['key' => 'features', 'label' => 'Çalışılan konular (virgülle ayırın)', 'type' => 'textarea', 'rows' => 3, 'placeholder' => 'ör. Kaygı, Panik atak, Sosyal kaygı'],
                ['key' => 'steps', 'label' => 'Süreç adımları (virgülle ayırın)', 'type' => 'textarea', 'rows' => 3, 'placeholder' => 'ör. Tanışma görüşmesi, Değerlendirme, Hedef belirleme'],
                ['key' => 'img', 'label' => 'Hizmet görseli *', 'type' => 'image', 'required' => true],
            ],
            'beforeSave' => function (array $data): array {
                $data['slug'] = slugify($data['slug'] !== '' ? $data['slug'] : $data['title']);
                return $data;
            },
        ],
        'blog' => [
            'table' => 'BlogPost', 'title' => 'Blog Yazıları', 'add' => '+ Yeni yazı ekle', 'orderBy' => 'createdAt DESC', 'header' => 'blog',
            'confirm' => 'Bu yazıyı silmek istediğinize emin misiniz?',
            'columns' => [['image', 'Görsel', 'image'], ['title', 'Başlık', 'text'], ['category', 'Kategori', 'text'], ['status', 'Durum', 'text'], ['views', 'Okunma', 'text'], ['createdAt', 'Tarih', 'date']],
            'fields' => fn () => [
                ['key' => 'title', 'label' => 'Yazı başlığı *', 'required' => true, 'placeholder' => 'Yazı başlığını yazın...'],
                ['key' => 'category', 'label' => 'Kategori (ilgili hizmet) *', 'type' => 'select', 'required' => true, 'options' => service_titles(), 'help' => 'Seçenekler Hizmetler bölümündeki başlıklardan gelir.'],
                ['key' => 'status', 'label' => 'Durum *', 'type' => 'select', 'required' => true, 'options' => ['Yayında', 'Taslak']],
                ...seo_fields(),
                ['section' => 'İçerik'],
                ['key' => 'excerpt', 'label' => 'Özet * (kartlarda ve arama sonuçlarında görünür)', 'type' => 'textarea', 'rows' => 3, 'required' => true, 'placeholder' => 'Kısa bir özet yazın...'],
                ['key' => 'content', 'label' => 'İçerik *', 'type' => 'textarea', 'rows' => 18, 'required' => true, 'placeholder' => 'Yazınızı buraya yazın...'],
                ['key' => 'image', 'label' => 'Kapak görseli', 'type' => 'image'],
            ],
            'beforeSave' => function (array $data, ?array $existing): array {
                if ($existing === null || $existing['title'] !== $data['title']) {
                    $data['slug'] = unique_post_slug($data['title'], $existing['id'] ?? null);
                }
                if ($data['image'] === '') {
                    $data['image'] = null;
                }
                return $data;
            },
        ],
        'gallery' => [
            'table' => 'GalleryItem', 'title' => 'Klinik & Seans Odaları', 'add' => '+ Yeni görsel ekle', 'orderBy' => 'createdAt DESC', 'header' => 'gallery',
            'confirm' => 'Bu görseli silmek istediğinize emin misiniz?',
            'columns' => [['img', 'Görsel', 'image'], ['title', 'Başlık', 'text'], ['category', 'Kategori', 'text'], ['order', 'Sıra', 'text']],
            'fields' => fn () => [
                ['key' => 'title', 'label' => 'Görsel başlığı *', 'required' => true, 'placeholder' => 'ör. Seans odası'],
                ['key' => 'category', 'label' => 'Kategori * (ör. Seans Odası; yeni bir ad da yazabilirsiniz)', 'type' => 'datalist', 'required' => true, 'options' => gallery_categories()],
                ['key' => 'order', 'label' => 'Sıralama (isteğe bağlı)', 'type' => 'number', 'placeholder' => '1, 2, 3... (1 en üstte)'],
                ['key' => 'img', 'label' => 'Görsel *', 'type' => 'image', 'required' => true],
                ...seo_fields(),
            ],
            'beforeSave' => function (array $data): array {
                $data['category'] = trim($data['category']);
                return $data;
            },
        ],
        'slides' => [
            'table' => 'Slide', 'title' => 'Açılış Slaytları', 'add' => '+ Yeni slayt ekle', 'orderBy' => '`order` ASC',
            'confirm' => 'Bu slaytı silmek istediğinize emin misiniz?',
            'columns' => [['bg', 'Görsel', 'image'], ['title', 'Ana başlık', 'text'], ['subtitle', 'Üst başlık', 'text'], ['order', 'Sıra', 'text']],
            'fields' => [
                ['key' => 'subtitle', 'label' => 'Üst başlık *', 'required' => true, 'placeholder' => 'ör. Bilimsel yaklaşım, şefkatli dinleme'],
                ['key' => 'title', 'label' => 'Ana başlık *', 'required' => true, 'placeholder' => 'ör. Kendinizi anlama yolculuğunuzda yanınızdayım'],
                ['key' => 'desc', 'label' => 'Açıklama *', 'type' => 'textarea', 'rows' => 3, 'required' => true, 'placeholder' => 'Slaytta görünecek kısa açıklama...'],
                ['key' => 'order', 'label' => 'Sıra', 'type' => 'number'],
                ['key' => 'bg', 'label' => 'Arka plan görseli *', 'type' => 'image', 'required' => true],
                ...seo_fields(),
            ],
            'beforeSave' => function (array $data, ?array $existing): array {
                if ($existing === null && (int) $data['order'] === 0) {
                    $data['order'] = (int) db_value('SELECT COUNT(*) FROM `Slide`') + 1;
                }
                return $data;
            },
        ],
        'steps' => [
            'table' => 'ProductionStep', 'title' => 'Terapi Aşamaları', 'add' => '+ Yeni aşama ekle', 'orderBy' => '`order` ASC', 'touch' => true, 'returnTo' => '/admin/production', 'embedded' => true,
            'confirm' => 'Bu terapi aşamasını silmek istediğinize emin misiniz?',
            'columns' => [['order', 'Sıra', 'text'], ['title', 'Aşama', 'text']],
            'fields' => [
                ['key' => 'title', 'label' => 'Aşama başlığı *', 'required' => true],
                ['key' => 'order', 'label' => 'Sıra no *', 'type' => 'number'],
                ['key' => 'desc', 'label' => 'Açıklama *', 'type' => 'textarea', 'rows' => 4, 'required' => true],
            ],
        ],
    ];
}

/** Tek kayıtlık ayar ekranları. */
function admin_singletons(): array
{
    $titleDesc = [['key' => 'title', 'label' => 'Başlık', 'placeholder' => 'Başlık'], ['key' => 'desc', 'label' => 'Açıklama', 'type' => 'textarea', 'placeholder' => 'Açıklama']];
    return [
        'home' => [
            'table' => 'HomePage', 'title' => 'Ana Sayfa', 'load' => fn () => home_page(),
            'fields' => [
                ...seo_fields(),
                ['section' => 'Hizmetler bölümü'],
                ['key' => 'servicesTitle', 'label' => 'Bölüm başlığı'],
                ['section' => 'Yaklaşım bölümü'],
                ['key' => 'whyUsTitle', 'label' => 'Bölüm başlığı'],
                ['key' => 'whyUsImg', 'label' => 'Kapak görseli', 'type' => 'image'],
                ['key' => 'whyUsItems', 'label' => 'Maddeler', 'type' => 'repeater', 'columns' => $titleDesc],
                ['section' => 'Yazılar bölümü'],
                ['key' => 'projectsTitle', 'label' => 'Bölüm başlığı'],
                ['key' => 'projectsDesc', 'label' => 'Açıklama metni', 'type' => 'textarea', 'rows' => 3],
                ['section' => 'Sayfa sonu çağrısı'],
                ['key' => 'ctaTitle', 'label' => 'Ana başlık (satır atlamak için <br/> kullanabilirsiniz)'],
                ['key' => 'ctaDesc', 'label' => 'Açıklama paragrafı', 'type' => 'textarea', 'rows' => 3],
                ['key' => 'ctaBtn1Text', 'label' => '1. buton metni'],
                ['key' => 'ctaBtn1Link', 'label' => '1. buton bağlantısı', 'placeholder' => 'ör. /quote'],
                ['key' => 'ctaBtn2Text', 'label' => '2. buton metni'],
                ['key' => 'ctaBtn2Link', 'label' => '2. buton bağlantısı', 'placeholder' => 'ör. /contact'],
            ],
        ],
        'about' => [
            'table' => 'AboutPage', 'title' => 'Hakkımda', 'header' => 'about', 'load' => fn () => about_page(),
            'fields' => [
                ...seo_fields(),
                ['section' => 'Hikaye'],
                ['key' => 'storyImg', 'label' => 'Kapak görseli', 'type' => 'image'],
                ['key' => 'storyTitle', 'label' => 'Başlık'],
                ['key' => 'storyDesc1', 'label' => '1. paragraf', 'type' => 'textarea', 'rows' => 5],
                ['key' => 'storyDesc2', 'label' => '2. paragraf', 'type' => 'textarea', 'rows' => 5],
                ['key' => 'visionTitle', 'label' => '1. kutu başlığı'],
                ['key' => 'visionText', 'label' => '1. kutu metni', 'type' => 'textarea', 'rows' => 3],
                ['key' => 'missionTitle', 'label' => '2. kutu başlığı'],
                ['key' => 'missionText', 'label' => '2. kutu metni', 'type' => 'textarea', 'rows' => 3],
                ['section' => 'Yöntemler'],
                ['key' => 'bridgeLabel', 'label' => 'Üst etiket'],
                ['key' => 'bridgeImg', 'label' => 'Görsel', 'type' => 'image'],
                ['key' => 'bridgeTitle', 'label' => 'Ana başlık (satır atlamak için <br/> kullanabilirsiniz)'],
                ['key' => 'bridgeDesc1', 'label' => '1. paragraf', 'type' => 'textarea', 'rows' => 4],
                ['key' => 'bridgeDesc2', 'label' => '2. paragraf', 'type' => 'textarea', 'rows' => 4],
                ['section' => 'Eğitimler'],
                ['key' => 'brochureLabel', 'label' => 'Üst etiket'],
                ['key' => 'brochureUrl', 'label' => 'Belge (PDF)', 'type' => 'file'],
                ['key' => 'brochureTitle', 'label' => 'Başlık'],
                ['key' => 'brochureDesc', 'label' => 'Açıklama', 'type' => 'textarea', 'rows' => 3],
                ['key' => 'brochureHighlights', 'label' => 'Eğitim listesi', 'type' => 'repeater', 'columns' => $titleDesc],
                ['key' => 'materialsTitle', 'label' => 'Çalışma alanları başlığı'],
                ['key' => 'materials', 'label' => 'Çalışma alanları (virgülle ayırın)', 'type' => 'textarea', 'rows' => 3],
                ['section' => 'İlkeler'],
                ['key' => 'policyTitle', 'label' => 'Başlık'],
                ['key' => 'policies', 'label' => 'İlkeler', 'type' => 'repeater', 'columns' => $titleDesc],
            ],
        ],
        'production' => [
            'table' => 'ProductionInfo', 'title' => 'Terapi Süreci', 'load' => fn () => production_info(), 'after' => 'steps',
            'fields' => [
                ['key' => 'title', 'label' => 'Sayfa başlığı *', 'required' => true],
                ['key' => 'desc', 'label' => 'Sayfa açıklaması *', 'type' => 'textarea', 'rows' => 4, 'required' => true],
                ['key' => 'img', 'label' => 'Kapak görseli *', 'type' => 'image', 'required' => true],
                ...seo_fields(),
            ],
        ],
        'contact' => [
            'table' => 'ContactSettings', 'title' => 'İletişim Ayarları', 'header' => 'contact',
            'load' => function () {
                $row = contact_settings();
                if ($row === null) {
                    return null;
                }
                $phones = parse_list($row['phones']);
                if (!$phones) {
                    if ($row['phone1']) {
                        $phones[] = ['label' => 'Randevu', 'value' => $row['phone1']];
                    }
                    if ($row['phone2']) {
                        $phones[] = ['label' => 'Diğer telefon', 'value' => $row['phone2']];
                    }
                }
                $emails = parse_list($row['emails']) ?: ($row['email'] ? [['label' => 'E-posta', 'value' => $row['email']]] : []);
                $links = array_map(fn ($l) => ['platform' => ($l['platform'] ?? '') ?: ($l['name'] ?? 'Diğer'), 'url' => $l['url'] ?? ''], parse_list($row['socialLinks']));
                return ['phones' => $phones, 'emails' => $emails, 'socialLinks' => $links] + $row;
            },
            'fields' => [
                ['section' => 'Logolar'],
                ['key' => 'logo', 'label' => 'Üst menü logosu', 'type' => 'image'],
                ['key' => 'logoFooter', 'label' => 'Alt bilgi logosu', 'type' => 'image'],
                ['section' => 'İletişim bilgileri'],
                ['key' => 'phones', 'label' => 'Telefon numaraları', 'type' => 'repeater', 'columns' => [['key' => 'label', 'label' => 'Etiket', 'placeholder' => 'Etiket (ör. Randevu, WhatsApp)'], ['key' => 'value', 'label' => 'Numara', 'placeholder' => 'Telefon numarası']]],
                ['key' => 'emails', 'label' => 'E-posta adresleri', 'type' => 'repeater', 'columns' => [['key' => 'label', 'label' => 'Etiket', 'placeholder' => 'Etiket (ör. Randevu, Genel bilgi)'], ['key' => 'value', 'label' => 'Adres', 'placeholder' => 'E-posta adresi']]],
                ['key' => 'address', 'label' => 'Adres', 'type' => 'textarea', 'rows' => 3, 'required' => true],
                ['key' => 'mapIframe', 'label' => 'Google Haritalar yerleştirme bağlantısı (src)', 'type' => 'textarea', 'rows' => 3, 'help' => 'Google Haritalar’daki "Haritayı yerleştir" kodunu ya da yalnızca src adresini yapıştırın.'],
                ['section' => 'Sosyal medya'],
                ['key' => 'socialLinks', 'label' => 'Sosyal medya hesapları', 'type' => 'repeater', 'columns' => [['key' => 'platform', 'label' => 'Platform', 'type' => 'select', 'options' => ['Facebook', 'Instagram', 'Twitter / X', 'LinkedIn', 'YouTube', 'TikTok', 'WhatsApp', 'Pinterest', 'Diğer']], ['key' => 'url', 'label' => 'URL', 'placeholder' => 'URL (https://...)']]],
            ],
            // İlk telefon ve e-posta, sitenin kullandığı tekil alanlara da yazılır.
            'beforeSave' => function (array $data): array {
                $phones = parse_list($data['phones']);
                $emails = parse_list($data['emails']);
                $data['phone1'] = $phones[0]['value'] ?? '';
                $data['phone2'] = $phones[1]['value'] ?? '';
                $data['email'] = $emails[0]['value'] ?? '';
                return $data;
            },
        ],
    ];
}

function resource_fields(array $resource): array
{
    return is_callable($resource['fields']) ? $resource['fields']() : $resource['fields'];
}

function unique_post_slug(string $title, ?int $excludeId): string
{
    $base = slugify($title) ?: 'yazi';
    $slug = $base;
    for ($i = 1; ; $i++) {
        $row = db_one('SELECT id FROM `BlogPost` WHERE slug = ?', [$slug]);
        if (!$row || (int) $row['id'] === $excludeId) {
            return $slug;
        }
        $slug = "$base-$i";
    }
}

/* ---------- Yönlendirme ---------- */

function admin_route(string $path, string $method): void
{
    header('X-Robots-Tag: noindex, nofollow');
    header('Cache-Control: no-store');

    $isLogin = $path === '/admin/login';
    $session = admin_session();

    if ($isLogin) {
        if ($session) {
            redirect('/admin');
        }
        $error = null;
        if ($method === 'POST') {
            $error = same_origin()
                ? attempt_login(is_string($_POST['email'] ?? null) ? $_POST['email'] : '', is_string($_POST['password'] ?? null) ? $_POST['password'] : '')
                : 'Oturum doğrulanamadı. Sayfayı yenileyip tekrar deneyin.';
            if ($error === null) {
                redirect('/admin');
            }
        }
        admin_login_page($error);
        return;
    }

    if (!$session) {
        redirect('/admin/login');
    }

    if ($method === 'POST') {
        $back = strtok($path, '?');
        if (empty($_POST) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
            redirect("$back?m=large");
        }
        if (!same_origin() || !csrf_valid()) {
            redirect("$back?m=denied");
        }
    }

    $segments = array_slice(explode('/', trim($path, '/')), 1);
    $first = $segments[0] ?? '';
    $resources = admin_resources();
    $singletons = admin_singletons();

    match (true) {
        $path === '/admin' => admin_dashboard(),
        $path === '/admin/logout' && $method === 'POST' => admin_logout(),
        $first === 'page-header' && isset($segments[1]) && $method === 'POST' => admin_save_header($segments[1], $resources, $singletons),
        $first === 'quotes' => admin_quotes($segments, $method),
        $first === 'calendar' => admin_calendar($segments, $method),
        $first === 'sms' => admin_sms($segments, $method),
        isset($singletons[$first]) && count($segments) === 1 => admin_singleton($first, $singletons[$first], $method),
        isset($resources[$first]) => admin_resource($first, $resources[$first], array_slice($segments, 1), $method),
        default => not_found(),
    };
}

function admin_logout(): void
{
    logout();
    redirect('/admin/login');
}

function admin_save_header(string $id, array $resources, array $singletons): void
{
    $allowed = array_filter(array_merge($resources, $singletons), fn ($r) => isset($r['header']));
    if (!isset($allowed[$id])) {
        not_found();
    }
    $title = normalize_text($_POST['title'] ?? '');
    $description = normalize_text($_POST['description'] ?? '');
    try {
        db_run(
            'INSERT INTO `PageHeader` (pageIdentifier, title, description, updatedAt) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), updatedAt = VALUES(updatedAt)',
            [$id, $title, $description, now_sql()]
        );
        redirect("/admin/$id?m=saved");
    } catch (PDOException $e) {
        error_log('[psikolog] ' . $e->getMessage());
        redirect("/admin/$id?m=error");
    }
}

/* ---------- Form işleme ---------- */

function normalize_text(mixed $value): string
{
    return is_string($value) ? str_replace("\r\n", "\n", $value) : '';
}

/** @return array{0: array, 1: ?string} Toplanan veri ve varsa hata mesajı */
function collect_fields(array $fields): array
{
    $input = is_array($_POST['f'] ?? null) ? $_POST['f'] : [];
    $data = [];
    $error = null;

    foreach ($fields as $field) {
        if (isset($field['section'])) {
            continue;
        }
        $key = $field['key'];
        $type = $field['type'] ?? 'text';
        $value = $input[$key] ?? '';

        switch ($type) {
            case 'number':
                $data[$key] = (int) (is_string($value) ? $value : 0);
                break;
            case 'checkbox':
                $data[$key] = empty($value) ? 0 : 1;
                break;
            case 'repeater':
                $rows = [];
                foreach (is_array($value) ? $value : [] as $row) {
                    $clean = [];
                    foreach ($field['columns'] as $column) {
                        $clean[$column['key']] = normalize_text($row[$column['key']] ?? '');
                    }
                    if (implode('', $clean) !== '') {
                        $rows[] = $clean;
                    }
                }
                $data[$key] = json_encode($rows, JSON_UNESCAPED_UNICODE);
                break;
            case 'image':
            case 'file':
                $data[$key] = normalize_text($value);
                $upload = $_FILES['upload']['name'][$key] ?? null;
                if ($upload !== null && ($_FILES['upload']['error'][$key] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
                    $saved = save_upload([
                        'tmp_name' => $_FILES['upload']['tmp_name'][$key],
                        'error' => $_FILES['upload']['error'][$key],
                        'size' => $_FILES['upload']['size'][$key],
                    ], $type === 'file');
                    if (isset($saved['error'])) {
                        $error ??= $field['label'] . ': ' . $saved['error'];
                    } else {
                        $data[$key] = $saved['url'];
                    }
                }
                break;
            default:
                $data[$key] = normalize_text($value);
        }

        if (!empty($field['required']) && trim((string) $data[$key]) === '') {
            $error ??= 'Lütfen zorunlu alanları doldurun: ' . rtrim($field['label'], ' *');
        }
    }
    return [$data, $error];
}

function admin_singleton(string $name, array $config, string $method): void
{
    $fields = resource_fields($config);
    $row = $config['load']();
    $error = null;

    if ($method === 'POST') {
        [$data, $error] = collect_fields($fields);
        if ($error === null) {
            try {
                if (isset($config['beforeSave'])) {
                    $data = $config['beforeSave']($data, $row);
                }
                db_update($config['table'], (int) $row['id'], [...$data, 'updatedAt' => now_sql()]);
                redirect("/admin/$name?m=saved");
            } catch (PDOException $e) {
                error_log('[psikolog] ' . $e->getMessage());
                $error = 'Kaydedilirken bir hata oluştu.';
            }
        }
        $row = [...($row ?? []), ...$data];
    }

    admin_shell($config['title'], "/admin/$name", function () use ($name, $config, $fields, $row, $error) {
        if (isset($config['header'])) {
            page_header_form($config['header']);
        }
        echo '<h1 class="text-2xl font-serif text-stone-900 font-bold mb-6">' . e($config['title']) . '</h1>';
        admin_form("/admin/$name", $fields, $row ?? [], $error);
        if (isset($config['after'])) {
            echo '<div class="mt-12">';
            admin_table($config['after'], admin_resources()[$config['after']]);
            echo '</div>';
        }
    });
}

function admin_resource(string $name, array $config, array $rest, string $method): void
{
    $base = "/admin/$name";
    $listPath = $config['returnTo'] ?? $base;
    $menuPath = $listPath;
    $table = $config['table'];

    if (!$rest) {
        if (!empty($config['embedded'])) {
            redirect($listPath);
        }
        admin_shell($config['title'], $menuPath, function () use ($name, $config) {
            if (isset($config['header'])) {
                page_header_form($config['header']);
            }
            admin_table($name, $config);
        });
        return;
    }

    if (count($rest) === 2 && $rest[1] === 'delete' && $method === 'POST' && ctype_digit($rest[0])) {
        try {
            db_run("DELETE FROM `$table` WHERE id = ?", [(int) $rest[0]]);
            redirect("$listPath?m=deleted");
        } catch (PDOException $e) {
            error_log('[psikolog] ' . $e->getMessage());
            redirect("$listPath?m=error");
        }
    }

    $isNew = $rest === ['new'];
    if (!$isNew && !(count($rest) === 1 && ctype_digit($rest[0]))) {
        not_found();
    }

    $existing = null;
    if (!$isNew) {
        $existing = db_one("SELECT * FROM `$table` WHERE id = ?", [(int) $rest[0]]);
        if (!$existing) {
            not_found();
        }
    }

    $fields = resource_fields($config);
    $row = $existing ?? [];
    $error = null;
    $action = $base . '/' . ($isNew ? 'new' : (int) $rest[0]);

    if ($method === 'POST') {
        [$data, $error] = collect_fields($fields);
        if ($error === null) {
            try {
                if (isset($config['beforeSave'])) {
                    $data = $config['beforeSave']($data, $existing);
                }
                if (!empty($config['touch'])) {
                    $data['updatedAt'] = now_sql();
                }
                if ($isNew) {
                    db_insert($table, $data);
                } else {
                    db_update($table, (int) $existing['id'], $data);
                }
                redirect("$listPath?m=saved");
            } catch (PDOException $e) {
                if ($e->getCode() === '23000' && isset($config['duplicate'])) {
                    $error = $config['duplicate'];
                } else {
                    error_log('[psikolog] ' . $e->getMessage());
                    $error = 'Kaydedilirken bir hata oluştu.';
                }
            }
        }
        $row = [...$row, ...$data];
    } elseif ($isNew && $name === 'blog') {
        $row = ['status' => 'Yayında'];
    }

    admin_shell($config['title'], $menuPath, function () use ($config, $fields, $row, $error, $action, $listPath, $isNew) {
        echo '<div class="flex justify-between items-center gap-4 mb-6">'
            . '<h1 class="text-2xl font-serif text-stone-900 font-bold">' . e($config['title']) . ' · ' . ($isNew ? 'Yeni kayıt' : 'Düzenle') . '</h1>'
            . '<a href="' . e($listPath) . '" class="px-6 py-2.5 bg-stone-900 text-white font-medium text-xs md:text-sm uppercase tracking-wider hover:bg-amber-800 transition-colors rounded shrink-0">Listeye Dön</a></div>';
        admin_form($action, $fields, $row, $error);
    });
}

/* ---------- Ekran parçaları ---------- */

function admin_alert(string $type, string $text): string
{
    $class = $type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200';
    return '<div class="p-4 mb-6 border rounded-lg text-sm font-medium ' . $class . '">' . e($text) . '</div>';
}

function repeater_row(array $field, string $index, array $row): string
{
    $html = '<div data-repeater-row class="flex flex-col sm:flex-row gap-3 items-start bg-stone-50 p-3 rounded border border-stone-200">';
    foreach ($field['columns'] as $column) {
        $name = 'f[' . $field['key'] . '][' . $index . '][' . $column['key'] . ']';
        $value = (string) ($row[$column['key']] ?? '');
        $inputClass = 'w-full bg-white border border-stone-200 px-3 py-2 text-sm rounded focus:outline-none focus:border-amber-700';
        $placeholder = e($column['placeholder'] ?? $column['label']);
        $type = $column['type'] ?? 'text';
        if ($type === 'select') {
            $options = $column['options'];
            if ($value !== '' && !in_array($value, $options, true)) {
                array_splice($options, count($options) - 1, 0, [$value]);
            }
            $html .= '<select name="' . e($name) . '" class="sm:w-1/3 ' . $inputClass . '">';
            foreach ($options as $option) {
                $html .= '<option value="' . e($option) . '"' . ($option === $value ? ' selected' : '') . '>' . e($option) . '</option>';
            }
            $html .= '</select>';
        } elseif ($type === 'textarea') {
            $html .= '<textarea rows="2" name="' . e($name) . '" placeholder="' . $placeholder . '" class="' . $inputClass . '">' . e($value) . '</textarea>';
        } else {
            $html .= '<input type="text" name="' . e($name) . '" value="' . e($value) . '" placeholder="' . $placeholder . '" class="' . $inputClass . '">';
        }
    }
    return $html . '<button type="button" data-repeater-remove class="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded shrink-0">Sil</button></div>';
}

function admin_field(array $field, array $row): void
{
    if (isset($field['section'])) {
        echo '<h2 class="text-lg font-serif font-bold text-stone-900 pt-6 pb-2 border-b border-stone-100 uppercase">' . e($field['section']) . '</h2>';
        return;
    }
    $key = $field['key'];
    $type = $field['type'] ?? 'text';
    $name = "f[$key]";
    $value = $row[$key] ?? '';
    $placeholder = e($field['placeholder'] ?? '');
    $required = !empty($field['required']) && !in_array($type, ['image', 'file'], true) ? ' required' : '';

    if ($type === 'checkbox') {
        echo '<label class="flex items-center gap-3 ' . LABEL_CLASS . ' cursor-pointer"><input type="checkbox" name="' . e($name) . '" value="1"' . (!empty($value) ? ' checked' : '') . ' class="h-4 w-4 accent-[#21492C]"> ' . e($field['label']) . '</label>';
        return;
    }

    echo '<div class="space-y-2"><label class="' . LABEL_CLASS . '">' . e($field['label']) . '</label>';
    if (isset($field['help'])) {
        echo '<p class="text-xs text-stone-400">' . e($field['help']) . '</p>';
    }

    switch ($type) {
        case 'textarea':
            echo '<textarea name="' . e($name) . '" rows="' . (int) ($field['rows'] ?? 4) . '" placeholder="' . $placeholder . '" class="' . INPUT_CLASS . ' resize-y"' . $required . '>' . e($value) . '</textarea>';
            break;
        case 'select':
            echo '<select name="' . e($name) . '" class="' . INPUT_CLASS . '"' . $required . '>';
            $options = $field['options'];
            if ($value !== '' && !in_array($value, $options, true)) {
                array_unshift($options, $value);
            }
            foreach ($options as $option) {
                echo '<option value="' . e($option) . '"' . ($option === $value ? ' selected' : '') . '>' . e($option) . '</option>';
            }
            echo '</select>';
            break;
        case 'datalist':
            echo '<input type="text" name="' . e($name) . '" value="' . e($value) . '" list="list-' . e($key) . '" autocomplete="off" class="' . INPUT_CLASS . '"' . $required . '><datalist id="list-' . e($key) . '">';
            foreach ($field['options'] as $option) {
                echo '<option value="' . e($option) . '">';
            }
            echo '</datalist>';
            break;
        case 'number':
            echo '<input type="number" name="' . e($name) . '" value="' . e($value) . '" placeholder="' . $placeholder . '" class="' . INPUT_CLASS . '">';
            break;
        case 'image':
        case 'file':
            $isImage = $type === 'image';
            $previewId = 'preview-' . e($key);
            echo '<div class="flex flex-col sm:flex-row gap-4 items-start">';
            if ($isImage) {
                echo '<img id="' . $previewId . '" src="' . e($value) . '" alt="" class="h-24 w-32 object-cover rounded border border-stone-200 bg-stone-100' . ($value ? '' : ' hidden') . '">';
            }
            echo '<div class="flex-1 w-full space-y-2">'
                . '<input type="file" name="upload[' . e($key) . ']" accept="' . ($isImage ? 'image/*' : '.pdf') . '"' . ($isImage ? ' data-preview="' . $previewId . '"' : '') . ' class="block w-full text-sm text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-stone-900 file:text-white file:text-xs file:font-bold file:cursor-pointer">'
                . '<input type="text" name="' . e($name) . '" value="' . e($value) . '" placeholder="/uploads/... ya da https://..." class="' . INPUT_CLASS . ' text-sm">'
                . '</div></div>';
            break;
        case 'repeater':
            $rows = parse_list($value);
            echo '<div data-repeater class="space-y-3"><div data-repeater-rows class="space-y-3">';
            foreach ($rows as $i => $item) {
                echo repeater_row($field, (string) $i, is_array($item) ? $item : []);
            }
            echo '</div><template>' . repeater_row($field, '__i__', []) . '</template>'
                . '<button type="button" data-repeater-add class="px-3 py-1 bg-stone-200 text-stone-700 text-xs font-bold rounded hover:bg-stone-300 transition-colors">+ Yeni ekle</button></div>';
            break;
        default:
            $slugAttr = isset($field['slugFrom']) ? ' data-slug-from="' . e($field['slugFrom']) . '"' : '';
            echo '<input type="text" name="' . e($name) . '" value="' . e($value) . '" placeholder="' . $placeholder . '" class="' . INPUT_CLASS . '"' . $required . $slugAttr . '>';
    }
    echo '</div>';
}

function admin_form(string $action, array $fields, array $row, ?string $error): void
{
    echo '<form method="post" action="' . e($action) . '" enctype="multipart/form-data" class="' . CARD_CLASS . ' space-y-6">' . csrf_field();
    if ($error !== null) {
        echo admin_alert('error', $error);
    }
    foreach ($fields as $field) {
        admin_field($field, $row);
    }
    echo '<div class="pt-4 border-t border-stone-100 flex justify-end"><button type="submit" class="' . SAVE_BUTTON . '">Kaydet</button></div></form>';
}

function page_header_form(string $id): void
{
    $header = page_header($id);
    ?>
    <section class="<?= CARD_CLASS ?> mb-12">
      <h2 class="text-xl font-serif font-bold text-stone-900 mb-6 pb-2 border-b border-stone-100 uppercase">Sayfa Başlık &amp; Açıklama Bilgileri</h2>
      <form method="post" action="/admin/page-header/<?= e($id) ?>" class="space-y-6">
        <?= csrf_field() ?>
        <div class="space-y-2">
          <label class="<?= LABEL_CLASS ?>">Başlık *</label>
          <input type="text" name="title" required value="<?= e($header['title'] ?? '') ?>" class="<?= INPUT_CLASS ?>">
        </div>
        <div class="space-y-2">
          <label class="<?= LABEL_CLASS ?>">Açıklama (İsteğe Bağlı)</label>
          <textarea name="description" rows="4" placeholder="Başlığın altında görüntülenecek açıklama metni..." class="<?= INPUT_CLASS ?> resize-y"><?= e($header['description'] ?? '') ?></textarea>
        </div>
        <div class="pt-4 border-t border-stone-100 flex justify-end"><button type="submit" class="<?= SAVE_BUTTON ?>">Kaydet</button></div>
      </form>
    </section>
    <?php
}

function admin_table(string $name, array $config): void
{
    $rows = safe(fn () => db_all("SELECT * FROM `{$config['table']}` ORDER BY {$config['orderBy']}"), []);
    ?>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-serif text-stone-900 font-bold"><?= e($config['title']) ?></h2>
        <p class="text-xs text-stone-500 mt-1">Toplam: <?= count($rows) ?> kayıt</p>
      </div>
      <a href="/admin/<?= e($name) ?>/new" class="px-6 py-2.5 bg-stone-900 text-white font-medium text-xs md:text-sm uppercase tracking-wider hover:bg-amber-800 transition-colors rounded shrink-0"><?= e($config['add']) ?></a>
    </div>
    <div class="bg-white border border-stone-200 shadow-sm overflow-x-auto rounded-xl">
      <?php if (!$rows): ?>
        <div class="text-center py-12 text-stone-500 text-sm">Henüz kayıt bulunmuyor.</div>
      <?php else: ?>
        <table class="w-full text-left text-sm text-stone-600">
          <thead class="bg-stone-50 text-stone-900 uppercase tracking-wider text-xs font-bold border-b border-stone-200">
            <tr>
              <?php foreach ($config['columns'] as [, $label]): ?><th class="px-6 py-4"><?= e($label) ?></th><?php endforeach; ?>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            <?php foreach ($rows as $row): ?>
              <tr class="hover:bg-stone-50">
                <?php foreach ($config['columns'] as [$key, , $type]): ?>
                  <td class="px-6 py-4">
                    <?php if ($type === 'image'): ?>
                      <?php if ($row[$key]): ?><img src="<?= e($row[$key]) ?>" alt="" loading="lazy" class="h-12 w-16 object-cover rounded"><?php endif; ?>
                    <?php elseif ($type === 'bool'): ?>
                      <?= $row[$key] ? 'Evet' : '—' ?>
                    <?php elseif ($type === 'date'): ?>
                      <?= e(tr_date($row[$key])) ?>
                    <?php else: ?>
                      <?= e($row[$key]) ?>
                    <?php endif; ?>
                  </td>
                <?php endforeach; ?>
                <td class="px-6 py-4">
                  <div class="flex justify-end gap-2">
                    <a href="/admin/<?= e($name) ?>/<?= (int) $row['id'] ?>" class="px-3 py-1.5 bg-stone-100 text-stone-800 text-xs font-bold rounded hover:bg-stone-200">Düzenle</a>
                    <form method="post" action="/admin/<?= e($name) ?>/<?= (int) $row['id'] ?>/delete" data-confirm="<?= e($config['confirm']) ?>">
                      <?= csrf_field() ?>
                      <button type="submit" class="px-3 py-1.5 text-red-600 text-xs font-bold rounded hover:bg-red-50">Sil</button>
                    </form>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>
    </div>
    <?php
}

function admin_dashboard(): void
{
    $stats = safe(fn () => [
        'services' => db_value('SELECT COUNT(*) FROM `Service`'),
        'gallery' => db_value('SELECT COUNT(*) FROM `GalleryItem`'),
        'blogs' => db_value("SELECT COUNT(*) FROM `BlogPost` WHERE status = 'Yayında'"),
        'drafts' => db_value("SELECT COUNT(*) FROM `BlogPost` WHERE status = 'Taslak'"),
        'quotes' => db_value('SELECT COUNT(*) FROM `Quote`'),
        'newQuotes' => db_value("SELECT COUNT(*) FROM `Quote` WHERE status = 'Yeni'"),
    ], []);
    $recentQuotes = safe(fn () => db_all('SELECT id, name, service, status, createdAt FROM `Quote` ORDER BY createdAt DESC LIMIT 5'), []);
    $recentBlogs = safe(fn () => db_all('SELECT title, status, createdAt FROM `BlogPost` ORDER BY createdAt DESC LIMIT 5'), []);

    $ago = function (string $time): string {
        $hours = (int) floor((time() - parse_date($time)->getTimestamp()) / 3600);
        return $hours >= 24 ? floor($hours / 24) . ' gün önce' : ($hours === 0 ? 'Az önce' : "$hours saat önce");
    };

    $newQuotes = (int) ($stats['newQuotes'] ?? 0);
    $drafts = (int) ($stats['drafts'] ?? 0);
    $cards = [
        ['Randevu talebi', 'quotes', '/admin/quotes', $newQuotes ? "$newQuotes yeni" : ''],
        ['Yayındaki yazı', 'blogs', '/admin/blog', $drafts ? "$drafts taslak" : ''],
        ['Hizmet', 'services', '/admin/services', ''],
        ['Galeri görseli', 'gallery', '/admin/gallery', ''],
    ];

    admin_shell('Yönetim Paneli', '/admin', function () use ($stats, $recentQuotes, $recentBlogs, $ago, $cards) {
        $secondary = 'px-5 py-3 text-sm bg-white border border-stone-300 text-stone-700 rounded hover:border-amber-700 hover:text-amber-700 transition-colors';
        ?>
        <div class="space-y-8">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <h1 class="text-3xl font-serif text-stone-900">Panel</h1>
            <div class="flex flex-wrap gap-3">
              <a href="/admin/calendar" class="<?= $secondary ?>">Takvim</a>
              <a href="/admin/services" class="<?= $secondary ?>">Hizmetleri düzenle</a>
              <a href="/admin/gallery/new" class="<?= $secondary ?>">Galeriye görsel ekle</a>
              <a href="/admin/blog/new" class="px-5 py-3 text-sm bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors">Yeni blog yazısı</a>
            </div>
          </div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <?php foreach ($cards as [$label, $key, $href, $note]): ?>
              <a href="<?= e($href) ?>" class="bg-white border border-stone-200 rounded-lg p-6 hover:border-amber-700 transition-colors">
                <span class="block text-4xl font-serif text-stone-900"><?= (int) ($stats[$key] ?? 0) ?></span>
                <span class="block text-sm text-stone-600 mt-2"><?= e($label) ?><?php if ($note): ?><span class="text-amber-700"> · <?= e($note) ?></span><?php endif; ?></span>
              </a>
            <?php endforeach; ?>
          </div>
          <div class="grid lg:grid-cols-2 gap-6">
            <section class="bg-white border border-stone-200 rounded-lg">
              <div class="flex items-center justify-between gap-4 px-6 py-4 border-b border-stone-200">
                <h2 class="text-lg text-stone-900">Son randevu talepleri</h2>
                <a href="/admin/quotes" class="text-sm text-amber-700 hover:underline">Tümü</a>
              </div>
              <?php if ($recentQuotes): ?>
                <ul class="divide-y divide-stone-100">
                  <?php foreach ($recentQuotes as $q): ?>
                    <li>
                      <a href="/admin/quotes?id=<?= (int) $q['id'] ?>" class="flex items-center justify-between gap-4 px-6 py-4 hover:bg-stone-50 transition-colors">
                        <span class="min-w-0">
                          <span class="block text-sm text-stone-900 truncate"><?= e($q['name']) ?></span>
                          <span class="block text-xs text-stone-500 mt-1 truncate"><?= e($q['service']) ?> · <?= e($ago($q['createdAt'])) ?></span>
                        </span>
                        <?= quote_status_badge($q['status']) ?>
                      </a>
                    </li>
                  <?php endforeach; ?>
                </ul>
              <?php else: ?>
                <p class="px-6 py-12 text-center text-sm text-stone-500">Henüz randevu talebi yok.</p>
              <?php endif; ?>
            </section>
            <section class="bg-white border border-stone-200 rounded-lg">
              <div class="flex items-center justify-between gap-4 px-6 py-4 border-b border-stone-200">
                <h2 class="text-lg text-stone-900">Son blog yazıları</h2>
                <a href="/admin/blog" class="text-sm text-amber-700 hover:underline">Tümü</a>
              </div>
              <?php if ($recentBlogs): ?>
                <ul class="divide-y divide-stone-100">
                  <?php foreach ($recentBlogs as $b): ?>
                    <li class="flex items-center justify-between gap-4 px-6 py-4">
                      <span class="min-w-0">
                        <span class="block text-sm text-stone-900 truncate"><?= e($b['title']) ?></span>
                        <span class="block text-xs text-stone-500 mt-1"><?= e($ago($b['createdAt'])) ?></span>
                      </span>
                      <span class="px-2.5 py-1 text-xs rounded-md whitespace-nowrap <?= $b['status'] === 'Yayında' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600' ?>"><?= e($b['status']) ?></span>
                    </li>
                  <?php endforeach; ?>
                </ul>
              <?php else: ?>
                <p class="px-6 py-12 text-center text-sm text-stone-500">Henüz blog yazısı yok.</p>
              <?php endif; ?>
            </section>
          </div>
        </div>
        <?php
    });
}

function quote_status_label(string $status): string
{
    return ['Yeni' => 'Yeni', 'Yanıtlandı' => 'Görüşüldü', 'Okundu' => 'İncelendi'][$status] ?? $status;
}

function quote_status_badge(string $status, string $padding = 'px-2.5'): string
{
    $tone = $status === 'Yeni' ? 'bg-amber-100 text-amber-800' : ($status === 'Yanıtlandı' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600');
    return '<span class="' . $padding . ' py-1 text-xs font-bold uppercase rounded-md ' . $tone . '">' . e(quote_status_label($status)) . '</span>';
}

function admin_quotes(array $segments, string $method): void
{
    if ($method === 'POST' && count($segments) === 3 && ctype_digit($segments[1])) {
        $id = (int) $segments[1];
        try {
            if ($segments[2] === 'delete') {
                db_run('DELETE FROM `Quote` WHERE id = ?', [$id]);
                redirect('/admin/quotes?m=deleted');
            }
            if ($segments[2] === 'answered') {
                db_run("UPDATE `Quote` SET status = 'Yanıtlandı' WHERE id = ?", [$id]);
                redirect("/admin/quotes?id=$id&m=status");
            }
        } catch (PDOException $e) {
            error_log('[psikolog] ' . $e->getMessage());
            redirect('/admin/quotes?m=error');
        }
    }
    if (count($segments) !== 1) {
        not_found();
    }

    // Açılan yeni talep "İncelendi" sayılır.
    $selectedId = ctype_digit((string) ($_GET['id'] ?? '')) ? (int) $_GET['id'] : 0;
    if ($selectedId) {
        safe(fn () => db_run("UPDATE `Quote` SET status = 'Okundu' WHERE id = ? AND status = 'Yeni'", [$selectedId]));
    }
    $quotes = safe(fn () => db_all('SELECT * FROM `Quote` ORDER BY createdAt DESC'), []);
    $selected = null;
    foreach ($quotes as $quote) {
        if ((int) $quote['id'] === $selectedId) {
            $selected = $quote;
        }
    }

    admin_shell('Randevu Talepleri', '/admin/quotes', function () use ($quotes, $selected, $selectedId) {
        ?>
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-serif text-stone-900 font-bold">Gelen Randevu Talepleri</h1>
            <span class="text-xs text-stone-500 font-medium">Toplam: <?= count($quotes) ?> Talep</span>
          </div>
          <div class="flex flex-col lg:flex-row gap-6 items-start">
            <div class="w-full lg:w-1/2 bg-white border border-stone-200 shadow-sm overflow-x-auto rounded-xl">
              <?php if (!$quotes): ?>
                <div class="text-center py-12 text-stone-500 text-sm">Henüz randevu talebi bulunmuyor.</div>
              <?php else: ?>
                <table class="w-full text-left text-sm text-stone-600">
                  <thead class="bg-stone-50 text-stone-900 uppercase tracking-wider text-xs font-bold border-b border-stone-200">
                    <tr><th class="px-6 py-4">Danışan Adı</th><th class="px-6 py-4">Hizmet / Alan</th><th class="px-6 py-4">Durum</th></tr>
                  </thead>
                  <tbody class="divide-y divide-stone-100">
                    <?php foreach ($quotes as $quote): $isNew = $quote['status'] === 'Yeni'; ?>
                      <tr class="<?= (int) $quote['id'] === $selectedId ? 'bg-amber-50' : 'hover:bg-stone-50' ?> <?= $isNew ? 'font-bold text-stone-900 bg-amber-50/20' : '' ?>">
                        <td class="px-6 py-4">
                          <a href="/admin/quotes?id=<?= (int) $quote['id'] ?>" class="block">
                            <span class="block"><?= e($quote['name']) ?></span>
                            <span class="block text-xs text-stone-400 font-normal mt-1"><?= e(tr_date($quote['createdAt'], true, true)) ?></span>
                          </a>
                        </td>
                        <td class="px-6 py-4 truncate max-w-[150px]"><?= e($quote['service']) ?></td>
                        <td class="px-6 py-4"><?= quote_status_badge($quote['status']) ?></td>
                      </tr>
                    <?php endforeach; ?>
                  </tbody>
                </table>
              <?php endif; ?>
            </div>
            <div class="w-full lg:w-1/2">
              <?php if ($selected): ?>
                <div class="bg-white border border-stone-200 shadow-sm p-8 rounded-xl sticky top-24">
                  <div class="flex justify-between items-start border-b border-stone-100 pb-6 mb-6">
                    <div>
                      <h2 class="text-xl font-bold font-serif text-stone-900 mb-1"><?= e($selected['service']) ?></h2>
                      <p class="text-xs text-stone-400"><?= e(tr_date($selected['createdAt'], true)) ?></p>
                    </div>
                    <?= quote_status_badge($selected['status'], 'px-3') ?>
                  </div>
                  <div class="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div><span class="block text-stone-400 text-xs uppercase tracking-wider mb-1">Danışan Adı</span><span class="font-semibold text-stone-900"><?= e($selected['name']) ?></span></div>
                    <div><span class="block text-stone-400 text-xs uppercase tracking-wider mb-1">Telefon</span><a href="tel:<?= e($selected['phone']) ?>" class="font-semibold text-amber-700 hover:underline"><?= e($selected['phone']) ?></a></div>
                    <div class="col-span-2"><span class="block text-stone-400 text-xs uppercase tracking-wider mb-1">E-Posta</span><a href="mailto:<?= e($selected['email']) ?>" class="font-semibold text-amber-700 hover:underline"><?= e($selected['email']) ?></a></div>
                  </div>
                  <div class="bg-stone-50 p-5 rounded-lg border border-stone-100 mb-6">
                    <span class="block text-stone-400 text-xs uppercase tracking-wider mb-2 font-semibold">Başvuru Notu &amp; Detaylar</span>
                    <p class="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap"><?= e($selected['message']) ?></p>
                  </div>
                  <div class="space-y-3">
                    <div class="flex flex-col sm:flex-row gap-3">
                      <a href="https://wa.me/<?= e(preg_replace('/[^0-9]/', '', $selected['phone'])) ?>" target="_blank" rel="noopener noreferrer" class="flex-1 text-center px-4 py-3 bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-800 transition-colors rounded-lg shadow-sm">WhatsApp ile Yanıtla</a>
                      <a href="mailto:<?= e($selected['email']) ?>?subject=<?= rawurlencode('Psikolojik Danışmanlık ve Randevu Talebi') ?>" class="flex-1 text-center px-4 py-3 bg-stone-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-colors rounded-lg shadow-sm">E-Posta Gönder</a>
                      <form method="post" action="/admin/quotes/<?= (int) $selected['id'] ?>/delete" data-confirm="Bu randevu talebini silmek istediğinize emin misiniz?">
                        <?= csrf_field() ?>
                        <button type="submit" class="w-full px-4 py-3 bg-white border border-stone-200 text-red-600 font-bold text-xs uppercase tracking-wider hover:bg-red-50 transition-colors rounded-lg">Sil</button>
                      </form>
                    </div>
                    <?php if ($selected['status'] !== 'Yanıtlandı'): ?>
                      <form method="post" action="/admin/quotes/<?= (int) $selected['id'] ?>/answered">
                        <?= csrf_field() ?>
                        <button type="submit" class="w-full text-center px-4 py-3 bg-stone-100 text-stone-800 border border-stone-200 font-bold text-xs uppercase tracking-wider hover:bg-stone-200 transition-colors rounded-lg">Görüşüldü Olarak İşaretle</button>
                      </form>
                    <?php endif; ?>
                  </div>
                </div>
              <?php else: ?>
                <div class="bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl p-12 flex flex-col items-center justify-center text-center text-stone-400 min-h-[360px]">
                  <p class="text-sm">Detayları görüntülemek için sol listeden bir randevu talebi seçiniz.</p>
                </div>
              <?php endif; ?>
            </div>
          </div>
        </div>
        <?php
    });
}

function admin_head(string $title, string $extra = ''): void
{
    ?>
<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= e($title) ?></title>
<link rel="icon" href="/icon.png" type="image/png">
<link rel="stylesheet" href="/assets/site.css?v=<?= (int) @filemtime(ROOT_DIR . '/assets/site.css') ?>">
<script src="/assets/admin.js?v=<?= (int) @filemtime(ROOT_DIR . '/assets/admin.js') ?>" defer></script>
<?= $extra ?>
</head>
    <?php
}

function admin_login_page(?string $error): void
{
    $field = 'w-full h-12 rounded-md border border-line bg-white px-4 text-ink transition-colors focus:border-forest focus:outline-none';
    admin_head('Yönetim Paneli');
    ?>
<body class="bg-paper text-ink antialiased">
<div class="min-h-screen bg-sand/70 flex items-center justify-center px-5 py-10">
  <div class="w-full max-w-[460px]">
    <div class="mb-8">
      <h1 class="font-serif text-[2.25rem] leading-tight text-forest">Yönetim paneli</h1>
      <p class="mt-1 text-base text-muted">Uzm. Klinik Psikolog melis Sağlam</p>
    </div>
    <div class="rounded-lg border border-line bg-paper p-8 sm:p-10">
      <form method="post" action="/admin/login" class="space-y-5">
        <?php if ($error): ?><div role="alert" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[15px] text-red-800"><?= e($error) ?></div><?php endif; ?>
        <div class="space-y-2">
          <label for="email" class="block text-base font-medium text-ink/80">E-posta</label>
          <input id="email" name="email" type="email" autocomplete="username" required maxlength="254" class="<?= $field ?>">
        </div>
        <div class="space-y-2">
          <label for="password" class="block text-base font-medium text-ink/80">Şifre</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required maxlength="256" class="<?= $field ?>">
        </div>
        <button type="submit" class="btn-primary mt-2 w-full">Giriş yap</button>
      </form>
    </div>
    <div class="mt-5"><a href="/" class="text-base text-muted transition-colors hover:text-forest">Siteye dön</a></div>
  </div>
</div>
</body>
</html>
    <?php
}

/** $options: 'head' (ek <head> içeriği), 'wide' (geniş içerik alanı) */
function admin_shell(string $heading, string $activePath, callable $body, array $options = []): void
{
    $menu = [
        ['Ana Sayfa', '/admin/home', 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'],
        ['Hizmetler', '/admin/services', 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'],
        ['Takvim', '/admin/calendar', 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm4-6h2v2H9v-2z'],
        ['SMS Ayarları', '/admin/sms', 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'],
        ['Randevu Talepleri', '/admin/quotes','M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'],
        ['Terapi Süreci', '/admin/production', 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'],
        ['Klinik & Seans Odaları', '/admin/gallery', 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'],
        ['Hakkımda', '/admin/about', 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'],
        ['Açılış Slaytları', '/admin/slides', 'M4 5a1 1 0 011-1h14a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM8 20h8M12 16v4'],
        ['Blog Yazıları', '/admin/blog', 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0012.586 3H12'],
        ['İletişim Ayarları', '/admin/contact', 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'],
    ];
    $settings = contact_settings();
    $logo = ($settings['logoFooter'] ?? '') ?: ($settings['logo'] ?? '');
    $icon = fn (string $d, string $class = 'w-5 h-5 shrink-0') => '<svg class="' . $class . '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="' . $d . '"/></svg>';
    $back = 'M10 19l-7-7m0 0l7-7m-7 7h18';
    $close = 'M6 18L18 6M6 6l12 12';
    $notice = ADMIN_MESSAGES[$_GET['m'] ?? ''] ?? null;

    admin_head($heading . ' · Yönetim Paneli', $options['head'] ?? '');
    ?>
<body class="bg-paper text-ink antialiased">
<div class="admin-theme min-h-screen bg-stone-100 flex flex-col md:flex-row">
  <header class="md:hidden bg-stone-900 text-white px-4 py-3 flex items-center justify-between z-30 shadow-md sticky top-0">
    <a href="/admin" class="font-semibold text-sm tracking-wide"><?php if ($logo): ?><img src="<?= e($logo) ?>" alt="Psikolog logosu" class="h-7 w-auto object-contain rounded-sm"><?php else: ?>melis Sağlam<?php endif; ?></a>
    <div class="flex items-center gap-2">
      <a href="/" class="p-2 text-stone-400 hover:text-white" title="Siteye dön"><?= $icon($back) ?></a>
      <button type="button" data-drawer-open class="p-2 text-stone-300 hover:text-white" aria-label="Menü"><?= $icon('M4 6h16M4 12h16M4 18h16', 'w-6 h-6') ?></button>
    </div>
  </header>
  <div id="admin-backdrop" data-drawer-close class="hidden fixed inset-0 bg-stone-950/70 z-40 md:hidden"></div>

  <aside id="admin-aside" class="fixed md:sticky top-0 inset-y-0 left-0 z-50 w-72 md:h-screen bg-stone-900 text-stone-300 flex flex-col justify-between transition-transform duration-200 flex-shrink-0 overflow-y-auto -translate-x-full md:translate-x-0">
    <div class="flex flex-col">
      <div class="p-6 border-b border-stone-800 flex items-center justify-between shrink-0">
        <a href="/admin" class="flex flex-col">
          <?php if ($logo): ?>
            <img src="<?= e($logo) ?>" alt="Psikolog logosu" class="h-10 w-auto object-contain rounded-sm">
          <?php else: ?>
            <span class="font-serif text-[1.4rem] leading-none text-white">melis Sağlam</span>
            <span class="mt-1.5 text-[14px] text-amber-500">Yönetim paneli</span>
          <?php endif; ?>
        </a>
        <button type="button" data-drawer-close class="md:hidden p-2 text-stone-400 hover:text-white" aria-label="Kapat"><?= $icon($close) ?></button>
      </div>
      <nav class="p-4 space-y-1 flex-1">
        <?php foreach ($menu as [$name, $href, $d]): $active = $activePath === $href; ?>
          <a href="<?= e($href) ?>" class="flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors <?= $active ? 'bg-amber-700 text-white' : 'text-stone-300 hover:bg-stone-800 hover:text-white' ?>"><?= $icon($d) ?><?= e($name) ?></a>
        <?php endforeach; ?>
      </nav>
    </div>
    <div class="p-4 border-t border-stone-800 space-y-1 shrink-0 bg-stone-900">
      <a href="/" class="flex items-center gap-3 px-4 py-3 rounded text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"><?= $icon($back) ?>Siteye dön</a>
      <form method="post" action="/admin/logout">
        <?= csrf_field() ?>
        <button type="submit" class="w-full flex items-center gap-3 px-4 py-3 rounded text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-left"><?= $icon('M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1') ?>Çıkış yap</button>
      </form>
    </div>
  </aside>

  <main class="flex-1 flex flex-col min-h-screen overflow-x-hidden">
    <div class="flex-1 overflow-x-hidden p-4 sm:p-6 md:p-10 relative">
      <div class="<?= empty($options['wide']) ? 'max-w-6xl' : 'max-w-[1500px]' ?> mx-auto w-full">
        <?php if ($notice) { echo admin_alert($notice[0], $notice[1]); } ?>
        <?php $body(); ?>
      </div>
    </div>
  </main>
</div>
</body>
</html>
    <?php
}
