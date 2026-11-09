import Image from 'next/image';

const BRAND_NAME = 'Uzm. Klinik Psikolog Melisa Sağlam';

export default function Brand({
  logo,
  variant = 'dark',
}: {
  logo?: string | null;
  variant?: 'dark' | 'light';
}) {
  if (logo) {
    return (
      <Image src={logo} alt={BRAND_NAME} width={170} height={52} priority unoptimized className="h-10 w-auto object-contain" />
    );
  }

  const isLight = variant === 'light';
  const main = isLight ? 'text-paper' : 'text-forest';
  const sub = isLight ? 'text-paper/60' : 'text-muted';
  // Logo dosyası şeffaf değil (açık gri damalı zeminde siyah): zemin önce beyaza çekilir, sonra harmanlamayla gizlenir.
  const blend = isLight ? 'brightness-[1.15] invert mix-blend-screen' : 'brightness-[1.15] mix-blend-multiply';

  return (
    <span className="flex items-center gap-2.5">
      <Image src="/logo/psikoloji_logo.png" alt="" width={40} height={40} priority unoptimized className={`h-10 w-10 shrink-0 ${blend}`} />
      <span className="flex flex-col leading-none">
        <span className={`text-[12px] ${sub}`}>Uzm. Klinik Psikolog</span>
        <span className={`mt-1.5 font-serif text-[1.35rem] tracking-[-0.01em] ${main}`}>Melisa Sağlam</span>
      </span>
    </span>
  );
}
