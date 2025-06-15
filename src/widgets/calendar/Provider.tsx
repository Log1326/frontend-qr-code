'use client';
import { useLocale } from 'next-intl';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { CalendarContext } from '@/widgets/calendar/Context';

export interface CalendarProviderProps extends PropsWithChildren {
  startDay?: number;
  className?: string;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  startDay = 0,
  children,
  className,
}: CalendarProviderProps) => {
  const locale = useLocale();

  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <CalendarContext.Provider
      value={{
        locale,
        startDay,
        month,
        year,
        setMonth,
        setYear,
      }}>
      <div className={cn('relative flex flex-col', className)}>{children}</div>
    </CalendarContext.Provider>
  );
};
