import { PrismaClient } from '@prisma/client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Table } from './components/Table';

const prisma = new PrismaClient();
type Props = {
  params: Promise<{ id: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found.',
    };
  }

  return {
    title: recipe.title,
    description: `Recipe details for ${recipe.title}`,
  };
}

export default async function RecipePage({ params }: Props) {
  const id = (await params).id;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      parameters: {
        orderBy: { order: 'asc' },
      },
    },
  });
  if (!recipe) notFound();
  return <Table recipe={recipe} />;
}
