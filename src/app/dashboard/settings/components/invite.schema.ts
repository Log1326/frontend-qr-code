import { z } from 'zod';

import { Role } from '@/types/models/enums';

export const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum([Role.CLIENT, Role.EMPLOYEE, Role.ADMIN]),
});
