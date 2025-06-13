import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

interface ConnectedEmployee {
  socketId: string;
  employeeId: string;
}

const connectedEmployees = new Map<string, ConnectedEmployee>();

io.on('connection', (socket) => {
  socket.on('join', ({ employeeId }) => {
    if (typeof employeeId !== 'string' || !employeeId.trim())
      return socket.disconnect();
    connectedEmployees.set(socket.id, { socketId: socket.id, employeeId });
    socket.join('chat-room');
    const onlineIds = Array.from(connectedEmployees.values()).map(
      (e) => e.employeeId,
    );
    io.emit('employees-updated', onlineIds);
  });

  socket.on('recipe-updated', (data) => {
    socket.broadcast.emit('recipe-updated', data);
  });

  socket.on('recipe-reordered', ({ status, recipes }) => {
    socket.broadcast.emit('recipe-reordered', { status, recipes });
  });
  socket.on('mouse-move', ({ employeeId, x, y, name }) => {
    socket.broadcast.emit('mouse-move', { employeeId, x, y, name });
  });
  socket.on('disconnect', () => {
    connectedEmployees.delete(socket.id);

    const onlineIds = Array.from(connectedEmployees.values()).map(
      (e) => e.employeeId,
    );
    io.emit('employees-updated', onlineIds);
  });
});

httpServer.listen(3001, () => {
  console.log('Socket.io сервер запущен на порту 3001');
});
