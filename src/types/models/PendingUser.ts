import type { Role } from '@/types/models/enums';

export type PendingUser = {
  id: string;
  email: string;
  name?: string | null;
  token: string;
  role: Role;
  createdAt: Date;
};
