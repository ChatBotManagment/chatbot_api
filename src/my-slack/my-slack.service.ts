import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { RoomTemplate } from '../db-modules/schemas/roomTemplate.schema';
import { ChatEngineService, RoomData } from '../chat-engine/chat-engine.service';
import { Message } from '../chat-engine/entities/message';
import axios from 'axios';
import * as FormData from 'form-data';
import { ClientInfoService } from '../clients-module/client-info/services/client-info.service';
import { ClientContextService } from '../services/client-context.service';
import { PeopleService } from '../db-modules/services/people.service';
import { CommandResponse } from './my-slack.controller';

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
    private peopleService: PeopleService,
  ) {
    // this.slackService = new WebClient(process.env.SLACK_TOKEN);
    // this.prepareSlackService().then();
  }

  public async prepareChatResponse(body: any) {
    // console.log('body.event.channel', body.event.channel);
    if ('bot_id' in body.event) return;
    if ('subtype' in body.event) return;
    this.initSlackService();
    this.user = await this.getUser(body.event.user);

    // get conversation description
    const roomData = await this.getRoomData(body.event.channel);

    const bots = await this.chatEngineService.getBots(roomData);
    roomData.bot = {
      name: bots[0].userName,
      slackBotId: bots[0]._id,
      personId: bots[0]._id,
    };

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
        'zoeil',
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
      username: bots[0].userName,
    });
  }

  private async getUser(userId: string, botProfile?: any) {
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
      /*    roomData.bot = {
            name: 'ahmed_zoiel',
          };*/

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

  public async personJoinChannel(body: any) {
    this.initSlackService();

    // Check if User exists
    const slackUser = await this.getUser(body.event.user);

    if (!slackUser.is_bot) {
      const appUser = await this.peopleService.findOneByCredential(
        'slack|' + slackUser.id,
      );
      console.log('appUser', appUser);
      if (!appUser) {
        await this.peopleService.create(
          {
            name: slackUser.profile.display_name,
            credentialIds: ['slack|' + slackUser.id],
            type: 'user',
            gender: 'male',
            profilePic: slackUser.profile.image_192,
            description: slackUser.profile.real_name,
            credit: 50,
            createdBy: 'slack|' + slackUser.id,
            metadata: {
              profiles: [slackUser],
            },
          },
          { sub: 'slack|' + slackUser.id },
        );
      }
    }

    /*    const channelInfo = await this.slackService.conversations.info({
          channel: body.event.channel,
        });
        console.log('channelInfo', channelInfo);
        if (channelInfo?.channel?.is_channel) {
          const channelName = channelInfo.channel.name;
          const room =
            await this.clientContextService.roomService.findOneByTitle(channelName);
          if (room) {
            await this.clientContextService.roomService.addChat(room._id, {
              content: `Welcome to ${channelName}`,
              role: 'bot',
              name: 'bot',
            });
          }
        }*/
  }

  async throwSlackError(error: string, body: CommandResponse) {
    this.initSlackService();
    console.log('error___', error);
    await this.slackService.chat.postEphemeral({
      user: body.user_id,
      channel: body.channel_id,
      text: '__ ERROR: ' + error,
      icon_emoji: ':robot_face:',
    });
  }

  initSlackService() {
    const slackAuthToken =
      this.clientContextService.client.metadata.slackAuth.access_token;
    this.slackService = new WebClient(slackAuthToken);
  }
}
