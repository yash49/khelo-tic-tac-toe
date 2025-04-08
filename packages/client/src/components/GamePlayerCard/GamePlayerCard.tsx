import { Stack } from '@mui/material';
import { ReactNode } from 'react';

export interface GamePlayerCardProps {
  username: string;
  avatar: ReactNode;
  symbol?: 'x' | 'o';
}

export const GamePlayerCard = ({
  avatar,
  symbol,
  username,
}: GamePlayerCardProps) => {
  return (
    <Stack
      direction={'row'}
      useFlexGap
      spacing={1.5}
      sx={{ alignItems: 'center' }}
    >
      <div>{avatar}</div>
      <Stack>
        {username} {symbol && <>({symbol})</>}
      </Stack>
    </Stack>
  );
};
