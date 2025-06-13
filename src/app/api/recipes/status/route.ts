import { RecipeStatus } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;

  if (!id || typeof id !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid recipe id' },
      { status: 400 },
    );
  }

  const newStatus = status as RecipeStatus;

  if (!Object.values(RecipeStatus).includes(newStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const updated = await db.recipe.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Ошибка обновления статуса рецепта:', error);
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
  }
}
