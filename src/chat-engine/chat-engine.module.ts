import { Module } from '@nestjs/common';
import { ChatEngineService } from './chat-engine.service';
import { RoomModule } from '../db-modules/room/room.module';
import { RoomTemplateModule } from '../db-modules/room-template/room-template.module';
import { PeopleModule } from '../db-modules/people/people.module';
import { OpenAiModule } from '../open-ai/open-ai.module';
import { ClientInfoModule } from '../clients-module/client-info/client-info.module';

@Module({
  imports: [RoomModule, RoomTemplateModule, PeopleModule, OpenAiModule, ClientInfoModule],
  providers: [ChatEngineService],
  exports: [ChatEngineService],
})
export class ChatEngineModule {}
