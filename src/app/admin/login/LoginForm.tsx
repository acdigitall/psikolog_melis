"use client";

import Link from 'next/link';
import { useActionState } from 'react';
import { loginAction, type LoginState } from '@/app/actions/auth';

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, undefined);

  const field =
    'w-full h-12 rounded-md border border-line bg-white px-4 text-ink transition-colors focus:border-forest focus:outline-none';

  return (
    <div className="min-h-screen bg-sand/70 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[460px]">
        <div className="mb-8">
          <h1 className="font-serif text-[2.25rem] leading-tight text-forest">Yönetim paneli</h1>
          <p className="mt-1 text-base text-muted">Uzm. Klinik Psikolog melis Sağlam</p>
        </div>

        <div className="rounded-lg border border-line bg-paper p-8 sm:p-10">
          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[15px] text-red-800">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-base font-medium text-ink/80">E-posta</label>
              <input id="email" name="email" type="email" autoComplete="username" required maxLength={254} className={field} />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-base font-medium text-ink/80">Şifre</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={256} className={field} />
            </div>

            <button type="submit" disabled={pending} className="btn-primary mt-2 w-full disabled:opacity-60">
              {pending ? 'Kontrol ediliyor…' : 'Giriş yap'}
            </button>
          </form>
        </div>

        <div className="mt-5">
          <Link href="/" className="text-base text-muted transition-colors hover:text-forest">Siteye dön</Link>
        </div>
      </div>
    </div>
  );
}
