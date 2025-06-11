import { z } from 'zod';

export const schema = z.object({
  id: z.string(),
  employeeName: z.string(),
  clientName: z.string(),
  price: z.number(),
  status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED']),
  createdAt: z.string(),
});
