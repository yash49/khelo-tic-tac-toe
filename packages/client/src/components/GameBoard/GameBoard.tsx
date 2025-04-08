import { Board, BoardIndex } from '../../../../server/src/types/messages';
import { Box, ButtonBase, Grid2 as Grid } from '@mui/material';
import { tokens } from '../../tokens';
import { PixelatedXIcon, PixelatedOIcon } from '../Icons';

export interface GameBoardProps {
  value: Board;
  onClick?: (boardIndex: BoardIndex) => void;
  readOnly?: boolean;
  xColor?: 'accent' | 'alert';
}

export const GameBoard = (props: GameBoardProps) => {
  const { value: board, onClick, readOnly, xColor = 'accent' } = props;

  return (
    <Grid
      container
      spacing={0.5}
      sx={{
        maxHeight: '100%',
        aspectRatio: '1 / 1',
        maxWidth: '100%',
        backgroundColor: tokens.color.background.muted,
      }}
    >
      {board.map((value, index) => (
        <Grid
          size={4}
          key={index}
          sx={[
            {
              // border: '1px solid blue',
              aspectRatio: '1 / 1',
              borderRadius: tokens.radius.n,
              position: 'relative',
              display: 'flex',
              justifyContent: 'stretch',
              alignItems: 'stretch',
              p: 2.5,
              backgroundColor: tokens.color.background.subtle,
            },
            value === 'x' && {
              color:
                xColor === 'accent'
                  ? tokens.color.accent.base
                  : tokens.color.alert.base,
            },
            value === 'o' && {
              color:
                xColor !== 'accent'
                  ? tokens.color.accent.base
                  : tokens.color.alert.base,
            },
          ]}
          component={ButtonBase}
          disabled={readOnly || value !== ''}
          onClick={() => onClick?.(index as BoardIndex)}
          focusRipple
        >
          <GameBoardMarking boardIndex={index as BoardIndex} />

          {value === 'x' ? (
            <PixelatedXIcon sx={{ height: 'auto', width: 'auto' }} />
          ) : value === 'o' ? (
            <PixelatedOIcon sx={{ height: 'auto', width: 'auto' }} />
          ) : (
            ''
          )}
        </Grid>
      ))}
    </Grid>
  );
};

function GameBoardMarking({ boardIndex }: { boardIndex: BoardIndex }) {
  let digit = '';
  let character = '';

  if (boardIndex === 0) {
    digit = '1';
  }

  if (boardIndex === 3) {
    digit = '2';
  }

  if (boardIndex === 6) {
    digit = '3';
    character = 'A';
  }

  if (boardIndex === 7) {
    character = 'B';
  }

  if (boardIndex === 8) {
    character = 'C';
  }

  return (
    <>
      {digit && (
        <Box
          sx={{
            fontSize: '1rem',
            position: 'absolute',
            top: 4,
            left: 4,
            color: tokens.color.content.muted,
          }}
          component={'code'}
        >
          {digit}
        </Box>
      )}
      {character && (
        <Box
          sx={{
            fontSize: '1rem',
            position: 'absolute',
            bottom: 4,
            right: 4,
            color: tokens.color.content.muted,
          }}
          component={'code'}
        >
          {character}
        </Box>
      )}
    </>
  );
}
