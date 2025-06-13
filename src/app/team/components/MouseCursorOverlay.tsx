'use client';

import { motion } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';

interface Cursor {
  x: number;
  y: number;
  name?: string;
  lastSeen: number;
}

interface NormalizedCursor {
  x: number;
  y: number;
  name: string;
  employeeId: string;
}

interface MouseCursorOverlayProps {
  socket: Socket;
  employeeId: string;
  employeeMap: Record<string, string>;
}

export const MouseCursorOverlay: React.FC<MouseCursorOverlayProps> = ({
  socket,
  employeeId,
  employeeMap,
}) => {
  const [cursors, setCursors] = useState<Record<string, Cursor>>({});
  const lastEmit = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastEmit.current > 100) {
        socket.emit('mouse-move', {
          employeeId,
          name: employeeMap[employeeId] ?? '?',
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
        lastEmit.current = now;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [socket, employeeId, employeeMap]);

  useEffect(() => {
    const handleIncoming = ({
      employeeId: id,
      name,
      x,
      y,
    }: NormalizedCursor) => {
      const absX = x * window.innerWidth;
      const absY = y * window.innerHeight;

      setCursors((prev) => ({
        ...prev,
        [id]: { x: absX, y: absY, name, lastSeen: Date.now() },
      }));
    };

    socket.on('mouse-move', handleIncoming);
    return () => {
      socket.off('mouse-move', handleIncoming);
    };
  }, [socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCursors((prev) =>
        Object.fromEntries(
          Object.entries(prev).filter(
            ([_id, cursor]) => now - cursor.lastSeen < 5000,
          ),
        ),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {Object.entries(cursors).map(([id, { x, y, name }]) =>
        id !== employeeId ? (
          <motion.div
            key={id}
            initial={false}
            animate={{ x, y }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="pointer-events-none fixed z-50 text-muted-foreground"
            style={{ top: 0, left: 0 }}>
            <div className="flex flex-col items-start space-y-0.5">
              <span className="rounded bg-background px-1 py-0.5 text-xs shadow">
                {name}
              </span>
              <MousePointer2 className="h-5 w-5" />
            </div>
          </motion.div>
        ) : null,
      )}
    </>
  );
};
