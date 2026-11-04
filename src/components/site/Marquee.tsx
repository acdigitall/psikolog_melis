export default function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  if (items.length === 0) return null;
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="px-8 font-serif text-[clamp(1.6rem,1.2rem+1.4vw,2.6rem)] italic">{t}</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 opacity-60" aria-hidden="true">
            <path d="M12 2c.6 4.8 2.6 7.4 10 10-7.4 2.6-9.4 5.2-10 10-.6-4.8-2.6-7.4-10-10 7.4-2.6 9.4-5.2 10-10z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee overflow-hidden py-7 ${className}`}>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
