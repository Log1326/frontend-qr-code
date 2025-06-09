import type { PutBlobResult } from '@vercel/blob';
import { put } from '@vercel/blob';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
): Promise<NextResponse<PutBlobResult>> {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const blob = await put(file.name, file, {
    access: 'public',
    allowOverwrite: true,
  });

  return NextResponse.json(blob);
}
