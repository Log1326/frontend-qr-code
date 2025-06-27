import { localFetch } from '@/services/utils/localFetch';
import type { Parameter } from '@/types/models/Parameter';
import type { Recipe } from '@/types/models/Recipe';
import type { User } from '@/types/models/User';

export type TypeDataTable = Pick<
  Recipe,
  'id' | 'client' | 'price' | 'status' | 'createdAt'
> & {
  employeeName: string;
  client: string | null;
};

export type RecipeWithEmployee = Recipe & {
  employeeName: string;
};

export type RecipeWithEmployeeAndParameters = Recipe & {
  employeeName: string;
  parameters: Parameter[];
};
export const recipeService = {
  async getDataTable(): Promise<TypeDataTable[]> {
    return localFetch<TypeDataTable[]>('/recipes/table');
  },
  async getInfo(): Promise<[RecipeWithEmployee[], User[]]> {
    return localFetch<[RecipeWithEmployee[], User[]]>('/recipes/info');
  },
  async getInfoWithGeo(): Promise<RecipeWithEmployee[]> {
    return localFetch<RecipeWithEmployee[]>('/recipes/with-location');
  },
  async getRecipeById(id: string): Promise<RecipeWithEmployeeAndParameters> {
    return localFetch<RecipeWithEmployeeAndParameters>('/recipes/' + id);
  },
};
