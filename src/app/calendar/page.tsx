import { recipeService } from '@/services/recipes';
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

export default async function CalendarPage() {
  const [recipes, employees] = await recipeService.getInfo();
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
