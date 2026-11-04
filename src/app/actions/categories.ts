"use server";

import { requireAdmin } from '@/lib/auth';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

const defaultCategories = ["Konut", "Otel", "Ofis", "Restoran", "Eğitim", "Sağlık", "Üretim (Fabrika)"];

export async function getCategories() {
  try {
    let categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    if (categories.length === 0) {
      await prisma.category.createMany({
        data: defaultCategories.map(name => ({ name })),
        skipDuplicates: true
      });
      categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
      });
    }

    return { success: true, data: categories };
  } catch (error: any) {
    console.error("getCategories error:", error);
    return { success: false, error: error.message || "Kategoriler çekilemedi." };
  }
}

export async function createCategory(name: string) {
  try {
    await requireAdmin();
    const trimmedName = name.trim();
    if (!trimmedName) return { success: false, error: "Kategori adı boş olamaz." };

    const existing = await prisma.category.findUnique({
      where: { name: trimmedName }
    });

    if (existing) {
      return { success: false, error: "Bu kategori zaten mevcut." };
    }

    const newCategory = await prisma.category.create({
      data: { name: trimmedName }
    });

    revalidatePath('/admin/categories');
    revalidatePath('/quote');
    revalidatePath('/admin/gallery');
    return { success: true, data: newCategory };
  } catch (error: any) {
    console.error("createCategory error:", error);
    return { success: false, error: error.message || "Kategori eklenemedi." };
  }
}

export async function updateCategory(id: number, name: string) {
  try {
    await requireAdmin();
    const trimmedName = name.trim();
    if (!trimmedName) return { success: false, error: "Kategori adı boş olamaz." };

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name: trimmedName }
    });

    revalidatePath('/admin/categories');
    revalidatePath('/quote');
    revalidatePath('/admin/gallery');
    return { success: true, data: updatedCategory };
  } catch (error: any) {
    console.error("updateCategory error:", error);
    return { success: false, error: error.message || "Kategori güncellenemedi." };
  }
}

export async function deleteCategory(id: number) {
  try {
    await requireAdmin();
    await prisma.category.delete({
      where: { id }
    });
    revalidatePath('/admin/categories');
    revalidatePath('/quote');
    revalidatePath('/admin/gallery');
    return { success: true };
  } catch (error: any) {
    console.error("deleteCategory error:", error);
    return { success: false, error: error.message || "Kategori silinemedi." };
  }
}
