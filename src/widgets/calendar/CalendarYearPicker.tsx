'use client';

import { useContext } from 'react';

import { Combobox } from '@/widgets/calendar/Combobox';
import { CalendarContext } from '@/widgets/calendar/Context';

export interface CalendarYearPickerProps {
  className?: string;
  start: number;
  end: number;
}

export const CalendarYearPicker: React.FC<CalendarYearPickerProps> = ({
  className,
  start,
  end,
}) => {
  const { year, setYear } = useContext(CalendarContext);

  return (
    <Combobox
      className={className}
      value={year.toString()}
      setValue={(value) => setYear(Number.parseInt(value))}
      data={Array.from({ length: end - start + 1 }, (_, i) => ({
        value: (start + i).toString(),
        label: (start + i).toString(),
      }))}
      labels={{
        button: 'Select year',
        empty: 'No year found',
        search: 'Search year',
      }}
    />
  );
};
