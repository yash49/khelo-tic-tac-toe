import WebSocket from 'ws';
import { Player, PlayerId, Room } from '../types/messages';

export interface ServerState {
  rooms: Map<string, Room>;
  players: Map<PlayerId, Player>;
  playerSockets: Map<PlayerId, WebSocket.WebSocket>;
}

export const serverState: ServerState = {
  rooms: new Map(),
  players: new Map(),
  playerSockets: new Map(),
};
