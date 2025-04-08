import { forwardRef, ReactNode } from 'react';
import { Avatar as MuiAvatar } from '@mui/material';
import { tokens } from '../../tokens';

export interface AvatarProps {
  children: ReactNode;
  size?: 'medium';
  color?: 'accent' | 'alert';
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const { children, size = 'medium', color = 'accent', ...rest } = props;
  return (
    <MuiAvatar
      ref={ref}
      sx={[
        { textTransform: 'uppercase' },
        size === 'medium' && {
          width: (t) => t.spacing(5),
          height: (t) => t.spacing(5),
          fontSize: '1rem',
        },
        color === 'accent' && {
          bgcolor: tokens.color.accent.base,
          color: tokens.color.accent.contrast,
        },
        color === 'alert' && {
          bgcolor: tokens.color.alert.base,
          color: tokens.color.accent.contrast,
        },
      ]}
      {...rest}
    >
      {children}
    </MuiAvatar>
  );
});

Avatar.displayName = 'Avatar';
