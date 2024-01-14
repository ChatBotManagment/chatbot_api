import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { RoomService } from '../room/room.service';
import { ChatEngineService } from '../../chat-engine/chat-engine.service';
import { OpenAIService } from '../../open-ai/open-ai.service';

@Injectable()
export class ChatService {
  constructor(
    private roomService: RoomService,
    private chatEngineService: ChatEngineService,
    private openAIService: OpenAIService,
  ) {}

  /*  | ChatCompletionSystemMessageParam
       | ChatCompletionUserMessageParam
       | ChatCompletionAssistantMessageParam
       | ChatCompletionToolMessageParam
       | ChatCompletionFunctionMessageParam;*/

  // export type ChatCompletionRole = 'system' | 'user' | 'assistant' | 'tool' | 'function';
  async addMessage(roomId: string, createChatDto: CreateChatDto) {
    // this.chatEngineService.getReply(roomId, createChatDto);
    const updatedRoom = await this.roomService.addChat(roomId, { ...createChatDto });
    if (!updatedRoom) throw new HttpException('Room not found', HttpStatus.NOT_FOUND);

    const conversation: any[] = updatedRoom?.conversation || null;
    console.log('conversation', conversation);
    // prepare conversation to send it to openai

    const mappedConversation = conversation.map((item) => ({
      content: item.message,
      role: item.role,
      name: item.name,
    }));
    console.log('mappedConversation', mappedConversation);
    const response = await this.openAIService.chatCompletions({
      messages: mappedConversation,
    });
    console.log('response', response.choices[0]);
    if (!response.choices[0].message) return;

    const responseDto: CreateChatDto = {
      message: response.choices[0].message.content,
      role: response.choices[0].message.role,
      name: 'hamo',
    };
    const updatedRoom2 = await this.roomService.addChat(roomId, { ...responseDto });
    return updatedRoom2.conversation;
  }
}
