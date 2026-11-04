// Yönetici şifresi için .env'e yazılacak özeti üretir.
// Kullanım: node scripts/admin-sifre.mjs 'YeniŞifre'
import { scryptSync, randomBytes } from 'node:crypto';
const pw = process.argv[2];
if (!pw || pw.length < 8) {
  console.error('Kullanım: node scripts/admin-sifre.mjs "en-az-8-karakterli-şifre"');
  process.exit(1);
}
const N = 16384, r = 8, p = 1;
const salt = randomBytes(16);
const key = scryptSync(pw.normalize('NFKC'), salt, 64, { N, r, p, maxmem: 64 * 1024 * 1024 });
console.log(`ADMIN_PASSWORD_HASH=scrypt:${N}:${r}:${p}:${salt.toString('base64url')}:${key.toString('base64url')}`);
