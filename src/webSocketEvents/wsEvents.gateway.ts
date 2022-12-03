import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { User } from '../user/entities/user.entity';
import { Room } from '../room/entities/room.entity';
import { GroomingState } from '../interfaces/groomingSession.interface';
import { GroomingSession } from '../groomingSession/grooming-session.entity';
import { GroomingSessionManager } from '../groomingSession/grooming-session-manager.service';
import { IGroomingSessionManager } from '../groomingSession/grooming-session.interface';
import { GroomingSessionEntityService } from '../groomingSession/grooming-session-entity.service';

import { IncomingWSEvents, JoinRoomPayload } from './wsEvents.interface';

const gatewayOptions = {
  cors: {
    origin: '*',
  },
};

@WebSocketGateway(gatewayOptions)
export class EventsGateway implements OnGatewayDisconnect {
  constructor(
    @InjectRepository(GroomingSession)
    private readonly groomingSessionRepository: Repository<GroomingSession>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
    @Inject(GroomingSessionEntityService)
    private readonly groomingSessionEntityService: GroomingSessionEntityService,
    @Inject(GroomingSessionManager)
    private readonly groomingSessionManager: IGroomingSessionManager,
  ) {}

  @SubscribeMessage(IncomingWSEvents.JOIN_ROOM)
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: JoinRoomPayload,
  ): Promise<void> {
    const { userID, roomID } = data;

    const user = await this.usersRepository.findOne(userID);

    const groomingSession = await this.groomingSessionRepository.findOne({
      roomId: Number(roomID),
    });

    const updatedSession = await this.groomingSessionEntityService.addUser(
      user,
      groomingSession,
    );

    this.groomingSessionManager.addConnection(
      Number(userID),
      groomingSession.id,
      socket,
    );

    this.groomingSessionManager.emitUserJoinEvent(groomingSession.id, user);

    this.groomingSessionManager.emitSessionData(updatedSession, socket);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<void> {
    const socketDetails = this.groomingSessionManager.getSocketDetails(socket);

    if (!socketDetails) {
      return;
    }

    const { sessionID, userID } = socketDetails;

    this.groomingSessionManager.removeConnectionsForUser(userID, sessionID);

    const session = await this.groomingSessionRepository.findOne(sessionID);

    await this.groomingSessionEntityService.removeUser(session, userID);

    if (Number(session.votingInitiator) === socketDetails.userID) {
      await this.groomingSessionEntityService.finishVoting(sessionID);

      this.groomingSessionManager.emitVotingFinishEvent(sessionID);
    }
  }

  @SubscribeMessage(IncomingWSEvents.VOTING_START)
  async handleVotingStart(
    @ConnectedSocket() socket: Socket,
    @MessageBody() votingComment: string,
  ): Promise<void> {
    const socketDetails = this.groomingSessionManager.getSocketDetails(socket);

    if (!socketDetails) {
      return;
    }

    const { sessionID, userID } = socketDetails;

    const session = await this.groomingSessionRepository.findOne(sessionID);

    if (session.votingState !== GroomingState.ACTIVE) {
      await this.groomingSessionEntityService.startVoting(
        sessionID,
        userID,
        votingComment ?? null,
      );

      this.groomingSessionManager.emitVotingStartEvent(
        socketDetails.sessionID,
        userID,
        votingComment ?? null,
      );
    }
  }

  @SubscribeMessage(IncomingWSEvents.VOTING_FINISH)
  async handleVotingFinish(@ConnectedSocket() socket: Socket): Promise<void> {
    const socketDetails = this.groomingSessionManager.getSocketDetails(socket);

    if (!socketDetails) {
      return;
    }

    const { sessionID } = socketDetails;

    await this.groomingSessionEntityService.finishVoting(sessionID);

    this.groomingSessionManager.emitVotingFinishEvent(sessionID);
  }

  @SubscribeMessage(IncomingWSEvents.ESTIMATION)
  async handleEstimation(
    @ConnectedSocket() socket: Socket,
    @MessageBody() estimation: number | null,
  ): Promise<void> {
    const socketDetails = this.groomingSessionManager.getSocketDetails(socket);

    if (!socketDetails) {
      return;
    }

    const { sessionID, userID } = socketDetails;

    const updatedSession =
      await this.groomingSessionEntityService.setEstimation(
        sessionID,
        userID,
        estimation,
      );

    this.groomingSessionManager.emitEstimation(updatedSession);

    const allVoted =
      this.groomingSessionEntityService.checkAllVoted(updatedSession);

    if (allVoted) {
      await this.groomingSessionEntityService.finishVoting(sessionID);

      this.groomingSessionManager.emitVotingFinishEvent(sessionID);
    }
  }
}
