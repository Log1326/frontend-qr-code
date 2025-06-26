'use client';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { numberFormat } from '@/lib/utils';
import type { RecipeWithEmployee } from '@/services/recipes';

const createAvatarIcon = (url: string) =>
  new L.Icon({
    iconUrl: url,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: 'rounded-full shadow-md',
  });

export const ClientMap: React.FC<{ orders: RecipeWithEmployee[] }> = ({
  orders,
}) => {
  const center = [32.0853, 34.7818] as [number, number];
  const t = useTypedTranslations();

  return (
    <MapContainer
      center={center}
      zoom={10}
      scrollWheelZoom={true}
      className="size-full"
      style={{ height: '50rem', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {orders.map((order) => (
        <Marker
          key={order.id}
          position={[order.locationLat!, order.locationLng!]}
          icon={
            order.employee.avatarUrl
              ? createAvatarIcon(order.employee.avatarUrl)
              : undefined
          }>
          <Popup>
            <div>
              <strong>{t('clientName')}:</strong> {order.clientName}
              <br />
              <strong>{t('address')}:</strong> {order.address}
              <br />
              <strong>{t('price')}:</strong> {numberFormat(order.price)}
              <br />
              <strong>{t('employee')}:</strong> {order.employee.name}
              <br />
              <strong>{t('status')}:</strong> {t(order.status)}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
