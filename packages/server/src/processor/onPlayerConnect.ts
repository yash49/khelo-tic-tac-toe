import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';
import {
  generateGameState,
  getRoomListMessage,
  serverState,
} from '../serverState';
import { ClientMessage, Player, PlayerId } from '../types/messages';
import { clientMessageProcessor } from './clientMessageProcessor';
import { broadcastToPlayers, broadcastToRoom } from '../communicator';

function createPlayer(socket: WebSocket.WebSocket): Player {
  const playerId = uuidv4();
  const player: Player = { id: playerId, username: '' };
  serverState.players.set(playerId, player);
  serverState.playerSockets.set(playerId, socket);
  return player;
}

function sendInitialMessages(socket: WebSocket.WebSocket) {
  const response = getRoomListMessage();
  socket.send(JSON.stringify(response));
}

function onPlayerLeave(playerId: PlayerId) {
  const pl = serverState.players.get(playerId);
  serverState.players.delete(playerId);
  serverState.playerSockets.delete(playerId);

  // remove player from all rooms
  const rooms = Array.from(serverState.rooms.values()).filter((room) =>
    room.players.find((player) => player.id === playerId)
  );

  rooms.forEach((room) => {
    // remove player from room
    room.players = room.players.filter((player) => player.id !== playerId);

    if (room.isAgainstAi) {
      serverState.rooms.delete(room.id);
    } else if (room.players.length === 0) {
      serverState.rooms.delete(room.id);
    } else {
      room.status = 'abandoned';
      room.rematchRequested = undefined;
      broadcastToRoom({
        room,
        message: {
          type: 'ROOM_UPDATED',
          payload: { gameState: generateGameState({ room }) },
        },
      });
    }

    if (!room.isAgainstAi) broadcastToPlayers(getRoomListMessage());
  });
}

export const onPlayerConnect = (socket: WebSocket.WebSocket) => {
  const player = createPlayer(socket);
  const playerId = player.id;

  socket.on('message', (rawData: WebSocket.RawData) => {
    const message: ClientMessage = JSON.parse(rawData.toString());
    clientMessageProcessor({ playerId, socket, message });
  });

  socket.on('close', () => {
    onPlayerLeave(playerId);
  });

  // send initial messages
  sendInitialMessages(socket);

  // setInterval(() => {
  //   socket.send(JSON.stringify({ type: "TEST", payload: "ping from server" }));
  // }, 5000);
};
