import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Arama ve yapay zekâ botları metadatayı (title, canonical, JSON-LD) <head> içinde, akışsız alsın.
  htmlLimitedBots:
    /Googlebot|Google-InspectionTool|Bingbot|bingbot|YandexBot|DuckDuckBot|Applebot|GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Discordbot|bot|crawler|spider/i,
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  poweredByHeader: false,
  async headers() {
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    ];
    return [
      { source: '/:path*', headers: security },
      // Yüklenen dosyalar asla betik çalıştıramaz.
      { source: '/uploads/:path*', headers: [{ key: 'Content-Security-Policy', value: "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox" }] },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
