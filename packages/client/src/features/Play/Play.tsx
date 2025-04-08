import { useAtom, useAtomValue } from 'jotai';
import { gameStateAtom } from '../../atoms/game';
import { Navigate } from 'react-router';
import { playerIdAtom } from '../../atoms/player';
import {
  Grid2 as Grid,
  Stack,
  Box,
  InputBase,
  Button,
  Typography,
} from '@mui/material';
import {
  GamePlayerCard,
  GameBoard,
  Avatar,
  GameLogList,
  GameLogItem,
  getGameBoardCellPosition,
  toast,
} from '../../components';
import { sendToServerAtom } from '../../atoms/connection';
import { Fragment } from 'react/jsx-runtime';
import { useCallback, useEffect, useState } from 'react';
import {
  aiDifficultyAtom,
  aiPlayerSymbolAtom,
  aiWhoGoesFirstAtom,
} from '../../atoms/aiSettings';
import { tokens } from '../../tokens';
import { GameChatItem } from '../../components/GameLog';

export const Play = () => {
  const gameState = useAtomValue(gameStateAtom);
  const playerId = useAtomValue(playerIdAtom);
  const sendToServer = useAtomValue(sendToServerAtom);

  const [message, setMessage] = useState('');

  const leaveRoom = useCallback(() => {
    if (gameState?.roomId) {
      sendToServer({
        type: 'LEAVE_ROOM',
        payload: { roomId: gameState.roomId },
      });
    }
  }, [gameState, sendToServer]);

  useEffect(() => {
    const handleBackButton = () => {
      leaveRoom();
    };
    // on browser back button
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [leaveRoom]);

  if (!gameState) return <Navigate to="/" />;

  const player = gameState?.players.find((p) => p.id === playerId);
  const opponent = gameState?.players.find((p) => p.id !== playerId);

  // console.log({ gameState });

  const playerSymbol = player?.symbol;
  const opponentSymbol =
    opponent?.symbol ||
    (playerSymbol ? (playerSymbol === 'x' ? 'o' : 'x') : undefined);

  return (
    <>
      <Grid
        container
        sx={{
          height: '100%',
          maxHeight: '100%',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          py: { xs: 2, md: 4 },
        }}
        spacing={{ xs: 3, sm: 2, md: 4, lg: 8 }}
      >
        <Grid
          size={{ xs: 12, sm: 7, md: 8 }}
          sx={{ maxHeight: '100%', height: '100%' }}
        >
          <Stack
            sx={{
              justifyContent: 'space-between',
              maxHeight: '100%',
              height: '100%',
            }}
            useFlexGap
            spacing={{ xs: 2, sm: 3 }}
          >
            <GamePlayerCard
              username={opponent?.username ?? 'opponent'}
              avatar={
                <Avatar size="medium" color="alert">
                  {opponent?.username?.charAt(0) ?? ''}
                </Avatar>
              }
              symbol={opponentSymbol}
            />

            <Box
              sx={{
                flexGrow: 1,
                aspectRatio: '1 / 1',
                mx: 'auto',
                maxWidth: '100%',

                alignContent: 'center',
              }}
            >
              <GameBoard
                onClick={(boardIndex) =>
                  sendToServer({
                    type: 'MAKE_MOVE',
                    payload: {
                      boardIndex,
                      roomId: gameState.roomId,
                    },
                  })
                }
                xColor={playerSymbol === 'x' ? 'accent' : 'alert'}
                value={gameState?.board}
                readOnly={
                  player?.id !== gameState.currentTurn ||
                  gameState.roomStatus !== 'playing'
                }
              />
            </Box>

            <GamePlayerCard
              username={player?.username ?? 'player'}
              avatar={
                <Avatar size="medium" color="accent">
                  {player?.username?.charAt(0) ?? ''}
                </Avatar>
              }
              symbol={playerSymbol}
            />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 5, md: 4 }} sx={{ maxHeight: '100%' }}>
          <Stack sx={{ height: '100%' }} useFlexGap spacing={2}>
            <GameStatus />

            <Box sx={{ flexGrow: 1, justifySelf: 'end', minHeight: 0 }}>
              <Stack sx={{ maxHeight: '100%', height: '100%' }}>
                <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                  <GameLogList
                    title="Game log"
                    sx={
                      gameState.isAgainstAi
                        ? {}
                        : {
                            borderBottom: 'none',
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                          }
                    }
                  >
                    {gameState.gameLogs.map((log, index) => {
                      let cellPosition;
                      switch (log.type) {
                        case 'move-made':
                          cellPosition = getGameBoardCellPosition(
                            log.boardIndex
                          );
                          return (
                            <GameLogItem
                              key={index}
                              from={`${log.playerUsername} (${log.playerSymbol})`}
                              opponent={log.playerSymbol !== playerSymbol}
                            >
                              picks{' '}
                              <code>{`${cellPosition.column}-${cellPosition.row}`}</code>
                            </GameLogItem>
                          );
                        case 'finished-with-tie':
                          return (
                            <GameLogItem key={index} opponent={false}>
                              This game is a tie
                            </GameLogItem>
                          );
                        case 'finished-with-winner':
                          return (
                            <GameLogItem
                              key={index}
                              opponent={log.winnerId !== playerId}
                            >
                              {log.winnerId === playerId
                                ? 'You won this game'
                                : 'You lost this game'}
                            </GameLogItem>
                          );

                        case 'game-chat':
                          return (
                            <GameChatItem
                              key={index}
                              from={`${log.playerUsername} (${log.playerSymbol})`}
                            >
                              {log.message}
                            </GameChatItem>
                          );

                        default:
                          return <Fragment key={index}></Fragment>;
                      }
                    })}
                  </GameLogList>
                </Box>
                {!gameState.isAgainstAi && (
                  <Box
                    component={'form'}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (message.trim() === '') return;

                      sendToServer({
                        type: 'CHAT_WITH_ROOM',
                        payload: {
                          roomId: gameState.roomId,
                          message: message.trim(),
                        },
                      });
                      setMessage('');
                    }}
                  >
                    <InputBase
                      sx={{
                        border: `${tokens.space.px} solid ${tokens.color.neutral.border}`,
                        borderBottomLeftRadius: tokens.radius.l,
                        borderBottomRightRadius: tokens.radius.l,
                        fontSize: '0.875rem',
                        backgroundColor: tokens.color.background.subtle,
                      }}
                      slotProps={{ input: { sx: { p: 1, px: 2 } } }}
                      placeholder="Send a message..."
                      size="small"
                      aria-label="Send a message to opponent"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      fullWidth
                      disabled={
                        gameState.roomStatus === 'abandoned' ||
                        gameState.roomStatus === 'waiting'
                      }
                    />
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

function GameStatus() {
  const gameState = useAtomValue(gameStateAtom);
  const playerId = useAtomValue(playerIdAtom);
  const sendToServer = useAtomValue(sendToServerAtom);

  const aiDifficulty = useAtomValue(aiDifficultyAtom);
  const aiPlayerSymbol = useAtomValue(aiPlayerSymbolAtom);
  const [aiWhoGoesFirst, setAiWhoGoesFirst] = useAtom(aiWhoGoesFirstAtom);

  if (!gameState) return null;

  const getStatusMessage = () => {
    switch (gameState.roomStatus) {
      case 'waiting':
        return 'Waiting for opponent to join';
      case 'playing':
        return gameState.currentTurn === playerId
          ? 'Your turn'
          : "Opponent's turn";
      case 'abandoned':
        return 'Opponent has left the room';
      case 'finished-with-tie':
        return "It's a tie!";
      case 'finished-with-winner':
        return gameState.winnerId === playerId ? 'You won!' : 'You lost!';
      default:
        return '';
    }
  };

  const showRematchButton =
    !gameState.isAgainstAi &&
    (!gameState.rematchRequested ||
      gameState.rematchRequested.by === playerId) &&
    (gameState.roomStatus === 'finished-with-winner' ||
      gameState.roomStatus === 'finished-with-tie');
  const showPlayAgainButton =
    gameState.isAgainstAi && gameState.roomStatus !== 'playing';

  const showRematchMessage =
    !gameState.isAgainstAi && gameState.rematchRequested;

  const rematchButtonDisabled =
    showRematchButton && gameState.rematchRequested?.by === playerId;

  return (
    <Stack
      sx={{
        minHeight: { sm: 200 },
        alignItems: 'start',
      }}
      useFlexGap
      spacing={2}
    >
      <Typography component={'div'} variant="h6">
        {getStatusMessage()}
      </Typography>

      <Stack useFlexGap spacing={2} direction={'row'}>
        {showPlayAgainButton && (
          <Button
            onClick={() => {
              sendToServer({
                type: 'REMATCH_AGAINST_AI',
                payload: {
                  roomId: gameState.roomId,
                  difficulty: aiDifficulty,
                  playerSymbol: aiPlayerSymbol,
                  firstTurn: aiWhoGoesFirst === 'ai' ? 'player' : 'ai',
                },
              });
              setAiWhoGoesFirst(aiWhoGoesFirst === 'ai' ? 'player' : 'ai');
            }}
            variant="contained"
            size="small"
          >
            Play again
          </Button>
        )}

        {showRematchButton && (
          <Button
            onClick={() => {
              sendToServer({
                type: 'REQUEST_REMATCH',
                payload: {
                  roomId: gameState.roomId,
                },
              });
              toast.create({
                description: 'Rematch requested',
                severity: 'info',
              });
            }}
            variant="contained"
            size="small"
            disabled={rematchButtonDisabled}
          >
            Rematch
          </Button>
        )}
      </Stack>

      {showRematchMessage && (
        <Stack
          useFlexGap
          spacing={1}
          sx={{
            bgcolor: tokens.color.background.subtle,
            alignSelf: 'stretch',
            borderRadius: tokens.radius.l,
            px: 2,
            py: 2,
            mt: 1,
          }}
        >
          {gameState.rematchRequested?.by !== playerId &&
          !gameState.rematchRequested?.response ? (
            <>
              <Typography>Rematch requested</Typography>
              <Stack useFlexGap spacing={1} direction="row">
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  onClick={() => {
                    sendToServer({
                      type: 'REMATCH_RESPONSE',
                      payload: {
                        roomId: gameState.roomId,
                        response: 'accept',
                      },
                    });
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => {
                    sendToServer({
                      type: 'REMATCH_RESPONSE',
                      payload: {
                        roomId: gameState.roomId,
                        response: 'reject',
                      },
                    });
                  }}
                >
                  Reject
                </Button>
              </Stack>
            </>
          ) : (
            <>
              <Typography>
                {gameState.rematchRequested.response === 'reject' &&
                  'Rematch rejected'}
                {!gameState.rematchRequested.response &&
                  'Rematch requested ...'}
                {gameState.rematchRequested.response === 'accept' &&
                  'Rematch accepted'}
              </Typography>
            </>
          )}
        </Stack>
      )}
    </Stack>
  );
}
