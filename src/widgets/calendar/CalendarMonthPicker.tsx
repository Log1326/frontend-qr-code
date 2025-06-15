'use client';
import { useContext } from 'react';

import { Combobox } from '@/widgets/calendar/Combobox';
import { CalendarContext } from '@/widgets/calendar/Context';
import { monthsForLocale } from '@/widgets/calendar/utils';

export interface CalendarMonthPickerProps {
  className?: string;
}

export const CalendarMonthPicker: React.FC<CalendarMonthPickerProps> = ({
  className,
}) => {
  const { month, setMonth, locale } = useContext(CalendarContext);

  return (
    <Combobox
      className={className}
      value={month.toString()}
      setValue={(value) => setMonth(Number.parseInt(value))}
      data={monthsForLocale(locale).map((month, index) => ({
        value: index.toString(),
        label: month,
      }))}
      labels={{
        button: 'Select month',
        empty: 'No month found',
        search: 'Search month',
      }}
    />
  );
};
