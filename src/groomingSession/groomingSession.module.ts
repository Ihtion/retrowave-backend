import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroomingSession } from './groomingSession.entity';
import { GroomingSessionService } from './groomingSession.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroomingSession])],
  providers: [GroomingSessionService],
  exports: [
    TypeOrmModule.forFeature([GroomingSession]),
    GroomingSessionService,
  ],
})
export class GroomingSessionModule {}
