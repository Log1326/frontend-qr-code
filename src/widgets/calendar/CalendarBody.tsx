'use client';

import { getDay, getDaysInMonth, isSameDay } from 'date-fns';
import { useContext } from 'react';

import { cn } from '@/lib/utils';
import type { Recipe } from '@/types/models/Recipe';
import type { User } from '@/types/models/User';
import { CalendarItem } from '@/widgets/calendar/CalendarItem';
import { OutOfBoundsDay } from '@/widgets/calendar/Components';
import { CalendarContext } from '@/widgets/calendar/Context';

interface CalendarBodyProps {
  recipes: Recipe[];
  employees: User[];
}

export const CalendarBody: React.FC<CalendarBodyProps> = ({
  recipes,
  employees,
}) => {
  const { month, year, startDay } = useContext(CalendarContext);
  const daysInMonth = getDaysInMonth(new Date(year, month, 1));
  const firstDay = (getDay(new Date(year, month, 1)) - startDay + 7) % 7;
  const days: React.ReactNode[] = [];

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1));
  const prevMonthDaysArray = Array.from(
    { length: prevMonthDays },
    (_, i) => i + 1,
  );

  for (let i = 0; i < firstDay; i++) {
    const day = prevMonthDaysArray[prevMonthDays - firstDay + i];
    if (day) days.push(<OutOfBoundsDay key={`prev-${i}`} day={day} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const recipesForDay = recipes.filter((recipe) =>
      isSameDay(new Date(recipe.createdAt), new Date(year, month, day)),
    );

    days.push(
      <div
        key={day}
        className="relative flex h-full w-full flex-col gap-1 p-1 text-xs text-muted-foreground">
        {day}
        <div className="space-y-1">
          {recipesForDay.slice(0, 3).map((recipe) => {
            const employee = employees.find((e) => e.id === recipe.employeeId);
            return employee ? (
              <CalendarItem
                key={recipe.id}
                recipe={recipe}
                employee={employee}
              />
            ) : null;
          })}
        </div>
        {recipesForDay.length > 3 && (
          <span className="block text-xs text-muted-foreground">
            +{recipesForDay.length - 3} more
          </span>
        )}
      </div>,
    );
  }

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  const nextMonthDays = getDaysInMonth(new Date(nextMonthYear, nextMonth, 1));
  const nextMonthDaysArray = Array.from(
    { length: nextMonthDays },
    (_, i) => i + 1,
  );

  const remainingDays = 7 - ((firstDay + daysInMonth) % 7);
  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      const day = nextMonthDaysArray[i];
      if (day) days.push(<OutOfBoundsDay key={`next-${i}`} day={day} />);
    }
  }

  return (
    <div className="grid flex-grow grid-cols-7 grid-rows-4">
      {days.map((day, index) => (
        <div
          key={index}
          className={cn('relative aspect-square overflow-hidden border')}>
          {day}
        </div>
      ))}
    </div>
  );
};
