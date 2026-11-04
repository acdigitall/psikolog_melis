"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

const defaultSlides = [
  {
    subtitle: "İzmir Psikolog · Uzm. Klinik Psikolog · Alsancak & Online",
    title: "Pratik, şefkatli ve gerçekten işe yarayan bir terapi",
    desc: "Kaygı, depresyon, ilişki sorunları ve travma sonrası süreçlerde kanıta dayalı yöntemlerle, size özel bir yol haritası oluşturuyoruz.",
    bg: "/images/hero-sakin-oda.jpg",
    order: 1
  },
  {
    subtitle: "Yüz Yüze & Online Seanslar",
    title: "Nerede olursanız olun, güvenli bir alan",
    desc: "Görüntülü görüşmeyle Türkiye'nin ve dünyanın her yerinden, yüz yüze seanslarla aynı özen ve gizlilikle görüşebiliriz.",
    bg: "/images/hero-nefes.jpg",
    order: 2
  },
  {
    subtitle: "Kanıta Dayalı Yöntemler",
    title: "BDT, Şema Terapi ve EMDR ile kalıcı değişim",
    desc: "Belirtileri yalnızca hafifletmek değil; onları besleyen düşünce, duygu ve davranış örüntülerini birlikte dönüştürmek için.",
    bg: "/images/hero-orman-yolu.jpg",
    order: 3
  }
];

export async function getSlides() {
  try {
    let slides = await prisma.slide.findMany({
      orderBy: { order: 'asc' }
    });

    if (slides.length === 0) {
      for (const slide of defaultSlides) {
        await prisma.slide.create({ data: slide });
      }
      slides = await prisma.slide.findMany({
        orderBy: { order: 'asc' }
      });
    }

    return { success: true, data: slides };
  } catch (error: any) {
    console.error("getSlides error:", error);
    return { success: false, error: error.message || "Slaytlar getirilemedi." };
  }
}

export async function createSlide(formData: {
  title: string;
  subtitle: string;
  desc: string;
  bg: string;
  order?: number;
  metaTitle?: string;
  metaDesc?: string;
  metaKeys?: string;
}) {
  try {
    const { title, subtitle, desc, bg, order, metaTitle, metaDesc, metaKeys } = formData;
    const count = await prisma.slide.count();
    
    const newSlide = await prisma.slide.create({
      data: {
        title,
        subtitle,
        desc,
        bg,
        order: order ?? count + 1,
        metaTitle,
        metaDesc,
        metaKeys
      }
    });

    revalidatePath('/');
    revalidatePath('/admin/slides');
    return { success: true, data: newSlide };
  } catch (error: any) {
    console.error("createSlide error:", error);
    return { success: false, error: error.message || "Slayt eklenemedi." };
  }
}

export async function deleteSlide(id: number) {
  try {
    await prisma.slide.delete({
      where: { id }
    });

    revalidatePath('/');
    revalidatePath('/admin/slides');
    return { success: true };
  } catch (error: any) {
    console.error("deleteSlide error:", error);
    return { success: false, error: error.message || "Slayt silinemedi." };
  }
}

export async function updateSlide(id: number, formData: {
  title: string;
  subtitle: string;
  desc: string;
  bg: string;
  order?: number;
  metaTitle?: string;
  metaDesc?: string;
  metaKeys?: string;
}) {
  try {
    const { title, subtitle, desc, bg, order, metaTitle, metaDesc, metaKeys } = formData;
    
    const updatedSlide = await prisma.slide.update({
      where: { id },
      data: {
        title,
        subtitle,
        desc,
        bg,
        metaTitle,
        metaDesc,
        metaKeys,
        ...(order !== undefined && { order })
      }
    });

    revalidatePath('/');
    revalidatePath('/admin/slides');
    return { success: true, data: updatedSlide };
  } catch (error: any) {
    console.error("updateSlide error:", error);
    return { success: false, error: error.message || "Slayt güncellenemedi." };
  }
}
