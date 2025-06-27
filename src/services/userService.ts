import { localFetch } from '@/services/utils/localFetch';
import type { User } from '@/types/models/User';

export const userService = {
  async getCurrentUser(): Promise<User> {
    return localFetch<User>('/users/profile', {
      credentials: 'include',
    });
  },
};
