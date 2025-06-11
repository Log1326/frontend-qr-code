import { z } from 'zod';

export const schema = z.object({
  id: z.number(),
  employeeName: z.string(),
  clientName: z.string(),
  status: z.string(),
  price: z.string(),
  createdAt: z.string(),
});
