import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { UniqueValidator } from './utils/unique-validator';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RoomModule, UserModule, TypeOrmModule.forRoot(), AuthModule],
  controllers: [],
  providers: [UniqueValidator],
})
export class AppModule {}
