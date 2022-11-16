import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { UserIDType } from '../interfaces/common.interface';
import { OutgoingWSEvents } from '../webSocketEvents/wsEvents.interface';

import {
  IGroomingSessionManager,
  ConnectionData,
} from './grooming-session.interface';

import { GroomingSession } from './grooming-session.entity';

@Injectable()
export class GroomingSessionManager implements IGroomingSessionManager {
  private _socketsStorage = new Map<number, Socket[]>(); // sessionID: Socket
  private _connectionsData = new Map<string, ConnectionData>(); // socketID: Data

  addConnection(userID: UserIDType, sessionID: number, socket: Socket): void {
    const sessionSockets = this._socketsStorage.get(sessionID) ?? [];

    this._socketsStorage.set(sessionID, [...sessionSockets, socket]);

    this._connectionsData.set(socket.id, { userID, sessionID });
  }

  removeConnection(socketToRemove: Socket): void {
    const sessionID = this._connectionsData.get(socketToRemove.id)?.sessionID;

    if (!sessionID) {
      return;
    }

    const sessionSockets = this._socketsStorage.get(sessionID) ?? [];

    const updatedSessionSockets = sessionSockets.filter(
      (socket) => socket !== socketToRemove,
    );

    if (updatedSessionSockets.length === 0) {
      this._socketsStorage.delete(sessionID);
    } else {
      this._socketsStorage.set(sessionID, updatedSessionSockets);
    }

    this._connectionsData.delete(socketToRemove.id);
  }

  getConnectionData(socket: Socket): ConnectionData {
    return this._connectionsData.get(socket.id);
  }

  emitUserJoinEvent(sessionID: number, connectionID: string, user: User): void {
    const sessionSockets = this._socketsStorage.get(sessionID) ?? [];

    sessionSockets.forEach((socket) =>
      socket.emit(OutgoingWSEvents.USER_JOIN, {
        connectionID,
        userEmail: user.email,
      }),
    );
  }

  emitUserLeaveEvent(sessionID: number, connectionID: string): void {
    const sessionSockets = this._socketsStorage.get(sessionID) ?? [];

    sessionSockets.forEach((socket) =>
      socket.emit(OutgoingWSEvents.USER_LEAVE, { connectionID }),
    );
  }

  emitVotingStartEvent(
    sessionID: number,
    connectionID: string,
    votingComment: string | null,
  ): void {
    const sessionSockets = this._socketsStorage.get(sessionID) ?? [];

    sessionSockets.forEach((socket) =>
      socket.emit(OutgoingWSEvents.VOTING_START, {
        votingInitiator: connectionID,
        votingComment,
      }),
    );
  }

  emitVotingFinishEvent(sessionID: number): void {
    const sessionSockets = this._socketsStorage.get(sessionID) ?? [];

    sessionSockets.forEach((socket) =>
      socket.emit(OutgoingWSEvents.VOTING_FINISH),
    );
  }

  emitSessionData(session: GroomingSession, socket: Socket): void {
    const { state, users, votingInitiator, votingComment, estimations } =
      session;

    const usersList = Object.entries(users).map(
      ([connectionID, { email, mode }]) => {
        return { connectionID, email, mode };
      },
    );

    socket.emit(OutgoingWSEvents.SESSION_DATA, {
      usersList,
      state,
      votingInitiator,
      votingComment,
      estimations,
    });
  }

  emitEstimation(session: GroomingSession): void {
    const sessionSockets = this._socketsStorage.get(session.id) ?? [];

    sessionSockets.forEach((socket) =>
      socket.emit(OutgoingWSEvents.ESTIMATION, {
        estimations: session.estimations,
      }),
    );
  }
}
