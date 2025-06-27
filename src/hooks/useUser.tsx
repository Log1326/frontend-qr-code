import { useQuery } from '@tanstack/react-query';

import { userService } from '@/services/userService';
import type { User } from '@/types/models/User';

export const useUser = (): {
  user?: User;
  isLoading: boolean;
} => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getCurrentUser,
    retry: false,
  });

  return { user, isLoading };
};
