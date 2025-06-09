import { put, PutBlobResult } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
): Promise<NextResponse<PutBlobResult>> {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const blob = await put(file.name, file, {
    access: 'public',
  });

  return NextResponse.json(blob);
}
