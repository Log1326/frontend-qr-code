'use client';

import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';

import { Column } from '@/app/team/components/Column';
import { statusColors, statusTitles } from '@/app/team/components/constant';
import { cn } from '@/lib/utils';
import { RecipeStatus } from '@/services/types/enums';
import type { Recipe } from '@/services/types/Recipe';
import { localFetch } from '@/services/utils/localFetch';

interface KanbanBoardProps {
  socket: Socket;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ socket }) => {
  const {
    data: initialData,
    error,
    isLoading,
  } = useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: () => localFetch('/recipes'),
  });

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [columnOrder] = useState<RecipeStatus[]>(Object.values(RecipeStatus));
  const [activeId, setActiveId] = useState<string | null>(null);

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
    const recipe = recipes.find((r) => r.id === active.id);

    if (!recipe) return;

    if (activeData?.type === 'column' && overData?.type === 'column') {
      return;
    }

    if (activeData?.type === 'card') {
      const sourceColumn = recipe.status;
      let targetColumn = sourceColumn;

      if (overData?.type === 'column') {
        targetColumn = overData.columnId;
      } else if (overData?.type === 'card') {
        targetColumn = overData.columnId;
      }

      const updatedRecipes = [...recipes];
      const movedRecipeIndex = updatedRecipes.findIndex(
        (r) => r.id === active.id,
      );

      if (sourceColumn !== targetColumn) {
        updatedRecipes[movedRecipeIndex] = {
          ...updatedRecipes[movedRecipeIndex],
          status: targetColumn,
        };
      }

      const columnRecipes = updatedRecipes
        .filter((r) => r.status === targetColumn)
        .sort((a, b) => a.position - b.position);

      const filteredColumn = columnRecipes.filter((r) => r.id !== active.id);

      let targetIndex = filteredColumn.length;
      if (overData?.type === 'card' && overData.columnId === targetColumn) {
        targetIndex = filteredColumn.findIndex((r) => r.id === over.id);
      }

      const movedRecipe = updatedRecipes[movedRecipeIndex];
      filteredColumn.splice(targetIndex, 0, movedRecipe);

      const reordered = filteredColumn.map((r, index) => ({
        ...r,
        position: index,
      }));

      const finalRecipes = [
        ...updatedRecipes.filter((r) => r.status !== targetColumn),
        ...reordered,
      ];

      setRecipes(finalRecipes);

      try {
        const changedRecipes = reordered.filter((r) => {
          const original = recipes.find((or) => or.id === r.id);
          return (
            !original ||
            original.position !== r.position ||
            original.status !== r.status
          );
        });

        if (changedRecipes.length > 0) {
          socket.emit('recipe-reordered', {
            status: targetColumn,
            recipes: changedRecipes.map((r) => r.id),
          });
        }
      } catch (error) {
        setRecipes(recipes);
        console.error('Update failed:', error);
      }
    }
  };

  const activeRecipe = activeId ? recipes.find((r) => r.id === activeId) : null;

  const getParameterValue = (
    recipe: Recipe,
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
