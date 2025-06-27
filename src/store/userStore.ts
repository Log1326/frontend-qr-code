import { create } from 'zustand';

import { AuthProvider, Role } from '@/types/models/enums';
import type { User } from '@/types/models/User';

type UserState = {
  user: User;
  setUser: (user: User) => void;
  isAuth: boolean;
  setAuth: (value: boolean) => void;
};

const initialUser: User = {
  id: '',
  email: '',
  password: null,
  name: '',
  avatarUrl: null,
  role: Role.CLIENT,
  socialId: null,
  provider: AuthProvider.EMAIL,
  createdAt: new Date(),
  organizationId: null,
  organization: null,
  recipes: [],
  clientRecipes: [],
  roleHistory: [],
  changedRoles: [],
};

export const useUserStore = create<UserState>((set) => ({
  user: initialUser,
  isAuth: false,
  setUser: (user) => set({ user }),
  setAuth: (value) => set({ isAuth: value }),
}));
