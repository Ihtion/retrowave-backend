import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { User } from '../user/entities/user.entity';
import { Room } from '../room/entities/room.entity';
import { GroomingSession } from '../groomingSession/groomingSession.entity';
import { GroomingSessionService } from '../groomingSession/groomingSession.service';

import { IncomingWSEvents, JoinRoomPayload } from './wsEvents.interface';

const gatewayOptions = {
  cors: {
    origin: '*',
  },
};

const SocketsMap: Record<string, Socket[]> = {};

@WebSocketGateway(gatewayOptions)
export class EventsGateway {
  constructor(
    @InjectRepository(GroomingSession)
    private readonly _sessionsRepository: Repository<GroomingSession>,
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly _roomsRepository: Repository<Room>,
    @Inject(GroomingSessionService)
    private readonly _groomingSessionService: GroomingSessionService,
  ) {}

  @SubscribeMessage(IncomingWSEvents.JOIN_ROOM)
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: JoinRoomPayload,
  ): Promise<void> {
    const { userID, roomID } = data;

    const user = await this._usersRepository.findOne(userID);
    const room = await this._roomsRepository.findOne(roomID);
    const session = await this._sessionsRepository.findOne({ room });

    await this._groomingSessionService.joinUser(user, session);

    SocketsMap[session.id] = [...(SocketsMap[roomID] ?? []), socket];

    SocketsMap[session.id].forEach((socket) =>
      socket.emit('userJoin', { userID, roomID }),
    );
  }
}
