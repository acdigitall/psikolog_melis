/**
 * Başlığın son kelimelerini italik ve renkli vurgular.
 * Örn. "Pratik, şefkatli ve gerçekten işe yarayan bir terapi" → "... bir *terapi*"
 */
export default function Accent({
  text,
  words = 1,
  className = 'italic text-olive',
}: {
  text: string;
  words?: number;
  className?: string;
}) {
  const parts = text.trim().split(/\s+/);
  if (parts.length <= words) return <>{text}</>;
  const head = parts.slice(0, -words).join(' ');
  const tail = parts.slice(-words).join(' ');
  return (
    <>
      {head} <em className={className}>{tail}</em>
    </>
  );
}
