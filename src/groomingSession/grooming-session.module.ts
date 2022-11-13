import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroomingSession } from './grooming-session.entity';
import { GroomingSessionManager } from './grooming-session-manager.service';
import { GroomingSessionEntityService } from './grooming-session-entity.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroomingSession])],
  providers: [GroomingSessionEntityService, GroomingSessionManager],
  exports: [
    TypeOrmModule.forFeature([GroomingSession]),
    GroomingSessionEntityService,
    GroomingSessionManager,
  ],
})
export class GroomingSessionModule {}
