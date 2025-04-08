import { Navigate, Route, Routes } from 'react-router';
import { CreateRoom } from './features/CreateRoom';
import { JoinRoom } from './features/JoinRoom';
import { NotFound } from './features/NotFound';
import { Onboard } from './features/Onboard';
import { Layout } from './Layout';
import { Stack, Link } from '@mui/material';
import { Message } from './components';
import { useAtomValue } from 'jotai';
import { socketErrorAtom, socketLoadingAtom } from './atoms/connection';
import { PlayWithAi } from './features/PlayWithAi';
import { Play } from './features/Play';

export const ROUTES = {
  onboard: '/onboard',
  createRoom: '/create-room',
  joinRoom: '/join-room',
  playWithAi: '/play-with-ai',
  play: '/play',
};

export const AppRoutes = () => {
  const socketError = useAtomValue(socketErrorAtom);
  const socketLoading = useAtomValue(socketLoadingAtom);

  if (socketError || socketLoading)
    return (
      <Stack
        sx={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Message
          title={socketError ? 'Oops! Something went wrong' : 'Loading...'}
          description={
            socketError && (
              <>
                If the problem persists, please report the issue on{' '}
                <Link href="https://github.com/yash49/tic-tac-toe/issues">
                  GitHub
                </Link>
              </>
            )
          }
        />
      </Stack>
    );

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={ROUTES.createRoom} />} />
        <Route path={ROUTES.createRoom} element={<CreateRoom />} />
        <Route path={ROUTES.joinRoom} element={<JoinRoom />} />
        <Route path={ROUTES.playWithAi} element={<PlayWithAi />} />
        <Route path={ROUTES.play} element={<Play />} />
      </Route>
      <Route path={ROUTES.onboard} element={<Onboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
