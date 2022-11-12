import { Socket } from 'socket.io';

import { User } from '../user/entities/user.entity';
import { UserIDType } from '../interfaces/common.interface';

export type SocketData = {
  userID: UserIDType;
  sessionID: number;
};

export interface ISessionsManager {
  addSocket(
    socketID: string,
    userID: number,
    sessionID: number,
    socket: Socket,
  ): void;

  removeSocket(socketToRemove: Socket): void;
  getSocketData(socket: Socket): SocketData;
  emitUserJoinEvent(sessionID: number, user: User): void;
}
