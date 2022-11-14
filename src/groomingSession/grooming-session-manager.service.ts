import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { UserIDType } from '../interfaces/common.interface';
import { OutcomingWSEvents } from '../webSocketEvents/wsEvents.interface';

import {
  IGroomingSessionManager,
  ConnectionData,
} from './grooming-session.interface';

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
      socket.emit(OutcomingWSEvents.USER_JOIN, {
        connectionID,
        userEmail: user.email,
      }),
    );
  }

  emitUserLeaveEvent(sessionID: number, connectionID: string): void {
    const sessionSockets = this._socketsStorage.get(sessionID) ?? [];

    sessionSockets.forEach((socket) =>
      socket.emit(OutcomingWSEvents.USER_LEAVE, { connectionID }),
    );
  }

  emitVotingStartEvent(sessionID: number, connectionID: string): void {
    const sessionSockets = this._socketsStorage.get(sessionID) ?? [];

    sessionSockets.forEach((socket) =>
      socket.emit(OutcomingWSEvents.VOTING_START, {
        votingInitiator: connectionID,
      }),
    );
  }

  emitVotingFinishEvent(sessionID: number): void {
    const sessionSockets = this._socketsStorage.get(sessionID) ?? [];

    sessionSockets.forEach((socket) =>
      socket.emit(OutcomingWSEvents.VOTING_FINISH),
    );
  }
}
