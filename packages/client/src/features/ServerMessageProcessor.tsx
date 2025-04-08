import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { ServerMessage } from '../../../server/src/types/messages';
import {
  socketAtom,
  socketConnectedAtom,
  socketErrorAtom,
} from '../atoms/connection';
import { roomListAtom } from '../atoms/room';
import { toast } from '../components';
import { gameStateAtom } from '../atoms/game';
import { playerIdAtom } from '../atoms/player';
import { useNavigate } from 'react-router';
import { ROUTES } from '../AppRoutes';
import { SERVER_URL } from '../SERVER_URL';

export const ServerMessageProcessor = () => {
  const [socket, setSocket] = useAtom(socketAtom);
  const setSocketConnected = useSetAtom(socketConnectedAtom);
  const setSocketError = useSetAtom(socketErrorAtom);
  const setRoomList = useSetAtom(roomListAtom);
  const setGameState = useSetAtom(gameStateAtom);
  const setPlayerId = useSetAtom(playerIdAtom);
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: number;
    const processServerMessage = (message: ServerMessage) => {
      console.log('Received message from server ::', message);
      switch (message.type) {
        case 'USERNAME_UPDATED':
          setPlayerId(message.payload.playerId);
          break;
        case 'ROOM_LIST':
          setRoomList(message.payload.roomList);
          break;
        case 'ROOM_CREATED':
        case 'ROOM_JOINED':
          navigate(ROUTES.play);
          setGameState(message.payload.gameState);
          break;
        case 'ROOM_UPDATED':
          setGameState(message.payload.gameState);
          break;
        case 'ERROR':
          toast.create({
            description: message.payload.message,
            severity: 'error',
          });
          break;
      }
    };

    socket.onerror = () => {
      setSocketConnected(false);
      setSocketError(true);

      setGameState(null);
      // todo: add error handling ?
    };
    socket.onclose = () => {
      setSocketConnected(false);
      setSocketError(true);
      setGameState(null);
      toast.create({
        description: 'Disconnected, trying again in 5 seconds',
        severity: 'error',
      });
      timeoutId = setTimeout(() => {
        setSocket(new WebSocket(SERVER_URL));
        toast.create({
          description: 'Connecting...',
          severity: 'info',
        });
        setSocketConnected(false);
        setSocketError(false);
      }, 5000);
    };
    socket.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data) as ServerMessage;

        processServerMessage(message);
      } catch {
        // todo: add error handling
        console.log('Unable to parse server message ::', event.data);
      }
    };
    socket.onopen = () => {
      setSocketConnected(true);
      setSocketError(false);
      toast.create({
        description: 'Connected to server',
        severity: 'success',
      });
    };

    return () => {
      clearTimeout(timeoutId);
      setSocketConnected(false);
      setSocketError(false);
    };
  }, [
    setRoomList,
    setSocket,
    setSocketError,
    setSocketConnected,
    socket,
    navigate,
    setGameState,
    setPlayerId,
  ]);

  return <></>;
};
