import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { userService } from '@/services/userService';
import { useUserStore } from '@/store/userStore';
import type { User } from '@/types/models/User';

export const useUser = (): {
  user?: User;
  isLoading: boolean;
} => {
  const { setUser } = useUserStore();
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    staleTime: 0,
    queryFn: userService.getCurrentUser,
    retry: false,
  });
  useEffect(() => {
    if (user) setUser(user);
  }, [setUser, user]);
  return { user, isLoading };
};
