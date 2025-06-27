import { ClientMap } from '@/app/dashboard/map/components/ClientMap';
import { recipeService } from '@/services/recipeService';

export default async function OrderMap() {
  const orders = await recipeService.getInfoWithGeo();

  const filteredOrders = orders.filter(
    (o): o is typeof o & { locationLat: number; locationLng: number } =>
      o.locationLat !== null && o.locationLng !== null,
  );

  return <ClientMap orders={filteredOrders} />;
}
