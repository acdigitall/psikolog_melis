/**
 * Sunucu tarafı kimlik doğrulama (yalnızca sunucuda çalışır: next/headers + node:crypto).
 * - Şifre .env'de düz metin değil, scrypt özeti olarak tutulur (ADMIN_PASSWORD_HASH).
 * - Oturum, httpOnly + SameSite=Lax + (üretimde) Secure çerezde imzalı belirteçtir.
 * - Her yönetim aksiyonu requireAdmin() ile korunur; proxy ve layout kontrolleri buna ek katmandır.
 */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { scrypt as scryptCb, randomBytes, timingSafeEqual, type ScryptOptions } from 'node:crypto';
import { SESSION_COOKIE, createSessionToken, verifySessionToken, type SessionPayload } from '@/lib/session-token';

const scrypt = (password: string, salt: Buffer, keylen: number, opts: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) =>
    scryptCb(password, salt, keylen, opts, (err, key) => (err ? reject(err) : resolve(key))),
  );

/** Biçim: scrypt:N:r:p:tuz(base64url):özet(base64url) — .env'de "$" genişlemesine takılmaması için ":" ayraçlı. */
export async function hashPassword(password: string): Promise<string> {
  const N = 16384, r = 8, p = 1;
  const salt = randomBytes(16);
  const key = await scrypt(password.normalize('NFKC'), salt, 64, { N, r, p, maxmem: 64 * 1024 * 1024 });
  return `scrypt:${N}:${r}:${p}:${salt.toString('base64url')}:${key.toString('base64url')}`;
}

// E-posta yanlışken de aynı süre harcansın diye kullanılan sahte özet (zamanlama farkıyla kullanıcı tespiti engellenir).
const DUMMY_HASH = 'scrypt:16384:8:1:AAAAAAAAAAAAAAAAAAAAAA:' + 'A'.repeat(86);

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(':');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  const expected = Buffer.from(hashB64, 'base64url');
  if (expected.length !== 64) return false;
  try {
    const key = await scrypt(password.normalize('NFKC'), Buffer.from(saltB64, 'base64url'), expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
      maxmem: 64 * 1024 * 1024,
    });
    return timingSafeEqual(key, expected);
  } catch {
    return false;
  }
}

/** E-posta ve şifreyi doğrular; her iki durumda da şifre özeti hesaplanır. */
export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const adminHash = process.env.ADMIN_PASSWORD_HASH || '';
  if (!adminEmail || !adminHash) {
    console.error('ADMIN_EMAIL veya ADMIN_PASSWORD_HASH tanımlı değil; giriş devre dışı.');
    await verifyPassword(password, DUMMY_HASH);
    return false;
  }
  const emailOk = email.trim().toLowerCase() === adminEmail;
  const passOk = await verifyPassword(password, emailOk ? adminHash : DUMMY_HASH);
  return emailOk && passOk;
}

export async function startSession(email: string) {
  const { token, expires } = createSessionToken(email.trim().toLowerCase());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** Yönetim aksiyonlarının başında çağrılır: oturum yoksa işlem yapılmaz. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getAdminSession();
  if (!session) throw new Error('Yetkisiz işlem. Lütfen yeniden giriş yapın.');
  return session;
}

/** Yönetim sayfaları için: oturum yoksa giriş sayfasına yönlendirir. */
export async function requireAdminPage(): Promise<SessionPayload> {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return session;
}
