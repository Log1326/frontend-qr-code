'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import { Blocks } from '@/app/employee/components/Blocks';
import { HeaderEmployees } from '@/app/employee/components/HeaderEmployees';

interface ChatMessage {
  employeeId: string;
  message: string;
  timestamp: string;
}
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';
export default function EmployeePage() {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('employeeId') || 'default-employee-id';

  const [socket, setSocket] = useState<Socket | null>(null);
  const [employees, setEmployees] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  useEffect(() => {
    const socketIo = io(SITE_URL);

    socketIo.emit('join', { employeeId });

    socketIo.on('employees-updated', (list: string[]) => {
      setEmployees(list);
    });

    socketIo.on('chat-message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [employeeId]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    socket.emit('chat-message', input);
    setInput('');
  };

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
