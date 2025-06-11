import { EventType } from '@prisma/client';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Recipe } from '@/app/recipes/[id]/components/Recipe';
import { db } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const recipe = await getRecipeById(id);
  if (!recipe) {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found.',
    };
  }
  return {
    title: `Recipe for ${recipe.clientName}`,
    description: `Created by ${recipe.status}`,
  };
}

const getRecipeById = async (id: string) => {
  try {
    await db.recipeEvent.create({
      data: {
        type: EventType.VIEWED,
        recipeId: id,
      },
    });
    return db.recipe.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            name: true,
          },
        },
        parameters: {
          orderBy: { order: 'asc' },
        },
      },
    });
  } catch (error) {
    console.log('getRecipeById:' + error);
  }
};
export default async function RecipePage({ params }: Props) {
  const id = (await params).id;
  const recipe = await getRecipeById(id);
  if (!recipe) notFound();
  return <Recipe recipe={recipe} />;
}
