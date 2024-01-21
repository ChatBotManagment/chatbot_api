import { Module } from '@nestjs/common';
import { RoomService } from '../services/room.service';
import { RoomController } from '../controllers/room.controller';
import { ClientInfoModule } from '../../clients-module/client-info/client-info.module';
import { RoomTemplateModule } from '../room-template/room-template.module';

@Module({
  imports: [ClientInfoModule, RoomTemplateModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
