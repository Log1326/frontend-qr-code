import type { Role } from '@/types/models/enums';
import type { Organization } from '@/types/models/Organization';

export type InviteToken = {
  id: string;
  email: string;
  organizationId: string;
  organization: Organization;
  role: Role;
  token: string;
  expiresAt: Date;
  accepted: boolean;
  createdAt: Date;
};
