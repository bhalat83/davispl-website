import { NextResponse } from 'next/server';
import JSZip from 'jszip';

export async function POST(request) {
  const { files } = await request.json();

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files' }, { status: 400 });
  }

  if (files.length === 1) {
    const res = await fetch(files[0].url);
    if (!res.ok) return NextResponse.json({ error: 'Fetch failed' }, { status: 502 });
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get('Content-Type') || 'application/octet-stream';
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(files[0].name)}"`,
      },
    });
  }

  const zip = new JSZip();
  await Promise.all(
    files.map(async (file) => {
      try {
        const res = await fetch(file.url);
        if (!res.ok) return;
        const buffer = await res.arrayBuffer();
        zip.file(file.name, buffer);
      } catch {
        // pomiń pliki niedostępne
      }
    })
  );

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

  return new NextResponse(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="davis-fabrics.zip"',
    },
  });
}
