'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import { HeaderEmployees } from '@/app/dashboard/team/components/HeaderEmployees';
import { KanbanBoard } from '@/app/dashboard/team/components/KanbanBoard';
import { MouseCursorOverlay } from '@/app/dashboard/team/components/MouseCursorOverlay';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/useUser';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';

interface Employee {
  id: string;
  name: string;
}

export default function TeamPage() {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const employeeId = user?.id;
  const employeeName = user?.name;

  useEffect(() => {
    if (!employeeId || !employeeName) return;

    const socketIo = io(SITE_URL, {
      path: '/socket',
      transports: ['websocket'],
    });

    setSocket(socketIo);

    socketIo.on('connect', () => {
      socketIo.emit('join', { id: employeeId, name: employeeName });

      setEmployees((prev) => [
        ...prev.filter((e) => e.id !== employeeId),
        { id: employeeId, name: employeeName },
      ]);
    });

    socketIo.on('employee-joined', ({ id, name }: Employee) => {
      setEmployees((prev) => {
        if (prev.find((e) => e.id === id)) return prev;
        return [...prev, { id, name }];
      });
    });

    return () => {
      socketIo.disconnect();
    };
  }, [employeeId, employeeName]);

  const employeeMap = useMemo(() => {
    const map: Record<string, string> = {};
    employees.forEach(({ id, name }) => {
      map[id] = name;
    });
    return map;
  }, [employees]);

  if (!user) return <div>Загрузка пользователя...</div>;
  if (!employeeId) return <div>ID сотрудника не найден</div>;

  return (
    <div className="flex flex-col gap-2 p-4">
      {socket && (
        <MouseCursorOverlay
          socket={socket}
          employeeId={employeeId}
          employeeMap={employeeMap}
        />
      )}
      {employees.length === 0 ? (
        <div className="flex flex-col gap-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-40" />
        </div>
      ) : (
        <HeaderEmployees data={employees} />
      )}
      {socket && <KanbanBoard socket={socket} />}
    </div>
  );
}
