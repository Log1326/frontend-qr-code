import type { Employee } from '@/services/types/Employee';
import type { Parameter } from '@/services/types/Parameter';
import type { Recipe } from '@/services/types/Recipe';
import { localFetch } from '@/services/utils/localFetch';

export type TypeDataTable = Pick<
  Recipe,
  'id' | 'clientName' | 'price' | 'status' | 'createdAt'
> & {
  employeeName: string;
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
  async getInfo(): Promise<[RecipeWithEmployee[], Employee[]]> {
    return localFetch<[RecipeWithEmployee[], Employee[]]>('/recipes/info');
  },
  async getInfoWithGeo(): Promise<RecipeWithEmployee[]> {
    return localFetch<RecipeWithEmployee[]>('/recipes/with-location');
  },
  async getRecipeById(id: string): Promise<RecipeWithEmployeeAndParameters> {
    return localFetch<RecipeWithEmployeeAndParameters>('/recipes/' + id);
  },
};
