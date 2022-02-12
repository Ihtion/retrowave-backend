import { Module } from '@nestjs/common';
import { RetroItemService } from './retro-item.service';
import { RetroItemController } from './retro-item.controller';

@Module({
  controllers: [RetroItemController],
  providers: [RetroItemService]
})
export class RetroItemModule {}
