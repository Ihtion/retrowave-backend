import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

const gatewayOptions = {
  cors: {
    origin: '*',
  },
};

@WebSocketGateway(gatewayOptions)
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  handleEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): void {
    console.log(data);
    socket.emit('events', { name: 'Nest' });
  }
}
