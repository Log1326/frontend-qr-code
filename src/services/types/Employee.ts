import type { Recipe } from '@/services/types/Recipe';

export type Employee = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  recipes: Recipe[];
  createdAt: Date;
};
