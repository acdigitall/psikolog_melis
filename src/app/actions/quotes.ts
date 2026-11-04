"use server";

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Yeni teklif isteği gönder
export async function submitQuote(formData: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) {
  try {
    const { name, email, phone, service, message } = formData;
    const newQuote = await prisma.quote.create({
      data: {
        name,
        email,
        phone,
        service,
        message,
        status: "Yeni", // Varsayılan durum
      }
    });

    revalidatePath('/admin/quotes');
    return { success: true, data: newQuote };
  } catch (error: any) {
    console.error("submitQuote error:", error);
    return { success: false, error: error.message || "Teklif talebi gönderilemedi." };
  }
}

// Bütün teklif isteklerini getir (Sadece Admin için)
export async function getQuotes() {
  try {
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
