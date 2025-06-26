import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Card } from '@/app/team/components/Card';
import { statusColors, statusTitles } from '@/app/team/components/constant';
import { cn } from '@/lib/utils';
import type { RecipeStatus } from '@/services/types/enums';
import type { Recipe } from '@/services/types/Recipe';

interface ColumnProps {
  status: RecipeStatus;
  recipes: Recipe[];
}

export const Column: React.FC<ColumnProps> = ({ status, recipes }) => {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'column',
      columnId: status,
    },
  });

  return (
    <div className="flex min-w-80 flex-col rounded-lg bg-secondary transition-colors">
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
        data-column-id={status}
        ref={setDroppableRef}
        className={cn(
          'min-h-[150px] flex-1 space-y-3 overflow-y-auto p-3',
          isOver && 'bg-blue-100',
        )}>
        <SortableContext
          items={
            recipes.length > 0 ? recipes.map((r) => r.id) : ['__placeholder__']
          }
          strategy={verticalListSortingStrategy}>
          {recipes.length > 0 ? (
            recipes.map((recipe) => <Card key={recipe.id} recipe={recipe} />)
          ) : (
            <SortablePlaceholder />
          )}
        </SortableContext>
      </div>
    </div>
  );
};

const SortablePlaceholder = () => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: '__placeholder__' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex h-32 items-center justify-center rounded border-2 border-dashed border-gray-300 bg-white text-gray-400">
      Перетащите сюда задачи
    </div>
  );
};
