"use client";

import Link from 'next/link';
import { useActionState } from 'react';
import { loginAction, type LoginState } from '@/app/actions/auth';

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, undefined);

  const field =
    'w-full h-12 rounded-xl border border-line bg-white px-4 text-ink placeholder:text-muted/60 transition-colors focus:border-forest focus:outline-none focus:ring-4 focus:ring-forest/10';

  return (
    <div className="min-h-screen bg-sand/70 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[440px]">
        <div className="mb-8 text-center">
          <p className="font-serif text-[1.6rem] leading-none text-forest">Uzm. Klinik Psikolog</p>
          <p className="mt-2 text-sm text-muted">Yönetim paneli</p>
        </div>

        <div className="rounded-[1.75rem] border border-line bg-paper px-6 py-9 shadow-[0_20px_50px_-24px_rgba(23,50,31,0.25)] sm:px-10">
          <h1 className="font-serif text-[1.9rem] leading-tight text-forest">Giriş yapın</h1>
          <p className="mt-2 text-[15px] text-muted">Devam etmek için yönetici bilgilerinizi girin.</p>

          <form action={formAction} className="mt-8 space-y-5">
            {state?.error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-ink/80">E-posta adresi</label>
              <input id="email" name="email" type="email" autoComplete="username" required maxLength={254} className={field} placeholder="admin@psikolog.com" />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-ink/80">Şifre</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={256} className={field} placeholder="••••••••" />
            </div>

            <button type="submit" disabled={pending} className="btn-primary mt-2 w-full disabled:opacity-60">
              {pending ? 'Kontrol ediliyor…' : 'Giriş yap'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted transition-colors hover:text-forest">← Siteye dön</Link>
        </div>
      </div>
    </div>
  );
}
