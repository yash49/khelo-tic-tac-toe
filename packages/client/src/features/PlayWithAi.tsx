import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { tokens } from '../tokens';
import { sendToServerAtom } from '../atoms/connection';
import { useId } from 'react';
import { PixelatedOIcon, PixelatedXIcon } from '../components';
import {
  aiDifficultyAtom,
  aiPlayerSymbolAtom,
  aiWhoGoesFirstAtom,
} from '../atoms/aiSettings';

export const PlayWithAi = () => {
  const sendToServer = useAtomValue(sendToServerAtom);

  const [difficulty, setDifficulty] = useAtom(aiDifficultyAtom);
  const [symbol, setSymbol] = useAtom(aiPlayerSymbolAtom);
  const [whoGoesFirst, setWhoGoesFirst] = useAtom(aiWhoGoesFirstAtom);

  const difficultyLabelId = useId();
  const symbolLabelId = useId();
  const whoGoesFirstLabelId = useId();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    sendToServer({
      type: 'CREATE_ROOM_AGAINST_AI',
      payload: {
        difficulty,
        firstTurn: whoGoesFirst,
        playerSymbol: symbol,
      },
    });
  };

  return (
    <Stack
      sx={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        sx={{
          background: tokens.color.background.subtle,
          borderRadius: tokens.radius.l,
        }}
        component={'form'}
        onSubmit={onSubmit}
      >
        <DialogTitle>Play against AI</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1, minWidth: 250 }} useFlexGap>
            <Box>
              <InputLabel shrink id={difficultyLabelId}>
                Select difficulty
              </InputLabel>
              <ToggleButtonGroup
                value={difficulty}
                onChange={(_, value) => {
                  if (value) setDifficulty(value);
                }}
                exclusive
                size="small"
                color="primary"
                aria-labelledby={difficultyLabelId}
              >
                <ToggleButton sx={{ width: (t) => t.spacing(9) }} value="easy">
                  Easy
                </ToggleButton>
                <ToggleButton
                  sx={{ width: (t) => t.spacing(9) }}
                  value="medium"
                >
                  Medium
                </ToggleButton>
                <ToggleButton sx={{ width: (t) => t.spacing(9) }} value="hard">
                  Hard
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box>
              <InputLabel shrink id={symbolLabelId}>
                Choose your symbol
              </InputLabel>
              <ToggleButtonGroup
                value={symbol}
                onChange={(_, value) => {
                  if (value) setSymbol(value);
                }}
                exclusive
                size="small"
                color="primary"
                aria-labelledby={symbolLabelId}
              >
                <ToggleButton
                  value="x"
                  sx={{ width: (t) => t.spacing(6) }}
                  aria-label='Symbol "X"'
                >
                  <PixelatedXIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton
                  value="o"
                  sx={{ width: (t) => t.spacing(6) }}
                  aria-label='Symbol "O"'
                >
                  <PixelatedOIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box>
              <InputLabel shrink id={whoGoesFirstLabelId}>
                Who goes first?
              </InputLabel>
              <ToggleButtonGroup
                value={whoGoesFirst}
                onChange={(_, value) => {
                  if (value) setWhoGoesFirst(value);
                }}
                exclusive
                size="small"
                color="primary"
                aria-labelledby={whoGoesFirstLabelId}
              >
                <ToggleButton
                  value="ai"
                  aria-label="AI goes first"
                  sx={{ width: (t) => t.spacing(7) }}
                >
                  AI
                </ToggleButton>
                <ToggleButton
                  value="player"
                  sx={{ width: (t) => t.spacing(7) }}
                  aria-label="You go first"
                >
                  You
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="submit">Play</Button>
        </DialogActions>
      </Box>
    </Stack>
  );
};
