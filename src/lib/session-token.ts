/**
 * Yönetim paneli oturum belirteci (HMAC-SHA256 imzalı, süreli).
 * Hem proxy'de hem sunucu bileşenlerinde/aksiyonlarda kullanılır; yalnızca Node.js çalışma zamanında çalışır.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'psk_admin_session';
export const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 saat

export interface SessionPayload {
  sub: string; // yönetici e-postası
  iat: number;
  exp: number;
}

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error('SESSION_SECRET ortam değişkeni eksik veya 32 karakterden kısa.');
  }
  return s;
}

const b64url = (buf: Buffer | string) => Buffer.from(buf).toString('base64url');

function sign(data: string): string {
  return createHmac('sha256', getSecret()).update(data).digest('base64url');
}

export function createSessionToken(sub: string): { token: string; expires: Date } {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { sub, iat: now, exp: now + SESSION_TTL_SECONDS };
  const body = b64url(JSON.stringify(payload));
  return { token: `${body}.${sign(body)}`, expires: new Date(payload.exp * 1000) };
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token || token.length > 1024) return null;
  const [body, sig, extra] = token.split('.');
  if (!body || !sig || extra !== undefined) return null;

  let expected: string;
  try {
    expected = sign(body);
  } catch {
    return null; // gizli anahtar yoksa hiçbir oturum geçerli sayılmaz
  }
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof payload.sub !== 'string' || typeof payload.exp !== 'number') return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
    // Yönetici e-postası değiştirildiyse eski oturumlar geçersiz olur.
    if (payload.sub !== (process.env.ADMIN_EMAIL || '').trim().toLowerCase()) return null;
    return payload;
  } catch {
    return null;
  }
}
