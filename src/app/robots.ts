import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Arama motorları ve yapay zekâ arama botları (GEO) için açık erişim; yalnızca admin kapalı.
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'YandexBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/'] },
      { userAgent: AI_BOTS, allow: '/', disallow: ['/admin', '/admin/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
