import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

export const CalendarDate: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="flex items-center justify-start gap-2">{children}</div>
);

export interface CalendarDatePickerProps extends PropsWithChildren {
  className?: string;
}

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  className,
  children,
}) => (
  <div className={cn('flex items-center gap-1', className)}>{children}</div>
);

interface OutOfBoundsDayProps {
  day: number;
}

export const OutOfBoundsDay: React.FC<OutOfBoundsDayProps> = ({ day }) => (
  <div className="relative h-full w-full cursor-not-allowed bg-secondary p-1 text-xs text-muted-foreground blur-[2px]">
    {day}
  </div>
);
