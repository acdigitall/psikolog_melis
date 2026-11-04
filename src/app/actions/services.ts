"use server";

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Tüm hizmetleri getir
export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { id: 'asc' }
    });
    return { success: true, data: services };
  } catch (error: any) {
    console.error("getServices error:", error);
    return { success: false, error: error.message || "Hizmetler çekilemedi." };
  }
}

// Slug'a göre hizmet getir
export async function getServiceBySlug(slug: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug }
    });
    return { success: true, data: service };
  } catch (error: any) {
    console.error("getServiceBySlug error:", error);
    return { success: false, error: error.message || "Hizmet bulunamadı." };
  }
}

// Yeni hizmet ekle
export async function createService(formData: {
  slug: string;
  title: string;
  desc: string;
  longDesc: string;
  features: string;
  steps: string;
  img: string;
  metaTitle?: string;
  metaDesc?: string;
  metaKeys?: string;
  isFeatured?: boolean;
}) {
  try {
    const newService = await prisma.service.create({
      data: {
        ...formData,
        isFeatured: formData.isFeatured || false
      }
    });

    revalidatePath('/services');
    revalidatePath('/admin/services');
    return { success: true, data: newService };
  } catch (error: any) {
    console.error("createService error:", error);
    // Eğer slug benzersiz değilse
    if (error.code === 'P2002') {
      return { success: false, error: "Bu URL (slug) zaten kullanımda. Lütfen başka bir URL belirleyin." };
    }
    return { success: false, error: error.message || "Hizmet eklenemedi." };
  }
}

// Hizmeti güncelle
export async function updateService(
  id: number,
  formData: {
    slug?: string;
    title?: string;
    desc?: string;
    longDesc?: string;
    features?: string;
    steps?: string;
    img?: string;
    metaTitle?: string;
    metaDesc?: string;
    metaKeys?: string;
    isFeatured?: boolean;
  }
) {
  try {
    const updatedService = await prisma.service.update({
      where: { id },
      data: formData
    });

    revalidatePath('/services');
    revalidatePath('/admin/services');
    if (formData.slug) {
      revalidatePath(`/services/${formData.slug}`);
    }
    return { success: true, data: updatedService };
  } catch (error: any) {
    console.error("updateService error:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "Bu URL (slug) zaten kullanımda." };
    }
    return { success: false, error: error.message || "Hizmet güncellenemedi." };
  }
}

// Hizmeti sil
export async function deleteService(id: number) {
  try {
    await prisma.service.delete({
      where: { id }
    });
    revalidatePath('/services');
    revalidatePath('/admin/services');
    return { success: true };
  } catch (error: any) {
    console.error("deleteService error:", error);
    return { success: false, error: error.message || "Hizmet silinemedi." };
  }
}
