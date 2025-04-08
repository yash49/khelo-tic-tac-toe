import { broadcastToRoom } from '../communicator';
import { generateGameState, serverState } from '../serverState';
import {
  createBoard,
  PlayerId,
  RematchResponseMessage,
  Room,
} from '../types/messages';

export function handleRematchResponse({
  message,
  playerId,
}: {
  playerId: PlayerId;
  message: RematchResponseMessage;
}) {
  const {
    payload: { roomId, response },
  } = message;
  let room = serverState.rooms.get(roomId);

  if (!room || room.players.length !== 2) {
    // todo: handle this case
    return;
  }

  if (room.isAgainstAi) return;

  const player = room.players.find((player) => player.id === playerId);
  const opponent = room.players.find((player) => player.id !== playerId);

  // player does not belong to this room
  if (!player) {
    return;
  }

  // rematch is not requested or requested by not by the opponent
  if (!room.rematchRequested || room.rematchRequested?.by !== opponent?.id)
    return;

  if (response === 'reject') {
    room.rematchRequested.response = 'reject';
  } else {
    room.rematchRequested.response = 'accept';

    // start the new game
    const newRoom: Room = {
      id: roomId,
      board: createBoard(),
      // here we are changing the turn
      currentTurn: room.players[1].id,
      name: room.name,
      pin: room.pin,
      players: room.players.reverse(),
      status: 'playing',
      createdBy: room.createdBy,
      gameLogs: [],
      isAgainstAi: false,
    };

    serverState.rooms.set(roomId, newRoom);
    room = newRoom;
  }

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
