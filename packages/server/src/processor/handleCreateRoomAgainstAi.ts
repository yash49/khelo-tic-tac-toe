import { v4 as uuidv4 } from 'uuid';
import { sendToPlayer } from '../communicator';
import { generateGameState, serverState } from '../serverState';
import {
  CreateRoomAgainstAiMessage,
  PlayerId,
  Room,
  createBoard,
} from '../types/messages';
import { makeMoveForAi } from './makeMoveForAi';

export const AI_PLAYER_USERNAME = 'ai';
export const AI_PLAYER_ID = 'ai';

export function handleCreateRoomAgainstAi({
  message,
  playerId,
}: {
  playerId: PlayerId;
  message: CreateRoomAgainstAiMessage;
}) {
  const player = serverState.players.get(playerId);

  if (!player) return;

  const roomId = uuidv4();
  const {
    payload: { difficulty, firstTurn, playerSymbol },
  } = message;

  const room: Room = {
    id: roomId,
    board: createBoard(),
    currentTurn: firstTurn === 'player' ? player.id : AI_PLAYER_ID,
    name: `${player.username}__vs__${AI_PLAYER_USERNAME}`,
    players: [
      {
        id: player.id,
        username: player.username,
        symbol: playerSymbol,
      },
      {
        id: AI_PLAYER_ID,
        username: AI_PLAYER_USERNAME,
        symbol: playerSymbol === 'x' ? 'o' : 'x',
      },
    ],
    status: 'playing',
    createdBy: player,
    gameLogs: [],

    isAgainstAi: true,
    difficulty,
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

  if (firstTurn === 'ai') {
    makeMoveForAi({ aiSymbol: playerSymbol === 'x' ? 'o' : 'x', roomId });
  }
}
