'use client';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { RecipeStatus } from '@prisma/client';

import { SortableCard } from '@/app/employee/components/SortableCard';

export const Block = ({
  id,
  title,
  tasks,
}: {
  id: RecipeStatus;
  title: string;
  tasks: any[];
}) => {
  return (
    <div className="min-h-[200px] rounded-xl bg-muted p-2">
      <h2 className="mb-2 px-2 text-lg font-semibold">{title}</h2>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.map((task) => (
            <SortableCard key={task.id} id={task.id} title={task.title} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
