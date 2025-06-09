import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

interface ConnectedEmployee {
  socketId: string;
  employeeName: string;
}

const connectedEmployees = new Map<string, ConnectedEmployee>();

io.on('connection', (socket) => {
  socket.on('join', ({ employeeName }) => {
    connectedEmployees.set(socket.id, { socketId: socket.id, employeeName });
    socket.join('chat-room');
    io.emit(
      'employees-updated',
      Array.from(connectedEmployees.values()).map((e) => e.employeeName),
    );
  });

  socket.on('chat-message', (message) => {
    const employee = connectedEmployees.get(socket.id);
    if (!employee) return;
    io.to('chat-room').emit('chat-message', {
      employeeName: employee.employeeName,
      message,
      timestamp: new Date().toISOString(),
    });
  });
  socket.on('disconnect', () => {
    const employee = connectedEmployees.get(socket.id);
    if (employee) {
      connectedEmployees.delete(socket.id);
      io.emit(
        'employees-updated',
        Array.from(connectedEmployees.values()).map((e) => e.employeeName),
      );
    }
  });
});

httpServer.listen(3001, () => {
  console.log('Socket.io сервер запущен на порту 3001');
});
