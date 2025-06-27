import type { InviteToken } from '@/types/models/InviteToken';
import type { User } from '@/types/models/User';

export type Organization = {
  id: string;
  name: string;
  users: User[];
  invites: InviteToken[];
  createdAt: Date;
};
