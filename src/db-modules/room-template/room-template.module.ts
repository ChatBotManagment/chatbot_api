import { Module } from '@nestjs/common';
import { RoomTemplateService } from './room-template.service';
import { RoomTemplateController } from './room-template.controller';
import { ClientInfoModule } from '../../clients-module/client-info/client-info.module';

@Module({
  imports: [ClientInfoModule],
  controllers: [RoomTemplateController],
  providers: [RoomTemplateService],
})
export class RoomTemplateModule {}
