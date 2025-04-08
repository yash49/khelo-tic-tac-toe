import { atomWithStorage } from 'jotai/utils';

export const aiDifficultyAtom = atomWithStorage<'easy' | 'medium' | 'hard'>(
  'ai-difficulty',
  'medium'
);

export const aiPlayerSymbolAtom = atomWithStorage<'x' | 'o'>(
  'ai-player-symbol',
  'x'
);

export const aiWhoGoesFirstAtom = atomWithStorage<'player' | 'ai'>(
  'ai-who-goes-first',
  'player'
);
