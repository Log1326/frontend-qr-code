export enum FieldType {
  TEXT = 'TEXT',
  AREA = 'AREA',
  FILE = 'FILE'
}

export interface Parameter {
  id: string;
  type: FieldType;
  value: string;
  order: number;
}

export interface Recipe {
  id: string;
  title: string;
  parameters: Parameter[];
  createdAt: Date;
}

export interface CreateRecipeDTO {
  title: string;
  parameters: Omit<Parameter, 'id'>[];
}
