import { broadcastToPlayers, broadcastToRoom } from '../communicator';
import {
  generateGameState,
  getRoomListMessage,
  serverState,
} from '../serverState';
import {
  LeaveRoomMessage,
  PlayerId,
  RoomUpdatedMessage,
} from '../types/messages';

export function handleLeaveRoom({
  message,
  playerId,
}: {
  playerId: PlayerId;
  message: LeaveRoomMessage;
}): RoomUpdatedMessage | undefined {
  const player = serverState.players.get(playerId);
  const room = serverState.rooms.get(message.payload.roomId);

  // todo: handle this case
  if (!room) return;
  // todo: handle this case
  if (!player) return;

  // remove player from room
  room.players = room.players.filter((player) => player.id !== playerId);

  if (room.isAgainstAi) {
    serverState.rooms.delete(room.id);
  } else if (room.players.length === 0) {
    serverState.rooms.delete(room.id);
  } else {
    room.status = 'abandoned';
    room.rematchRequested = undefined;
    broadcastToRoom({
      room,
      message: {
        type: 'ROOM_UPDATED',
        payload: { gameState: generateGameState({ room }) },
      },
    });
  }

  if (!room.isAgainstAi) broadcastToPlayers(getRoomListMessage());
}
