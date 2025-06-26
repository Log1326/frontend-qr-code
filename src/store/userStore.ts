import { create } from 'zustand';

type User = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
};

type UserState = {
  user: User;
  setUser: (user: User) => void;
  isAuth: boolean;
  setAuth: (value: boolean) => void;
};

const initialUser = { avatar: '', email: '', id: '', name: '', role: '' };

export const useUserStore = create<UserState>((set) => ({
  user: initialUser,
  isAuth: false,
  setUser: (user) => set({ user }),
  setAuth: (value) => set({ isAuth: value }),
}));
