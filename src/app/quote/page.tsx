"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { submitQuote } from '@/app/actions/quotes';
import { getCategories } from '@/app/actions/categories';
import PageHero from '@/components/site/PageHero';
import { ArrowRight } from '@/components/site/Icons';

const DEFAULT_CATS = [
  'Bireysel Yetişkin Terapisi',
  'Çift ve İlişki Terapisi',
  'Online Terapi',
  'EMDR & Travma Terapisi',
  'Kaygı & Panik Atak',
  'Depresyon & Yas',
];

const SESSION_TYPES = [
  { value: 'Yüz Yüze Terapi (Klinik)', title: 'Yüz yüze', desc: 'Kadıköy kliniğinde' },
  { value: 'Online Terapi (Görüntülü Görüşme)', title: 'Online', desc: 'Güvenli görüntülü görüşme' },
];

const field =
  'peer w-full border-0 border-b border-forest/25 bg-transparent px-0 pb-3 pt-2 text-[1.05rem] text-ink placeholder:text-ink/35 focus:border-forest focus:outline-none focus:ring-0 transition-colors';
const label = 'block text-sm text-muted';

export default function Quote() {
  const [categories, setCategories] = useState<string[]>([]);
  const [sessionType, setSessionType] = useState(SESSION_TYPES[0].value);
  const [consent, setConsent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get('service');
    (async () => {
      const res = await getCategories();
      const names = res.success && res.data && res.data.length > 0 ? res.data.map((c: any) => c.name) : DEFAULT_CATS;
      const list = preset && !names.includes(preset) ? [preset, ...names] : names;
      setCategories(list);
      setFormData((prev) => ({ ...prev, service: preset || list[0] }));
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setStatus({ type: 'error', text: 'Lütfen ad, e-posta ve telefon alanlarını doldurun.' });
      return;
    }
    if (!consent) {
      setStatus({ type: 'error', text: 'Devam etmek için KVKK aydınlatma metnini onaylamanız gerekiyor.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    const res = await submitQuote({ ...formData, message: `[Seans tercihi: ${sessionType}]\n\n${formData.message}` });
    setLoading(false);
    if (res.success) {
      setStatus({ type: 'success', text: 'Teşekkürler, talebiniz bana ulaştı. En kısa sürede uygun saatlerle size dönüş yapacağım.' });
      setFormData({ name: '', email: '', phone: '', service: categories[0] || '', message: '' });
      setConsent(false);
    } else {
      setStatus({ type: 'error', text: res.error || 'Bir sorun oluştu. Lütfen biraz sonra tekrar deneyin ya da telefonla ulaşın.' });
    }
  };

  return (
    <>
      <PageHero
        image="/images/klinik-oturma.jpg"
        title="Randevu talebi"
        description="Formu doldurun; size uygun gün ve saatleri konuşmak için en kısa sürede dönüş yapayım. Bilgileriniz gizli tutulur."
        crumbs={[{ label: 'Randevu' }]}
      />

      <section className="mx-auto max-w-[1320px] px-6 py-20 md:py-28 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
          <form onSubmit={handleSubmit} className="space-y-12" noValidate>
            {status && (
              <p
                role="status"
                className={`border-l-2 pl-5 py-1 text-[15px] ${status.type === 'success' ? 'border-olive text-forest' : 'border-red-700 text-red-800'}`}
              >
                {status.text}
              </p>
            )}

            <div className="grid gap-10 md:grid-cols-2">
              <label className="block">
                <span className={label}>Ad soyad</span>
                <input type="text" required autoComplete="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={field} />
              </label>
              <label className="block">
                <span className={label}>Telefon</span>
                <input type="tel" required autoComplete="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={field} placeholder="05xx xxx xx xx" />
              </label>
              <label className="block">
                <span className={label}>E-posta</span>
                <input type="email" required autoComplete="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={field} />
              </label>
              <label className="block">
                <span className={label}>Destek almak istediğiniz alan</span>
                <select value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} className={`${field} cursor-pointer`}>
                  {categories.length === 0 && <option value="">Yükleniyor…</option>}
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
            </div>

            <fieldset>
              <legend className={label}>Seans tercihi</legend>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                {SESSION_TYPES.map((t) => {
                  const active = sessionType === t.value;
                  return (
                    <label
                      key={t.value}
                      className={`flex flex-1 cursor-pointer items-center justify-between gap-4 rounded-full border px-6 py-3.5 transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-olive ${
                        active ? 'border-forest bg-forest text-paper' : 'border-forest/25 text-forest hover:border-forest/60'
                      }`}
                    >
                      <input type="radio" name="sessionType" value={t.value} checked={active} onChange={(e) => setSessionType(e.target.value)} className="sr-only" />
                      <span className="font-medium">{t.title}</span>
                      <span className={`text-sm ${active ? 'text-paper/70' : 'text-muted'}`}>{t.desc}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <label className="block">
              <span className={label}>Kısaca sizi neyin getirdiği ve uygun saatleriniz (isteğe bağlı)</span>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`${field} resize-y`}
                placeholder="Ayrıntıya girmek zorunda değilsiniz; birkaç cümle yeterli."
              />
            </label>

            <label className="flex items-start gap-3 text-[15px] text-muted">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#21492C]" />
              <span>
                Kişisel verilerimin randevu planlaması amacıyla işlenmesine ilişkin{' '}
                <Link href="/kvkk" className="text-forest underline underline-offset-4 decoration-forest/30 hover:decoration-forest">aydınlatma metnini</Link> okudum.
              </span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Gönderiliyor…' : <>Talebi gönder <ArrowRight /></>}
            </button>
          </form>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="h-sub">Sonra ne olacak?</h2>
            <ol className="mt-8 border-t border-line">
              {[
                'Talebiniz bana ulaşır; genellikle 1 iş günü içinde dönüş yaparım.',
                'Kısa bir telefon görüşmesiyle ihtiyacınızı ve uygun saatleri konuşuruz.',
                'İlk seansımızı yüz yüze ya da online olarak planlarız.',
              ].map((t, i) => (
                <li key={i} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-5 text-[15px] leading-relaxed text-ink/80">
                  <span className="font-serif italic text-olive">{i + 1}.</span>
                  {t}
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm leading-relaxed text-muted">
              Bu form acil durumlar için uygun değildir. Kendinize ya da bir başkasına zarar verme riski varsa hemen 112&apos;yi arayın.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
