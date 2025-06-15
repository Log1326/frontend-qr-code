'use client';
import { createContext } from 'react';

type CalendarContextProps = {
  locale: Intl.LocalesArgument;
  startDay: number;
  month: number;
  year: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
};

export const CalendarContext = createContext<CalendarContextProps>({
  locale: 'en-US',
  startDay: 0,
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  setMonth: () => {},
  setYear: () => {},
});
