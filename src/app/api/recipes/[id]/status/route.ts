import { NextResponse } from 'next/server';
import { RecipeStatus } from '@prisma/client';
import { db } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const body = await req.json();

  const newStatus = body.status as RecipeStatus;

  if (!Object.values(RecipeStatus).includes(newStatus))
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

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
