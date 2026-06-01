import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const rateLimit = checkRateLimit(ip, 'strict');
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many uploads. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter || 60), ...getRateLimitHeaders(rateLimit) } }
    );
  }

  try {
    const formData = await req.formData();
    
    // Jodit Editor sends files in an array-like structure. 
    // We try to get 'files[0]' first, if not we try standard 'file'
    let file = formData.get('files[0]') as File;
    if (!file) {
      file = formData.get('file') as File;
    }
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'Tidak ada gambar yang diunggah' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Sanitize filename to prevent issues
    const filename = `${uniquePrefix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Write file to disk
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, buffer);

    // Return the response format that Jodit Editor expects
    return NextResponse.json({
      success: true,
      time: new Date().toISOString(),
      data: {
        baseurl: "/",
        messages: [],
        files: [`uploads/${filename}`],
        isImages: [true],
        code: 220
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
