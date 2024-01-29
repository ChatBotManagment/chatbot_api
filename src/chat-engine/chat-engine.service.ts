import { Injectable } from '@nestjs/common';
import { RoomService } from '../db-modules/services/room.service';
import { Message } from './entities/message';
import { OpenAIService } from '../open-ai/open-ai.service';
import { ClientContextService } from '../services/client-context.service';
import { RoomTemplateService } from '../db-modules/services/room-template.service';
import { CreateChatDto } from '../db-modules/chat/dto/create-chat.dto';
import { Room } from '../db-modules/schemas/room.schema';
import OpenAI from 'openai';
import ChatCompletion = OpenAI.ChatCompletion;
import { Conversation } from '../db-modules/schemas/conversation.schema';
import { PeopleService } from '../db-modules/services/people.service';

export interface RoomData {
  clientId?: string;
  roomTemplateId?: string;
  roomId?: string;
  bot?: {
    name: string;
    personId?: string;
    slackBotId?: string;
  };
}

@Injectable()
export class ChatEngineService {
  constructor(
    private openAIService: OpenAIService,
    private roomService: RoomService,
    private peopleService: PeopleService,
    private roomTemplateService: RoomTemplateService,
  ) {}

  async getStatelessReply(
    history: Message[],
    systemMessageOrRoomData: Message | RoomData,
    credentialId: any,
  ) {
    // Define systemMessageOrRoomData as either a Message or a RoomData
    const person = await this.getPerson(credentialId);
    let systemMessage: Message = null;
    let roomData: RoomData = null;
    if ('content' in systemMessageOrRoomData) {
      systemMessage = systemMessageOrRoomData as Message;
    } else {
      roomData = systemMessageOrRoomData as RoomData;
    }
    // TODO find the start of the conversation

    // find the roomTemplateId
    if (roomData) {
      const roomTemplateId = roomData.roomTemplateId;

      // await this.clientContextService.getClient(roomData.clientId);

      const roomTemplate = await this.roomTemplateService.findOne(roomTemplateId);
      systemMessage = systemMessage || { content: roomTemplate.prompt, role: 'system' };
    }

    //send to openAI
    const botResponse = await this.openAIService.chatCompletions({
      messages: systemMessage ? [systemMessage, ...history] : [...history],
    });
    await this.peopleService.increaseCredit(credentialId, -1);
    //return the response
    return botResponse.choices[0].message.content;
  }

  async getReply(
    message: Message,
    roomData: RoomData,
    meta: any,
    credentialId: any,
  ): Promise<Conversation[]> {
    const person = await this.getPerson(credentialId);

    if (!roomData?.roomId) throw new Error('RoomId is required');

    // find the roomeId
    let room: Room = await this.roomService.findOne(roomData.roomId);
    if (!room) throw new Error('Room not found');

    room = await this.roomService.addChat(roomData.roomId, {
      role: message.role,
      name: message.name,
      content: message.content,
      metaData: meta,
    });

    const history = room.conversation.map((message) => ({
      content: message.content,
      role: message.role,
      name: message.name,
    }));
    const roomTemplateConf = room.configuration;
    const systemMessage = { content: roomTemplateConf.prompt, role: 'system' };
    //send to openAI
    let botResponse: ChatCompletion;
    try {
      botResponse = await this.openAIService.chatCompletions({
        messages: [systemMessage, ...history],
      });
      await this.peopleService.increaseCredit(credentialId, -1);
      const message1: CreateChatDto = {
        role: botResponse.choices[0].message.role,
        content: botResponse.choices[0].message.content,
        name: roomData.bot?.name || undefined,
        metaData: {
          messageSource: 'openai',
          messageIdFromSource: botResponse.id,
          openAiEvent: botResponse,
        },
      };
      room = await this.roomService.addChat(roomData.roomId, message1);
    } catch (error) {
      console.log('error', error);
    }

    //return the response
    // return botResponse.choices[0].message.content;
    return room.conversation;
  }

  private async getPerson(credentialId: any) {
    console.log('credentialId', credentialId);
    const person = await this.peopleService.findOneByCredential(credentialId);
    if (!person) throw new Error('Person not found');
    if (person.credit <= 0) throw new Error('Insufficient credit');
    return person;
  }

  async getBots(roomData: RoomData): Promise<any[]> {
    if (roomData?.roomId) {
      const room = await this.roomService.findOne(roomData.roomId);
      if (room.configuration.bots) return room.configuration.bots;
    }

    if (roomData?.roomTemplateId) {
      const roomTemplate = await this.roomTemplateService.findOne(
        roomData.roomTemplateId,
      );
      if (roomTemplate.bots) return roomTemplate.bots;
    }
    return Promise.resolve(['Lucy']);
  }
}
