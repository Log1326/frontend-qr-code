'use client';

import React, { useEffect, useState } from 'react';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Recipe, RecipeStatus, Parameter } from '@prisma/client';
import { statusColors, statusTitles } from './constant';
import { Column } from './Column';
import useSWR, { useSWRConfig } from 'swr';
import { cn } from '@/lib/utils';
import { Socket } from 'socket.io-client';

type RecipeWithParameters = Recipe & {
  parameters: Parameter[];
  employee: {
    name: string;
    avatarUrl?: string | null;
  };
};

interface KanbanBoardProps {
  socket: Socket;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ socket }) => {
  const {
    data: initialData,
    error,
    isLoading,
  } = useSWR<RecipeWithParameters[]>('/api/recipes');

  const [recipes, setRecipes] = useState<RecipeWithParameters[]>([]);
  const [columnOrder, setColumnOrder] = useState<RecipeStatus[]>(
    Object.values(RecipeStatus),
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (initialData) setRecipes(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = ({
      id,
      status,
    }: {
      id: string;
      status: RecipeStatus;
    }) => {
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
    };

    socket.on('recipe-updated', handleUpdate);
    return () => {
      socket.off('recipe-updated', handleUpdate);
    };
  }, [socket]);

  useEffect(() => {
    socket.on('recipe-reordered', ({ status, recipes: newOrder }) => {
      setRecipes((prev) => {
        const sameStatus = prev.filter((r) => r.status === status);
        const others = prev.filter((r) => r.status !== status);
        const reordered = newOrder
          .map((id: string) => sameStatus.find((r) => r.id === id))
          .filter(Boolean) as typeof sameStatus;
        return [...others, ...reordered];
      });
    });

    return () => {
      socket.off('recipe-reordered');
    };
  }, [socket]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const recipesByStatus = (status: RecipeStatus) =>
    recipes
      .filter((r) => r.status === status)
      .sort((a, b) => a.position - b.position);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === 'column' && overData?.type === 'column') {
      const oldIndex = columnOrder.indexOf(active.id as RecipeStatus);
      const newIndex = columnOrder.indexOf(over.id as RecipeStatus);

      if (oldIndex !== -1 && newIndex !== -1)
        setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));

      return;
    }

    if (activeData?.type === 'card') {
      let newStatus: RecipeStatus | null = null;

      if (overData?.type === 'column') newStatus = overData.columnId;
      else if (overData?.type === 'card') newStatus = overData.columnId;

      const recipe = recipes.find((r) => r.id === active.id);
      if (!recipe) return;

      if (!newStatus || recipe.status === newStatus) {
        const columnRecipes = recipes
          .filter((r) => r.status === recipe.status)
          .sort((a, b) => a.position - b.position);

        const oldIndex = columnRecipes.findIndex((r) => r.id === active.id);
        const newIndex = columnRecipes.findIndex((r) => r.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const reordered = arrayMove(columnRecipes, oldIndex, newIndex);

          const updated = reordered.map((r, index) => ({
            ...r,
            position: index,
          }));
          const others = recipes.filter((r) => r.status !== recipe.status);
          setRecipes([...others, ...updated]);

          const reorderedPayload = reordered.map((r, index) => ({
            id: r.id,
            position: index,
          }));

          await fetch(`/api/recipes/reorder`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: recipe.status,
              recipes: reorderedPayload,
            }),
          });

          socket.emit('recipe-reordered', {
            status: recipe.status,
            recipes: reorderedPayload.map((r) => r.id),
          });
        }

        return;
      }

      const original = [...recipes];
      try {
        setRecipes((prev) =>
          prev.map((r) =>
            r.id === active.id ? { ...r, status: newStatus! } : r,
          ),
        );

        await fetch(`/api/recipes/${active.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });

        socket.emit('recipe-updated', { id: active.id, status: newStatus });
        mutate('/api/recipes');
      } catch (error) {
        console.error('Ошибка при обновлении статуса:', error);
        setRecipes(original);
      }
    }
  };

  const activeRecipe = activeId ? recipes.find((r) => r.id === activeId) : null;

  const getParameterValue = (
    recipe: RecipeWithParameters,
    name: string,
  ): string | undefined => {
    return recipe.parameters.find(
      (p) => p.name.toLowerCase() === name.toLowerCase(),
    )?.description;
  };

  if (isLoading) return <p>Загрузка доски...</p>;
  if (error) return <p>Ошибка загрузки рецептов</p>;

  return (
    <div className="w-full">
      <DndContext
        collisionDetection={closestCorners}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          <SortableContext
            items={columnOrder}
            strategy={horizontalListSortingStrategy}>
            {columnOrder.map((status) => (
              <Column
                key={status}
                status={status}
                recipes={recipesByStatus(status)}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeRecipe && (
            <div className="cursor-grabbing overflow-hidden rounded bg-background shadow-lg">
              <div
                className={cn('h-1 w-full', statusColors[activeRecipe.status])}
              />
              <div className="p-3">
                <h3 className="text-base font-semibold">
                  {getParameterValue(activeRecipe, 'Название') ??
                    activeRecipe.clientName}
                </h3>
                {getParameterValue(activeRecipe, 'Описание') && (
                  <p className="text-sm text-muted-foreground">
                    {getParameterValue(activeRecipe, 'Описание')}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-foreground">
                  <span>{statusTitles[activeRecipe.status]}</span>
                  <span>{activeRecipe.price}₪</span>
                </div>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
