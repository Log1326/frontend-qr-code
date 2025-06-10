'use client';

import type { PropsWithChildren } from 'react';

import { SWRProvider } from '@/providers/SwrProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <SWRProvider>{children}</SWRProvider>
    </ThemeProvider>
  );
};
