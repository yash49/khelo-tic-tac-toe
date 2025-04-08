import { Room, ServerMessage } from '../types/messages';
import { sendToPlayer } from './sendToPlayer';

export function broadcastToRoom({
  room,
  message,
}: {
  room: Room;
  message: ServerMessage;
}) {
  const { players } = room;

  players.forEach((player) => {
    sendToPlayer({
      playerId: player.id,
      message,
    });
  });
}
