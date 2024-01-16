import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { OpenAIService } from '../open-ai/open-ai.service';
import { RoomTemplateService } from '../db-modules/services/room-template.service';
import { ClientContextService } from '../services/client-context.service';
import { RoomTemplate } from '../db-modules/schemas/roomTemplate.schema';

@Injectable()
export class MySlackService {
  slackService: WebClient;
  private systemPrompt: {
    role: string;
    content: string;
  } = null;
  private roomTemplate: RoomTemplate = null;
  private conversationDescription: string = '';
  private messages: (
    | { role: string; content: string }
    | { role: string; name: string; content: any }
  )[];
  private users: { [userId: string]: any } = {};
  private user: any;

  constructor(
    private clientContextService: ClientContextService,
    private openAiService: OpenAIService,
    private roomTemplateService: RoomTemplateService,
  ) {
    this.slackService = new WebClient(process.env.SLACK_TOKEN);
  }

  async prepareChatResponse(body: any) {
    // console.log('body.event.channel', body.event.channel);
    if ('bot_id' in body.event) return;
    if ('subtype' in body.event) return;

    this.user = await this.getUser(body.event.user);
    // get conversation description
    await this.getClientAndRoomTemplate(body.event.channel);

    // prepare the Messages
    await this.prepareMessages(body.event);

    // get bot response
    const botResponse = await this.openAiService.chatCompletions({
      messages: this.messages,
    });

    // send back the response to the Slack channel
    await this.slackService.chat.postMessage({
      channel: body.event.channel,
      text: botResponse.choices[0].message.content,
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

  async getClientAndRoomTemplate(channel: string) {
    const conversationDescriptionResponse = await this.slackService.conversations.info({
      channel: channel,
    });
    this.conversationDescription = conversationDescriptionResponse.channel.purpose.value;
    const regexPattern = /\{\{\{\s*(.*?)\s*}}}/s;

    const match = this.conversationDescription.match(regexPattern);

    if (match) {
      const convSetting = JSON.parse(`{${match[1]}}`);
      if (!(convSetting['clientId'] && convSetting['roomTemplate'])) return;

      const roomTemplateId = convSetting['roomTemplate'];

      await this.clientContextService.getClient(convSetting['clientId']);

      this.roomTemplate = await this.roomTemplateService.findOne(roomTemplateId);
    }
  }

  async prepareMessages(event: { channel: any; text: any; user: any }) {
    const history = await this.slackService.conversations.history({
      channel: event.channel,
    });

    const systemMessage = {
      role: 'system',
      content: this.roomTemplate?.prompt || this.conversationDescription,
    };
    let messages: any[] = [];
    for (const item of history.messages) {
      if (item.type === 'message' && !('subtype' in item)) {
        const user = await this.getUser(item.user || item.bot_id, item.bot_profile);
        messages.push({
          role: 'bot_id' in item ? 'assistant' : 'user',
          name: user.name.toString().replace(/[^a-zA-Z0-9_-]/g, ''),
          content: item.text,
        });
      }
    }

    messages = messages.reverse();

    console.log('messages', messages);

    this.messages = [
      systemMessage,
      ...messages,
      {
        role: 'user',
        name: this.user.name.toString().replace(/[^a-zA-Z0-9_-]/g, ''),
        content: event.text,
      },
    ];
    console.log('messages', this.messages);
  }
}
