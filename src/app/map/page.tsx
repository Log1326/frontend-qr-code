import { ClientMap } from '@/app/map/components/ClientMap';
import { db } from '@/lib/prisma';

export default async function OrderMap() {
  const orders = await db.recipe.findMany({
    where: {
      locationLat: { not: null },
      locationLng: { not: null },
    },
    select: {
      id: true,
      address: true,
      locationLat: true,
      locationLng: true,
      clientName: true,
      status: true,
      price: true,
      employee: {
        select: {
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  const filteredOrders = orders.filter(
    (o): o is typeof o & { locationLat: number; locationLng: number } =>
      o.locationLat !== null && o.locationLng !== null,
  );

  return <ClientMap orders={filteredOrders} />;
}
