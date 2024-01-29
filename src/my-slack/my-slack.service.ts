import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { RoomTemplate } from '../db-modules/schemas/roomTemplate.schema';
import { ChatEngineService, RoomData } from '../chat-engine/chat-engine.service';
import { Message } from '../chat-engine/entities/message';
import axios from 'axios';
import * as FormData from 'form-data';
import { ClientInfoService } from '../clients-module/client-info/services/client-info.service';
import { ClientContextService } from '../services/client-context.service';

@Injectable()
export class MySlackService {
  slackService: WebClient;
  private roomTemplate: RoomTemplate = null;
  private conversationDescription: string = '';
  private messages: Message[];
  private users: { [userId: string]: any } = {};
  private user: any;

  constructor(
    private chatEngineService: ChatEngineService,
    private clientContextService: ClientContextService,
    private clientInfoService: ClientInfoService,
  ) {
    // this.slackService = new WebClient(process.env.SLACK_TOKEN);
    // this.prepareSlackService().then();
  }



  public async prepareChatResponse(body: any) {
    // console.log('body.event.channel', body.event.channel);
    if ('bot_id' in body.event) return;
    if ('subtype' in body.event) return;
    const slackAuthToken = this.clientContextService.client.metadata.slackAuth.access_token
    this.slackService = new WebClient(slackAuthToken);
    this.user = await this.getUser(body.event.user);

    // get conversation description
    const roomData = await this.getRoomData(body.event.channel);

    const bots = await this.chatEngineService.getBots(roomData);
    console.log('bots', bots);
    let botResponse: any;
    if (roomData?.roomId) {
      // if (roomData.roomId) {
      const message: Message = {
        role: 'user',
        name:
          this.user?.profile?.display_name ||
          this.user?.real_name ||
          this.user.name ||
          'user',
        content: body.event.text,
      };
      const meta = {
        messageSource: 'slack',
        messageIdFromSource: body.event.client_msg_id,
        slackEvent: body.event,
      };

      const conversations = await this.chatEngineService.getReply(
        message,
        roomData,
        meta,
        'slack|' + this.user.id,
      );
      botResponse = conversations[conversations.length - 1].content;
    } else {
      // prepare the Messages
      await this.prepareMessages(body.event);
      const systemMessage: Message = {
        role: 'system',
        content: this.roomTemplate?.prompt || this.conversationDescription,
      };
      botResponse = await this.chatEngineService.getStatelessReply(
        this.messages,
        roomData || systemMessage,
        'slack|' + this.user.id,
      );
    }

    // get bot response

    // send back the response to the Slack channel
    await this.slackService.chat.postMessage({
      channel: body.event.channel,
      text: botResponse,
      icon_url: bots[0].profilePic,
      username: bots[0].name,
    });
  }

  async getUser(userId: string, botProfile?: any) {
    let userResponse: any;
    if (!this.users[userId]) {
      if (botProfile) {
        this.users[userId] = botProfile;
      } else {
        userResponse = await this.slackService.users.info({
          user: userId,
        });
        this.users[userId] = userResponse.user;
      }
    }
    return this.users[userId];
  }

  async getRoomData(channel: string): Promise<RoomData> {
    const conversationDescriptionResponse = await this.slackService.conversations.info({
      channel: channel,
    });
    this.conversationDescription = conversationDescriptionResponse.channel.purpose.value;
    const regexPattern = /\{\{\{\s*(.*?)\s*}}}/s;

    const match = this.conversationDescription.match(regexPattern);

    if (match) {
      const convSetting = JSON.parse(`{${match[1]}}`);
      // if (!(convSetting['clientId'] && convSetting['roomTemplate'])) return;

      const roomData: RoomData = {};
      roomData.clientId = convSetting['clientId'];
      roomData.roomTemplateId = convSetting['roomTemplate'];
      roomData.roomId = convSetting['roomId'];

      return roomData;
    }
  }

  async prepareMessages(event: { channel: any; text: any; user: any }) {
    const history = await this.slackService.conversations.history({
      channel: event.channel,
    });

    let messages: any[] = [];
    for (const item of history.messages) {
      if (item.type === 'message' && !('subtype' in item)) {
        const user = await this.getUser(item.user || item.bot_id, item.bot_profile);
        messages.push({
          role: 'bot_id' in item ? 'assistant' : 'user',
          name:
            user?.profile?.display_name?.toString().replace(/[^a-zA-Z0-9_-]/g, '-') ||
            user?.real_name?.toString().replace(/[^a-zA-Z0-9_-]/g, '-') ||
            user?.name?.toString().replace(/[^a-zA-Z0-9_-]/g, '-') ||
            'user',
          content: item.text,
        });
      }
    }

    messages = messages.reverse();

    // console.log('messages', messages);

    this.messages = [...messages];
  }

  async authCallback(clientId: any, code: string, state: string) {
    console.log('authCallback - env', {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: code,
    });
    if (clientId) {
      const form = new FormData();
      form.append('code', code);
      form.append('client_id', process.env.SLACK_CLIENT_ID);
      form.append('client_secret', process.env.SLACK_CLIENT_SECRET);
      const response = await axios.post('https://slack.com/api/oauth.v2.access', form);
      console.log('response', response.data);

      const res_addOrUpdateMeta = await this.clientInfoService.addOrUpdateMeta(clientId, {
        slackAuth: response.data,
      });
      console.log('res_addOrUpdateMeta', res_addOrUpdateMeta);
      return response.data;
    }
  }
}
