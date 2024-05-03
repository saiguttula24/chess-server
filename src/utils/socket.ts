import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

let io: SocketIOServer;

export const init = (server: Server): void => {
  io = new SocketIOServer(server); 
  
  io.on('connection', (socket: Socket) => {
    console.log('A user connected');
    
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
