"use server";

import { requireAdmin } from '@/lib/auth';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Bütün galeri ögelerini getir
export async function getGalleryItems() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: items };
  } catch (error: any) {
    console.error("getGalleryItems error:", error);
    return { success: false, error: error.message || "Galeri ögeleri çekilemedi." };
  }
}

// Yeni galeri ögesi ekle
export async function createGalleryItem(formData: {
  title: string;
  category: string;
  img?: string;
  metaTitle?: string;
  metaDesc?: string;
  metaKeys?: string;
  order?: number;
}) {
  try {
    await requireAdmin();
    const { title, category, img, metaTitle, metaDesc, metaKeys, order } = formData;
    const newItem = await prisma.galleryItem.create({
      data: {
        title,
        category,
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
        metaKeys: metaKeys || null,
        img: img || "/images/klinik-oturma.jpg",
        order: order !== undefined ? order : 999, // Varsayılan 999 olsun ki 1 girildiğinde en üste çıksın
      }
    });

    revalidatePath('/gallery');
    revalidatePath('/admin/gallery');
    return { success: true, data: newItem };
  } catch (error: any) {
    console.error("createGalleryItem error:", error);
    return { success: false, error: error.message || "Görsel eklenemedi." };
  }
}

// Galeri ögesini sil
export async function deleteGalleryItem(id: number) {
  try {
    await requireAdmin();
    await prisma.galleryItem.delete({
      where: { id }
    });
    revalidatePath('/gallery');
    revalidatePath('/admin/gallery');
    return { success: true };
  } catch (error: any) {
    console.error("deleteGalleryItem error:", error);
    return { success: false, error: error.message || "Görsel silinemedi." };
  }
}

// Galeri ögesini güncelle
export async function updateGalleryItem(
  id: number,
  formData: {
    title?: string;
    category?: string;
    img?: string;
    metaTitle?: string;
    metaDesc?: string;
    metaKeys?: string;
    order?: number;
  }
) {
  try {
    await requireAdmin();
    const updatedItem = await prisma.galleryItem.update({
      where: { id },
      data: {
        ...(formData.title && { title: formData.title }),
        ...(formData.category && { category: formData.category }),
        ...(formData.img && { img: formData.img }),
        ...(formData.metaTitle !== undefined && { metaTitle: formData.metaTitle }),
        ...(formData.metaDesc !== undefined && { metaDesc: formData.metaDesc }),
        ...(formData.metaKeys !== undefined && { metaKeys: formData.metaKeys }),
        ...(formData.order !== undefined && { order: formData.order }),
      }
    });

    revalidatePath('/gallery');
    revalidatePath('/admin/gallery');
    return { success: true, data: updatedItem };
  } catch (error: any) {
    console.error("updateGalleryItem error:", error);
    return { success: false, error: error.message || "Görsel güncellenemedi." };
  }
}
