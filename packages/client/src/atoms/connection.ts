import { atom } from 'jotai';

import { ClientMessage } from '../../../server/src/types/messages';
import { SERVER_URL } from '../SERVER_URL';

export const socketAtom = atom<WebSocket>(new WebSocket(SERVER_URL));

export const socketConnectedAtom = atom(false);

export const socketLoadingAtom = atom(false);

export const socketErrorAtom = atom(false);

export const sendToServerAtom = atom((get) => {
  const socket = get(socketAtom);

  const sendToServer = (message: ClientMessage) => {
    if (socket?.OPEN) {
      try {
        const serializedMessage = JSON.stringify(message);
        socket.send(serializedMessage);
      } catch {
        // todo: add error handling
      }
    } else {
      // todo: handle closed socket or undefined socket scenario
      console.warn('Did not send the message, socket not open :: ', message);
    }
  };

  return sendToServer;
});
