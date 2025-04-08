import { List, ListSubheader, SxProps } from '@mui/material';
import { ReactNode } from 'react';
import { tokens } from '../../tokens';

export interface GameLogListProps {
  children: ReactNode;
  title?: ReactNode;
  sx?: SxProps;
}

export const GameLogList = (props: GameLogListProps) => {
  const { children, title, sx = {} } = props;
  return (
    <List
      sx={{
        height: '100%',
        overflow: 'auto',
        background: tokens.color.background.subtle,
        border: `1px solid ${tokens.color.neutral.border}`,
        borderRadius: tokens.radius.l,
        ...sx,
      }}
      disablePadding
      dense
      subheader={
        title && (
          <ListSubheader sx={{ textAlign: 'center', typography: 'overline' }}>
            {title}
          </ListSubheader>
        )
      }
    >
      {children}
    </List>
  );
};
