import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserWsModule } from './user-ws/user-ws.module';

@Module({
  imports: [UserModule, UserWsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
