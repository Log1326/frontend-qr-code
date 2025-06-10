'use client';

import type { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';

export const SWRProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((res) => res.json()),
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        dedupingInterval: 5000 * 60,
      }}>
      {children}
    </SWRConfig>
  );
};
