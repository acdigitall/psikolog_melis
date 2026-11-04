import { NextResponse, NextRequest } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const fileName = path.map(p => decodeURIComponent(p)).join('/');
    
    // Check main public/uploads directory first
    let filePath = join(process.cwd(), 'public', 'uploads', fileName);

    // If not found in main, check standalone directory
    if (!existsSync(filePath)) {
      filePath = join(process.cwd(), '.next', 'standalone', 'public', 'uploads', fileName);
    }

    if (!existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = readFileSync(filePath);
    const ext = fileName.split('.').pop()?.toLowerCase();

    let contentType = 'application/octet-stream';
    if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'png') contentType = 'image/png';
    else if (ext === 'webp') contentType = 'image/webp';
    else if (ext === 'gif') contentType = 'image/gif';
    else if (ext === 'svg') contentType = 'image/svg+xml';
    else if (ext === 'pdf') contentType = 'application/pdf';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
