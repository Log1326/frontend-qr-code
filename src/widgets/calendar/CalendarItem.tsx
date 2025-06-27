'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import { useLocale } from 'next-intl';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { cn, formattedDate, numberFormat } from '@/lib/utils';
import type { Recipe } from '@/types/models/Recipe';
import type { User } from '@/types/models/User';

export interface CalendarItemProps {
  recipe: Recipe;
  employee: User;
  className?: string;
}

export const CalendarItem: React.FC<CalendarItemProps> = ({
  recipe,
  employee,
  className,
}) => {
  const t = useTypedTranslations();
  const locale = useLocale();
  const statusColors = {
    NEW: 'bg-blue-200 border-blue-500',
    IN_PROGRESS: 'bg-yellow-200 border-yellow-500',
    COMPLETED: 'bg-green-200 border-green-500',
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded border-l-4 p-2 transition-all hover:bg-muted/40',
            statusColors[recipe.status],
            className,
          )}
          key={recipe.id}>
          {employee.avatarUrl ? (
            <Image
              src={employee.avatarUrl}
              alt={employee.name}
              className="size-6 rounded-full object-cover"
              height={24}
              width={24}
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full text-xs">
              {employee.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">{recipe.client?.name}</div>
            <div className="truncate text-xs text-gray-600">
              {format(new Date(recipe.createdAt), 'HH:mm')} • {employee.name}
            </div>
          </div>
        </div>
      </TooltipTrigger>

      <TooltipContent
        side={locale === 'he' ? 'left' : 'right'}
        className="max-w-xs break-words bg-muted-foreground text-background">
        <div className="text-sm font-medium">{recipe.client?.name}</div>
        <div className="text-xs">
          {t('status')}: {t(recipe.status)}
        </div>
        <div className="text-xs">
          {t('employee')}: {employee.name}
        </div>
        <div className="text-xs">
          {t('time')}: {formattedDate({ date: recipe.createdAt, locale })}
        </div>
        <div className="text-xs">
          {t('price')}
          {numberFormat(recipe.price)}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
