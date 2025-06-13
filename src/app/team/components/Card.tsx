import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { statusBorderColors, statusColors, statusTitles } from './constant';
import { Parameter, Recipe } from '@prisma/client';
import { cn } from '@/lib/utils';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';

type RecipeWithParameters = Recipe & {
  parameters: Parameter[];
  employee: {
    name: string;
    avatarUrl?: string | null;
  };
};

export const Card: React.FC<{ recipe: RecipeWithParameters }> = ({
  recipe,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: recipe.id,
    data: { type: 'card', recipe, columnId: recipe.status },
  });
  const t = useTypedTranslations();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'cursor-grab rounded border-2 bg-background shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800 dark:shadow-md',
        {
          'cursor-grabbing shadow-lg': isDragging,
        },
        statusBorderColors[recipe.status],
      )}>
      <div
        className={cn('h-1 w-full rounded-t', statusColors[recipe.status])}
      />
      <div className="space-y-2 p-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          {t('clientName')}: {recipe.clientName}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {t('employee')}: {recipe.employee.name}
        </p>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            {statusTitles[recipe.status]}
          </span>
          {recipe.employee.avatarUrl ? (
            <img
              src={recipe.employee.avatarUrl}
              alt={recipe.employee.name}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-gray-300 dark:ring-gray-600"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600" />
          )}
        </div>
      </div>
    </div>
  );
};
