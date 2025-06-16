export async function fetchAddressAndCoordinates(address: string): Promise<{
  displayName: string;
  lat: number;
  lon: number;
} | null> {
  if (!address) return null;

  const params = new URLSearchParams({
    q: address,
    format: 'json',
    limit: '1',
  });

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          'User-Agent': 'TelegramBot/1.0',
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const result = data[0];
    return {
      displayName: result.display_name,
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
    };
  } catch {
    return null;
  }
}
