'use client';

import { useContext } from 'react';

import { cn } from '@/lib/utils';
import { CalendarContext } from '@/widgets/calendar/Context';
import { daysForLocale } from '@/widgets/calendar/utils';

export interface CalendarHeaderProps {
  className?: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  className,
}) => {
  const { locale, startDay } = useContext(CalendarContext);

  return (
    <div className={cn('flex w-full justify-between text-lg', className)}>
      {daysForLocale(locale, startDay).map((day) => (
        <div
          key={day}
          className="flex p-3 text-right text-xs text-muted-foreground">
          {day}
        </div>
      ))}
    </div>
  );
};
