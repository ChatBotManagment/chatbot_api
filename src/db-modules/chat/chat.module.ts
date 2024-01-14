import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { RoomModule } from '../room/room.module';
import { ChatEngineModule } from '../../chat-engine/chat-engine.module';
import { OpenAiModule } from '../../open-ai/open-ai.module';

@Module({
  imports: [RoomModule, ChatEngineModule, OpenAiModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
