type JoinRoomPayload = {
  userID: string;
  roomID: string;
};

enum IncomingWSEvents {
  JOIN_ROOM = 'joinRoom',
  VOTING_START = 'votingStart',
  VOTING_FINISH = 'votingFinish',
}

enum OutcomingWSEvents {
  USER_JOIN = 'userJoin',
  USER_LEAVE = 'userLeave',
  VOTING_START = 'votingStart',
  VOTING_FINISH = 'votingFinish',
}

export { JoinRoomPayload, IncomingWSEvents, OutcomingWSEvents };
