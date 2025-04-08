import { Box, Stack, StackProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

// todo: can add option for image in future

export interface MessageProps extends Omit<StackProps, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
}

export const Message = ({
  title,
  description,
  actions,
  icon,
  sx,
  ...rest
}: MessageProps) => {
  return (
    <Stack
      gap={1}
      sx={{ minWidth: '200px', alignItems: 'center', ...sx }}
      {...rest}
    >
      {icon && <Box>{icon}</Box>}
      <Stack sx={{ textAlign: 'center' }} gap={2}>
        {title && (
          <Typography
            color="text.primary"
            variant="h5"
            component={'h1'}
            sx={{ fontSize: '1.25rem' }}
          >
            {title}
          </Typography>
        )}
        {description && (
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        )}
      </Stack>
      {actions && (
        <Stack
          sx={{ mt: 1.5, justifyContent: 'center', alignItems: 'center' }}
          direction={'row'}
          spacing={2}
        >
          {actions}
        </Stack>
      )}
    </Stack>
  );
};
