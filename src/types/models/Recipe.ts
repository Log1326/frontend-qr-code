import type { RecipeStatus } from '@/types/models/enums';
import type { Parameter } from '@/types/models/Parameter';
import type { RecipeEvent } from '@/types/models/RecipeEvent';
import type { User } from '@/types/models/User';

export type Recipe = {
  id: string;
  employeeId: string;
  employee: User;
  clientId?: string | null;
  client?: User | null;
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
