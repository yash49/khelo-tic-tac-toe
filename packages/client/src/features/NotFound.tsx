import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { Message } from '../components';
export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Stack
      sx={{ height: '100%' }}
      justifyContent={'center'}
      alignItems={'center'}
      component={'main'}
    >
      <Message
        title="404 Not Found"
        actions={
          <Button
            variant="contained"
            onClick={() => {
              navigate('/');
            }}
          >
            Go Home
          </Button>
        }
      />
    </Stack>
  );
};
