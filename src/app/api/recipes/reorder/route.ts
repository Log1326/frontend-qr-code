import { db } from '@/lib/prisma';
import { RecipeStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      status,
      recipes,
    }: { status: RecipeStatus; recipes: { id: string; position: number }[] } =
      body;

    if (!status || !Array.isArray(recipes))
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    const updates = recipes.map((r) =>
      db.recipe.update({
        where: { id: r.id },
        data: { position: r.position, status },
      }),
    );

    await db.$transaction(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении позиций:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
