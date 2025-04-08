import WebSocket, { WebSocketServer } from 'ws';
import { onPlayerConnect } from './processor';

export const server = new WebSocketServer({ port: 8080 });

server.on('connection', onPlayerConnect);

// Listen for the SIGINT signal (Ctrl+C)
process.on('SIGINT', () => {
  // clean up
  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.close();
    }
  });
  server.close(() => {
    console.log('WebSocket server closed');
  });
  process.exit(0);
});

console.log('Tic Tac Toe server started');
