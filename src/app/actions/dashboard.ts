"use server";

import { requireAdmin } from '@/lib/auth';

import prisma from "@/lib/db";

function timeAgo(date: Date) {
  const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (hours >= 24) return `${Math.floor(hours / 24)} gün önce`;
  return hours === 0 ? "Az önce" : `${hours} saat önce`;
}

export async function getDashboardStats() {
  try {
    await requireAdmin();
    const [services, gallery, blogs, drafts, quotes, newQuotes, recentQuotes, recentBlogs] = await Promise.all([
      prisma.service.count(),
      prisma.galleryItem.count(),
      prisma.blogPost.count({ where: { status: 'Yayında' } }),
      prisma.blogPost.count({ where: { status: 'Taslak' } }),
      prisma.quote.count(),
      prisma.quote.count({ where: { status: 'Yeni' } }),
      prisma.quote.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { name: true, service: true, status: true, createdAt: true }
      }),
      prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { title: true, status: true, createdAt: true }
      }),
    ]);

    return {
      success: true,
      stats: { services, gallery, blogs, drafts, quotes, newQuotes },
      recentQuotes: recentQuotes.map(({ createdAt, ...q }) => ({ ...q, time: timeAgo(createdAt) })),
      recentBlogs: recentBlogs.map(({ createdAt, ...b }) => ({ ...b, time: timeAgo(createdAt) })),
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return { success: false, error: "Bir hata oluştu." };
  }
}
