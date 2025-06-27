export enum EventType {
  CREATED = 'CREATED',
  VIEWED = 'VIEWED',
  STATUS_CHANGE = 'STATUS_CHANGE',
  UPDATED = 'UPDATED',
}

export enum Role {
  SUPERUSER = 'SUPERUSER',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT',
}

export enum AuthProvider {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  EMAIL = 'EMAIL',
}

export enum FieldType {
  TEXT = 'TEXT',
  AREA = 'AREA',
  FILE = 'FILE',
}

export enum RecipeStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}
