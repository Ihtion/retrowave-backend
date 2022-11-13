type JoinRoomPayload = {
  userID: string;
  roomID: string;
};

enum IncomingWSEvents {
  JOIN_ROOM = 'joinRoom',
}

enum OutcomingWSEvents {
  USER_JOIN = 'userJoin',
  USER_LEAVE = 'userLeave',
}

export { JoinRoomPayload, IncomingWSEvents, OutcomingWSEvents };
