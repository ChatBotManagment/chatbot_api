import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { OpenAIService } from '../open-ai/open-ai.service';

@Injectable()
export class MySlackService {
  slackService: WebClient;

  constructor(private openAiService: OpenAIService) {
    this.slackService = new WebClient(process.env.SLACK_TOKEN);
  }

  async onCallback(body: any) {
    // console.log('body.event.channel', body.event.channel);
    if ('bot_id' in body.event) return;

    const history = await this.slackService.conversations.history({
      channel: body.event.channel,
    });
    const conversationDescription = await this.slackService.conversations.info({
      channel: body.event.channel,
    });
    const systemMessage = {
      role: 'system',
      content: conversationDescription.channel.purpose.value,
    };
    // console.log('conversationDescription', conversationDescription.channel.purpose.value);
    let messages = history.messages
      .filter((item) => item.type === 'message' && !('subtype' in item))
      .map((item) => ({
        role: 'bot_id' in item ? 'assistant' : 'user',
        name: 'bot_id' in item ? 'Lucy' : 'Hazem',
        content: item.text,
      }));
    messages = messages.reverse();
    // console.log('messages', messages);
    const botResponse = await this.openAiService.chatCompletions({
      messages: [
        systemMessage,
        ...messages,
        { role: 'user', name: 'Hazem', content: body.event.text },
      ],
    });
    // console.log('botResponse', botResponse.choices[0].message.content);
    await this.slackService.chat.postMessage({
      channel: body.event.channel,
      text: botResponse.choices[0].message.content,
    });
  }
}
