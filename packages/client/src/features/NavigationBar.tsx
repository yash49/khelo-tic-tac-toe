import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { ROUTES } from '../AppRoutes';
import { platerInitialsAtom, playerUsernameAtom } from '../atoms/player';
import { NavLink, Avatar } from '../components';
import { themeModeAtom } from '../atoms/theme';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { useLocation, useNavigate } from 'react-router';
import { sendToServerAtom } from '../atoms/connection';
import { gameStateAtom } from '../atoms/game';
import { useCallback } from 'react';
import { tokens } from '../tokens';
import { XAndOParticles } from '../particles/XAndOParticles';
import { FireParticles } from '../particles/FireParticles';

export const NavigationBar = () => {
  const playerUsername = useAtomValue(playerUsernameAtom);
  const location = useLocation();
  const navigate = useNavigate();
  const playerInitials = useAtomValue(platerInitialsAtom);
  const sendToServer = useAtomValue(sendToServerAtom);

  const [themeMode, setThemeMode] = useAtom(themeModeAtom);
  const gameState = useAtomValue(gameStateAtom);

  const isPlay = location.pathname === ROUTES.play;

  const leaveRoom = useCallback(() => {
    if (gameState?.roomId) {
      sendToServer({
        type: 'LEAVE_ROOM',
        payload: { roomId: gameState.roomId },
      });
    }
  }, [gameState, sendToServer]);

  return (
    <>
      {isPlay ? <FireParticles /> : <XAndOParticles />}
      <Stack
        component={'nav'}
        direction={'row'}
        spacing={{ xs: 1, sm: 3 }}
        useFlexGap
        sx={{
          flexWrap: 'wrap',
          alignItems: 'center',
          bgcolor: tokens.color.background.subtle,
          mx: `calc((100vw - 100%) / 2 * -1)`,
          px: { xs: 2, sm: 3 },
        }}
      >
        {isPlay ? (
          <Button
            onClick={() => {
              const yesLeave = confirm(
                'Are you sure you want to leave the room?'
              );
              if (yesLeave) {
                leaveRoom();
                navigate('/');
              }
            }}
            color="inherit"
            startIcon={<ArrowBackIcon />}
            sx={{ height: (t) => t.spacing(4) }}
          >
            {gameState?.roomStatus !== 'playing' ? 'Go home' : 'Leave game'}
          </Button>
        ) : (
          <>
            <Stack
              component={'ul'}
              direction="row"
              spacing={2}
              useFlexGap
              divider={<Divider flexItem orientation="vertical" />}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                p: 0,
                py: 3,
                m: 0,
                alignItems: 'center',
              }}
              // flexWrap="wrap"
            >
              <li style={{ listStyle: 'none' }}>
                <NavLink to={ROUTES.createRoom}>Create Room</NavLink>
              </li>
              <li style={{ listStyle: 'none' }}>
                <NavLink to={ROUTES.joinRoom}>Join Room</NavLink>
              </li>
              <li style={{ listStyle: 'none' }}>
                <NavLink to={ROUTES.playWithAi}>Play With AI</NavLink>
              </li>
            </Stack>
            <Box sx={{ display: { xs: 'initial', sm: 'none' } }}>
              <Select
                variant="outlined"
                size="small"
                onChange={(e) => {
                  navigate(e?.target.value);
                }}
                value={location.pathname}
              >
                <MenuItem dense value={ROUTES.createRoom}>
                  Create Room
                </MenuItem>
                <MenuItem dense value={ROUTES.joinRoom}>
                  Join Room
                </MenuItem>
                <MenuItem dense value={ROUTES.playWithAi}>
                  Play With AI
                </MenuItem>
              </Select>
            </Box>
          </>
        )}
        <ToggleButtonGroup
          value={themeMode}
          onChange={(_, value) => {
            if (value) setThemeMode(value);
          }}
          exclusive
          size="small"
          color="primary"
          aria-label={'Theme mode'}
          sx={{ py: 2, ml: 'auto' }}
        >
          <ToggleButton
            value="light"
            aria-label="light"
            sx={{ px: 1, height: (t) => t.spacing(5) }}
          >
            <WbSunnyOutlinedIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="system"
            aria-label="system"
            sx={{ px: 1, height: (t) => t.spacing(5) }}
          >
            <SettingsBrightnessOutlinedIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="dark"
            aria-label="dark"
            sx={{ px: 1, height: (t) => t.spacing(5) }}
          >
            <BedtimeOutlinedIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
        <Stack
          direction={'row'}
          alignItems={'center'}
          useFlexGap
          spacing={2}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          <Tooltip title={playerUsername} arrow>
            <Avatar size="medium" color="accent">
              {playerInitials}
            </Avatar>
          </Tooltip>
        </Stack>
      </Stack>
    </>
  );
};
