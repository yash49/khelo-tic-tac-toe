import { Room, GameState } from '../types/messages';

export function generateGameState({ room }: { room: Room }): GameState {
  const gameState: GameState = {
    board: room.board,
    roomId: room.id,
    roomName: room.name,
    roomStatus: room.status,
    currentTurn: room.currentTurn,
    players: room.players,
    winnerId: room.winnerId,
    gameLogs: room.gameLogs,

    ...(room.isAgainstAi
      ? {
          isAgainstAi: true,
        }
      : {
          rematchRequested: room.rematchRequested,
          isAgainstAi: false,
        }),
  };

  return gameState;
}
