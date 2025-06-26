import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Recipe } from '@/app/recipes/[id]/components/Recipe';
import { recipeService } from '@/services/recipes';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const recipe = await recipeService.getRecipeById(id);
  if (!recipe) {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found.',
    };
  }
  return {
    title: `Recipe for ${recipe.clientName}`,
    description: `Created by ${recipe.status}`,
    openGraph: {
      title: `Recipe for ${recipe.clientName}`,
      description: `Created by ${recipe.status}`,
      images: recipe.qrCodeUrl ? [recipe.qrCodeUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Recipe for ${recipe.clientName}`,
      description: `Created by ${recipe.status}`,
      images: recipe.qrCodeUrl ? [recipe.qrCodeUrl] : undefined,
    },
  };
}

export default async function RecipePage({ params }: Props) {
  const id = (await params).id;
  const recipe = await recipeService.getRecipeById(id);
  if (!recipe) notFound();
  return <Recipe recipe={recipe} />;
}
