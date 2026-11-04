"use server";

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { checkCredentials, startSession, endSession } from '@/lib/auth';

/**
 * Kaba kuvvet koruması: IP başına 15 dakikada 5 hatalı deneme, tüm IP'ler için toplam 30.
 * Sınır aşılınca giriş geçici olarak kilitlenir. (Tek sunucu sürecinde bellekte tutulur.)
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 5;
const MAX_GLOBAL = 30;
const failures = new Map<string, number[]>();

function recent(key: string) {
  const now = Date.now();
  const list = (failures.get(key) || []).filter((t) => now - t < WINDOW_MS);
  failures.set(key, list);
  return list;
}

async function clientIp() {
  const h = await headers();
  return (h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'yerel').trim().slice(0, 64);
}

export type LoginState = { error?: string } | undefined;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!email || !password || email.length > 254 || password.length > 256) {
    return { error: 'E-posta ve şifre gerekli.' };
  }

  const ip = await clientIp();
  if (recent(`ip:${ip}`).length >= MAX_PER_IP || recent('global').length >= MAX_GLOBAL) {
    return { error: 'Çok fazla hatalı deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin.' };
  }

  const ok = await checkCredentials(email, password);
  if (!ok) {
    recent(`ip:${ip}`).push(Date.now());
    recent('global').push(Date.now());
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
    return { error: 'E-posta veya şifre hatalı.' };
  }

  failures.delete(`ip:${ip}`);
  await startSession(email);
  redirect('/admin');
}

export async function logoutAction() {
  await endSession();
  redirect('/admin/login');
}
