import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { UniqueValidator } from './utils/unique-validator';

@Module({
  imports: [RoomModule, UserModule, TypeOrmModule.forRoot()],
  controllers: [],
  providers: [UniqueValidator],
})
export class AppModule {}
