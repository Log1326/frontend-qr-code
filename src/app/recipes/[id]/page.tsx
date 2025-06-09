import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Table } from '@/app/recipes/[id]/components/Table';
import { db } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
};

const getRecipeById = async (id: string) => {
  try {
    return db.recipe.findUnique({
      where: { id },
      include: {
        parameters: {
          orderBy: { order: 'asc' },
        },
      },
    });
  } catch (error) {
    console.log('getRecipeById:' + error);
  }
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
    title: `Recipe for ${recipe.employee}`,
    description: `Created by ${recipe.clientName}`,
  };
}

export default async function RecipePage({ params }: Props) {
  const id = (await params).id;
  const recipe = await getRecipeById(id);
  if (!recipe) notFound();
  return <Table recipe={recipe} />;
}
