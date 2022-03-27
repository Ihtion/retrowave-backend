import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { configuration } from './config/configuration';
import { UniqueValidator } from './utils/unique-validator';

@Module({
  imports: [
    RoomModule,
    UserModule,
    AuthModule,
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
