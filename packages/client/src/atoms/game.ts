import { atom } from 'jotai';
import { GameState } from '../../../server/src/types/messages';

export const gameStateAtom = atom<GameState | null>(null);
