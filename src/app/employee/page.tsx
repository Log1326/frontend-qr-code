'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { Blocks } from '@/app/employee/components/Blocks';
import { HeaderEmployees } from '@/app/employee/components/HeaderEmployees';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';

export default function EmployeePage() {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('employeeId') || 'default-employee-id';
  const [employees, setEmployees] = useState<string[]>([]);

  useEffect(() => {
    const socketIo = io(SITE_URL);
    socketIo.emit('join', { employeeId });
    socketIo.on('employees-updated', (list: string[]) => {
      setEmployees(list);
    });
    return () => {
      socketIo.disconnect();
    };
  }, [employeeId]);

  return (
    <div>
      <HeaderEmployees employeesIds={employees} />
      <h2>Сотрудник: {employeeId}</h2>

      <h3>Подключенные сотрудники:</h3>
      <ul>
        {employees.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
      <Blocks />
    </div>
  );
}
