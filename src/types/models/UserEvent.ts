import type { Role } from '@/types/models/enums';
import type { User } from '@/types/models/User';

export type UserEvent = {
  id: string;
  userId: string;
  user: User;
  changedById: string;
  changedBy: User;
  oldRole: Role;
  newRole: Role;
  createdAt: Date;
};
