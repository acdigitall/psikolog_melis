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
