const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';

export const localFetch = async <T = unknown>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  try {
    const isFormData = options?.body instanceof FormData;
    const res = await fetch(`${SITE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Ошибка ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Произошла ошибка при выполнении запроса');
  }
};
