import { serverState } from '../serverState';
import { PlayerId, ServerMessage } from '../types/messages';

export function sendToPlayer({
  playerId,
  message,
}: {
  playerId?: PlayerId;
  message: ServerMessage;
}) {
  if (!playerId) return;

  const socket = serverState.playerSockets.get(playerId);

  if (socket?.OPEN) {
    socket.send(JSON.stringify(message));
  }
}
