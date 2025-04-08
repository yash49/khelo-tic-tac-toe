import { useMediaQuery } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { themeModeAtom } from '../atoms/theme';

export const useThemeMode = () => {
  const userPreferredMode = useAtomValue(themeModeAtom);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const themeMode = useMemo<'light' | 'dark'>(() => {
    return userPreferredMode === 'system'
      ? prefersDarkMode
        ? 'dark'
        : 'light'
      : userPreferredMode;
  }, [userPreferredMode, prefersDarkMode]);

  return themeMode;
};
