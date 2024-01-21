import { Module } from '@nestjs/common';
import { MySlackController } from './my-slack.controller';
import { MySlackService } from './my-slack.service';
import { ChatEngineModule } from '../chat-engine/chat-engine.module';
import { ClientInfoModule } from '../clients-module/client-info/client-info.module';
import { MySlackCommandsService } from './my-slack-commands.service';
import { RoomModule } from '../db-modules/room/room.module';

@Module({
  imports: [ChatEngineModule, ClientInfoModule, RoomModule],
  controllers: [MySlackController],
  providers: [MySlackService, MySlackCommandsService],
})
export class MySlackModule {}
