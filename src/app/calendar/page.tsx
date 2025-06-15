import type { Employee, Recipe } from '@prisma/client';

import { db } from '@/lib/prisma';
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarHeader,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarStatus,
  CalendarYearPicker,
} from '@/widgets/calendar';

type RecipeWithEmployee = Recipe & { employee: Employee };

const getInfo = async (): Promise<[RecipeWithEmployee[], Employee[]]> => {
  try {
    const recipes = await db.recipe.findMany({
      include: {
        employee: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const employees = await db.employee.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return [recipes, employees];
  } catch (err) {
    console.error('CalendarPage:', err);
    return [[], []];
  }
};

export default async function CalendarPage() {
  const [recipes, employees] = await getInfo();
  return (
    <div className="w-full p-4">
      <CalendarProvider startDay={0}>
        <CalendarDate>
          <CalendarMonthPicker />
          <CalendarYearPicker start={2025} end={2044} />
          <CalendarDatePagination />
          <CalendarStatus />
        </CalendarDate>

        <CalendarHeader />

        <CalendarBody recipes={recipes} employees={employees} />
      </CalendarProvider>
    </div>
  );
}
