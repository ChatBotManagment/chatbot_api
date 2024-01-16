import { Injectable } from '@nestjs/common';
import { RoomService } from '../db-modules/services/room.service';

@Injectable()
export class ChatEngineService {
  constructor(
    // private openAIService: OpenAIService,
    private roomService: RoomService,
    // private roomTemplateService: RoomTemplateService,
  ) {}

  async getReply(roomId: string, conv: any) {
    const room = await this.roomService.findOne(roomId);
    const conversation = room.conversation || {};

    console.log('room', room);

    // await this.openAIService.chatCompletions(message.message);
  }
}
