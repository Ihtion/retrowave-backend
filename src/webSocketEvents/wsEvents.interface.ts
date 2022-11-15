type JoinRoomPayload = {
  userID: string;
  roomID: string;
};

enum IncomingWSEvents {
  JOIN_ROOM = 'joinRoom',
  VOTING_START = 'votingStart',
  VOTING_FINISH = 'votingFinish',
}

enum OutgoingWSEvents {
  USER_JOIN = 'userJoin',
  USER_LEAVE = 'userLeave',
  VOTING_START = 'votingStart',
  VOTING_FINISH = 'votingFinish',
  SESSION_DATA = 'sessionData',
}

export { JoinRoomPayload, IncomingWSEvents, OutgoingWSEvents };
