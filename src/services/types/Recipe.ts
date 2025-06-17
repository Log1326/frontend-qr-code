import type { Employee } from '@/services/types/Employee';
import type { RecipeStatus } from '@/services/types/enums';
import type { Parameter } from '@/services/types/Parameter';
import type { RecipeEvent } from '@/services/types/RecipeEvent';

export type Recipe = {
  id: string;
  employeeId: string;
  employee: Employee;
  clientName: string;
  price: number;
  status: RecipeStatus;
  parameters: Parameter[];
  events: RecipeEvent[];
  position: number;
  address: string;
  locationLat?: number | null;
  locationLng?: number | null;
  qrCodeUrl?: string | null;
  createdAt: Date;
};
