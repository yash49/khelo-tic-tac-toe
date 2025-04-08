import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const playerUsernameAtom = atomWithStorage('playerUserName', '');

export const playerIdAtom = atom('');

export const platerInitialsAtom = atom((get) => {
  const playerUsername = get(playerUsernameAtom);
  // todo: better initials can be generated
  return playerUsername.charAt(0).toUpperCase();
});
