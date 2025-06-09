import { RecipeStatus } from '@prisma/client';
import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { Block } from './Block';
const initialData = {
  [RecipeStatus.NEW]: [
    { id: '1', title: 'Заказ 1' },
    { id: '2', title: 'Заказ 2' },
  ],
  [RecipeStatus.IN_PROGRESS]: [{ id: '3', title: 'Заказ 3' }],
  [RecipeStatus.COMPLETED]: [{ id: '4', title: 'Заказ 4' }],
};

const statusTitles = {
  [RecipeStatus.NEW]: 'Новые',
  [RecipeStatus.IN_PROGRESS]: 'В процессе',
  [RecipeStatus.COMPLETED]: 'Завершённые',
};
export const Blocks = () => {
  const [tasks, setTasks] = useState(initialData);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const sourceStatus = Object.keys(tasks).find((status) =>
      tasks[status as RecipeStatus].some((task) => task.id === active.id),
    ) as RecipeStatus;
    const targetStatus = Object.keys(tasks).find((status) =>
      (event?.over?.id as string).includes(status),
    ) as RecipeStatus;

    if (!sourceStatus || !targetStatus) return;

    const activeIndex = tasks[sourceStatus].findIndex(
      (task) => task.id === active.id,
    );
    const overIndex = 0;

    const movedTask = tasks[sourceStatus][activeIndex];

    setTasks((prev) => {
      const newSource = [...prev[sourceStatus]];
      newSource.splice(activeIndex, 1);

      const newTarget = [...prev[targetStatus]];
      newTarget.splice(overIndex, 0, movedTask);

      return {
        ...prev,
        [sourceStatus]: newSource,
        [targetStatus]: newTarget,
      };
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Object.values(RecipeStatus).map((status) => (
          <Block
            key={status}
            id={status}
            title={statusTitles[status]}
            tasks={tasks[status]}
          />
        ))}
      </div>
    </DndContext>
  );
};
