import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { AppController } from './app.controller';
import { RetroItemModule } from './retro-item/retro-item.module';

@Module({
  imports: [RoomModule, RetroItemModule, TypeOrmModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
