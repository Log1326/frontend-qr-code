import type { EventType } from 'react-hook-form';

import type { Recipe } from '@/types/models/Recipe';

export type RecipeEvent = {
  id: string;
  type: EventType;
  recipeId: string;
  recipe: Recipe;
  createdAt: Date;
};
