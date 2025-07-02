import { localFetch } from '@/services/utils/localFetch';
import type { User } from '@/types/models/User';

type LoginResponse = {
  user: User;
};

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return localFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  async signUpWithOrganization(data: {
    organizationName: string;
    email: string;
    name: string;
    password: string;
  }) {
    return localFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async getCurrentUser(): Promise<LoginResponse['user'] | null> {
    return localFetch<LoginResponse['user'] | null>('/user/profile');
  },

  async logout() {
    return localFetch('/auth/logout', {
      method: 'POST',
    });
  },
};
