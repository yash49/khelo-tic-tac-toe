import { broadcastToRoom } from '../communicator';
import { generateGameState, serverState } from '../serverState';
import { MakeMoveMessage, PlayerId } from '../types/messages';
import { AI_PLAYER_ID } from './handleCreateRoomAgainstAi';
import { makeMoveForAi } from './makeMoveForAi';

export const WINNING_COMBINATION = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonals
  [0, 4, 8],
  [2, 4, 6],
];

export function handleMakeMove({
  message,
  playerId,
}: {
  playerId: PlayerId;
  message: MakeMoveMessage;
}) {
  const {
    payload: { roomId, boardIndex },
  } = message;
  const room = serverState.rooms.get(roomId);
  if (!room || room.status !== 'playing' || room.players.length !== 2) {
    // todo: handle this case
    return;
  }

  // check if it's actually player's turn
  if (playerId !== room.currentTurn) {
    return;
  }

  const player = room.players.find((player) => player.id === playerId);

  // player does not belong to this room
  if (!player) {
    return;
  }

  const opponent = room.players.find((player) => player.id !== playerId);

  if (!opponent) {
    return;
  }

  // invalid move
  if (room.board[boardIndex] !== '') {
    return;
  }

  room.board[boardIndex] = player.symbol;
  room.gameLogs.push({
    type: 'move-made',
    boardIndex,
    playerSymbol: player.symbol,
    playerUsername: player.username,
  });

  // check if the game is over
  const isWinningMove = WINNING_COMBINATION.some((combination) =>
    combination.every((index) => room.board[index] === player.symbol)
  );

  const isTie = room.board.every((cell) => cell !== '');

  if (isWinningMove) {
    room.status = 'finished-with-winner';
    room.winnerId = playerId;
    room.gameLogs.push({
      type: 'finished-with-winner',
      winnerId: playerId,
    });
  } else if (isTie) {
    room.status = 'finished-with-tie';
    room.gameLogs.push({
      type: 'finished-with-tie',
    });
  } else {
    room.currentTurn = opponent.id;

    if (opponent.id === AI_PLAYER_ID && room.isAgainstAi) {
      makeMoveForAi({ aiSymbol: opponent.symbol, roomId });
    }
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
