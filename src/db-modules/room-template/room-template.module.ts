import { Module } from '@nestjs/common';
import { RoomTemplateService } from '../services/room-template.service';
import { RoomTemplateController } from '../controllers/room-template.controller';
import { ClientInfoModule } from '../../clients-module/client-info/client-info.module';
import { PeopleModule } from '../people/people.module';

@Module({
  imports: [ClientInfoModule, PeopleModule],
  controllers: [RoomTemplateController],
  providers: [RoomTemplateService],
  exports: [RoomTemplateService],
})
export class RoomTemplateModule {}
