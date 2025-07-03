const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';

export const localFetch = async <T = unknown>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  try {
    const method = options?.method ?? 'GET';
    console.log(`[localFetch] ${method} ${SITE_URL}${endpoint}`);

    const isFormData = options?.body instanceof FormData;
    const res = await fetch(`${SITE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[localFetch] ❌ Error ${res.status}: ${errorText}`);
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('[localFetch] Fetch error:', error);
    throw new Error('Error happend during request');
  }
};
