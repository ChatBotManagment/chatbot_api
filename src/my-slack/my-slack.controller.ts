/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { MySlackService } from './my-slack.service';
import { ClientContextService } from '../services/client-context.service';
import { MySlackCommandsService } from './my-slack-commands.service';
import axios from 'axios';

export interface CommandResponse {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  api_app_id: string;
  is_enterprise_install: string;
  response_url: string;
  trigger_id: string;
}

@Controller('slack/:clientId')
export class MySlackController {
  constructor(
    private mySlackService: MySlackService,
    private mySlackCommandService: MySlackCommandsService,
    private clientContextService: ClientContextService,
  ) {}

  @Post('event')
  async events(
    @Param('clientId') clientId: string,
    @Body() body: any,
    @Headers('X-Slack-Retry-Num') retryNum: number,
  ) {
    console.log('userMessage',clientId, body);

    if (clientId) await this.clientContextService.getClient(clientId);
    else throw new Error('clientId is required');
    if (retryNum) return;
    if (body.type === 'url_verification') {
      return { challenge: body.challenge };
    } else if (body.type === 'event_callback') {
      try {
        console.log('prepareChatResponse___');
        await this.mySlackService.prepareChatResponse(body);
      } catch (e) {
        console.log('error___', e);
        await this.mySlackService.slackService.chat.postEphemeral({
          user: body.event.user,
          channel: body.event.channel,
          text: '__ ERROR: ' + e.message,
          icon_emoji: ':robot_face:',
        });
      }
    }
  }

  @Post('interactive')
  interactive(@Body() body: any) {
    return 'hi';
  }

  @Post('command/:commandName')
  async commands(
    @Param('clientId') clientId: string,
    @Param('commandName') commandName: string,
    @Body() body: CommandResponse,
    @Headers('X-Slack-Retry-Num') retryNum: number,
  ) {
    if (clientId) await this.clientContextService.getClient(clientId);
    else throw new Error('clientId is required');
    if (retryNum) return;

    if (commandName === 'c_from_template') {
      console.log('commandName', commandName);
      await this.mySlackCommandService.createChannelAndRoomFromTemplate(body);
    }
  }


  @Get('authCallback')
  async authCallback(    @Param('clientId') clientId: string, @Query('code') code: string, @Param('state') state: string) {
    console.log('authCallback', clientId, state, code);
    return await this.mySlackService.authCallback(clientId, code, state);
  }

  @Post('auth-test')
  authCallback1(@Body() body: any) {
    console.log('authCallback1', body)
  }

}
