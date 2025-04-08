import WebSocket from 'ws';

import { serverState } from '../serverState';
import { ClientMessage, PlayerId } from '../types/messages';
import { handleCreateRoom } from './handleCreateRoom';
import { handleCreateRoomAgainstAi } from './handleCreateRoomAgainstAi';
import { handleRematchAgainstAi } from './handleRematchAgainstAi';
import { handleJoinRoom } from './handleJoinRoom';
import { handleMakeMove } from './handleMakeMove';
import { handleUpdateUsername } from './handleUpdateUsername';
import { handleLeaveRoom } from './handleLeaveRoom';
import { handleChatWithRoom } from './handleChatWithRoom';
import { handleRequestRematch } from './handleRequestRematch';
import { handleRematchResponse } from './handleRematchResponse';

type ClientRequest = {
  message: ClientMessage;
  socket: WebSocket.WebSocket;
  playerId: PlayerId;
};

export const clientMessageProcessor = (clientRequest: ClientRequest) => {
  const { socket, playerId, message } = clientRequest;

  console.log(`Message received :: ${playerId}`, message);

  switch (message.type) {
    case 'UPDATE_USERNAME':
      handleUpdateUsername({ playerId, message });
      break;
    case 'CREATE_ROOM':
      handleCreateRoom({ playerId, message });
      break;
    case 'CREATE_ROOM_AGAINST_AI':
      handleCreateRoomAgainstAi({ playerId, message });
      break;
    case 'REMATCH_AGAINST_AI':
      handleRematchAgainstAi({ playerId, message });
      break;
    case 'JOIN_ROOM':
      handleJoinRoom({ message, playerId });
      break;
    case 'LEAVE_ROOM':
      handleLeaveRoom({ message, playerId });
      break;
    case 'MAKE_MOVE':
      handleMakeMove({ message, playerId });
      break;
    case 'CHAT_WITH_ROOM':
      handleChatWithRoom({ message, playerId });
      break;
    case 'REQUEST_REMATCH':
      handleRequestRematch({ message, playerId });
      break;
    case 'REMATCH_RESPONSE':
      handleRematchResponse({ message, playerId });
      break;
  }

  console.log('-------------');

  console.log(
    `Rooms :: `,
    Array.from(serverState.rooms.values()).map((room) => room.name)
  );
  console.log(
    `Players :: `,
    Array.from(serverState.players.values()).map((player) => player.username)
  );
  console.log(
    `Sockets :: `,
    Array.from(serverState.playerSockets.values()).length
  );
};

// ================
