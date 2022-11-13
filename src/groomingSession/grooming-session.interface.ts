import { Socket } from 'socket.io';

import { User } from '../user/entities/user.entity';
import { UserIDType } from '../interfaces/common.interface';

export type ConnectionData = {
  userID: UserIDType;
  sessionID: number;
};

export interface IGroomingSessionManager {
  addConnection(userID: number, sessionID: number, socket: Socket): void;
  removeConnection(socketToRemove: Socket): void;
  getConnectionData(socket: Socket): ConnectionData;
  emitUserJoinEvent(sessionID: number, connectionID: string, user: User): void;
  emitUserLeaveEvent(sessionID: number, connectionID: string): void;
}
