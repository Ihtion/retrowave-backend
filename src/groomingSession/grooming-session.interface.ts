import { Socket } from 'socket.io';

import { User } from '../user/entities/user.entity';
import { UserIDType } from '../interfaces/common.interface';
import { GroomingSession } from './grooming-session.entity';

export type SocketDetails = {
  userID: UserIDType;
  sessionID: number;
};

export interface IGroomingSessionManager {
  addConnection(userID: number, sessionID: number, socket: Socket): void;
  removeConnection(socketToRemove: Socket): void;

  getSocketDetails(socket: Socket): SocketDetails;
  getUserIDConnectionsAmount(sessionID: number, userID: UserIDType): number;

  emitUserJoinEvent(sessionID: number, user: User): void;
  emitUserLeaveEvent(sessionID: number, userID: UserIDType): void;

  emitVotingFinishEvent(sessionID: number): void;
  emitVotingStartEvent(
    sessionID: number,
    userID: UserIDType,
    votingComment: string | null,
  ): void;

  emitSessionData(session: GroomingSession, socket: Socket): void;
  emitEstimation(session: GroomingSession): void;
}
