import type { AuthProvider, Role } from '@/types/models/enums';
import type { Organization } from '@/types/models/Organization';
import type { Recipe } from '@/types/models/Recipe';
import type { UserEvent } from '@/types/models/UserEvent';

export type User = {
  id: string;
  email: string;
  password?: string | null;
  name: string;
  avatarUrl?: string | null;
  role: Role;
  socialId?: string | null;
  provider: AuthProvider;
  createdAt: Date;

  organizationId?: string | null;
  organization?: Organization | null;

  recipes: Recipe[];
  clientRecipes: Recipe[];
  roleHistory: UserEvent[];
  changedRoles: UserEvent[];
};
