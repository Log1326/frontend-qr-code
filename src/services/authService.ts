import { localFetch } from '@/services/utils/localFetch';

type LoginResponse = {
  user: {
    id: string;
    email: string;
    avatar: string;
    name: string;
    role: string;
  };
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
    return localFetch<LoginResponse['user'] | null>('/auth/me', {
      credentials: 'include',
    });
  },

  async logout() {
    return localFetch('/auth/logout', {
      method: 'POST',
    });
  },
};
