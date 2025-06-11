import { db } from '@/lib/prisma';
import type { PutBlobResult } from '@vercel/blob';
import { put } from '@vercel/blob';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
): Promise<NextResponse<PutBlobResult | { error: string }>> {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const recipeId = formData.get('recipeId')?.toString();
  if (!file || !recipeId) {
    return NextResponse.json(
      { error: 'Missing file or recipeId' },
      { status: 400 },
    );
  }

  try {
    const blob = await put(file.name, file, {
      access: 'public',
      allowOverwrite: true,
    });

    await db.recipe.update({
      where: { id: recipeId },
      data: { qrCodeUrl: blob.url },
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Upload or DB update failed:', error);
    return NextResponse.json(
      { error: 'Upload or DB update failed' },
      { status: 500 },
    );
  }
}
