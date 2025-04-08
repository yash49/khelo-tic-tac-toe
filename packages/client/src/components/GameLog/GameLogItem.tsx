import {
  Box,
  ListItem,
  ListItemText,
  listItemTextClasses,
} from '@mui/material';
import { ReactNode } from 'react';
import { tokens } from '../../tokens';

export interface GameLogItemProps {
  from?: ReactNode;
  children: ReactNode;
  opponent?: boolean;
}

export const GameLogItem = (props: GameLogItemProps) => {
  const { from, children, opponent = false } = props;
  const isSystemLog = !from;
  return (
    <ListItem
      sx={{
        color: tokens.color.neutral.muted,
        borderTop: `1px solid ${tokens.color.neutral.border}`,
        alignItems: 'center',
        backgroundColor: opponent
          ? tokens.color.alert.backdrop
          : tokens.color.accent.backdrop,
      }}
    >
      <ListItemText
        primary={
          <>
            {from && (
              <Box component={'span'} sx={{ mr: 1 }}>
                {from}
              </Box>
            )}
            {children}
          </>
        }
        sx={[
          {
            code: {
              color: opponent
                ? tokens.color.alert.strong
                : tokens.color.accent.strong,
              fontWeight: 'bold',
              px: 0.75,
              mx: 0.25,
              py: 0.25,
              borderRadius: tokens.radius.l,
              background: tokens.color.background.regular,
            },
          },
          isSystemLog && {
            [`.${listItemTextClasses.primary}`]: {
              textTransform: 'uppercase',
              fontWeight: 'bold',
              textAlign: 'center',
            },
          },
        ]}
      ></ListItemText>
    </ListItem>
  );
};
