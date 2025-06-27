import { localFetch } from '@/services/utils/localFetch';
import type { User } from '@/types/models/User';

type LoginResponse = {
  user: User;
};

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return localFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  },

  async getCurrentUser(): Promise<LoginResponse['user'] | null> {
    return localFetch<LoginResponse['user'] | null>('/user/profile', {
      credentials: 'include',
    });
  },

  async logout() {
    return localFetch('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  },
};
