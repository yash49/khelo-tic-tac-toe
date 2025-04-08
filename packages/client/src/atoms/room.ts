import { atom } from 'jotai';
import { RoomList } from '../../../server/src/types/messages';

export const roomListAtom = atom<RoomList>([]);

export const roomSearchQueryAtom = atom('');

export const filteredRoomListAtom = atom<RoomList>((get) => {
  const roomList = get(roomListAtom);
  const roomSearchQuery = get(roomSearchQueryAtom);

  if (!roomSearchQuery) return roomList;

  return roomList.filter(
    ({ createdBy, name }) =>
      name.toLowerCase().includes(roomSearchQuery.toLowerCase()) ||
      createdBy.toLowerCase().includes(roomSearchQuery.toLowerCase())
  );
});
