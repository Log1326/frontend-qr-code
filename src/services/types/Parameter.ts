import type { FieldType } from '@/services/types/enums';
import type { Recipe } from '@/services/types/Recipe';

export type Parameter = {
  id: string;
  name: string;
  type: FieldType;
  description: string;
  order: number;
  recipeId: string;
  recipe: Recipe;
};
