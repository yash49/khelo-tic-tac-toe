export type PlayerId = string;

export interface Player {
  id: PlayerId;
  username: string;
}

export type BoardCellValue = 'x' | 'o' | '';

export type BoardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Board = [
  BoardCellValue,
  BoardCellValue,
  BoardCellValue,
  BoardCellValue,
  BoardCellValue,
  BoardCellValue,
  BoardCellValue,
  BoardCellValue,
  BoardCellValue,
];

export function createBoard(): Board {
  return ['', '', '', '', '', '', '', '', ''];
}

export type GameStatus =
  | 'waiting'
  | 'playing'
  | 'finished-with-tie'
  | 'finished-with-winner'
  | 'abandoned';

export type GameLog =
  | {
      type: 'move-made';
      playerUsername: Player['username'];
      playerSymbol: Exclude<BoardCellValue, ''>;
      boardIndex: BoardIndex;
    }
  | {
      type: 'finished-with-tie';
    }
  | {
      type: 'finished-with-winner';
      winnerId: PlayerId;
    }
  | {
      type: 'game-chat';
      playerUsername: Player['username'];
      playerSymbol: Exclude<BoardCellValue, ''>;
      message: string;
    };

export type Room = {
  id: string;
  name: string;
  players: {
    id: PlayerId;
    username: Player['username'];
    symbol: Exclude<BoardCellValue, ''>;
  }[];
  currentTurn: PlayerId;
  board: Board;
  status: GameStatus;
  createdBy: Player;
  winnerId?: PlayerId;
  gameLogs: GameLog[];
} & (
  | {
      isAgainstAi: false;
      pin: string;
      rematchRequested?: {
        by: PlayerId;
        response?: 'accept' | 'reject';
      };
    }
  | {
      isAgainstAi: true;
      difficulty: 'easy' | 'medium' | 'hard';
    }
);

export type GameState = {
  board: Board;
  roomId: Room['id'];
  roomName: Room['name'];
  roomStatus: Room['status'];
  players: {
    id: PlayerId;
    username: Player['username'];
    symbol: Exclude<BoardCellValue, ''>;
  }[];
  winnerId?: PlayerId;
  currentTurn: PlayerId;
  gameLogs: GameLog[];
} & (
  | {
      isAgainstAi: false;
      rematchRequested?: {
        by: PlayerId;
        response?: 'accept' | 'reject';
      };
    }
  | {
      isAgainstAi: true;
    }
);

export type RoomList = (Pick<Room, 'id' | 'name'> & {
  createdBy: Player['username'];
})[];

// Client Message Types
export interface UpdateUsernameMessage {
  type: 'UPDATE_USERNAME';
  payload: {
    username: string;
  };
}

export interface CreateRoomMessage {
  type: 'CREATE_ROOM';
  payload: {
    roomName: string;
    roomPin: string;
  };
}

export interface CreateRoomAgainstAiMessage {
  type: 'CREATE_ROOM_AGAINST_AI';
  payload: {
    difficulty: 'easy' | 'medium' | 'hard';
    playerSymbol: 'x' | 'o';
    firstTurn: 'player' | 'ai';
  };
}

export interface RematchAgainstAiMessage {
  type: 'REMATCH_AGAINST_AI';
  payload: {
    difficulty: 'easy' | 'medium' | 'hard';
    playerSymbol: 'x' | 'o';
    firstTurn: 'player' | 'ai';
    roomId: Room['id'];
  };
}

export interface RequestRematchMessage {
  type: 'REQUEST_REMATCH';
  payload: {
    roomId: Room['id'];
  };
}

export interface RematchResponseMessage {
  type: 'REMATCH_RESPONSE';
  payload: {
    roomId: Room['id'];
    response: 'accept' | 'reject';
  };
}

export interface JoinRoomMessage {
  type: 'JOIN_ROOM';
  payload: {
    roomId: string;
    roomPin: string;
  };
}

export interface MakeMoveMessage {
  type: 'MAKE_MOVE';
  payload: {
    boardIndex: BoardIndex;
    roomId: Room['id'];
  };
}

export interface LeaveRoomMessage {
  type: 'LEAVE_ROOM';
  payload: {
    roomId: Room['id'];
  };
}

export interface ChatWithRoom {
  type: 'CHAT_WITH_ROOM';
  payload: {
    roomId: Room['id'];
    message: string;
  };
}

// Server Message Types and Payloads
export interface UsernameUpdatedMessage {
  type: 'USERNAME_UPDATED';
  payload: {
    username: string;
    playerId: PlayerId;
  };
}

export interface RoomCreatedMessage {
  type: 'ROOM_CREATED';
  payload: {
    gameState: GameState;
  };
}

export interface RoomJoinedMessage {
  type: 'ROOM_JOINED';
  payload: {
    gameState: GameState;
  };
}

export interface GameStartedMessage {
  type: 'GAME_STARTED';
  payload: {
    room: Room;
  };
}

export interface MoveMadeMessage {
  type: 'MOVE_MADE';
  payload: {
    board: string[][];
    currentTurn: string;
  };
}

export interface ErrorMessage {
  type: 'ERROR';
  payload: {
    message: string;
  };
}

// Server Message Types
export type RoomListMessage = {
  type: 'ROOM_LIST';
  payload: {
    roomList: RoomList;
  };
};

export type RoomUpdatedMessage = {
  type: 'ROOM_UPDATED';
  payload: {
    gameState: GameState;
  };
};

// Update the ClientMessage and ServerMessage union types
export type ClientMessage =
  | UpdateUsernameMessage
  | CreateRoomMessage
  | CreateRoomAgainstAiMessage
  | RematchAgainstAiMessage
  | JoinRoomMessage
  | RequestRematchMessage
  | RematchResponseMessage
  | MakeMoveMessage
  | LeaveRoomMessage
  | ChatWithRoom;

export type ServerMessage =
  | UsernameUpdatedMessage
  | RoomCreatedMessage
  | RoomJoinedMessage
  | GameStartedMessage
  | MoveMadeMessage
  | RoomListMessage
  | RoomUpdatedMessage
  | ErrorMessage;

export type ClientMessageType = ClientMessage['type'];
export type ServerMessageType = ServerMessage['type'];
