"use server";

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'Dosya seçilmedi veya yüklenemedi.' };
    }

    // Dosya uzantısı ve türü kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Yalnızca görsel dosyaları (JPG, PNG, WEBP, GIF, SVG) veya PDF yükleyebilirsiniz.' };
    }

    const isPdf = file.type === 'application/pdf';
    const maxSize = isPdf ? 15 * 1024 * 1024 : 5 * 1024 * 1024; // PDF'ler için 15MB, görseller için 5MB
    
    // Dosya boyutu kontrolü
    if (file.size > maxSize) {
      return { success: false, error: `Dosya boyutu ${isPdf ? '15MB' : '5MB'}'dan büyük olamaz.` };
    }

    // ArrayBuffer okuma
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Kaydetme dizinini ayarla: public/uploads
    const mainUploadDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      mkdirSync(mainUploadDir, { recursive: true });
    } catch (e: any) {
      if (e.code === 'EACCES') {
        return { success: false, error: 'Sunucuda public/uploads klasörünün yazma izni (CHMOD 755/777) yok.' };
      }
    }

    // Benzersiz ve temiz dosya adı oluştur
    const ext = file.name.split('.').pop() || '';
    const cleanName = file.name
      .replace(`.${ext}`, '')
      .replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueName = `${Date.now()}_${cleanName}.${ext}`;
    const filePath = join(mainUploadDir, uniqueName);

    // Diske yaz
    try {
      writeFileSync(filePath, buffer);
    } catch (e: any) {
      if (e.code === 'EACCES') {
        return { success: false, error: 'Sunucuya görsel yazılırken izin hatası alındı (CHMOD 755 gereklidir).' };
      }
      throw e;
    }

    // Eğer standalone modu aktifse standalone klasörüne de eşzamanlı kopyala
    const standaloneDir = join(process.cwd(), '.next', 'standalone', 'public', 'uploads');
    if (existsSync(join(process.cwd(), '.next', 'standalone'))) {
      try {
        mkdirSync(standaloneDir, { recursive: true });
        writeFileSync(join(standaloneDir, uniqueName), buffer);
      } catch (e) {
        console.warn("Standalone upload sync warning:", e);
      }
    }

    // Veritabanına ve frontend'e verilecek dinamiği yüksek URL yolu
    const fileUrl = `/api/uploads/${uniqueName}`;
    return { success: true, url: fileUrl };
  } catch (error: any) {
    console.error("uploadImageAction error:", error);
    return { success: false, error: error.message || 'Dosya sunucuya yazılırken bir hata oluştu.' };
  }
}

export async function uploadMultipleImagesAction(formData: FormData) {
  try {
    const files = formData.getAll('files') as File[];
    if (!files || files.length === 0) {
      return { success: false, error: 'Hiçbir dosya seçilmedi.' };
    }

    const uploadedUrls: string[] = [];
    const mainUploadDir = join(process.cwd(), 'public', 'uploads');
    const standaloneDir = join(process.cwd(), '.next', 'standalone', 'public', 'uploads');
    const isStandalone = existsSync(join(process.cwd(), '.next', 'standalone'));

    try {
      mkdirSync(mainUploadDir, { recursive: true });
      if (isStandalone) {
        mkdirSync(standaloneDir, { recursive: true });
      }
    } catch (e: any) {
      if (e.code === 'EACCES') {
        return { success: false, error: 'Sunucuda public/uploads klasörünün yazma izni (CHMOD 755/777) yok.' };
      }
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split('.').pop() || 'jpg';
      const cleanName = file.name
        .replace(`.${ext}`, '')
        .replace(/[^a-zA-Z0-9]/g, '_');
      const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${cleanName}.${ext}`;
      const filePath = join(mainUploadDir, uniqueName);

      writeFileSync(filePath, buffer);

      if (isStandalone) {
        try {
          writeFileSync(join(standaloneDir, uniqueName), buffer);
        } catch (e) {
          console.warn("Standalone sync warning:", e);
        }
      }

      uploadedUrls.push(`/api/uploads/${uniqueName}`);
    }

    if (uploadedUrls.length === 0) {
      return { success: false, error: 'Uygun görsel formatında dosya yüklenemedi.' };
    }

    return { success: true, urls: uploadedUrls };
  } catch (error: any) {
    console.error("uploadMultipleImagesAction error:", error);
    return { success: false, error: error.message || 'Görseller yüklenirken bir hata oluştu.' };
  }
}

