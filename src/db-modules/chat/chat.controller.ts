import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post(':roomId')
  addMessage(@Body() createChatDto: CreateChatDto, @Param('roomId') roomId: string) {
    return this.chatService.addMessage(roomId, createChatDto);
  }
}
