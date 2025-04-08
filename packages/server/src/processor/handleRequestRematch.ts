import { broadcastToRoom } from '../communicator';
import { generateGameState, serverState } from '../serverState';
import { PlayerId, RequestRematchMessage } from '../types/messages';

export function handleRequestRematch({
  message,
  playerId,
}: {
  playerId: PlayerId;
  message: RequestRematchMessage;
}) {
  const {
    payload: { roomId },
  } = message;
  const room = serverState.rooms.get(roomId);
  if (!room || room.players.length !== 2) {
    // todo: handle this case
    return;
  }

  if (
    !(
      room.status === 'finished-with-tie' ||
      room.status === 'finished-with-winner'
    )
  )
    return;

  const player = room.players.find((player) => player.id === playerId);

  // player does not belong to this room
  if (!player) {
    return;
  }

  if (room.isAgainstAi) return;

  if (room.rematchRequested) return;

  room.rematchRequested = {
    by: playerId,
  };

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
