import WebSocket from 'ws';
import { server } from '../server';
import { ServerMessage } from '../types/messages';

export function broadcastToPlayers(message: ServerMessage) {
  const serializedMessage = JSON.stringify(message);

  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(serializedMessage);
    }
  });
}
