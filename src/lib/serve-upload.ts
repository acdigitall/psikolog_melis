import { NextResponse } from 'next/server';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, resolve, sep } from 'path';

/**
 * public/uploads içindeki dosyaları güvenli biçimde sunar.
 * Yalnızca tek parçalı, güvenli karakterli dosya adları kabul edilir; klasör dışına çıkış (../) imkânsızdır.
 */
const TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
};

const ROOTS = [join(process.cwd(), 'public', 'uploads'), join(process.cwd(), '.next', 'standalone', 'public', 'uploads')].map((r) =>
  resolve(r),
);

export function serveUpload(segments: string[]): NextResponse {
  const notFound = () => new NextResponse('Not found', { status: 404 });
  if (segments.length !== 1) return notFound();

  let name: string;
  try {
    name = decodeURIComponent(segments[0]);
  } catch {
    return notFound();
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,200}$/.test(name) || name.includes('..')) return notFound();

  const ext = name.split('.').pop()!.toLowerCase();
  const type = TYPES[ext];
  if (!type) return notFound();

  for (const root of ROOTS) {
    const file = resolve(root, name);
    if (!file.startsWith(root + sep)) continue;
    if (!existsSync(file) || !statSync(file).isFile()) continue;

    const headers: Record<string, string> = {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      // Görsel/PDF içinde betik çalıştırılmasını engeller (özellikle eski SVG dosyaları için).
      'Content-Security-Policy': "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
    };
    if (ext === 'svg') headers['Content-Disposition'] = 'inline; filename="image.svg"';
    return new NextResponse(readFileSync(file), { headers });
  }
  return notFound();
}
