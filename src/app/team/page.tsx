'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { HeaderEmployees } from '@/app/team/components/HeaderEmployees';
import { KanbanBoard } from './components/KanbanBoard';
import useSWR from 'swr';
import { Skeleton } from '@/components/ui/skeleton';
import { MouseCursorOverlay } from './components/MouseCursorOverlay';

const SITE_URL = process.env.NEXT_PUBLIC_SOCKET_SITE_URL ?? '';

export default function TeamPage() {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('employeeId');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectedEmployeeIds, setConnectedEmployeeIds] = useState<string[]>(
    [],
  );

  const {
    data,
    error,
    isLoading: isLoadingEmployees,
  } = useSWR<
    {
      name: string;
      id: string;
    }[]
  >(
    connectedEmployeeIds.length > 0
      ? `/api/employees/list?ids=${connectedEmployeeIds.join(',')}`
      : null,
  );

  const isLoading = !error && !data;

  useEffect(() => {
    if (!employeeId) return;
    const socketIo = io(SITE_URL);
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
      {isLoadingEmployees ? (
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
