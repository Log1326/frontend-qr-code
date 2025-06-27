import type { FieldType } from '@/types/models/enums';
import type { Recipe } from '@/types/models/Recipe';

export type Parameter = {
  id: string;
  name: string;
  type: FieldType;
  description: string;
  order: number;
  recipeId: string;
  recipe: Recipe;
};
