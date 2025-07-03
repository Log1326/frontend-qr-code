import { localFetch } from '@/services/utils/localFetch';
import type { Role } from '@/types/models/enums';

export const organizationService = {
  async getInviteInfo(token: string): Promise<{ email: string; role: string }> {
    return localFetch(`/organizations/invite/${token}`);
  },
  async registerByInvite(data: {
    name: string;
    password: string;
    token: string;
  }) {
    return localFetch('/organizations/register-by-invite', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async inviteUser(
    orgId: string,
    email: string,
    role: Role.EMPLOYEE | Role.CLIENT,
  ) {
    const res = await localFetch<{ token: string }>(
      `/organizations/${orgId}/invite`,
      {
        method: 'POST',
        body: JSON.stringify({ email, role }),
      },
    );
    return {
      token: res.token,
      inviteLink: `${window.location.origin}/invite/${res.token}`,
    };
  },
};
