import { serverState } from '../serverState';
import { Board, BoardIndex, Room } from '../types/messages';
import { AI_PLAYER_ID } from './handleCreateRoomAgainstAi';
import { handleMakeMove, WINNING_COMBINATION } from './handleMakeMove';

export function makeMoveForAi({
  aiSymbol,
  roomId,
}: {
  aiSymbol: 'x' | 'o';
  roomId: Room['id'];
}) {
  const room = serverState.rooms.get(roomId);

  if (!room) return;

  if (!room.isAgainstAi) return;

  if (room.currentTurn !== AI_PLAYER_ID) return;

  const boardIndex = getMoveBasedOnDifficulty({
    board: room.board,
    aiSymbol,
    difficulty: room.difficulty,
  });

  handleMakeMove({
    message: {
      type: 'MAKE_MOVE',
      payload: {
        roomId,
        boardIndex,
      },
    },
    playerId: AI_PLAYER_ID,
  });
}

function getMoveBasedOnDifficulty(args: {
  board: Room['board'];
  aiSymbol: 'x' | 'o';
  difficulty: 'easy' | 'medium' | 'hard';
}): BoardIndex {
  const { board, aiSymbol, difficulty } = args;
  const playerSymbol = aiSymbol === 'x' ? 'o' : 'x';

  function getBestMove(): BoardIndex {
    let bestScore = -Infinity;
    let bestMove = 0 as BoardIndex;
    const validMoves = getValidMoves(board);

    for (const move of validMoves) {
      board[move] = aiSymbol;
      const score = minimax(board, 0, false, aiSymbol, playerSymbol);
      board[move] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  function getRandomMove(): BoardIndex {
    const validMoves = getValidMoves(board);
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  if (difficulty === 'easy') return getRandomMove();
  if (difficulty === 'hard') return getBestMove();
  return Math.random() < 0.5 ? getRandomMove() : getBestMove();
}

// =====

function getValidMoves(board: Board): BoardIndex[] {
  return board.reduce((acc, cell, index) => {
    if (cell === '') acc.push(index as BoardIndex);
    return acc;
  }, [] as BoardIndex[]);
}

function checkWinner(board: Room['board']): string | null {
  const lines = WINNING_COMBINATION;

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isBoardFull(board: Room['board']): boolean {
  return !board.includes('');
}

// todo: implement alpha beta pruning
function minimax(
  board: Room['board'],
  depth: number,
  isMaximizing: boolean,
  aiSymbol: 'x' | 'o',
  playerSymbol: 'x' | 'o'
): number {
  const winner = checkWinner(board);

  if (winner === aiSymbol) return 10 - depth;
  if (winner === playerSymbol) return depth - 10;
  if (isBoardFull(board)) return 0;

  const validMoves = getValidMoves(board);

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of validMoves) {
      board[move] = aiSymbol;
      bestScore = Math.max(
        bestScore,
        minimax(board, depth + 1, false, aiSymbol, playerSymbol)
      );
      board[move] = '';
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of validMoves) {
      board[move] = playerSymbol;
      bestScore = Math.min(
        bestScore,
        minimax(board, depth + 1, true, aiSymbol, playerSymbol)
      );
      board[move] = '';
    }
    return bestScore;
  }
}
