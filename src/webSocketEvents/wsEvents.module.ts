import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { GroomingSessionModule } from '../groomingSession/groomingSession.module';

import { EventsGateway } from './wsEvents.gateway';

@Module({
  imports: [UserModule, RoomModule, GroomingSessionModule],
  providers: [EventsGateway],
})
export class WSEventsModule {}
