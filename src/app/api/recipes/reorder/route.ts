import type { RecipeStatus } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      status,
      recipes,
    }: { status: RecipeStatus; recipes: { id: string; position: number }[] } =
      body;

    if (!status || !Array.isArray(recipes) || recipes.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const ids = recipes.map((r) => r.id);
    const currentRecipes = await db.recipe.findMany({
      where: { id: { in: ids } },
      select: { id: true, position: true, status: true },
    });

    const updates = recipes.filter((newRecipe) => {
      const current = currentRecipes.find((cr) => cr.id === newRecipe.id);
      return (
        !current ||
        current.position !== newRecipe.position ||
        current.status !== status
      );
    });

    if (updates.length === 0) {
      return NextResponse.json({ success: true, message: 'No changes needed' });
    }

    await db.$transaction(async (tx) => {
      const tempSQL = `
        UPDATE "Recipe"
        SET "position" = CASE
          ${updates.map((r, i) => `WHEN id = '${r.id}' THEN ${-1000 - i}`).join('\n')}
          ELSE "position"
        END
        WHERE id IN (${updates.map((r) => `'${r.id}'`).join(',')});
      `;

      const finalSQL = `
        UPDATE "Recipe"
        SET
          "position" = CASE
            ${updates.map((r) => `WHEN id = '${r.id}' THEN ${r.position}`).join('\n')}
            ELSE "position"
          END,
          "status" = CASE
            ${updates.map((r) => `WHEN id = '${r.id}' THEN '${status}'::"RecipeStatus"`).join('\n')}
            ELSE "status"
          END
        WHERE id IN (${updates.map((r) => `'${r.id}'`).join(',')});
      `;

      await tx.$executeRawUnsafe(tempSQL);
      await tx.$executeRawUnsafe(finalSQL);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
