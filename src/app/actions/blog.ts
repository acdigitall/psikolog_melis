"use server";

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Türkçe karakterleri temizleyen ve slug oluşturan yardımcı fonksiyon
function slugify(text: string) {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i',
    'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
  };
  let result = text;
  for (const key in trMap) {
    result = result.replace(new RegExp(key, 'g'), trMap[key]);
  }
  return result
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Boşlukları - ile değiştir
    .replace(/[^\w\-]+/g, '')       // Kelime ve - harici karakterleri sil
    .replace(/\-\-+/g, '-')         // Çoklu - işaretlerini teke indir
    .replace(/^-+/, '')             // Başındaki - işaretlerini sil
    .replace(/-+$/, '');            // Sonundaki - işaretlerini sil
}

// Bütün blog yazılarını getir (Admin ve Genel sayfa için)
export async function getBlogPosts(onlyPublished = false) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: onlyPublished ? { status: "Yayında" } : {},
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: posts };
  } catch (error: any) {
    console.error("getBlogPosts error:", error);
    return { success: false, error: error.message || "Blog yazıları çekilemedi." };
  }
}

// Slug ile tek bir blog yazısı getir
export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });
    if (!post) return { success: false, error: "Yazı bulunamadı." };

    // Görüntülenme sayısını artır
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    return { success: true, data: post };
  } catch (error: any) {
    console.error("getBlogPostBySlug error:", error);
    return { success: false, error: error.message || "Yazı detayları alınamadı." };
  }
}

// Yeni blog yazısı oluştur
export async function createBlogPost(formData: {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  status?: string;
  image?: string;
  metaTitle?: string;
  metaDesc?: string;
  metaKeys?: string;
}) {
  try {
    const { title, category, excerpt, content, status, image, metaTitle, metaDesc, metaKeys } = formData;
    const baseSlug = slugify(title);
    
    // Benzersiz bir slug oluştur (aynı isimde varsa sonuna sayı ekler)
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await prisma.blogPost.findUnique({ where: { slug } });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        category,
        excerpt,
        content,
        status: status || "Yayında",
        image: image || null,
        metaTitle,
        metaDesc,
        metaKeys,
      }
    });

    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    return { success: true, data: newPost };
  } catch (error: any) {
    console.error("createBlogPost error:", error);
    return { success: false, error: error.message || "Yazı oluşturulamadı." };
  }
}

// Blog yazısını güncelle
export async function updateBlogPost(id: number, formData: {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  status: string;
  image?: string;
  metaTitle?: string;
  metaDesc?: string;
  metaKeys?: string;
}) {
  try {
    const { title, category, excerpt, content, status, image, metaTitle, metaDesc, metaKeys } = formData;
    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) return { success: false, error: "Yazı bulunamadı." };

    let slug = existingPost.slug;
    // Eğer başlık değiştiyse yeni bir slug üret
    if (existingPost.title !== title) {
      const baseSlug = slugify(title);
      slug = baseSlug;
      let counter = 1;
      while (true) {
        const existing = await prisma.blogPost.findUnique({ where: { slug } });
        if (!existing || existing.id === id) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        category,
        excerpt,
        content,
        status,
        image: image !== undefined ? image : existingPost.image,
        metaTitle,
        metaDesc,
        metaKeys,
      }
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/admin/blog');
    return { success: true, data: updatedPost };
  } catch (error: any) {
    console.error("updateBlogPost error:", error);
    return { success: false, error: error.message || "Yazı güncellenemedi." };
  }
}

// Blog yazısını sil
export async function deleteBlogPost(id: number) {
  try {
    await prisma.blogPost.delete({
      where: { id }
    });
    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    return { success: true };
  } catch (error: any) {
    console.error("deleteBlogPost error:", error);
    return { success: false, error: error.message || "Yazı silinemedi." };
  }
}
