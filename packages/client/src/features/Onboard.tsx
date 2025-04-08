import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import { Grid2, IconButton, Stack, TextField } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { sendToServerAtom } from '../atoms/connection';
import { previousPathAtom } from '../atoms/navigation';
import { playerUsernameAtom } from '../atoms/player';
import { validateName } from './utils/validateName';

export const Onboard = () => {
  const [playerUsername, setPlayerUsername] = useAtom(playerUsernameAtom);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const sendToServer = useAtomValue(sendToServerAtom);
  const previousPath = useAtomValue(previousPathAtom);

  useEffect(() => {
    if (playerUsername !== '') {
      navigate(previousPath !== '' ? previousPath : '/');
    }
  }, [playerUsername, previousPath, navigate]);

  return (
    <Grid2
      container
      sx={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}
    >
      <Grid2 sx={{ height: 90 }}>
        <Stack
          spacing={1}
          useFlexGap
          direction={'row'}
          sx={{ alignItems: 'start' }}
          component={'form'}
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setErrorMessage('');

            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const newPlayerUsername = formJson.playerUsername as string;

            const newErrorMessage = validateName(newPlayerUsername);
            if (newErrorMessage) {
              setErrorMessage(newErrorMessage);
              return;
            }
            setPlayerUsername(newPlayerUsername);
            sendToServer({
              type: 'UPDATE_USERNAME',
              payload: {
                username: newPlayerUsername,
              },
            });
            navigate('/');
          }}
        >
          <TextField
            autoFocus
            name="playerUsername"
            label="Pick a username"
            defaultValue={playerUsername}
            fullWidth
            variant="standard"
            slotProps={{ inputLabel: { shrink: true } }}
            size="small"
            error={!!errorMessage}
            helperText={errorMessage}
            sx={{ width: '250px' }}
            onChange={(event) => {
              const newPlayerUsername = event.target.value;
              const newErrorMessage = validateName(newPlayerUsername);

              if (newPlayerUsername && newErrorMessage) {
                setErrorMessage(newErrorMessage);
              } else {
                setErrorMessage('');
              }
            }}
          />
          <IconButton size="large" type="submit" edge="end">
            <SubdirectoryArrowLeftIcon />
          </IconButton>
        </Stack>
      </Grid2>
    </Grid2>
  );
};
