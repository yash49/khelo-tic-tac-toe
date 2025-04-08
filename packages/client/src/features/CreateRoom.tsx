import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Stack,
  TextField,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { sendToServerAtom } from '../atoms/connection';
import { validateName } from './utils/validateName';
import { tokens } from '../tokens';
import { z } from 'zod';

export const roomPinSchema = z
  .string()
  .length(4, { message: 'PIN must be exactly 4 digits long' })
  .regex(/^\d{4}$/, { message: 'PIN must only contain numeric values' });

export const CreateRoom = () => {
  const sendToServer = useAtomValue(sendToServerAtom);

  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [pinErrorMessage, setPinErrorMessage] = useState('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNameErrorMessage('');

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const roomName = formJson.roomName as string;
    const roomPin = formJson.roomPin as string;

    const newErrorMessage = validateName(roomName);
    const pinValidation = roomPinSchema.safeParse(roomPin);

    if (!pinValidation.success) {
      setPinErrorMessage(pinValidation.error.format()._errors.join(' and '));
    }

    if (newErrorMessage) {
      setNameErrorMessage(newErrorMessage);
    }

    if (newErrorMessage || !pinValidation.success) {
      return;
    }

    sendToServer({
      type: 'CREATE_ROOM',
      payload: {
        roomName,
        roomPin,
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
          width: 300,
        }}
        component={'form'}
        onSubmit={onSubmit}
      >
        <DialogTitle>Create room</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            fullWidth
            autoFocus
            required
            name="roomName"
            label="Room name"
            variant="standard"
            size="small"
            placeholder="room123"
            helperText={nameErrorMessage}
            error={Boolean(nameErrorMessage)}
            onChange={(e) => {
              const newRoomName = e.target.value;
              const newErrorMessage = validateName(newRoomName);
              if (newRoomName && newErrorMessage) {
                setNameErrorMessage(newErrorMessage);
              } else {
                setNameErrorMessage('');
              }
            }}
          />
          <TextField
            fullWidth
            required
            name="roomPin"
            label="Room pin"
            variant="standard"
            size="small"
            helperText={pinErrorMessage}
            error={Boolean(pinErrorMessage)}
            placeholder="1234"
            onChange={(e) => {
              const newPinName = e.target.value;
              const pinValidation = roomPinSchema.safeParse(newPinName);
              const newPinErrorMessage = !pinValidation.success
                ? pinValidation.error.format()._errors.join(' and ')
                : '';
              if (newPinName && newPinErrorMessage) {
                setPinErrorMessage(newPinErrorMessage);
              } else {
                setPinErrorMessage('');
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Box>
    </Stack>
  );
};
