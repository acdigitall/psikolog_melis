# psikolog_melis

Uzm. Klinik Psikolog sitesi ve yönetim paneli. Saf PHP (8.1+) ve MySQL; çatı (framework) yok.

## Klasörler

- `php/` — sitenin tamamı. Sunucuda `public_html` içine bu klasörün **içeriği** yüklenir.
  - `index.php` — tek giriş noktası
  - `app/` — kod (dışarıya kapalı): `router.php`, `admin.php`, `admin_crm.php` (takvim + SMS ekranları), `crm.php` (NetGSM ve zamanlama), `views/`
  - `app/tools/` — `schema.sql` (veritabanı şeması), `sifre-olustur.php`, `sms-cron.php`
  - `assets/` — derlenmiş CSS ve JS; `uploads/` — panelden yüklenen dosyalar
- `scripts/build-php-css.mjs` — Tailwind ile `php/assets/site.css` üretir

## Yerelde çalıştırma

1. `php/app/env.example` dosyasını `php/app/.env` olarak kopyalayıp doldurun.
2. Boş veritabanına `php/app/tools/schema.sql` dosyasını içe aktarın.
3. `npm run dev` (ya da `cd php && php -S 127.0.0.1:8000 index.php`) → http://127.0.0.1:8000

Yönetici şifresi: `php php/app/tools/sifre-olustur.php 'YeniSifre'` çıktısını `.env` dosyasına yazın.

## CSS

`php/app` içindeki sınıflar değiştiğinde: `npm install` (ilk sefer) ve `npm run build:css`.
Takvim sayfasının stili ayrı ve derleme gerektirmez: `php/assets/calendar.css`.

## Sunucu (Hostinger)

- `php/` içeriğini `public_html` altına yükleyin, `app/.env` dosyasını oluşturun.
- Seans sonrası SMS için Cron İşleri'ne 5 dakikada bir: `php /home/KULLANICI/public_html/app/tools/sms-cron.php`
- NetGSM bilgileri panelden girilir: Yönetim › SMS Ayarları.
