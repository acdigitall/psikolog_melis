"use server";

import { requireAdmin } from '@/lib/auth';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

// Randevu talebi gönder (herkese açık) — girdi doğrulama ve kötüye kullanım sınırı ile.
const QUOTE_WINDOW_MS = 60 * 60 * 1000;
const QUOTE_MAX_PER_IP = 5;
const quoteHits = new Map<string, number[]>();

const clean = (v: unknown, max: number) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);

export async function submitQuote(formData: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) {
  try {
    const name = clean(formData?.name, 120);
    const email = clean(formData?.email, 254);
    const phone = clean(formData?.phone, 40);
    const service = clean(formData?.service, 120);
    const message = clean(formData?.message, 3000);

    if (name.length < 2) return { success: false, error: 'Lütfen adınızı yazın.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { success: false, error: 'Lütfen geçerli bir e-posta adresi yazın.' };
    if (phone && !/^[0-9+()\s-]{7,40}$/.test(phone)) return { success: false, error: 'Lütfen geçerli bir telefon numarası yazın.' };

    const h = await headers();
    const ip = (h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'yerel').trim().slice(0, 64);
    const now = Date.now();
    const hits = (quoteHits.get(ip) || []).filter((t) => now - t < QUOTE_WINDOW_MS);
    if (hits.length >= QUOTE_MAX_PER_IP) {
      return { success: false, error: 'Kısa sürede çok fazla talep gönderildi. Lütfen daha sonra tekrar deneyin ya da telefonla ulaşın.' };
    }
    hits.push(now);
    quoteHits.set(ip, hits);

    await prisma.quote.create({
      data: { name, email, phone, service, message, status: "Yeni" },
    });

    revalidatePath('/admin/quotes');
    return { success: true };
  } catch (error: any) {
    console.error("submitQuote error:", error);
    return { success: false, error: "Talebiniz şu anda gönderilemedi. Lütfen telefonla ulaşın." };
  }
}

// Bütün teklif isteklerini getir (Sadece Admin için)
export async function getQuotes() {
  try {
    await requireAdmin();
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: quotes };
  } catch (error: any) {
    console.error("getQuotes error:", error);
    return { success: false, error: error.message || "Teklif talepleri çekilemedi." };
  }
}

// Teklif durumunu güncelle (örn: "Okundu", "Cevaplandı")
export async function updateQuoteStatus(id: number, status: string) {
  try {
    await requireAdmin();
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: { status }
    });

    revalidatePath('/admin/quotes');
    return { success: true, data: updatedQuote };
  } catch (error: any) {
    console.error("updateQuoteStatus error:", error);
    return { success: false, error: error.message || "Durum güncellenemedi." };
  }
}

// Teklif talebini sil
export async function deleteQuote(id: number) {
  try {
    await requireAdmin();
    await prisma.quote.delete({
      where: { id }
    });
    revalidatePath('/admin/quotes');
    return { success: true };
  } catch (error: any) {
    console.error("deleteQuote error:", error);
    return { success: false, error: error.message || "Talep silinemedi." };
  }
}
