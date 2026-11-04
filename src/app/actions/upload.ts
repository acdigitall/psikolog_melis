"use server";

import { requireAdmin } from '@/lib/auth';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

/**
 * Güvenli dosya yükleme:
 * - Yalnızca yönetici (requireAdmin).
 * - Tür, tarayıcının bildirdiği MIME'a değil dosyanın gerçek içeriğine (imza baytları) göre belirlenir.
 * - Uzantı kullanıcı dosya adından değil doğrulanmış türden üretilir; dosya adı rastgeledir (yol/HTML enjeksiyonu yok).
 * - SVG kabul edilmez (içine betik gömülebildiği için).
 */
type Kind = { ext: string; mime: string };

function detect(buf: Buffer): Kind | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: 'jpg', mime: 'image/jpeg' };
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: 'png', mime: 'image/png' };
  if (buf.subarray(0, 4).toString('latin1') === 'GIF8') return { ext: 'gif', mime: 'image/gif' };
  if (buf.subarray(0, 4).toString('latin1') === 'RIFF' && buf.subarray(8, 12).toString('latin1') === 'WEBP') return { ext: 'webp', mime: 'image/webp' };
  if (buf.subarray(0, 5).toString('latin1') === '%PDF-') return { ext: 'pdf', mime: 'application/pdf' };
  return null;
}

const IMAGE_MAX = 8 * 1024 * 1024;
const PDF_MAX = 15 * 1024 * 1024;

function uploadDirs() {
  const main = join(process.cwd(), 'public', 'uploads');
  const standaloneRoot = join(process.cwd(), '.next', 'standalone');
  const standalone = existsSync(standaloneRoot) ? join(standaloneRoot, 'public', 'uploads') : null;
  mkdirSync(main, { recursive: true });
  if (standalone) mkdirSync(standalone, { recursive: true });
  return { main, standalone };
}

async function saveFile(file: File, allowPdf: boolean): Promise<{ url: string } | { error: string }> {
  if (!(file instanceof File) || file.size === 0) return { error: 'Dosya seçilmedi veya boş.' };
  if (file.size > PDF_MAX) return { error: 'Dosya 15 MB’tan büyük olamaz.' };

  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = detect(buffer);
  if (!kind || (kind.ext === 'pdf' && !allowPdf)) {
    return { error: allowPdf ? 'Yalnızca JPG, PNG, WEBP, GIF görselleri veya PDF yükleyebilirsiniz.' : 'Yalnızca JPG, PNG, WEBP veya GIF görselleri yükleyebilirsiniz.' };
  }
  if (kind.ext !== 'pdf' && buffer.length > IMAGE_MAX) return { error: 'Görsel 8 MB’tan büyük olamaz.' };

  const name = `${Date.now()}_${randomUUID().replace(/-/g, '').slice(0, 12)}.${kind.ext}`;
  const { main, standalone } = uploadDirs();
  writeFileSync(join(main, name), buffer);
  if (standalone) {
    try {
      writeFileSync(join(standalone, name), buffer);
    } catch (e) {
      console.warn('Standalone upload sync warning:', e);
    }
  }
  return { url: `/api/uploads/${name}` };
}

function friendly(e: any) {
  if (e?.code === 'EACCES') return 'Sunucuda public/uploads klasörüne yazma izni yok (CHMOD 755 gerekli).';
  if (e?.message?.startsWith('Yetkisiz')) return e.message;
  return 'Dosya yüklenirken bir hata oluştu.';
}

export async function uploadImageAction(formData: FormData) {
  try {
    await requireAdmin();
    const res = await saveFile(formData.get('file') as File, true);
    return 'error' in res ? { success: false, error: res.error } : { success: true, url: res.url };
  } catch (error: any) {
    console.error('uploadImageAction error:', error);
    return { success: false, error: friendly(error) };
  }
}

export async function uploadMultipleImagesAction(formData: FormData) {
  try {
    await requireAdmin();
    const files = formData.getAll('files').slice(0, 30) as File[];
    if (files.length === 0) return { success: false, error: 'Hiçbir dosya seçilmedi.' };

    const uploadedUrls: string[] = [];
    for (const file of files) {
      const res = await saveFile(file, false);
      if ('url' in res) uploadedUrls.push(res.url);
    }
    if (uploadedUrls.length === 0) return { success: false, error: 'Uygun görsel formatında dosya yüklenemedi.' };
    return { success: true, urls: uploadedUrls };
  } catch (error: any) {
    console.error('uploadMultipleImagesAction error:', error);
    return { success: false, error: friendly(error) };
  }
}
