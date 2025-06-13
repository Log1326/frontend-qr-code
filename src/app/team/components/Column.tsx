import { useDroppable } from '@dnd-kit/core';
import { Parameter, Recipe, RecipeStatus } from '@prisma/client';
import { statusColors, statusTitles } from './constant';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './Card';

type RecipeWithParameters = Recipe & {
  parameters: Parameter[];
  employee: {
    name: string;
    avatarUrl?: string | null;
  };
};
interface ColumnProps {
  status: RecipeStatus;
  recipes: RecipeWithParameters[];
}
export const Column: React.FC<ColumnProps> = ({ status, recipes }) => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: status,
      data: {
        type: 'column',
        columnId: status,
      },
    });
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `${status}-droppable`,
    data: { type: 'column', columnId: status },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'flex min-w-80 flex-col rounded-lg bg-secondary transition-colors',
      )}>
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-lg p-3">
        <div className="flex items-center gap-2">
          <span className={cn('h-3 w-3 rounded-full', statusColors[status])} />
          <h2 className="font-bold">{statusTitles[status]}</h2>
        </div>
        <span className="flex items-center justify-center rounded-full bg-muted text-lg font-medium">
          {recipes.length}
        </span>
      </div>

      <div
        ref={setDroppableRef}
        className="min-h-[150px] flex-1 space-y-3 overflow-y-auto p-3">
        <SortableContext
          items={recipes.map((r) => r.id)}
          strategy={verticalListSortingStrategy}>
          {recipes.map((recipe) => (
            <Card key={recipe.id} recipe={recipe} />
          ))}
        </SortableContext>

        {recipes.length === 0 && (
          <div className="flex h-32 items-center justify-center rounded border-2 border-dashed border-gray-300 bg-white text-gray-400">
            Перетащите сюда задачи
          </div>
        )}
      </div>
    </div>
  );
};
