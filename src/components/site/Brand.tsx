import Image from 'next/image';

export default function Brand({
  logo,
  variant = 'dark',
}: {
  logo?: string | null;
  variant?: 'dark' | 'light';
}) {
  if (logo) {
    return (
      <Image src={logo} alt="Uzm. Klinik Psikolog" width={170} height={52} priority unoptimized className="h-10 w-auto object-contain" />
    );
  }

  const main = variant === 'light' ? 'text-paper' : 'text-forest';
  const sub = variant === 'light' ? 'text-paper/60' : 'text-muted';

  return (
    <span className="flex flex-col leading-none">
      <span className={`font-serif text-[1.35rem] tracking-[-0.01em] ${main}`}>Uzm. Klinik Psikolog</span>
      <span className={`mt-1.5 text-[12px] ${sub}`}>Psikoterapi · Kadıköy & Online</span>
    </span>
  );
}
