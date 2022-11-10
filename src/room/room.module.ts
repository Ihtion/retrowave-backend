import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { GroomingSessionModule } from '../groomingSession/groomingSession.module';

import { Room } from './entities/room.entity';
import { RoomController } from './room.controller';

@Module({
  imports: [
    UserModule,
    RoomModule,
    GroomingSessionModule,
    TypeOrmModule.forFeature([Room]),
  ],
  controllers: [RoomController],
  exports: [TypeOrmModule.forFeature([Room])],
})
export class RoomModule {}
