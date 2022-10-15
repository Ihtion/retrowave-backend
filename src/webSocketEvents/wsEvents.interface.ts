type JoinRoomPayload = {
  userID: string;
  roomID: string;
};

enum IncomingWSEvents {
  JOIN_ROOM = 'joinRoom',
}

export { JoinRoomPayload, IncomingWSEvents };
