import { RoomListMessage } from '../types/messages';
import { serverState } from './serverState';

export function getRoomListMessage(): RoomListMessage {
  const roomList = Array.from(serverState.rooms.values())
    .filter(
      (room) =>
        room.status === 'waiting' &&
        !room.isAgainstAi &&
        room.players.length === 1
    )
    .map(({ id, name, createdBy }) => ({
      id,
      name,
      createdBy: createdBy.username,
    }));
  return {
    type: 'ROOM_LIST',
    payload: {
      roomList: roomList,
    },
  };
}
