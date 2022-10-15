import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroomingSession } from './groomingSession.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroomingSession])],
  exports: [TypeOrmModule.forFeature([GroomingSession])],
})
export class GroomingSessionModule {}
