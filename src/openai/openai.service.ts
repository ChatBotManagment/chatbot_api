import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: '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',
      organization: 'org-jRGWrSsagksEJhRFtybrnDXE',
    });
    // this.openai = new OpenAIApi(configuration);
  }

  async getReply(message: string) {
    try {
      const stream = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: 'tell me a long joke' }],
        model: 'gpt-3.5-turbo',
        stream: false,
      });
      // for await (const chunk of stream) {
      //   process.stdout.write(chunk.choices[0]?.delta?.content || '');
      // }
      return stream;
      // for await (const chunk of stream) {
      //   process.stdout.write(chunk.choices[0]?.delta?.content || '');
      // }
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw new Error('Error processing your request');
    }
  }
}
