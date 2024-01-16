/* eslint-disable prettier/prettier */
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { MySlackService } from './my-slack.service';

@Controller('slack')
export class MySlackController {
  constructor(private mySlackService: MySlackService) {}

  @Post('event')
  async create(@Body() body: any, @Headers('X-Slack-Retry-Num') retryNum: number) {
    if (retryNum) return;
    if (body.type === 'url_verification') {
      return { challenge: body.challenge };
    } else if (body.type === 'event_callback') {
      await this.mySlackService.prepareChatResponse(body);
    }
  }

  @Post('interactive')
  interactive(@Body() body: any) {
    return 'hi';
  }
}
