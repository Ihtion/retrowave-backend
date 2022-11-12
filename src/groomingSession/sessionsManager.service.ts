import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { OutcomingWSEvents } from '../webSocketEvents/wsEvents.interface';

import { ISessionsManager } from './groomingSession.interface';

@Injectable()
export class SessionsManager implements ISessionsManager {
  private _socketsStorage = new Map<number, Socket[]>();

  addSocket(sessionID: number, socket: Socket): void {
    this._socketsStorage[sessionID] = [
      ...(this._socketsStorage[sessionID] ?? []),
      socket,
    ];
  }

  emitUserJoinEvent(sessionID: number, user: User): void {
    this._socketsStorage[sessionID].forEach((socket) =>
      socket.emit(OutcomingWSEvents.USER_JOIN, {
        userID: user.id,
        userEmail: user.email,
      }),
    );
  }
}
