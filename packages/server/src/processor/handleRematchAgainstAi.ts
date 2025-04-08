import { sendToPlayer } from '../communicator';
import { generateGameState, serverState } from '../serverState';
import {
  PlayerId,
  RematchAgainstAiMessage,
  Room,
  createBoard,
} from '../types/messages';
import { makeMoveForAi } from './makeMoveForAi';

export const AI_PLAYER_USERNAME = 'ai';
export const AI_PLAYER_ID = 'ai';

export function handleRematchAgainstAi({
  message,
  playerId,
}: {
  playerId: PlayerId;
  message: RematchAgainstAiMessage;
}) {
  const player = serverState.players.get(playerId);

  if (!player) return;

  const {
    payload: { difficulty, firstTurn, playerSymbol, roomId },
  } = message;

  serverState.rooms.delete(roomId);

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
