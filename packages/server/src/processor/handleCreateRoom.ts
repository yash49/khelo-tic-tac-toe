import { v4 as uuidv4 } from 'uuid';
import { broadcastToPlayers, sendToPlayer } from '../communicator';
import {
  generateGameState,
  getRoomListMessage,
  serverState,
} from '../serverState';
import {
  CreateRoomMessage,
  PlayerId,
  Room,
  createBoard,
} from '../types/messages';

export function handleCreateRoom({
  message,
  playerId,
}: {
  playerId: PlayerId;
  message: CreateRoomMessage;
}) {
  const player1 = serverState.players.get(playerId);

  if (!player1) return;

  const roomId = uuidv4();
  const {
    payload: { roomName, roomPin },
  } = message;

  const room: Room = {
    id: roomId,
    board: createBoard(),
    currentTurn: player1.id,
    name: roomName,
    pin: roomPin,
    players: [
      {
        id: player1.id,
        username: player1.username,
        symbol: 'x',
      },
    ],
    status: 'waiting',
    createdBy: player1,
    gameLogs: [],
    isAgainstAi: false,
  };

  serverState.rooms.set(roomId, room);

  sendToPlayer({
    message: {
      type: 'ROOM_CREATED',
      payload: {
        gameState: generateGameState({ room }),
      },
    },
    playerId,
  });

  broadcastToPlayers(getRoomListMessage());
}
