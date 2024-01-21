import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { ChatEngineService } from '../chat-engine/chat-engine.service';
import { CommandResponse } from './my-slack.controller';
import { RoomService } from '../db-modules/services/room.service';
import { Room } from '../db-modules/schemas/room.schema';

@Injectable()
export class MySlackCommandsService {
  slackService: WebClient;

  constructor(
    private chatEngineService: ChatEngineService,
    private roomService: RoomService,
  ) {
    this.slackService = new WebClient(process.env.SLACK_TOKEN);
  }

  async createChannelAndRoomFromTemplate(body: CommandResponse) {
    const channelName = body.text.trim().split(' ')[0] || 'test-6';
    const roomTemplateId = body.text.trim().split(' ')[1] || undefined;
    if (!channelName) return;

    const creatingRes = await this.slackService.conversations.create({
      is_private: false,
      name: channelName,
    });
    if (!creatingRes) return;
    const invitingRes = await this.slackService.conversations.invite({
      channel: creatingRes?.channel.id,
      users: body.user_id, // User IDs should be a comma-separated string
    });
    console.log('creatingRes', creatingRes);
    console.log('invitingRes', invitingRes);

    let room: Room;
    if (roomTemplateId) {
      room = await this.roomService.createFromTemplate(
        roomTemplateId,
        {
          title: channelName,
          parties: [1, 2],
        },
        { sub: '1' },
      );
    } else {
      room = await this.roomService.create(
        {
          title: channelName,
          parties: [1, 2],
        },
        { sub: '1' },
      );
    }

    //room.title

    const setPurposeRes = await this.slackService.conversations.setPurpose({
      channel: creatingRes?.channel.id,
      purpose: `${room.configuration.description}
      RoomData:
      {{{ "roomId": "${room._id.toString()}" }}}
      `,
    });

    const setTopicRes = await this.slackService.conversations.setTopic({
      channel: creatingRes?.channel.id,
      topic: `${room.configuration.name}
      `,
    });

    console.log('setPurposeRes', setPurposeRes);
    console.log('setTopicRes', setTopicRes);
  }
}
