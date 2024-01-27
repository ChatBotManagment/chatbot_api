import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import { ChatCompletionCreateParamsBase } from 'openai/src/resources/chat/completions';
import { ClientInfoService } from '../clients-module/client-info/services/client-info.service';
import { ClientContextService } from '../services/client-context.service';

dotenv.config();

interface ChatCompletionOptions extends ChatCompletionCreateParamsBase {
  model:
    | string
    | 'gpt-4-1106-preview'
    | 'gpt-4-vision-preview'
    | 'gpt-4'
    | 'gpt-4-0314'
    | 'gpt-4-0613'
    | 'gpt-4-32k'
    | 'gpt-4-32k-0314'
    | 'gpt-4-32k-0613'
    | 'gpt-3.5-turbo'
    | 'gpt-3.5-turbo-16k'
    | 'gpt-3.5-turbo-0301'
    | 'gpt-3.5-turbo-0613'
    | 'gpt-3.5-turbo-1106'
    | 'gpt-3.5-turbo-16k-0613'
    | undefined;
}

export type Roles = OpenAI.Chat.Completions.ChatCompletionRole;

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(
    private clientInfoService: ClientInfoService,
    private clientContextService: ClientContextService,
  ) {
    // this.openai = new OpenAI({
    //   apiKey: process.env.OPENAI_API_KEY, // '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',
    //   organization: process.env.OPENAI_ORGANIZATION, //'org-jRGWrSsagksEJhRFtybrnDXE',
    // });
    //// this.openai = new OpenAIApi(configuration);
  }

  async configOpenai() {
    const client = await this.clientInfoService.findOne(
      this.clientContextService.clientId,
    );
    this.openai = new OpenAI({
      apiKey: client?.openai_api_key || process.env.OPENAI_API_KEY, // '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',
      organization: client?.openai_organization || process.env.OPENAI_ORGANIZATION, //'org-jRGWrSsagksEJhRFtybrnDXE',
    });
  }

  async chatCompletions(options: ChatCompletionOptions | any = {}) {
    await this.configOpenai();
    try {
      console.log('messages', options.messages);
      const stream = await this.openai.chat.completions.create({
        // messages: [{ role: role as any, content: message }],
        model: 'gpt-3.5-turbo-1106',
        stream: false,
        temperature: 0.8,
        // functions: openAiFunctions(message),
        ...options,
      });

      return stream;
    } catch (error) {
      console.error('Error calling OpenAI:', error.stack);
      throw new Error('Error processing your request');
    }
  }

  async getCompletions(message: string, options: any = {}) {
    await this.configOpenai();

    const response = await this.openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: message,
      temperature: 0.8,
      stream: false,

      ...options,
    });

    return response;
  }
}
