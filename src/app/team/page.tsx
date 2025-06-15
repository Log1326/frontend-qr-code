'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import useSWR from 'swr';

import { HeaderEmployees } from '@/app/team/components/HeaderEmployees';
import { KanbanBoard } from '@/app/team/components/KanbanBoard';
import { MouseCursorOverlay } from '@/app/team/components/MouseCursorOverlay';
import { Skeleton } from '@/components/ui/skeleton';

const SITE_URL = process.env.NEXT_PUBLIC_SOCKET_SITE_URL ?? '';

export default function TeamPage() {
  const { data: employees } =
    useSWR<{ id: string; name: string }[]>('/api/employees');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectedEmployeeIds, setConnectedEmployeeIds] = useState<string[]>(
    [],
  );
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR<
    {
      name: string;
      id: string;
    }[]
  >(
    connectedEmployeeIds.length > 0
      ? `/api/employees/list?ids=${connectedEmployeeIds.join(',')}`
      : null,
  );

  useEffect(() => {
    if (!employees) return;
    if (employeeId) return;
    const unusedEmployee = employees.find(
      (e) => !connectedEmployeeIds.includes(e.id),
    );
    if (unusedEmployee) {
      setEmployeeId(unusedEmployee.id);
    } else {
      setEmployeeId(employees[0]?.id ?? null);
    }
  }, [employees, connectedEmployeeIds]);

  useEffect(() => {
    if (!employeeId) return;
    const socketIo = io(SITE_URL, {
      transports: ['websocket'],
    });
    setSocket(socketIo);
    socketIo.on('employees-updated', (updatedIds: string[]) => {
      const uniqueIds = Array.from(new Set(updatedIds));
      setConnectedEmployeeIds(uniqueIds);
    });

    socketIo.emit('join', { employeeId });

    return () => {
      socketIo.disconnect();
    };
  }, [employeeId]);

  const employeeMap = useMemo(() => {
    const map: Record<string, string> = {};
    data?.forEach(({ id, name }) => {
      map[id] = name;
    });
    return map;
  }, [data]);

  if (!employeeId) return <div>ID сотрудника не указан</div>;

  if (error) return <div>Ошибка загрузки данных</div>;

  if (isLoading) return <div>Загрузка данных...</div>;

  return (
    <div className="flex flex-col gap-2 p-4">
      {socket && (
        <MouseCursorOverlay
          socket={socket}
          employeeId={employeeId}
          employeeMap={employeeMap}
        />
      )}
      {isLoading ? (
        <div className="flex flex-col gap-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-40" />
        </div>
      ) : (
        <HeaderEmployees data={data ?? []} />
      )}
      {socket && <KanbanBoard socket={socket} />}
    </div>
  );
}
