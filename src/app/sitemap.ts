import type { MetadataRoute } from 'next';
import { getServices } from '@/app/actions/services';
import { getBlogPosts } from '@/app/actions/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://psikolog.com';
  const currentDate = new Date();

  // Statik Sayfalar
  const routes = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/services', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/blog', changeFrequency: 'daily' as const, priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/faq', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/gallery', changeFrequency: 'weekly' as const, priority: 0.6 },
    { path: '/quote', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/production', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/kvkk', changeFrequency: 'yearly' as const, priority: 0.4 },
    { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.4 },
    { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.4 },
  ];

  const [servicesRes, blogRes] = await Promise.all([getServices(), getBlogPosts(true)]);
  const services = servicesRes.success && servicesRes.data ? servicesRes.data : [];
  const posts = blogRes.success && blogRes.data ? blogRes.data : [];

  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route.path}`,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...services.map((s: any) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: s.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...posts.map((p: any) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
