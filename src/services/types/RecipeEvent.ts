import type { EventType } from '@/services/types/enums';
import type { Recipe } from '@/services/types/Recipe';

export type RecipeEvent = {
  id: string;
  type: EventType;
  recipeId: string;
  recipe: Recipe;
  createdAt: Date;
};
