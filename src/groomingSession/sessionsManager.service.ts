import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { OutcomingWSEvents } from '../webSocketEvents/wsEvents.interface';

import { ISessionsManager, SocketData } from './groomingSession.interface';

@Injectable()
export class SessionsManager implements ISessionsManager {
  private _socketsStorage = new Map<number, Socket[]>();
  private _socketsData = new Map<string, SocketData>();

  addSocket(
    socketID: string,
    userID: number,
    sessionID: number,
    socket: Socket,
  ): void {
    const sessionSockets = this._socketsStorage.get(sessionID) ?? [];

    this._socketsStorage.set(sessionID, [...sessionSockets, socket]);

    this._socketsData.set(socketID, { userID, sessionID });
  }

  removeSocket(socketToRemove: Socket): void {
    const sessionID = this._socketsData.get(socketToRemove.id)?.sessionID;

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

    this._socketsData.delete(socketToRemove.id);
  }

  getSocketData(socket: Socket): SocketData {
    return this._socketsData.get(socket.id);
  }

  emitUserJoinEvent(sessionID: number, user: User): void {
    const sessionSockets = this._socketsStorage.get(sessionID) ?? [];

    sessionSockets.forEach((socket) =>
      socket.emit(OutcomingWSEvents.USER_JOIN, {
        userID: user.id,
        userEmail: user.email,
      }),
    );
  }
}
