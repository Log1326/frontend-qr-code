'use client';

import type { RecipeStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

const STATUS_COLOR_MAP: Record<RecipeStatus, string> = {
  NEW: 'bg-blue-200 border-blue-500',
  IN_PROGRESS: 'bg-yellow-200 border-yellow-500',
  COMPLETED: 'bg-green-200 border-green-500',
};

export const CalendarStatus = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-wrap gap-4">
      {(Object.keys(STATUS_COLOR_MAP) as RecipeStatus[]).map((status) => (
        <div key={status} className="flex items-center gap-2 text-sm">
          <div
            className={cn('h-4 w-4 rounded border', STATUS_COLOR_MAP[status])}
          />
          <span className="text-muted-foreground">{t(status)}</span>
        </div>
      ))}
    </div>
  );
};
