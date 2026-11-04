import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session-token';

/**
 * Yönetim panelinin ilk savunma hattı: geçerli oturum yoksa /admin/* isteklerini giriş sayfasına yönlendirir.
 * Asıl yetki kontrolü ayrıca her sunucu aksiyonunda (requireAdmin) ve panel layout'unda yapılır.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === '/admin/login';
  const session = verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);

  if (!session && !isLogin) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
  }
  if (session && isLogin) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
