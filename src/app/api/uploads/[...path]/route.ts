import type { NextRequest } from 'next/server';
import { serveUpload } from '@/lib/serve-upload';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return serveUpload(path);
}
