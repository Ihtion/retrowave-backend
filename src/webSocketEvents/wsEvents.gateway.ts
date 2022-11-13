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
    const room = await this.roomsRepository.findOne(roomID);
    const groomingSession = await this.groomingSessionRepository.findOne({
      room,
    });

    await this.groomingSessionEntityService.addConnection(
      user,
      groomingSession,
      socket.id,
    );

    this.groomingSessionManager.addConnection(
      Number(userID),
      groomingSession.id,
      socket,
    );

    this.groomingSessionManager.emitUserJoinEvent(
      groomingSession.id,
      socket.id,
      user,
    );
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<void> {
    const connectionData =
      this.groomingSessionManager.getConnectionData(socket);

    this.groomingSessionManager.removeConnection(socket);

    if (connectionData) {
      this.groomingSessionManager.emitUserLeaveEvent(
        connectionData.sessionID,
        socket.id,
      );

      const session = await this.groomingSessionRepository.findOne(
        connectionData.sessionID,
      );

      await this.groomingSessionEntityService.removeConnection(
        session,
        socket.id,
      );
    }
  }
}
