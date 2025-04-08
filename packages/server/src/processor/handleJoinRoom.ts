import {
  broadcastToPlayers,
  broadcastToRoom,
  sendToPlayer,
} from '../communicator';
import {
  generateGameState,
  getRoomListMessage,
  serverState,
} from '../serverState';
import {
  JoinRoomMessage,
  PlayerId,
  RoomUpdatedMessage,
} from '../types/messages';

export function handleJoinRoom({
  message,
  playerId,
}: {
  playerId: PlayerId;
  message: JoinRoomMessage;
}): RoomUpdatedMessage | undefined {
  const { roomId, roomPin } = message.payload;

  const player = serverState.players.get(playerId);
  const room = serverState.rooms.get(roomId);

  // todo: handle this case
  if (!room) return;
  // todo: handle this case
  if (!player) return;

  if (room.status !== 'waiting') return;

  if (room.players.length !== 1) {
    sendToPlayer({
      message: {
        type: 'ERROR',
        payload: {
          message: room.players.length === 0 ? 'Room is empty' : 'Room is full',
        },
      },
      playerId,
    });
    return;
  }

  if (!room.isAgainstAi && room.pin !== roomPin) {
    sendToPlayer({
      message: {
        type: 'ERROR',
        payload: {
          message: 'Invalid pin',
        },
      },
      playerId,
    });
    return;
  }

  room.players.push({
    id: player.id,
    username: player.username,
    symbol: room.players[0].symbol === 'x' ? 'o' : 'x',
  });

  room.status = 'playing';
  room.currentTurn = room.players[0].id;

  broadcastToRoom({
    room,
    message: {
      type: 'ROOM_JOINED',
      payload: {
        gameState: generateGameState({ room }),
      },
    },
  });
  broadcastToPlayers(getRoomListMessage());
}
