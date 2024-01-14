import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OpenAIService } from '../open-ai/open-ai.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly openAIService: OpenAIService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async sendMessage(@Body('message') userMessage: string) {
    const response = await this.openAIService.chatCompletions(userMessage);
    return response;
  }

  @Post('test')
  @UseGuards(AuthGuard('jwt')) // Apply the AuthGuard with your JWT strategy
  async test(@Req() request: Request) {
    return request.body;
  }
}
