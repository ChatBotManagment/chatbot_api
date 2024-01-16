import { Module } from '@nestjs/common';
import { RoomTemplateService } from '../services/room-template.service';
import { RoomTemplateController } from '../controllers/room-template.controller';
import { ClientInfoModule } from '../../clients-module/client-info/client-info.module';

@Module({
  imports: [ClientInfoModule],
  controllers: [RoomTemplateController],
  providers: [RoomTemplateService],
  exports: [RoomTemplateService],
})
export class RoomTemplateModule {}
