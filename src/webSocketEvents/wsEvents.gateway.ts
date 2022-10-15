import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
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
import { GroomingSessionUserMode } from '../interfaces/groomingSession.interface';

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
  ) {}

  @SubscribeMessage(IncomingWSEvents.JOIN_ROOM)
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: JoinRoomPayload,
  ): Promise<void> {
    console.log({ data });

    const { userID, roomID } = data;

    const user = await this._usersRepository.findOne(userID);
    const room = await this._roomsRepository.findOne(roomID);

    console.log({ user, room });

    const newSession = await this._sessionsRepository.save(
      this._sessionsRepository.create({
        users: {
          [userID]: {
            mode: GroomingSessionUserMode.VOTER,
            email: user.email,
          },
        },
        room,
      }),
    );

    console.log({ newSession });

    SocketsMap[roomID] = [...(SocketsMap[roomID] ?? []), socket];

    console.log({ SocketsMap });

    SocketsMap[roomID].forEach((socket) =>
      socket.emit('joinRoom', { userID, roomID }),
    );
  }
}
