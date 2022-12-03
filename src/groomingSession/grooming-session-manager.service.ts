import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { UserIDType } from '../interfaces/common.interface';
import { OutgoingWSEvents } from '../webSocketEvents/wsEvents.interface';

import {
  SocketDetails,
  IGroomingSessionManager,
} from './grooming-session.interface';

import { GroomingSession } from './grooming-session.entity';

type socketData = {
  socket: Socket;
  userID: UserIDType;
};

type SessionIDType = number;
type SocketIDType = string;

@Injectable()
export class GroomingSessionManager implements IGroomingSessionManager {
  private socketsForSession = new Map<SessionIDType, socketData[]>();
  private socketsDetails = new Map<SocketIDType, SocketDetails>();

  addConnection(userID: UserIDType, sessionID: number, socket: Socket): void {
    const sessionSockets = this.socketsForSession.get(sessionID) ?? [];

    this.socketsForSession.set(sessionID, [
      ...sessionSockets,
      { socket, userID },
    ]);

    this.socketsDetails.set(socket.id, { userID, sessionID });
  }

  removeConnection(socketToRemove: Socket): void {
    const sessionID = this.socketsDetails.get(socketToRemove.id)?.sessionID;

    if (!sessionID) {
      return;
    }

    const sessionSockets = this.socketsForSession.get(sessionID) ?? [];

    const updatedSessionSockets = sessionSockets.filter(
      ({ socket }) => socket !== socketToRemove,
    );

    if (updatedSessionSockets.length === 0) {
      this.socketsForSession.delete(sessionID);
    } else {
      this.socketsForSession.set(sessionID, updatedSessionSockets);
    }

    this.socketsDetails.delete(socketToRemove.id);
  }

  removeConnectionsForUser(userID: UserIDType, sessionID: number): void {
    const sessionSockets = this.socketsForSession.get(sessionID) ?? [];

    const socketIDsToRemove = [];
    const updatedSessionSockets = [];

    sessionSockets.forEach((socketDetails) => {
      if (socketDetails.userID !== userID) {
        updatedSessionSockets.push(socketDetails);
      } else {
        socketIDsToRemove.push(socketDetails.socket.id);
      }
    });

    this.emitUserLeaveEvent(sessionID, userID);

    if (updatedSessionSockets.length === 0) {
      this.socketsForSession.delete(sessionID);
    } else {
      this.socketsForSession.set(sessionID, updatedSessionSockets);
    }

    socketIDsToRemove.forEach((socketID) => {
      this.socketsDetails.delete(socketID);
    });
  }

  getUserIDConnectionsAmount(sessionID: number, userID: UserIDType): number {
    const sessionSockets = this.socketsForSession.get(sessionID);

    if (!sessionSockets) {
      return 0;
    }

    return sessionSockets.filter((socketData) => socketData.userID === userID)
      .length;
  }

  getSocketDetails(socket: Socket): SocketDetails {
    return this.socketsDetails.get(socket.id);
  }

  emitUserJoinEvent(sessionID: number, user: User): void {
    const sessionSockets = this.socketsForSession.get(sessionID) ?? [];

    sessionSockets.forEach(({ socket }) =>
      socket.emit(OutgoingWSEvents.USER_JOIN, {
        userEmail: user.email,
        userID: user.id,
      }),
    );
  }

  emitUserLeaveEvent(sessionID: number, userID: UserIDType): void {
    const sessionSockets = this.socketsForSession.get(sessionID) ?? [];

    sessionSockets.forEach(({ socket }) =>
      socket.emit(OutgoingWSEvents.USER_LEAVE, { userID }),
    );
  }

  emitVotingStartEvent(
    sessionID: number,
    userID: UserIDType,
    votingComment: string | null,
  ): void {
    const sessionSockets = this.socketsForSession.get(sessionID) ?? [];

    sessionSockets.forEach(({ socket }) =>
      socket.emit(OutgoingWSEvents.VOTING_START, {
        votingInitiator: userID,
        votingComment,
      }),
    );
  }

  emitVotingFinishEvent(sessionID: number): void {
    const sessionSockets = this.socketsForSession.get(sessionID) ?? [];

    sessionSockets.forEach(({ socket }) =>
      socket.emit(OutgoingWSEvents.VOTING_FINISH),
    );
  }

  emitSessionData(session: GroomingSession, socket: Socket): void {
    const { votingState, users, votingInitiator, votingComment, estimations } =
      session;

    const usersList = Object.entries(users).map(([userID, { email, mode }]) => {
      return { userID: Number(userID), email, mode };
    });

    socket.emit(OutgoingWSEvents.SESSION_DATA, {
      usersList,
      votingState,
      votingInitiator,
      votingComment,
      estimations,
    });
  }

  emitEstimation(session: GroomingSession): void {
    const sessionSockets = this.socketsForSession.get(session.id) ?? [];

    sessionSockets.forEach(({ socket }) =>
      socket.emit(OutgoingWSEvents.ESTIMATION, {
        estimations: session.estimations,
      }),
    );
  }
}
