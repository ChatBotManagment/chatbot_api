import { Module } from '@nestjs/common';
import { MySlackController } from './my-slack.controller';
import { MySlackService } from './my-slack.service';
import { OpenAiModule } from '../open-ai/open-ai.module';
import { RoomTemplateModule } from '../db-modules/room-template/room-template.module';
import { ClientInfoModule } from '../clients-module/client-info/client-info.module';

@Module({
  imports: [OpenAiModule, RoomTemplateModule, ClientInfoModule],
  controllers: [MySlackController],
  providers: [MySlackService],
})
export class MySlackModule {}
