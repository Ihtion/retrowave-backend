import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroomingSession } from './groomingSession.entity';
import { SessionsManager } from './sessionsManager.service';
import { GroomingSessionService } from './groomingSession.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroomingSession])],
  providers: [GroomingSessionService, SessionsManager],
  exports: [
    TypeOrmModule.forFeature([GroomingSession]),
    GroomingSessionService,
    SessionsManager,
  ],
})
export class GroomingSessionModule {}
