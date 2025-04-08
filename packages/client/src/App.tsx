import { Container } from '@mui/material';
import { AppRoutes } from './AppRoutes';
import { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import '../.unicornix/theme.css';
import './index.css';
import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { playerUsernameAtom } from './atoms/player';
import { sendToServerAtom, socketConnectedAtom } from './atoms/connection';
import { initParticlesEngineAtom } from './atoms/animation';

export const App = () => {
  const playerUsername = useAtomValue(playerUsernameAtom);
  const socketConnected = useAtomValue(socketConnectedAtom);
  const sendToServer = useAtomValue(sendToServerAtom);
  const setInitParticleEngine = useSetAtom(initParticlesEngineAtom);

  useEffect(() => {
    if (playerUsername && socketConnected) {
      sendToServer({
        type: 'UPDATE_USERNAME',
        payload: {
          username: playerUsername,
        },
      });
    }
  }, [playerUsername, sendToServer, socketConnected]);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine); // Load features
    }).then(() => {
      setInitParticleEngine(true); // Indicate that initialization is complete
    });
  }, [setInitParticleEngine]);

  return (
    <Container sx={{ height: '100vh' }}>
      <AppRoutes />
    </Container>
  );
};
