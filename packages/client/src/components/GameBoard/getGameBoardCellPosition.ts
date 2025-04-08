import { BoardIndex } from '../../../../server/src/types/messages';

const rows = ['1', '2', '3'] as const;
const columns = ['A', 'B', 'C'] as const;

export const getGameBoardCellPosition = (boardIndex: BoardIndex) => {
  const rowIndex = Math.floor(boardIndex / 3);
  const columnIndex = boardIndex % 3;

  return {
    row: rows[rowIndex],
    column: columns[columnIndex],
  };
};
