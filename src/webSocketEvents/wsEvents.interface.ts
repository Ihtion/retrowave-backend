type JoinRoomPayload = {
  userID: string;
  roomID: string;
};

enum IncomingWSEvents {
  JOIN_ROOM = 'joinRoom',
  VOTING_START = 'votingStart',
  VOTING_FINISH = 'votingFinish',
  ESTIMATION = 'estimation',
}

enum OutgoingWSEvents {
  USER_JOIN = 'userJoin',
  USER_LEAVE = 'userLeave',
  VOTING_START = 'votingStart',
  VOTING_FINISH = 'votingFinish',
  SESSION_DATA = 'sessionData',
  ESTIMATION = 'estimation',
}

export { JoinRoomPayload, IncomingWSEvents, OutgoingWSEvents };
