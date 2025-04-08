import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../AppRoutes';
import { sendToServerAtom } from '../atoms/connection';
import { filteredRoomListAtom, roomSearchQueryAtom } from '../atoms/room';
import { Message } from '../components';
import { roomPinSchema } from './CreateRoom';
import { tokens } from '../tokens';

export const JoinRoom = () => {
  const filteredRoomList = useAtomValue(filteredRoomListAtom);
  const navigate = useNavigate();
  const setRoomSearchQuery = useSetAtom(roomSearchQueryAtom);
  const [localQuery, setLocalQuery] = useState('');
  const [roomPinError, setRoomPinError] = useState('');
  const sendToServer = useAtomValue(sendToServerAtom);

  const [roomId, setRoomId] = useState('');

  const handleClose = () => {
    setRoomId('');
  };

  const handleOpen = (newRoomId: string) => {
    setRoomId(newRoomId);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setRoomSearchQuery(localQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localQuery, setRoomSearchQuery]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRoomPinError('');

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    const formRoomPin = formJson.roomPin as string;

    const pinValidation = roomPinSchema.safeParse(formRoomPin);

    if (!pinValidation.success) {
      setRoomPinError(pinValidation.error.format()._errors.join(' and '));
      return;
    }
    handleClose();
    sendToServer({
      type: 'JOIN_ROOM',
      payload: {
        roomId,
        roomPin: formRoomPin,
      },
    });
  };

  return (
    <>
      <Dialog open={!!roomId} onClose={handleClose}>
        <form onSubmit={onSubmit}>
          <DialogTitle>Enter Room Pin </DialogTitle>
          <DialogContent>
            <TextField
              variant="standard"
              label="Room pin"
              name="roomPin"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{ width: 200 }}
              placeholder="1234"
              autoFocus
              required
              helperText={roomPinError}
              error={Boolean(roomPinError)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              size="small"
              onClick={handleClose}
              variant="text"
              color="secondary"
            >
              Cancel
            </Button>
            <Button size="small" type="submit">
              Join
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Stack spacing={4} useFlexGap sx={{ maxHeight: '100%', height: '100%' }}>
        <Stack
          flexWrap={'wrap'}
          useFlexGap
          spacing={2}
          direction={'row'}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 4,
            pb: 2,
          }}
        >
          <Typography component={'h1'} variant="h4">
            Rooms
          </Typography>
          <TextField
            variant="standard"
            label="Search room"
            sx={{
              alignSelf: { sm: 'end' },
              bgcolor: tokens.color.accent.surface,
            }}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value ?? '')}
          />
        </Stack>

        {filteredRoomList.length === 0 && (
          <Stack
            sx={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Message
              title="No rooms found"
              actions={
                <Button
                  onClick={() => navigate(ROUTES.createRoom)}
                  size="small"
                >
                  Create room
                </Button>
              }
              sx={{
                background: tokens.color.background.subtle,
                p: 4,
                mt: -5,
                borderRadius: tokens.radius.l,
                width: 300,
              }}
            />
          </Stack>
        )}

        <List
          sx={{
            overflow: 'auto',
          }}
          disablePadding
        >
          {filteredRoomList.map((room, index) => {
            return (
              <React.Fragment key={room.id}>
                {index === 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Button
                      variant="outlined"
                      onClick={() => {
                        handleOpen(room.id);
                      }}
                      color="inherit"
                      sx={{ color: tokens.color.content.regular }}
                    >
                      Join
                    </Button>
                  }
                  sx={{ bgcolor: tokens.color.accent.surface }}
                >
                  <ListItemText
                    primary={room.name}
                    secondary={
                      <>
                        created by <code>{room.createdBy}</code>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            );
          })}
        </List>
      </Stack>
    </>
  );
};
