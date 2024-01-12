import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
  constructor(private readonly openAIService: OpenAIService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async sendMessage(@Body('message') userMessage: string) {
    const response = await this.openAIService.getReply(userMessage);
    return response;
  }

  @Post('test')
  @UseGuards(AuthGuard('jwt')) // Apply the AuthGuard with your JWT strategy
  async test(@Req() request: Request) {
    return request.body;
  }
}
