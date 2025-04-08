import { Box, ListItem, ListItemText } from '@mui/material';
import { ReactNode } from 'react';
import { tokens } from '../../tokens';

export interface GameChatItemProps {
  from: ReactNode;
  children: ReactNode;
}

export const GameChatItem = (props: GameChatItemProps) => {
  const { from, children } = props;

  return (
    <ListItem
      sx={{
        color: tokens.color.neutral.muted,
        borderTop: `1px solid ${tokens.color.neutral.border}`,
        alignItems: 'center',
      }}
    >
      <ListItemText
        primary={
          <>
            <Box component={'span'} sx={{ mr: 1 }}>
              {from}
            </Box>
            {children}
          </>
        }
      />
    </ListItem>
  );
};
