'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useContext } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarContext } from '@/widgets/calendar/Context';

export interface CalendarDatePaginationProps {
  className?: string;
}

export const CalendarDatePagination: React.FC<CalendarDatePaginationProps> = ({
  className,
}) => {
  const { month, year, setMonth, setYear } = useContext(CalendarContext);

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button onClick={() => handlePreviousMonth()} variant="ghost" size="icon">
        <ChevronLeftIcon size={16} />
      </Button>
      <Button onClick={() => handleNextMonth()} variant="ghost" size="icon">
        <ChevronRightIcon size={16} />
      </Button>
    </div>
  );
};
