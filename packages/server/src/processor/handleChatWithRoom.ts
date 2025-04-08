import { broadcastToRoom } from '../communicator';
import { generateGameState, serverState } from '../serverState';
import { ChatWithRoom, PlayerId } from '../types/messages';

export function handleChatWithRoom({
  message,
  playerId,
}: {
  playerId: PlayerId;
  message: ChatWithRoom;
}) {
  const {
    payload: { roomId, message: chatMessage },
  } = message;
  const room = serverState.rooms.get(roomId);
  if (
    !room ||
    room.status === 'waiting' ||
    room.status === 'abandoned' ||
    room.players.length !== 2
  ) {
    // todo: handle this case
    return;
  }

  const player = room.players.find((player) => player.id === playerId);

  // player does not belong to this room
  if (!player) {
    return;
  }

  room.gameLogs.push({
    type: 'game-chat',
    message: chatMessage,
    playerUsername: player.username,
    playerSymbol: player.symbol,
  });

  broadcastToRoom({
    room,
    message: {
      type: 'ROOM_UPDATED',
      payload: {
        gameState: generateGameState({ room }),
      },
    },
  });
}
