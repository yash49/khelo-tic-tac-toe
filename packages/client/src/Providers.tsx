import { CssBaseline, ThemeProvider } from '@mui/material';
import { ReactNode, useEffect, useMemo } from 'react';
import { ToastContainer } from './components';
import { ServerMessageProcessor } from './features/ServerMessageProcessor';
import { getTheme } from './theme';
import { BrowserRouter } from 'react-router';
import { useThemeMode } from './hooks/useThemeMode';

export const Providers = ({ children }: { children: ReactNode }) => {
  const themeMode = useThemeMode();

  const theme = useMemo(() => {
    return getTheme(themeMode);
  }, [themeMode]);

  useEffect(() => {
    document.body.dataset.theme = themeMode;
  }, [themeMode]);

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ServerMessageProcessor />
          {children}
          <ToastContainer />
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
};
