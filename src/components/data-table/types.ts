import { z } from 'zod';

export type TypeDataTable = {
  id: string;
  employeeName: string;
  client: string | null;
  price: number;
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date;
};

export const typeDataTableSchema = z.object({
  id: z.string(),
  employeeName: z.string(),
  client: z.string().nullable(),
  price: z.number(),
  status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED']),
  createdAt: z.date(),
});
