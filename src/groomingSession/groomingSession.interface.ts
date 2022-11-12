import { Socket } from 'socket.io';

import { User } from '../user/entities/user.entity';

export interface ISessionsManager {
  addSocket(sessionID: number, socket: Socket): void;
  emitUserJoinEvent(sessionID: number, user: User): void;
}
