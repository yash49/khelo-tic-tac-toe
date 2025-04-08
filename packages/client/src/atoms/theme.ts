import { atomWithStorage } from 'jotai/utils';

export const themeModeAtom = atomWithStorage<'dark' | 'light' | 'system'>(
  'themeMode',
  'system'
);
