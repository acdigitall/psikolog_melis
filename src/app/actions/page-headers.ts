"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPageHeader(pageIdentifier: string) {
  try {
    const header = await prisma.pageHeader.findUnique({
      where: { pageIdentifier },
    });
    return { success: true, data: header };
  } catch (error) {
    console.error(`Error fetching page header for ${pageIdentifier}:`, error);
    return { success: false, message: "Sayfa başlığı alınırken bir hata oluştu." };
  }
}

export async function getAllPageHeaders() {
  try {
    const headers = await prisma.pageHeader.findMany();
    return { success: true, data: headers };
  } catch (error) {
    console.error("Error fetching all page headers:", error);
    return { success: false, message: "Sayfa başlıkları alınırken bir hata oluştu." };
  }
}

export async function updatePageHeader(pageIdentifier: string, title: string, description: string) {
  try {
    const updated = await prisma.pageHeader.upsert({
      where: { pageIdentifier },
      update: {
        title,
        description,
      },
      create: {
        pageIdentifier,
        title,
        description,
      },
    });
    
    // Yalnızca ilgili sayfanın cache'ini temizle
    revalidatePath(`/${pageIdentifier}`);
    revalidatePath('/admin/page-headers');
    
    return { success: true, data: updated };
  } catch (error) {
    console.error(`Error updating page header for ${pageIdentifier}:`, error);
    return { success: false, message: "Sayfa başlığı güncellenirken bir hata oluştu." };
  }
}
