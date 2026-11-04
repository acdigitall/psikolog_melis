import type { Metadata } from 'next';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'Randevu Al · İzmir Psikolog (Yüz Yüze & Online)',
  description:
    "İzmir Alsancak'taki klinikte yüz yüze ya da online terapi için randevu talebi oluşturun. Genellikle 1 iş günü içinde dönüş yapılır.",
  path: '/quote',
});

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
