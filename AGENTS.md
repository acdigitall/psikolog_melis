# Proje notları

Bu proje saf PHP (8.1+) + MySQL'dir; Next.js / Prisma kaldırıldı. Tüm site `php/` klasöründedir.

- Giriş noktası `php/index.php`; yönlendirme `php/app/router.php`; yönetim paneli `php/app/admin.php` ve `php/app/admin_crm.php`.
- Veritabanı şeması: `php/app/tools/schema.sql`. Tablo/sütun eklerken bu dosyayı da güncelleyin.
- Tarihler veritabanında UTC tutulur, ekranda Europe/Istanbul'a çevrilir.
- `php/app` içinde yeni Tailwind sınıfı kullandıysanız `npm run build:css` çalıştırın (çıktı: `php/assets/site.css`, depoya eklenir).
- Yerel sunucu: `npm run dev`.
