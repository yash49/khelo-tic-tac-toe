import { sendToPlayer } from '../communicator';
import { serverState } from '../serverState';
import {
  PlayerId,
  UpdateUsernameMessage,
  UsernameUpdatedMessage,
} from '../types/messages';

export function handleUpdateUsername({
  playerId,
  message,
}: {
  playerId: PlayerId;
  message: UpdateUsernameMessage;
}) {
  const {
    payload: { username },
  } = message;
  const player = serverState.players.get(playerId);
  if (player) {
    player.username = username;
  } else {
    // todo: handle this case when player does not exist
  }

  const responseMessage: UsernameUpdatedMessage = {
    type: 'USERNAME_UPDATED',
    payload: {
      playerId,
      username,
    },
  };

  sendToPlayer({ playerId, message: responseMessage });
}
