import { Box, Stack } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { ROUTES } from './AppRoutes';
import { previousPathAtom } from './atoms/navigation';
import { playerUsernameAtom } from './atoms/player';
import { NavigationBar } from './features/NavigationBar';

export const Layout = () => {
  const playerUsername = useAtomValue(playerUsernameAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const setPreviousPath = useSetAtom(previousPathAtom);

  useEffect(() => {
    if (location.pathname !== ROUTES.onboard && !playerUsername) {
      setPreviousPath(location.pathname);
      navigate(`${ROUTES.onboard}`);
    }
  }, [playerUsername, setPreviousPath, navigate, location]);

  return (
    <Stack sx={{ height: '100%', maxHeight: '100%' }}>
      <NavigationBar />
      <Box sx={{ flexGrow: 1, minHeight: 0 }} component={'main'}>
        <Outlet />
      </Box>
    </Stack>
  );
};
