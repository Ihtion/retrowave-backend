import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { configuration } from './config/configuration';
import { UniqueValidator } from './utils/unique-validator';
import { WSEventsModule } from './webSocketEvents/wsEvents.module';
import { GroomingSessionModule } from './groomingSession/grooming-session.module';

@Module({
  imports: [
    WSEventsModule,
    RoomModule,
    UserModule,
    AuthModule,
    GroomingSessionModule,
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [],
  providers: [UniqueValidator],
})
export class AppModule {}
