import { RecipeStatus } from '@prisma/client';

export const statusTitles: Record<RecipeStatus, string> = {
  [RecipeStatus.NEW]: 'Новые',
  [RecipeStatus.IN_PROGRESS]: 'В процессе',
  [RecipeStatus.COMPLETED]: 'Завершенные',
};

export const statusColors: Record<RecipeStatus, string> = {
  [RecipeStatus.NEW]: 'bg-blue-500',
  [RecipeStatus.IN_PROGRESS]: 'bg-yellow-500',
  [RecipeStatus.COMPLETED]: 'bg-green-500',
};
export const statusBorderColors: Record<RecipeStatus, string> = {
  [RecipeStatus.NEW]: 'border-blue-500',
  [RecipeStatus.IN_PROGRESS]: 'border-yellow-500',
  [RecipeStatus.COMPLETED]: 'border-green-500',
};
