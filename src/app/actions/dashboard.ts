"use server";

import { requireAdmin } from '@/lib/auth';

import prisma from "@/lib/db";

export async function getDashboardStats() {
  try {
    await requireAdmin();
    const serviceCount = await prisma.service.count();
    const galleryCount = await prisma.galleryItem.count();
    const blogCount = await prisma.blogPost.count({ where: { status: 'Yayında' } });
    const quoteCount = await prisma.quote.count();

    // Fetch recent activities (combining latest from a few tables for demo purposes)
    const recentQuotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      take: 2,
      select: { name: true, service: true, createdAt: true }
    });
    const recentBlogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 2,
      select: { title: true, createdAt: true }
    });
    
    const activities: any[] = [];
    
    recentQuotes.forEach(q => {
      activities.push({
        type: `Randevu talebi · ${q.service}`,
        title: q.name,
        time: q.createdAt,
        color: 'text-blue-600 bg-blue-100'
      });
    });

    recentBlogs.forEach(b => {
      activities.push({
        type: 'Blog yazısı',
        title: b.title,
        time: b.createdAt,
        color: 'text-amber-600 bg-amber-100'
      });
    });

    // Sort by time descending
    activities.sort((a, b) => b.time.getTime() - a.time.getTime());

    // Format time to string
    const formattedActivities = activities.slice(0, 4).map(act => {
      const diffHours = Math.floor((new Date().getTime() - act.time.getTime()) / (1000 * 60 * 60));
      let timeStr = `${diffHours} saat önce`;
      if (diffHours >= 24) {
        timeStr = `${Math.floor(diffHours / 24)} gün önce`;
      } else if (diffHours === 0) {
        timeStr = "Yeni";
      }

      return {
        ...act,
        time: timeStr
      };
    });

    return {
      success: true,
      stats: {
        services: serviceCount,
        gallery: galleryCount,
        blogs: blogCount,
        quotes: quoteCount
      },
      recentActivity: formattedActivities
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return { success: false, error: "Bir hata oluştu." };
  }
}
